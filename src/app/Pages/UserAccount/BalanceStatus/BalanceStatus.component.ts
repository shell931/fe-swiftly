import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ApiService } from '../../../Services/api.service';
import { Invoice, BalanceDetail } from '../../../Models/Invoice';
import { Router, NavigationEnd } from '@angular/router';
const { isArray } = Array;
import { EmbryoService } from '../../../Services/Embryo.service';





@Component({
	selector: 'app-BalanceStatus',
	standalone: true,
	imports: [
		CommonModule,
		CurrencyPipe,
		MatCardModule,
		MatListModule,
		MatButtonModule,
		SweetAlert2Module
	],
	templateUrl: './BalanceStatus.component.html',
	styleUrls: ['./BalanceStatus.component.scss']
})

export class BalanceStatusComponent implements OnInit {


	popUpDeleteUserResponse: any;
	invoiceList: any[] = [];
	balaDetailGrid!: BalanceDetail;
	balance_store: any;
	id_bank_account: any;
	account_number: any;
	responsible: any;
	name_bank: any;
	type_account: any;
	public validate_trans_value: boolean = false;

	@ViewChild(MatPaginator, { static: false })
	paginator!: MatPaginator;

	dataSource = new MatTableDataSource<any>(this.invoiceList);

	displayedColumns: string[] = ['action', 'reference_invoice', 'created_at', 'name_state', 'number_identifier', 'paymentmethod', 'reference', 'total_price'];


	constructor(
		// public service: AdminPanelServiceService,
		private apiService: ApiService,
		public router: Router,
		public embryoService: EmbryoService,
		
	) { }

	ngOnInit() {
		const id_store = localStorage.getItem('id-store');
		this.apiService.GetBalanceAccount(id_store).subscribe((res: any) => this.getBalanceAcountData(res));
	}

	getBalanceAcountData(response: any) {
		let myJSONbalance = JSON.stringify(response);
		let objTrx = JSON.parse(myJSONbalance);

		if (objTrx.data.total_balance__sum) {
			this.balance_store = objTrx.data.total_balance__sum;
		} else {
			this.balance_store = 0;
		}

		this.id_bank_account = response.data_bankaccounts.id_bank_account;
		this.account_number = response.data_bankaccounts.account_number;
		this.responsible = response.data_bankaccounts.responsible;
		this.name_bank = response.data_bankaccounts.name_bank;
		this.type_account = response.data_bankaccounts.type_account;

	}


	getAllInvoiceData(response: any) {
		this.invoiceList = response;
		this.dataSource = new MatTableDataSource<any>(this.invoiceList);
		setTimeout(() => {
			this.dataSource.paginator = this.paginator;
		}, 0)
	}



	setTransferRequest() {
		this.validate_trans_value = false;
		if (this.balance_store <= 0) {
			this.validate_trans_value = true;
		} else {
			
			let id_store_v = localStorage.getItem('id-store');
			let myObjRequestTransfer = {
				"id_store": id_store_v,
			};
			this.apiService.setTransferRequest(myObjRequestTransfer).subscribe(
				result => {

					let myJSON = JSON.stringify(result);
					let obj = JSON.parse(myJSON);
					let id_tranfer = obj.data;
					localStorage.setItem('id_transfer', id_tranfer);

					let myObjRequestTransferMail = {
						"id_store": id_store_v,
						'id_transfer': id_tranfer
					};
					this.apiService.sendEmailTransferRequest(myObjRequestTransferMail).subscribe();
					this.router.navigate(['/account/balance_response']);					
				},
				error => console.log(error)
			);
			
		}
	}

	abstract(){
		// const id_store = localStorage.getItem('id-store');
		// this.apiService.getBalanceDetail(id_store).subscribe(dataDetailBalance => this.getBalanceTransactionDetailData(dataDetailBalance));		
		this.embryoService.balanceSidenavOpen = !this.embryoService.balanceSidenavOpen;
	}


	getBalanceTransactionDetailData(dataDetailBalance: any) {

		// console.log(dataDetailBalance);
		// let myObjBalanceDetail;
		// myObjBalanceDetail = {
		// 	reference: myObjBalanceDetail.reference,
		// 	created_at: myObjBalanceDetail.created_at,
		// 	state: myObjBalanceDetail.state,
		// 	total_balance: myObjBalanceDetail.total_balance,
		// };

		// this.balaDetailGrid = myObjBalanceDetail;
		// this.apiService.PopUpInvoiceDetail(this.balaDetailGrid);

		
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}




}


