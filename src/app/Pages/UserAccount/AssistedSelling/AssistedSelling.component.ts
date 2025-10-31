import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule, AsyncPipe, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, FormArray, Validators } from '@angular/forms';
import { EmbryoService } from '../../../Services/Embryo.service';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../Services/api.service';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Observable, Subscription } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgSelectModule } from '@ng-select/ng-select';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { Transactions } from '../../../Models/Transactions';
import { LoadScriptsService } from "../../../load-scripts.service";

export interface Month {
	id: number;
	month: string;
}

export interface Year {
	id: number;
	year: string;
}

export interface Identifiers {
	id: string;
	type_identifier: string;
}

export interface PercentageTax {
	id: string;
	percentage: string;
	description: string;
}

export interface Departament {
	id_departament: string;
	departament: string;
}

export interface City {
    id_city: string;
    city: string;
}

@Component({
	selector: 'app-AssistedSelling',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		AsyncPipe,
		CurrencyPipe,
		MatTableModule,
		MatPaginatorModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatButtonModule,
		MatCardModule,
		NgSelectModule,
		SweetAlert2Module
	],
	templateUrl: './AssistedSelling.component.html',
	styleUrls: ['./AssistedSelling.component.scss']
})

export class AssistedSellingComponent implements OnInit {
	public show: boolean = false;
	txDetailGrid!: Transactions;
	assistedsellingForm!: UntypedFormGroup;
	paymentForm!: UntypedFormGroup;
	emailPattern: string = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$";
	months$!: Observable<Month[]>;
	selectedMonth: any;
	months: Month[] = [
		{
			id: 1,
			month: '01'
		},
		{
			id: 2,
			month: '02'
		},
		{
			id: 3,
			month: '03'
		},
		{
			id: 4,
			month: '04'
		},
		{
			id: 5,
			month: '05'
		},
		{
			id: 6,
			month: '06'
		},
		{
			id: 7,
			month: '07'
		},
		{
			id: 8,
			month: '08'
		},
		{
			id: 9,
			month: '09'
		},
		{
			id: 10,
			month: '10'
		},
		{
			id: 11,
			month: '11'
		},
		{
			id: 12,
			month: '12'
		}
	]


	years: Year[] = [
		{
			id: 1,
			year: '20'
		},
		{
			id: 2,
			year: '21'
		},
		{
			id: 3,
			year: '22'
		},
		{
			id: 4,
			year: '23'
		},
		{
			id: 5,
			year: '24'
		},
		{
			id: 6,
			year: '25'
		},
		{
			id: 7,
			year: '26'
		},
		{
			id: 8,
			year: '27'
		},
		{
			id: 9,
			year: '28'
		},
		{
			id: 10,
			year: '29'
		},
	]
	years$!: Observable<Year[]>;
	selectedYear: any;
	selectIdentifiers: any;
	identifier$!: Observable<Identifiers[]>;
	identifierstlist: Identifiers[] = [];
	identifiers: Identifiers[] = [];

	selectedPercentageTax: any;
	percentage_tax$!: Observable<PercentageTax[]>;
	public percentagetaxFilterCtrl: UntypedFormControl = new UntypedFormControl();
	percentagetaxlist: PercentageTax[] = [];
	percentagetax: PercentageTax[] = [];
	id_percentage_tax: any;

	transactionsList: any[] = [];
	transactionsDetailGrid!: Transactions;
	@ViewChild(MatPaginator, { static: false })
	paginator!: MatPaginator;
	dataSource = new MatTableDataSource<any>(this.transactionsList);

	departament: any
	id_departament: any;
	// START ANGULAR MAT SEARCH DEPARTAMENT    
	public departamentCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
	public departamentCtrll: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
	public departamentFilterCtrl: UntypedFormControl = new UntypedFormControl();
	// END ANGULAR MAT SEARCH CITY
	departments: Departament[] = [];
	department_selected: Departament[] = [];
	departamentlist: Departament[] = [];
	depart$!: Observable<Departament[]>;

	citietlist: City[] = [];
	public citieCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
    public citieFilterCtrl: UntypedFormControl = new UntypedFormControl();
	cities: City[] = [];
	city$!: Observable<City[]>;
	selectedCity: any;

	displayedColumns: string[] = ['action', 'id', 'created_at', 'num_aprob', 'cod_reply', 'name_state', 'total_tx'];

	constructor(
		// public service: AdminPanelServiceService,
		private apiService: ApiService,
		public router: Router,
		private formGroup: UntypedFormBuilder,
		private _LoadScript: LoadScriptsService
	) {
		_LoadScript.Carga(["card/card"]);
	}

