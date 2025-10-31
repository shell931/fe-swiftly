import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { Router } from '@angular/router';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { ApiService } from '../../../Services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Products } from '../../../Models/Products';
import { Transactions } from '../../../Models/Transactions';
import { environment } from '../../../../environments/environment';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { UntypedFormGroup, FormControl, FormsModule } from '@angular/forms';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'Transactions',
	templateUrl: './Transactions.component.html',
	styleUrls: ['./Transactions.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		MatTableModule,
		MatPaginatorModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		CurrencyPipe
	]
})



export class TransactionsComponent implements OnInit {


	transactionList: any[] = [];
	adminTransactionList: any[] = [];
	get_pr: any[] = [];
	transactionsGrid: Transactions | any;
	dataList: any[] = [];
	@ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
	initial_date: any;
	finish_date: any;

	// Add missing properties for template binding
	dateInit: any;
	dateEnd: any;
	newVar: any;
	newVarE: any;

	dataSource = new MatTableDataSource<any>(this.adminTransactionList);
	displayedColumns: string[] = ['action', 'reference', 'name_state', 'created_at', 'quot', 'brand', 'num_aprob', 'cod_reply', 'messaje_reply', 'num_recibo', 'total_tx'];

	campaignOne: UntypedFormGroup;
	campaignTwo: UntypedFormGroup;

	constructor(
		private apiService: ApiService,
		public service: AdminPanelServiceService
	) {
	}

		ngOnInit() {
			this.addBodyClass();
			this.apiService.getAllTransactions().subscribe((res: any) => this.getAllTransactionsData(res), (error: any) => console.log(error));
		}


		addBodyClass() {
			window.addEventListener('load', function () {
				const body = document.querySelector('body');
				if (body) body.classList.add("loaded");
			});
		}

		getAllTransactionsData(response: any) {
		console.log(response);

		this.transactionList = response;
		this.dataSource = new MatTableDataSource<any>(this.transactionList);
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


	onSeeDialog(data) {
		this.getTransactionData(data);
	}

	getTransactionData(response) {
		let myObj_transaction = {
			brand: response.brand,
			cod_reply: response.cod_reply,
			created_at: response.created_at,
			id: response.id,
			messaje_reply: response.messaje_reply,
			num_aprob: response.num_aprob,
			num_recibo: response.num_recibo,
			quot: response.quot,
			reference: response.reference,
			total_tx: response.total_tx,
			state: response.state,
			name_state: response.name_state,
			tag_desc_selling: response.tag_desc_selling,
			tag_first_name: response.tag_first_name,
			tag_last_name: response.tag_last_name,
			tag_type_identification: response.tag_type_identification,
			tag_number_identification: response.tag_number_identification,
			tag_email: response.tag_email,
			tag_cellphone: response.tag_cellphone,
			ValidInvoiceOnTransfer: response.ValidInvoiceOnTransfer,
		};
		this.transactionsGrid = myObj_transaction;
		this.apiService.PopUpAdminTransaction(this.transactionsGrid);
	}

		downloadExcel() {
		let getDateInit = (document.getElementById("dateInit") as HTMLInputElement).value
		getDateInit = getDateInit.replace("/", "")
		getDateInit = getDateInit.replace("/", "") 
		let getDateEnd = (document.getElementById("dateEnd") as HTMLInputElement).value
		getDateEnd = getDateEnd.replace("/", "")
		getDateEnd = getDateEnd.replace("/", "") 
			
		this.initial_date = getDateInit;
		this.finish_date = getDateEnd;

		let jsondata = {
			"initial_date": this.initial_date,
			"finish_date": this.finish_date,
		}
		this.apiService.getDataExportableTransaction(jsondata).subscribe((res: any) => {
			let workbook = new Workbook();
			let worksheet = workbook.addWorksheet("Employee Data");
			let header = ["Tienda","Creacion", "Cuotas", "Franquicia", "Num Aprob", "Num Recibo", "Cod Respuesta", "Mensaje Respu",
				"Referencia", "Total", "Estado", "Nombre", "Tipo de indentiticacion", "Numero Identificacion", "Email",
				"Numero Contacto", "Descripcion venta", "Num tarj", "Bin"]
			let headerRow = worksheet.addRow(header);
			let myJSON = JSON.stringify(res);
			let obj = JSON.parse(myJSON || '[]');		
	
			for (let x1 of obj) {
				let x2 = Object.keys(x1);
				let temp = []
				for (let y of x2) {
					temp.push(x1[y])
				}
				worksheet.addRow(temp)
			}
			let fname = "Transacciones"
			workbook.xlsx.writeBuffer().then((data) => {
				let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
				fs.saveAs(blob, fname + ' ' + this.initial_date + '-' + this.finish_date + '.xlsx');
			});
		}
		);
	}
}

