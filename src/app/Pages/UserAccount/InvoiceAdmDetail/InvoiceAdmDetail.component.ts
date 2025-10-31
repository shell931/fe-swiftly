import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
// import { MaterialFileInputModule } from 'ngx-material-file-input'; // Temporarily disabled - missing dependency
import { ApiService } from '../../../Services/api.service';
import { Invoice } from '../../../Models/Invoice';
import { EmbryoService } from '../../../Services/Embryo.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { environment } from '../../../../../src/environments/environment';

const { isArray } = Array;



@Component({
	selector: 'app-InvoiceAdmDetail',
	standalone: true,
	imports: [
		CommonModule,
		CurrencyPipe,
		ReactiveFormsModule,
		FormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		MatButtonModule
		// MaterialFileInputModule // Temporarily disabled - missing dependency
	],
	templateUrl: './InvoiceAdmDetail.component.html',
	styleUrls: ['./InvoiceAdmDetail.component.scss']
})

export class InvoiceAdmDetailComponent implements OnInit {


	popUpDeleteUserResponse: any;
	invoiceList: any[] = [];
	invDetailGrid!: Invoice;


	@ViewChild(MatPaginator, { static: false })
	paginator!: MatPaginator;

	dataSource = new MatTableDataSource<any>(this.invoiceList);


	number_binnacles_inprocces: any;
	id_invoice: any;
	id_invoice_back: any;
	number_invoice: any;
	reference_invoice: any;
	datas: any;
	id: any;

	adress: any;
	created_at: any;
	departament: any;
	email: any;
	first_name_client: any;
	id_store_id: any;
	name_client: any;
	name_state: any;
	name_store: any;
	nameci: any;
	number_identifier: any;
	paymentmethod: any;
	phone: any;
	reference: any;
	state_id: any;
	total_price: any;
	percentage_sale: any;
	val_percentage_sale: any;
	percentage_commision_payment: any;
	val_percentage_commision_payment: any;
	percentage_rete_ica: any;
	val_percentage_rete_ica: any;
	percentage_rete_fuente: any;
	val_percentage_rete_fuente: any;
	percentage_commision_tax: any;
	val_percentage_commision_tax: any;
	total_balance: any;
	transaction_id: any;
	type_identifier: any;
	user_id: any;
	invoice_detail: any;
	num_aprob: any;
	quot: any;
	brand: any;
	cod_reply: any;
	messaje_reply: any;
	num_recibo: any;
	type_service_id: any;
	type_service: any;
	adminprList: any[] = [];
	cam_com: any;
	ShippmentForm!: UntypedFormGroup;
	img_product_rout: any;

	public show: boolean = false;


	constructor(
		// public service: AdminPanelServiceService,
		private apiService: ApiService,
		private changeDetectorRef: ChangeDetectorRef,
		public embryoService: EmbryoService,
		private router: Router,
		private route: ActivatedRoute,
		private formGroup: UntypedFormBuilder,
	) { }

	ngOnInit() {

		this.route.params.subscribe(res => {
			this.id = res.id;
		})

		this.apiService.ListInvoicesById(this.id).subscribe(
			(			dataHeaderInvoice: any) => {
				this.apiService.getInvoiceDetail(this.id).subscribe((dataDetailInvoice: any) => this.getInvoiceDetailData(dataDetailInvoice, dataHeaderInvoice));
			},
			(			error: any) => console.log(error)
		);
		this.ShippmentForm = this.formGroup.group({
			cam_com: new UntypedFormControl('', [Validators.required]),
		});

		this.embryoService.binnacleSidenavOpen = false;
		this.img_product_rout = environment.api.baseBucketImageUrl;
	}



