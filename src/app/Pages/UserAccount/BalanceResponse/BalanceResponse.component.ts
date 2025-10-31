import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ApiService } from '../../../Services/api.service';
import { Invoice } from '../../../Models/Invoice';
import { Router, NavigationEnd } from '@angular/router';

const { isArray } = Array;



@Component({
	selector: 'app-BalanceResponse',
	standalone: true,
	imports: [
		CommonModule,
		CurrencyPipe,
		MatCardModule,
		MatListModule
	],
	templateUrl: './BalanceResponse.component.html',
	styleUrls: ['./BalanceResponse.component.scss']
})

export class BalanceResponseComponent implements OnInit {


	account_number: any;
	responsible: any;
	val_request: any;
	val_transfer: any;
	bank: any;
	state: any;
	store: any;
	typeaccount: any;
	reference: any;

	constructor(		
		private apiService: ApiService,
		public router: Router,
	) { }

	ngOnInit() {
		const id_transfer = localStorage.getItem('id_transfer');		
		if(id_transfer){
			localStorage.removeItem("id_transfer");		
			this.apiService.GetTransferData(id_transfer).subscribe(res => this.getTransferData(res));
		}else{
			this.router.navigate(['/account/balance_status']);
		}		
	}

	getTransferData(response) {
				
		let myJSON = JSON.stringify(response);
		let objTra = JSON.parse(myJSON);

		this.account_number = objTra.data.account_number;
		this.responsible = objTra.data.responsible;
		this.val_request = objTra.data.val_request;
		this.val_transfer = objTra.data.val_transfer;
		this.bank = objTra.data.bank;
		this.state = objTra.data.state;
		this.store = objTra.data.store;
		this.typeaccount = objTra.data.typeaccount;
		this.reference = objTra.data.reference;
	}

}


