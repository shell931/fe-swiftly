import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
// import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TransfersDetailSidebarComponent } from '../../../Layouts/TransfersDetailSidebar/TransfersDetailSidebar.component';
import { ApiService } from '../../../Services/api.service';
import { Invoice } from '../../../Models/Invoice';
import { Transfer } from '../../../Models/Transfer';
import { Router, ActivatedRoute, Params } from '@angular/router';
const { isArray } = Array;
import { EmbryoService } from '../../../Services/Embryo.service';



@Component({
	selector: 'app-TransfersView',
	standalone: true,
	imports: [
		CommonModule,
		CurrencyPipe,
		MatSidenavModule,
		TransfersDetailSidebarComponent
	],
	templateUrl: './TransfersView.component.html',
	styleUrls: ['./TransfersView.component.scss']
})

export class TransfersViewComponent implements OnInit {


	popUpDeleteUserResponse: any;
	transferList: any[] = [];
	traDetailGrid: Transfer;
	id: any;

	account_number: any;
	bank: any;
	created_at: any;
	reference: any;
	responsible: any;
	state: any;
	store: any;
	typeaccount: any;
	val_request: any;
	val_transfer: any;

	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

	dataSource = new MatTableDataSource<any>(this.transferList);

	displayedColumns: string[] = ['action', 'reference', 'created_at', 'responsible', 'state', 'val_transfer'];


	constructor(
		// public service: AdminPanelServiceService,
		private apiService: ApiService,
		private route: ActivatedRoute,
		private router: Router,
		public embryoService: EmbryoService,
	) { }

	ngOnInit() {

		this.route.params.subscribe(res => {
			this.id = res.id;
		})

		this.apiService.GetTransferData(this.id).subscribe(res => this.getTransferData(res));
	}


	getTransferData(response) {
		this.account_number = response.data.account_number;
		this.bank = response.data.bank;
		this.created_at = response.data.created_at;
		this.reference = response.data.reference;
		this.responsible = response.data.responsible;
		this.state = response.data.state;
		this.store = response.data.store;
		this.typeaccount = response.data.typeaccount;
		this.val_request = response.data.val_request;
		this.val_transfer = response.data.val_transfer;
	}

	DetailTransferInv() {
		localStorage.removeItem("id_transfer");
		localStorage.setItem('id_transfer', this.id);

		this.apiService.GetTransfersById(this.id).subscribe(
			response => {
				let myJSONtrsDetail = JSON.stringify(response.data);
				localStorage.removeItem("detail_transfer");
				localStorage.setItem('detail_transfer', myJSONtrsDetail);				
				localStorage.removeItem("val_request");
				localStorage.setItem('val_request', response.val_request);				
				localStorage.removeItem("val_transfer");
				localStorage.setItem('val_transfer', response.val_transfer);	
				this.embryoService.TransfersDetailSidebarOpen = !this.embryoService.TransfersDetailSidebarOpen;
			},
			error => console.log(error)
		);
		
	}

}