	getInvoiceDetailData(dataDetailInvoice: any[], dataInvoice: { adress: any; created_at: any; departament: any; email: any; first_name_client: any; id_store_id: any; id: any; name_client: any; name_state: any; name_store: any; nameci: any; number_identifier: any; paymentmethod: any; phone: any; reference: any; reference_invoice: any; state_id: any; total_price: any; percentage_sale: any; val_percentage_sale: any; percentage_commision_payment: any; val_percentage_commision_payment: any; percentage_rete_ica: any; val_percentage_rete_ica: any; percentage_rete_fuente: any; val_percentage_rete_fuente: any; percentage_commision_tax: any; val_percentage_commision_tax: any; total_balance: any; transaction_id: any; type_identifier: any; user_id: any; num_aprob: any; quot: any; brand: any; cod_reply: any; messaje_reply: any; num_recibo: any; type_service_id: any; type_service: any; }) {
		this.adress = dataInvoice.adress;
		this.created_at = dataInvoice.created_at;
		this.departament = dataInvoice.departament;
		this.email = dataInvoice.email;
		this.first_name_client = dataInvoice.first_name_client;
		this.id_store_id = dataInvoice.id_store_id;
		this.id = dataInvoice.id;
		this.name_client = dataInvoice.name_client;
		this.name_state = dataInvoice.name_state;
		this.name_store = dataInvoice.name_store;
		this.nameci = dataInvoice.nameci;
		this.number_identifier = dataInvoice.number_identifier;
		this.paymentmethod = dataInvoice.paymentmethod;
		this.phone = dataInvoice.phone;
		this.reference = dataInvoice.reference;
		this.reference_invoice = dataInvoice.reference_invoice;
		this.state_id = dataInvoice.state_id;
		this.total_price = dataInvoice.total_price;
		this.percentage_sale = dataInvoice.percentage_sale;
		this.val_percentage_sale = dataInvoice.val_percentage_sale;
		this.percentage_commision_payment = dataInvoice.percentage_commision_payment;
		this.val_percentage_commision_payment = dataInvoice.val_percentage_commision_payment;
		this.percentage_rete_ica = dataInvoice.percentage_rete_ica;
		this.val_percentage_rete_ica = dataInvoice.val_percentage_rete_ica;
		this.percentage_rete_fuente = dataInvoice.percentage_rete_fuente;
		this.val_percentage_rete_fuente = dataInvoice.val_percentage_rete_fuente;
		this.percentage_commision_tax = dataInvoice.percentage_commision_tax;
		this.val_percentage_commision_tax = dataInvoice.val_percentage_commision_tax;
		this.total_balance = dataInvoice.total_balance;
		this.transaction_id = dataInvoice.transaction_id;
		this.type_identifier = dataInvoice.type_identifier;
		this.user_id = dataInvoice.user_id;
		this.invoice_detail = dataDetailInvoice;
		this.num_aprob = dataInvoice.num_aprob;
		this.quot = dataInvoice.quot;
		this.brand = dataInvoice.brand;
		this.cod_reply = dataInvoice.cod_reply;
		this.messaje_reply = dataInvoice.messaje_reply;
		this.num_recibo = dataInvoice.num_recibo;
		this.type_service_id = dataInvoice.type_service_id;
		this.type_service = dataInvoice.type_service;
		this.adminprList = dataDetailInvoice;
	}

	onChangeCamCom(event: any) {
		if (event.target.files.length > 0) {
			this.cam_com = event.target.files[0];
		}
	}
	/**   
	* Change invoice's status 
	* @param none
	* @returns update status
	*/

	ShippingVoucherRequest() {

		if (this.ShippmentForm.valid) {
			this.show = !this.show;
			let myObj_store = {
				"state": "5",
				"external_state": "1",
			};
			this.apiService.UpdateStatusInvoice(myObj_store, this.id).subscribe(
				result => {
					// window.location.reload();
					const formDataShippmentVoucher = new FormData();
					formDataShippmentVoucher.append('shipping_voucher', this.cam_com);
					formDataShippmentVoucher.append('id_invoice', this.id);
					this.apiService.UpdateShippingVoucherInvoice(formDataShippmentVoucher).subscribe(
						result => {
							window.location.reload();
						},
						error => console.log(error)
					);
				},
				error => console.log(error)
			);
		} else {
			console.log("fails");
			for (let i in this.ShippmentForm.controls) {
				this.ShippmentForm.controls[i].markAsTouched();
			}
		}
	}


	SendLetterReceived() {

		if (this.ShippmentForm.valid) {
			this.show = !this.show;
			const formDataLetter = new FormData();
			formDataLetter.append('letter_received', this.cam_com);
			formDataLetter.append('id_invoice', this.id);
			this.apiService.UpdateLetterReceivedInvoice(formDataLetter).subscribe(
				result => {
					window.location.reload();
					},
					error => console.log(error)
					);
		} else {
			console.log("fails");
			for (let i in this.ShippmentForm.controls) {
				this.ShippmentForm.controls[i].markAsTouched();
			}
		}
	}



}