	ngOnInit() {

		// START ANGULAR MAT SEARCH TYPE IDENTIFICATION
		this.identifiers = [];
		this.apiService.getTypreIdentifiersFront().subscribe(
			(data: Identifiers[]) => {
				this.identifierstlist = data;
				for (var i in this.identifierstlist) {
					let get_id = this.identifierstlist[i]['id'];
					let get_type_identifier = this.identifierstlist[i]['type_identifier'];
					this.identifiers.push({ id: get_id, type_identifier: get_type_identifier });
				}
				this.identifier$ = this.getIdentifiers("", this.identifiers);
			},
		);

		// START ANGULAR MAT SEARCH PERCENTAGE TAX IVA
		this.percentagetax = [];
		this.apiService.getPercentagesTax().subscribe(
			(data: PercentageTax[]) => {
				this.percentagetaxlist = data;
				for (var i in this.percentagetaxlist) {
					let get_id_percentagesale = this.percentagetaxlist[i]['id'];
					let get_percentagesale = this.percentagetaxlist[i]['percentage'] + ' %';
					let get_description = this.percentagetaxlist[i]['description'];
					this.percentagetax.push({ id: get_id_percentagesale, percentage: get_percentagesale, description: get_description });
				}
				this.percentage_tax$ = this.getPercentageTax("", this.percentagetax);
			},
			(			error: any) => console.log(error)
		);

		// START ANGULAR MAT SEARCH DEPARTAMENT
		this.departments = [];
		this.apiService.getDepartmentsFront().subscribe(
			(data: Departament[]) => {
				this.departamentlist = data;
				for (var i in this.departamentlist) {
					let get_id_departament = this.departamentlist[i]['id_departament'];
					let get_departament = this.departamentlist[i]['departament'];
					this.departments.push({ departament: get_departament, id_departament: get_id_departament });
				}

				console.log(this.departments);


				this.depart$ = this.getDepartment("", this.departments);

			},
		);
		// END ANGULAR MAT SEARCH DEPARTAMENT

		this.assistedsellingForm = this.formGroup.group({
			tag_first_name: ['', [Validators.required]],
			tag_last_name: ['', [Validators.required]],
			identifiersCtrl: new UntypedFormControl('', [Validators.required]),
			number_identifier: ['', [Validators.required]],
			tag_email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
			tag_cellphone: ['', [Validators.required]],
			total_tx: ['', [Validators.required]],
			percentagetaxCtrl: new UntypedFormControl(null, [Validators.required]),
			tag_desc_selling: ['', [Validators.required]],
			departamentCtrll: new UntypedFormControl('', [Validators.required]),
			citieCtrl: new UntypedFormControl('', [Validators.required]),
			address: new UntypedFormControl('', [Validators.required]),
		});


		this.paymentForm = this.formGroup.group({
			inputNumero: ['', [Validators.required]],
			inputNombre: ['', [Validators.required]],
			selectMesFc: new UntypedFormControl('', [Validators.required]),
			selectYearFc: new UntypedFormControl('', [Validators.required]),
			inputCCV: new UntypedFormControl('', [Validators.required]),
			quote: new UntypedFormControl('', [Validators.required]),
		});


		this.months$ = this.getMonths("", this.months);
		this.years$ = this.getYears("", this.years);

		const id_store_list = localStorage.getItem('id-store');
		this.apiService.ListTransactionByStore(id_store_list).subscribe((res: any) => this.getAllTransactionData(res));
	}

