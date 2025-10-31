import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { ApiService } from '../../../Services/api.service';
import { Transfer } from '../../../Models/Transfer';
import { EmbryoService } from '../../../Services/Embryo.service';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TransfersDetailAdmSidebarSidebarComponent } from '../../Shared/TransfersDetailAdmSidebar/TransfersDetailAdmSidebar.component';

@Component({
	selector: 'Transfers',
	templateUrl: './Transfers.component.html',
	styleUrls: ['./Transfers.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		MatTableModule,
		MatPaginatorModule,
		MatCardModule,
		MatSidenavModule,
		MatButtonModule,
		MatIconModule,
		CurrencyPipe,
		TransfersDetailAdmSidebarSidebarComponent
	]
})

export class TransfersComponent implements OnInit {


	transferList: any[] = [];
	adminTransferList: any[] = [];
	get_pr: any[] = [];
		transferGrid: Transfer | any;
		@ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

	dataSource = new MatTableDataSource<any>(this.adminTransferList);
	displayedColumns: string[] = ['action', 'detail','reference', 'state', 'store','created_at','responsible' , 'val_transfer'];

	constructor(
		private apiService: ApiService,
		public service: AdminPanelServiceService,
		public embryoService: EmbryoService,
	) { }

		ngOnInit() {
			this.addBodyClass();
			this.apiService.GetAllTransfers().subscribe((res: any) => this.getAllTransfersData(res), (error: any) => console.log(error));
		}


		addBodyClass() {
			window.addEventListener('load', function () {
				const body = document.querySelector('body');
				if (body) body.classList.add("loaded");
			});
		}

		getAllTransfersData(response: any) {	
		console.log(response);
					
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


		onSeeDialog(data: any) {				
			this.getTransferData(data);		
	}

		getTransferData(response: any) {				
		let myObj_transfer = {
			id: response.id,
			reference: response.reference,
			account_number: response.account_number,
			responsible: response.responsible,
			val_request: response.val_request,
			val_transfer: response.val_transfer,
			bank: response.bank,
			state: response.state,
			store: response.store,
			typeaccount: response.typeaccount,
			created_at: response.created_at,
			state_id: response.state_id,
			
		};
		this.transferGrid = myObj_transfer;
		this.apiService.PopUpAdminTransfers(this.transferGrid);
	}

			DetailTransfer(data: any){
			localStorage.removeItem("id_transfer");
			localStorage.setItem('id_transfer', String(data.id));
			localStorage.removeItem("refer_transfer");
			localStorage.setItem('refer_transfer', String(data.reference));
		this.apiService.GetTransfersByIdPanelAdmin(data.id).subscribe((response: any) => {
				let myJSONtrsDetail = JSON.stringify(response.data);
				localStorage.removeItem("detail_transfer");
				localStorage.setItem('detail_transfer', myJSONtrsDetail);				
				localStorage.removeItem("val_request");
				localStorage.setItem('val_request', response.val_request);				
				localStorage.removeItem("val_transfer");
				localStorage.setItem('val_transfer', response.val_transfer);	
				this.embryoService.TransfersDetailAdmSidebarOpen = !this.embryoService.TransfersDetailAdmSidebarOpen;
		}, (error: any) => console.log(error));
		
	}


}

