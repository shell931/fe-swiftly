import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { BinnacleSideBarComponent } from '../../../Layouts/BinnacleSideBar/BinnacleSideBar.component';
import { ApiService } from '../../../Services/api.service';
import { Invoice } from '../../../Models/Invoice';
import { EmbryoService } from '../../../Services/Embryo.service';


const { isArray } = Array;



@Component({
	selector: 'app-InvoiceAdm',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		CurrencyPipe,
		MatTableModule,
		MatPaginatorModule,
		MatSidenavModule,
		MatCardModule,
		MatListModule,
		MatButtonModule,
		MatBadgeModule,
		MatIconModule,
		BinnacleSideBarComponent
	],
	templateUrl: './InvoiceAdm.component.html',
	styleUrls: ['./InvoiceAdm.component.scss']
})

export class InvoiceAdmComponent implements OnInit {

	// UI properties
	hidden: boolean = false;

	popUpDeleteUserResponse: any;
	invoiceList: any[] = [];
	invDetailGrid!: Invoice;


	@ViewChild(MatPaginator, { static: false })
	paginator!: MatPaginator;

	dataSource = new MatTableDataSource<any>(this.invoiceList);

	displayedColumns: string[] = ['action', 'action2', 'reference_invoice', 'created_at', 'name_state', 'number_identifier', 'paymentmethod', 'type_service', 'reference', 'total_price'];
	number_binnacles_inprocces: any;
	id_invoice: any;
	id_invoice_back: any;
	number_invoice: any;
	reference_invoice: any;
	datas: any;
	// binnacleSidenavOpen: boolean = false;

	constructor(
		// public service: AdminPanelServiceService,
		private apiService: ApiService,
		private changeDetectorRef: ChangeDetectorRef,
		public embryoService: EmbryoService,
	) { }

	ngOnInit() {
		const id_store = localStorage.getItem('id-store');
		this.apiService.ListInvoicesByStore(id_store).subscribe((res: any) => this.getAllInvoiceData(res));
		this.id_invoice = localStorage.getItem('id_invoice_popup');
		this.embryoService.binnacleSidenavOpen = false;
	}


	getAllInvoiceData(response: any) {
		this.invoiceList = response;
		this.dataSource = new MatTableDataSource<any>(this.invoiceList);
		this.changeDetectorRef.detectChanges();
		this.dataSource.paginator = this.paginator;
		// this.obs = this.dataSource.connect();
		setTimeout(() => {
			this.dataSource.paginator = this.paginator;
		}, 0)
	}


	/**
  * onSeeDialog method is used to open a see dialog.
  */
	onSeeDialog(data: { id: any; }) {
		const invoice = this.invoiceList.find(inv => inv.id === data.id);
		if (invoice) {
			this.apiService.getInvoiceDetail(data.id).subscribe((dataDetailInvoice: any) => this.getInvoiceDetailData(dataDetailInvoice, invoice));
		} else {
			console.error('Invoice not found for id:', data.id);
		}
	}

	getBinnacles(data: { id: string; }) {
		const id_store = localStorage.getItem('id-store');
		this.apiService.ListInvoicesByStore(id_store).subscribe((res: any) => this.getAllInvoiceData(res));
		localStorage.removeItem("messajes");
		localStorage.removeItem("id_invoice_popup");
		localStorage.setItem('id_invoice_popup', data.id);

		let id_invoice = data.id;
		this.apiService.getBinnacle(id_invoice, 'st').subscribe(
			(			result: { result: number; data: any; }) => {				
				if (result.result == 200) {					
					let myJSONinvDetail = JSON.stringify(result.data);
					localStorage.setItem('messajes', myJSONinvDetail);
					this.embryoService.binnacleSidenavOpen = !this.embryoService.binnacleSidenavOpen;
				} else {
					console.log("Null");
					this.embryoService.binnacleSidenavOpen = !this.embryoService.binnacleSidenavOpen;
				}
			}
		);
	}

