import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../../Services/api.service';
import { Invoice } from '../../../Models/Invoice';
import { Transfer } from '../../../Models/Transfer';
const { isArray } = Array;



@Component({
	selector: 'app-Transfers',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		CurrencyPipe,
		MatTableModule,
		MatPaginatorModule,
		MatCardModule,
		MatListModule,
		MatButtonModule,
		MatIconModule
	],
	templateUrl: './Transfers.component.html',
	styleUrls: ['./Transfers.component.scss']
})

export class TransfersComponent implements OnInit {


	popUpDeleteUserResponse: any;
	transferList: any[] = [];
	traDetailGrid: Transfer;
	

	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

	dataSource = new MatTableDataSource<any>(this.transferList);

	displayedColumns: string[] = ['action','reference','created_at','responsible', 'state', 'val_transfer'];


	constructor(
		// public service: AdminPanelServiceService,
		private apiService: ApiService,
	) { }

	ngOnInit() {
		const id_store = localStorage.getItem('id-store');
		this.apiService.GetTransfersByIdStore(id_store).subscribe(res => this.getAllTransfersData(res));
	}


	getAllTransfersData(response) {											
		this.transferList = response.data;
		this.dataSource = new MatTableDataSource<any>(this.transferList);
		setTimeout(() => {
			this.dataSource.paginator = this.paginator;
		}, 0)
	}



	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}


	/**
  * onSeeDialog method is used to open a see dialog.
  */
	onSeeDialog(data) {
		// this.apiService.getInvoiceDetail(data.id).subscribe(dataDetailInvoice => this.getInvoiceDetailData(dataDetailInvoice, data));
	}


	// getInvoiceDetailData(dataDetailInvoice, dataInvoice) {
		
	// 	let myObj_invoice;
	// 	myObj_invoice = {
	// 		adress: dataInvoice.adress,
	// 		created_at: dataInvoice.created_at,
	// 		departament: dataInvoice.departament,
	// 		email: dataInvoice.email,
	// 		first_name_client: dataInvoice.first_name_client,
	// 		id_store_id: dataInvoice.id_store_id,
	// 		id: dataInvoice.id,
	// 		name_client: dataInvoice.name_client,
	// 		name_state: dataInvoice.name_state,
	// 		name_store: dataInvoice.name_store,
	// 		nameci: dataInvoice.nameci,
	// 		number_identifier: dataInvoice.number_identifier,
	// 		paymentmethod: dataInvoice.paymentmethod,
	// 		phone: dataInvoice.phone,
	// 		reference: dataInvoice.reference,
	// 		reference_invoice: dataInvoice.reference_invoice,
	// 		state_id: dataInvoice.state_id,
	// 		total_price: dataInvoice.total_price,			
	// 		percentage_sale: dataInvoice.percentage_sale,
	// 		val_percentage_sale: dataInvoice.val_percentage_sale,
	// 		percentage_commision_payment: dataInvoice.percentage_commision_payment,
	// 		val_percentage_commision_payment: dataInvoice.val_percentage_commision_payment,
	// 		percentage_rete_ica: dataInvoice.percentage_rete_ica,
	// 		val_percentage_rete_ica: dataInvoice.val_percentage_rete_ica,
	// 		percentage_rete_fuente: dataInvoice.percentage_rete_fuente,
	// 		val_percentage_rete_fuente: dataInvoice.val_percentage_rete_fuente,
	// 		percentage_commision_tax: dataInvoice.percentage_commision_tax,
	// 		val_percentage_commision_tax: dataInvoice.val_percentage_commision_tax,
	// 		total_balance: dataInvoice.total_balance,
	// 		transaction_id: dataInvoice.transaction_id,
	// 		type_identifier: dataInvoice.type_identifier,
	// 		user_id: dataInvoice.user_id,
	// 		invoice_detail: dataDetailInvoice,
	// 		num_aprob: dataInvoice.num_aprob,
	// 		quot: dataInvoice.quot,
	// 		brand: dataInvoice.brand,
	// 		cod_reply: dataInvoice.cod_reply,
	// 		messaje_reply: dataInvoice.messaje_reply,
	// 		num_recibo: dataInvoice.num_recibo,
	// 	};

	// 	this.invDetailGrid = myObj_invoice;		
	// 	this.apiService.PopUpInvoiceDetail(this.invDetailGrid);
	// }



}