	getDepartment(term: string = '', algo: Departament[]): Observable<Departament[]> {
        let items = algo;
        if (term) {
            items = items.filter((x: { departament: string; }) => x.departament.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }

	getAllTransactionData(response: any[]) {
		console.log(response);
		this.transactionsList = response;
		this.dataSource = new MatTableDataSource<any>(this.transactionsList);
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

	getMonths(term: string = '', algo: Month[]): Observable<Month[]> {
		let items = algo;
		if (term) {
			items = items.filter((x: { month: string; }) => x.month.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
		}
		return of(items).pipe(delay(500));
	}

	getYears(term: string = '', algo: Year[]): Observable<Year[]> {
		let items = algo;
		if (term) {
			items = items.filter((x: { year: string; }) => x.year.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
		}
		return of(items).pipe(delay(500));
	}

	getIdentifiers(term: string = '', algo: Identifiers[]): Observable<Identifiers[]> {
		let items = algo;
		if (term) {
			items = items.filter((x: { type_identifier: string; }) => x.type_identifier.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
		}
		return of(items).pipe(delay(500));
	}

	getPercentageTax(term: string = '', algo: PercentageTax[]): Observable<PercentageTax[]> {
		let items = algo;
		if (term) {
			items = items.filter((x: { percentage: string; }) => x.percentage.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
		}
		return of(items).pipe(delay(500));
	}


	citieChangeAction(departament: any) {
        // START ANGULAR MAT SEARCH CITIES
        let get_data_dep = departament;
        let id_dep = get_data_dep.id_departament;
        // console.log(id_dep);
        this.cities = [];
        this.apiService.getCitiesFrontbyDepartments(id_dep).subscribe(
            (data: City[]) => {
                this.citietlist = data;
                for (var i in this.citietlist) {
                    let get_id_citie = this.citietlist[i]['id_city'];
                    let get_citie = this.citietlist[i]['city'];
                    this.cities.push({ city: get_citie, id_city: get_id_citie });
                }
                this.city$ = this.getCity("", this.cities);
            },
        );
        // END ANGULAR MAT SEARCH CITIES
    }

	getCity(term: string = '', algo: City[]): Observable<City[]> {
        let items = algo;
        if (term) {
            items = items.filter((x: { city: string; }) => x.city.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }


	selling_execute() {						
		if (this.assistedsellingForm.valid) {
			if (this.paymentForm.valid) {
				this.show = true;
				const id_store = localStorage.getItem('id-store');
				const id_user_front = localStorage.getItem('id_user_front');
				let get_brand = this.GetCardType(this.paymentForm.value.inputNumero);

				let myObj_AssistedSelling = {
					"total_tx": parseInt(this.assistedsellingForm.value.total_tx),
					"tag_first_name": this.assistedsellingForm.value.tag_first_name,
					"tag_last_name": this.assistedsellingForm.value.tag_last_name,
					"tag_type_identification": this.assistedsellingForm.value.identifiersCtrl,
					"tag_number_identification": this.assistedsellingForm.value.number_identifier,
					"tag_email": this.assistedsellingForm.value.tag_email,
					"tag_cellphone": this.assistedsellingForm.value.tag_cellphone,
					"tag_desc_selling": this.assistedsellingForm.value.tag_desc_selling,
					"tag_tax_iva": this.assistedsellingForm.value.percentagetaxCtrl,
					"tag_store": id_store,
					"brand": get_brand,
					"card_number": this.paymentForm.value.inputNumero,
					"month": this.selectedMonth,
					"year": this.selectedYear.substr(-2),
					"cvv": this.paymentForm.value.inputCCV,
					"quot": this.paymentForm.value.quote,
					"id_user_front": id_user_front,
					"selectedCity": this.selectedCity,
					"address": this.assistedsellingForm.value.address
				};
				console.log(myObj_AssistedSelling);

				this.apiService.setAssistedSelling(myObj_AssistedSelling).subscribe(
					result => {
						window.location.reload();
					},
					error => console.log(error)
				);

			} else {
				console.log("fails");
				for (let i in this.paymentForm.controls) {
					this.paymentForm.controls[i].markAsTouched();
				}
			}
		} else {
			console.log("fails");
			for (let i in this.assistedsellingForm.controls) {
				this.assistedsellingForm.controls[i].markAsTouched();
			}
		}


	}


	GetCardType(number: { match: (arg0: RegExp) => null; }) {
		// visa
		var re = new RegExp("^4");
		if (number.match(re) != null)
			return "visa";

		// Mastercard 
		// Updated for Mastercard 2017 BINs expansion
		// if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number))
		var rem = new RegExp("^5");
		if (number.match(rem) != null)
			return "mastercard";

		// AMEX
		re = new RegExp("^3[47]");
		if (number.match(re) != null)
			return "amex";

		// Discover
		re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
		if (number.match(re) != null)
			return "discover";

		// Diners
		re = new RegExp("^36");
		if (number.match(re) != null)
			return "diners";

		// Diners - Carte Blanche
		re = new RegExp("^30[0-5]");
		if (number.match(re) != null)
			return "Diners - Carte Blanche";

		// JCB
		re = new RegExp("^35(2[89]|[3-8][0-9])");
		if (number.match(re) != null)
			return "JCB";

		// Visa Electron
		re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
		if (number.match(re) != null)
			return "Visa Electron";

		return "";
	}

	/**
	* onSeeDialog method is to see detail transaction .
	*/
	onSeeDialog(data: any) {
		this.getTransactionDetailData(data)
		// this.apiService.GetTransactionById(data.id).subscribe(dataDetailInvoice => this.getTransactionDetailData(data));
	}


	getTransactionDetailData(dataTransaction: { created_at: any; quot: any; departament: any; brand: any; num_aprob: any; cod_reply: any; messaje_reply: any; reference: any; total_tx: any; state: any; name_state: any; tag_first_name: any; tag_last_name: any; tag_type_identification: any; tag_number_identification: any; tag_email: any; tag_cellphone: any; tag_desc_selling: any; num_recibo: any; }) {
		let myObjTransaction: any;
		myObjTransaction = {
			created_at: dataTransaction.created_at,
			quot: dataTransaction.quot,
			departament: dataTransaction.departament,
			brand: dataTransaction.brand,
			num_aprob: dataTransaction.num_aprob,
			cod_reply: dataTransaction.cod_reply,
			messaje_reply: dataTransaction.messaje_reply,
			reference: dataTransaction.reference,
			total_tx: dataTransaction.total_tx,
			state: dataTransaction.state,
			name_state: dataTransaction.name_state,
			tag_first_name: dataTransaction.tag_first_name,
			tag_last_name: dataTransaction.tag_last_name,
			tag_type_identification: dataTransaction.tag_type_identification,
			tag_number_identification: dataTransaction.tag_number_identification,
			tag_email: dataTransaction.tag_email,
			tag_cellphone: dataTransaction.tag_cellphone,
			tag_desc_selling: dataTransaction.tag_desc_selling,
			num_recibo: dataTransaction.num_recibo,
		};

		this.txDetailGrid = myObjTransaction;
		this.apiService.PopUpTransactionDetail(this.txDetailGrid);
	}

	numberOnly(event: { which: any; keyCode: any; }): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;
	}


}


