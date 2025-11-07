import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../../Services/api.service';
import { InvoiceUser } from '../../../Models/Invoice';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

const order_history = [
	{ position: 1, orderid: 1801, name: 'LEGITIM', price: 1.0079, status: 'Sent', action: '' },
	{ position: 2, orderid: 1832, name: 'GRUNDTAL', price: 4.0026, status: 'In processing', action: '' },
	{ position: 3, orderid: 1881, name: 'BOHOLMEN', price: 6.941, status: 'Sent', action: '' },
	{ position: 4, orderid: 1832, name: 'ROSTAD LÖK', price: 9.0122, status: 'Return', action: '' },
	{ position: 5, orderid: 1810, name: 'TÅRTA CHOKLADKROKANT', price: 10.811, status: 'Sent', action: '' },
];

@Component({
	selector: 'app-OrderHistory',
	standalone: true,
	imports: [
		CommonModule,
		CurrencyPipe,
		MatTableModule,
		MatPaginatorModule,
		MatCardModule,
		MatButtonModule
	],
	templateUrl: './OrderHistory.component.html',
	styleUrls: ['./OrderHistory.component.scss']
})
export class OrderHistoryComponent implements OnInit {

	invoiceList: any[] = [];
	invDetailGrid: any;

	@ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

	dataSource = new MatTableDataSource<any>(this.invoiceList);


	displayedColumns: string[] = ['action', 'reference', 'name_external_state', 'created_at', 'total_p'];

	constructor(
		private apiService: ApiService,
	) { }

	// Getter para obtener los datos paginados para la vista móvil
	get paginatedData(): any[] {
		if (!this.paginator || !this.dataSource) {
			return this.dataSource?.data || [];
		}
		const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
		const endIndex = startIndex + this.paginator.pageSize;
		return this.dataSource.filteredData.slice(startIndex, endIndex);
	}

	ngOnInit() {

		const id_user_front = localStorage.getItem('id_user_front');
		this.apiService.ListInvoicesByUser(id_user_front).subscribe((res: any) => this.getAllInvoiceUserData(res));

	}


	getAllInvoiceUserData(response: any) {
		console.log(response);

		this.invoiceList = response;
		this.dataSource = new MatTableDataSource<any>(this.invoiceList);
		setTimeout(() => {
			this.dataSource.paginator = this.paginator;
		}, 0)
	}


	onSeeDialog(data: any) {
		this.apiService.getInvoiceUserDetail(data.reference).subscribe((dataDetailInvoice: any) => this.getInvoiceDetailData(dataDetailInvoice, data));
	}


	getInvoiceDetailData(dataDetailInvoice: any, dataInvoice: any) {
		let myObj_invoice;
		myObj_invoice = {
			address: dataInvoice.address ?? dataInvoice.adress,
			created_at: dataInvoice.created_at,
			departament: dataInvoice.depart,
			email: dataInvoice.email,
			first_name_client: dataInvoice.first_name_client,
			id_store_id: dataInvoice.id_store_id,
			id: dataInvoice.id,
			name_client: dataInvoice.name_client,
			name_state: dataInvoice.name_state,
			name_store: dataInvoice.name_store,
			nameci: dataInvoice.nameci,
			number_identifier: dataInvoice.number_identifier,
			paymentmethod: dataInvoice.paymentmethod,
			phone: dataInvoice.phone,
			reference: dataInvoice.reference,
			reference_invoice: dataInvoice.reference_invoice,
			state_id: dataInvoice.state_id,
			total_price: dataInvoice.total_p,
			transaction_id: dataInvoice.transaction_id,
			type_identifier: dataInvoice.type_identifier,
			user_id: dataInvoice.user_id,
			invoice_detail: dataDetailInvoice
		};



	this.invDetailGrid = myObj_invoice as any;
	this.apiService.PopUpInvoiceDetailUsr(this.invDetailGrid);
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}


}