	getInvoiceDetailData(dataDetailInvoice: any, dataInvoice: {
		[x: string]: null; adress: any; created_at: any; departament: any; email: any; first_name_client: any; id_store_id: any; id: any; name_client: any; name_state: any; name_store: any; nameci: any; number_identifier: any; paymentmethod: any; phone: any; reference: any; reference_invoice: any; state_id: any; total_price: any; percentage_sale: any; val_percentage_sale: any; percentage_commision_payment: any; val_percentage_commision_payment: any; percentage_rete_ica: any; val_percentage_rete_ica: any; percentage_rete_fuente: any; val_percentage_rete_fuente: any; percentage_commision_tax: any; val_percentage_commision_tax: any; total_balance: any; transaction_id: any; type_identifier: any; user_id: any; num_aprob: any; quot: any; brand: any; cod_reply: any; messaje_reply: any; num_recibo: any; type_service_id: any; type_service: any; 
}) {

		let myObj_invoice;
		myObj_invoice = {
			adress: dataInvoice.adress != null ? String(dataInvoice.adress) : '',
			created_at: dataInvoice.created_at != null ? String(dataInvoice.created_at) : '',
			departament: dataInvoice.departament != null ? String(dataInvoice.departament) : '',
			email: dataInvoice.email != null ? String(dataInvoice.email) : '',
			first_name_client: dataInvoice.first_name_client != null ? String(dataInvoice.first_name_client) : '',
			id_store_id: dataInvoice.id_store_id != null ? Number(dataInvoice.id_store_id) : 0,
			id: dataInvoice.id != null ? Number(dataInvoice.id) : 0,
			name_client: dataInvoice.name_client != null ? String(dataInvoice.name_client) : '',
			name_state: dataInvoice.name_state != null ? String(dataInvoice.name_state) : '',
			name_store: dataInvoice.name_store != null ? String(dataInvoice.name_store) : '',
			nameci: dataInvoice.nameci != null ? String(dataInvoice.nameci) : '',
			number_identifier: dataInvoice.number_identifier != null ? String(dataInvoice.number_identifier) : '',
			paymentmethod: dataInvoice.paymentmethod != null ? String(dataInvoice.paymentmethod) : '',
			phone: dataInvoice.phone != null ? String(dataInvoice.phone) : '',
			reference: dataInvoice.reference != null ? String(dataInvoice.reference) : '',
			reference_invoice: dataInvoice.reference_invoice != null ? String(dataInvoice.reference_invoice) : '',
			state_id: dataInvoice.state_id != null ? String(dataInvoice.state_id) : '',
			total_price: dataInvoice.total_price != null ? Number(dataInvoice.total_price) : 0,
			percentage_sale: dataInvoice.percentage_sale != null ? Number(dataInvoice.percentage_sale) : 0,
			val_percentage_sale: dataInvoice.val_percentage_sale != null ? Number(dataInvoice.val_percentage_sale) : 0,
			percentage_commision_payment: dataInvoice.percentage_commision_payment != null ? Number(dataInvoice.percentage_commision_payment) : 0,
			val_percentage_commision_payment: dataInvoice.val_percentage_commision_payment != null ? Number(dataInvoice.val_percentage_commision_payment) : 0,
			percentage_rete_ica: dataInvoice.percentage_rete_ica != null ? Number(dataInvoice.percentage_rete_ica) : 0,
			val_percentage_rete_ica: dataInvoice.val_percentage_rete_ica != null ? Number(dataInvoice.val_percentage_rete_ica) : 0,
			percentage_rete_fuente: dataInvoice.percentage_rete_fuente != null ? Number(dataInvoice.percentage_rete_fuente) : 0,
			val_percentage_rete_fuente: dataInvoice.val_percentage_rete_fuente != null ? Number(dataInvoice.val_percentage_rete_fuente) : 0,
			percentage_commision_tax: dataInvoice.percentage_commision_tax != null ? Number(dataInvoice.percentage_commision_tax) : 0,
			val_percentage_commision_tax: dataInvoice.val_percentage_commision_tax != null ? Number(dataInvoice.val_percentage_commision_tax) : 0,
			val_percentage_rete_iva: dataInvoice.val_percentage_rete_iva != null ? Number(dataInvoice.val_percentage_rete_iva) : 0,
			total_balance: dataInvoice.total_balance != null ? Number(dataInvoice.total_balance) : 0,
			transaction_id: dataInvoice.transaction_id != null ? Number(dataInvoice.transaction_id) : 0,
			type_identifier: dataInvoice.type_identifier != null ? String(dataInvoice.type_identifier) : '',
			user_id: dataInvoice.user_id != null ? Number(dataInvoice.user_id) : 0,
			invoice_detail: typeof dataDetailInvoice === 'string' ? dataDetailInvoice : JSON.stringify(dataDetailInvoice),
			image_gallery: Array.isArray(dataInvoice.image_gallery) ? JSON.stringify(dataInvoice.image_gallery) : (dataInvoice.image_gallery != null ? String(dataInvoice.image_gallery) : ''),
			shipping_voucher: dataInvoice.shipping_voucher != null ? String(dataInvoice.shipping_voucher) : '',
			num_aprob: dataInvoice.num_aprob != null ? String(dataInvoice.num_aprob) : '',
			quot: dataInvoice.quot != null ? String(dataInvoice.quot) : '',
			brand: dataInvoice.brand != null ? String(dataInvoice.brand) : '',
			cod_reply: dataInvoice.cod_reply != null ? String(dataInvoice.cod_reply) : '',
			messaje_reply: dataInvoice.messaje_reply != null ? String(dataInvoice.messaje_reply) : '',
			num_recibo: dataInvoice.num_recibo != null ? String(dataInvoice.num_recibo) : '',
			type_service_id: dataInvoice.type_service_id != null ? Number(dataInvoice.type_service_id) : 0,
			type_service: dataInvoice.type_service != null ? String(dataInvoice.type_service) : '',
			getBinnacleFalse: dataInvoice.getBinnacleFalse != null ? String(dataInvoice.getBinnacleFalse) : '',
		};

		this.invDetailGrid = myObj_invoice;
		this.apiService.PopUpInvoiceDetail(this.invDetailGrid);
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}




}


