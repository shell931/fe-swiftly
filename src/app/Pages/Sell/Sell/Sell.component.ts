// libraries
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../../../Services/api.service';
import { EmbryoService } from '../../../Services/Embryo.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

// Angular Material imports for standalone component
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDialog } from '@angular/material/dialog';
import { PromoDialogComponent } from '../../../Global/PromoDialog/PromoDialog.component';

// models
import { CategoryStore } from '../../../Models/CategoryStore';
import { SocietyType } from '../../../Models/SocietyType';
import { Departament } from '../../../Models/Departament';
import { City } from '../../../Models/City';
import { Bank } from '../../../Models/Banks';
import { TypeAccount } from '../../../Models/TypeAccount';




interface TokenObj {
  token: string;
  user_id: string;
  type_user: string;
  non_field_errors: string;
  id_store: string;
  personal_name: string;
  user_email: string;
}

export interface Identifiers {
  id: string;
  type_identifier: string;
}


@Component({
  selector: 'app-Sell',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    NgSelectModule,
    NgxDropzoneModule,
    NgxMatSelectSearchModule
  ],
  templateUrl: './Sell.component.html',
  styleUrls: ['./Sell.component.scss']
})

export class SellComponent implements OnInit {

  category$!: Observable<CategoryStore[]>;
  society$!: Observable<SocietyType[]>;
  depart$!: Observable<Departament[]>;
  city$!: Observable<City[]>;
  bank$!: Observable<Bank[]>;
  account_type$!: Observable<TypeAccount[]>;
  selectedPersonId = '5a15b13c36e7a7f00cf0d7cb';
  cam_com_docu: any;
  doc_identi_docu: any;
  rut_docu: any;
  bank_certification_docu: any;
  widthMin: Number = 700;
  heightMin: Number = 700;
  registerForm!: UntypedFormGroup;
  emailPattern: string = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$";
  storecategorylist: CategoryStore[] = [];
  storecategory: CategoryStore[] = [];
  societytypelist: SocietyType[] = [];
  societytype: SocietyType[] = [];
  departamentlist: Departament[] = [];
  departments: Departament[] = [];
  citietlist: City[] = [];
  cities: City[] = [];
  banklist: Bank[] = [];
  banks: Bank[] = [];
  typeaccountlist: TypeAccount[] = [];
  typeaccounts: TypeAccount[] = [];
  files_identifier_doc: File[] = [];
  selectedFiles_identifier_doc!: FileList;
  files_rut: File[] = [];
  selectedFiles_rut!: FileList;
  files_cam_com: File[] = [];
  selectedFiles_cam_com!: FileList;
  variable: any[] = [];
  name: any;
  selectedCity: any;
  selectedCategory: any;
  selectedSociety: any;
  selectedBAnk: any;
  selectedAccountType: any;
  public validate_user: boolean = false;
  public membership_error_message: string = '';
  identifierstlist: Identifiers[] = [];
  identifiers: Identifiers[] = [];
  identifier$!: Observable<Identifiers[]>;
  selectIdentifiers: any;

  public show: boolean = false;
  public show_spinner: boolean = false;
  toastIconMax: any = this.toastyService.warning(
    "Subir solo un logo para el comercio!",
    "Logo comercio",
    { timeOut: 4000, closeButton: true, progressBar: true }
  );
  toastRejectPixelsImg: any = this.toastyService.error(
    "No pudimos subir algunas de tus imágenes\n Deben tener formato jpg o png\n Deben tener más de 700 píxeles en uno de sus lados.",
    "Dimension de imagen",
    { timeOut: 8000, closeButton: true, progressBar: true }
  );


  public identifiersFilterCtrl: UntypedFormControl = new UntypedFormControl();
  private _onDestroy = new Subject<void>();
  // START ANGULAR MAT SEARCH CATEGORY STORE
  public categorystoreCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
  public categorystoreFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredcategorystore!: CategoryStore[];
  // END ANGULAR MAT SEARCH CATEGORY STORE
  // START ANGULAR MAT SEARCH SOCIETY TYPE
  public societytypeCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
  public societytypeFilterCtrl: UntypedFormControl = new UntypedFormControl();
  // END ANGULAR MAT SEARCH SOCIETY TYPE
  // START ANGULAR MAT SEARCH BANK
  public bankCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
  public bankFilterCtrl: UntypedFormControl = new UntypedFormControl();
  // END ANGULAR MAT SEARCH BANK

  // START ANGULAR MAT SEARCH BANK
  public typeaccountCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
  public typeaccountFilterCtrl: UntypedFormControl = new UntypedFormControl();
  // END ANGULAR MAT SEARCH BANK

  // END ANGULAR MAT SEARCH DEPARTMENT AND CITIES
  public departamentCtrll: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
  public departamentFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public citieCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
  public citieFilterCtrl: UntypedFormControl = new UntypedFormControl();
  // END ANGULAR MAT SEARCH DEPARTMENT AND CITIES

  constructor(private route: ActivatedRoute,
    private router: Router,
    private formGroup: UntypedFormBuilder,
    public embryoService: EmbryoService,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private toastyService: ToastrService
  ) { }

  ngOnInit() {
    // Show session-based promo dialog on first visit to Sell per session
    const promoKey = 'sellPromoShown';
    if (!sessionStorage.getItem(promoKey)) {
      sessionStorage.setItem(promoKey, 'true');
      this.dialog.open(PromoDialogComponent, {
        panelClass: 'promo-dialog-panel',
        maxWidth: 'none',
        width: 'auto',
        backdropClass: 'promo-backdrop',
        data: {
          imageUrl: 'https://market-docus-v2.s3.us-east-2.amazonaws.com/Modal+Crear+tienda.png',
          alt: 'Crea tu tienda'
        },
        disableClose: false
      });
    }

    // START ANGULAR MAT SEARCH CATEGORIES
    this.storecategory = [];
    this.apiService.getStoreCategories().subscribe(
      (data: CategoryStore[]) => {
        this.storecategorylist = data;
        for (var i in this.storecategorylist) {
          let get_id_category = this.storecategorylist[i]['id'];
          let get_name_category = this.storecategorylist[i]['name_category'];
          this.storecategory.push({ name_category: get_name_category, id: get_id_category });
        }
        this.category$ = this.getCategories("", this.storecategory);
      },
    );


    // START ANGULAR MAT SEARCH SOCIETY TYPE
    this.societytype = [];
    this.apiService.getSocietyType().subscribe(
      (data: SocietyType[]) => {
        this.societytypelist = data;
        for (var i in this.societytypelist) {
          let get_id = this.societytypelist[i]['id'];
          let get_society_type = this.societytypelist[i]['society_type'];
          this.societytype.push({ society_type: get_society_type, id: get_id });
        }

        this.society$ = this.getSocietyType("", this.societytype);

      },
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
        this.depart$ = this.getDepartment("", this.departments);

      },
    );

    // START ANGULAR MAT SEARCH BANK
    this.banks = [];
    this.apiService.getBanksFront().subscribe(
      (data: Bank[]) => {
        this.banklist = data;
        for (var i in this.banklist) {
          let get_id_bank = this.banklist[i]['id_bank'];
          let get_bank = this.banklist[i]['bank'];
          this.banks.push({ id_bank: get_id_bank, bank: get_bank });
        }
        this.bank$ = this.getBank("", this.banks);
      },
    );

    // START ANGULAR MAT SEARCH TYPE ACCOUNT
    this.typeaccounts = [];
    this.apiService.getTypeAccountFront().subscribe(
      (data: TypeAccount[]) => {
        this.typeaccountlist = data;
        for (var i in this.typeaccountlist) {
          let get_id_typeaccount = this.typeaccountlist[i]['id_type_account'];
          let get_typeaccount = this.typeaccountlist[i]['type_account'];
          this.typeaccounts.push({ id_type_account: get_id_typeaccount, type_account: get_typeaccount });
        }
        this.account_type$ = this.getTypeAccount("", this.typeaccounts);
      },
    );
    // END ANGULAR MAT SEARCH TYPE ACCOUNT

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
    // START ANGULAR MAT SEARCH TYPE IDENTIFICATION

    const token = localStorage.getItem('mr-token-front');
    if (token) {
      this.show = false;
      this.registerForm = this.formGroup.group({
        name: ['', [Validators.required]],
        second_name: ['', [Validators.required]],
        name_store: ['', [Validators.required]],
        name_legal: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        mobile: ['', [Validators.required]],
        number_identifier: ['', [Validators.required]],
        neighborhood: ['', [Validators.required]],
        via: ['', [Validators.required]],
        number_streeth: ['', [Validators.required]],
        sn: ['', [Validators.required]],
        postal_code: ['', [Validators.required]],
        doc_identi: ['', [Validators.required]],
        rut: ['', [Validators.required]],
        cam_com: new UntypedFormControl('', [Validators.required]),
        responsible: ['', [Validators.required]],
        account_number: ['', [Validators.required]],
        bankCtrl: new UntypedFormControl('', [Validators.required]),
        typeaccountCtrl: new UntypedFormControl('', [Validators.required]),
        bank_certification: new UntypedFormControl('', [Validators.required]),
        check_legal_docs: new UntypedFormControl('', [(control) => {
          return !control.value ? { 'required': true } : null;
        }]
        ),
        check_aprube_terms_conds: new UntypedFormControl('', [(control) => {
          return !control.value ? { 'required': true } : null;
        }]
        ),
        categorystoreCtrl: new UntypedFormControl('', [Validators.required]),
        societytypeCtrl: new UntypedFormControl('', [Validators.required]),
        departamentCtrll: new UntypedFormControl('', [Validators.required]),
        citieCtrl: new UntypedFormControl('', [Validators.required]),
        num_aprox_tx: ['', [Validators.required]],
        ticket_prom: ['', [Validators.required]],
        amount_aprox_tx_month: ['', [Validators.required]],
        maximun_amount_link: ['', [Validators.required]],
      });

    } else {
      this.show = true;
      this.registerForm = this.formGroup.group({
        name: ['', [Validators.required]],
        second_name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
        password: ['', [Validators.required]],
        number_identifier_person: ['', [Validators.required]],
        identifiersCtrl: new UntypedFormControl('', [Validators.required]),
        name_store: ['', [Validators.required]],
        name_legal: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        mobile: ['', [Validators.required]],
        number_identifier: ['', [Validators.required]],
        neighborhood: ['', [Validators.required]],
        via: ['', [Validators.required]],
        number_streeth: ['', [Validators.required]],
        sn: ['', [Validators.required]],
        postal_code: ['', [Validators.required]],
        doc_identi: ['', [Validators.required]],
        rut: ['', [Validators.required]],
        cam_com: new UntypedFormControl('', [Validators.required]),
        responsible: ['', [Validators.required]],
        account_number: ['', [Validators.required]],
        bankCtrl: new UntypedFormControl('', [Validators.required]),
        typeaccountCtrl: new UntypedFormControl('', [Validators.required]),
        bank_certification: new UntypedFormControl('', [Validators.required]),
        check_legal_docs: new UntypedFormControl('', [(control) => {
          return !control.value ? { 'required': true } : null;
        }]
        ),
        check_aprube_terms_conds: new UntypedFormControl('', [(control) => {
          return !control.value ? { 'required': true } : null;
        }]
        ),
        categorystoreCtrl: new UntypedFormControl('', [Validators.required]),
        societytypeCtrl: new UntypedFormControl('', [Validators.required]),
        departamentCtrll: new UntypedFormControl('', [Validators.required]),
        citieCtrl: new UntypedFormControl('', [Validators.required]),
        num_aprox_tx: ['', [Validators.required]],
        ticket_prom: ['', [Validators.required]],
        amount_aprox_tx_month: ['', [Validators.required]],
        maximun_amount_link: ['', [Validators.required]],
      });
    }

  }

  getIdentifiers(term: string = '', algo: Identifiers[]): Observable<Identifiers[]> {
    let items = algo;
    if (term) {
      items = items.filter((x: { type_identifier: string; }) => x.type_identifier.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
    }
    return of(items).pipe(delay(500));
  }


  getCategories(term: string = '', algo: CategoryStore[]): Observable<CategoryStore[]> {
    let items = algo;
    if (term) {
      items = items.filter((x: { name_category: string; }) => x.name_category.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
    }
    return of(items).pipe(delay(500));
  }

  getSocietyType(term: string = '', algo: SocietyType[]): Observable<SocietyType[]> {
    let items = algo;
    if (term) {
      items = items.filter((x: { society_type: string; }) => x.society_type.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
    }
    return of(items).pipe(delay(500));
  }

  getDepartment(term: string = '', algo: Departament[]): Observable<Departament[]> {
    let items = algo;
    if (term) {
      items = items.filter((x: { departament: string; }) => x.departament.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
    }
    return of(items).pipe(delay(500));
  }

  getCity(term: string = '', algo: City[]): Observable<City[]> {
    let items = algo;
    if (term) {
      items = items.filter((x: { city: string; }) => x.city.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
    }
    return of(items).pipe(delay(500));
  }

  getBank(term: string = '', algo: Bank[]): Observable<Bank[]> {
    let items = algo;
    if (term) {
      items = items.filter((x: { bank: string; }) => x.bank.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
    }
    return of(items).pipe(delay(500));
  }

  getTypeAccount(term: string = '', algo: TypeAccount[]): Observable<TypeAccount[]> {
    let items = algo;
    if (term) {
      items = items.filter((x: { type_account: string; }) => x.type_account.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
    }
    return of(items).pipe(delay(500));
  }


  citieChangeAction(departament: any) {
    // START ANGULAR MAT SEARCH CITIES
    // Reset city field when department changes
    this.registerForm.patchValue({ citieCtrl: null });

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



  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  //START SET EVENT FROM DROPZONE COMPLEMENT
  selectFile(event: { addedFiles: number | any[]; }) {
    let index = this.files_identifier_doc.length != event.addedFiles ? 0 : this.files_identifier_doc.length;
    console.log(this.files_identifier_doc.length);
    if (this.files_identifier_doc.length > 0) {
      this.toastyService.error(this.toastIconMax);
    } else if (Array.isArray(event.addedFiles)) {
      event.addedFiles.forEach((item: File) => {
        this.onValidatePixels(item)
          .then((value: boolean) => {
            if (value === true) {
              this.files_identifier_doc.push(item);
            } else {
              this.toastyService.error(this.toastRejectPixelsImg);
            }
          });
      });

    }
  }

  selectFileRut(event: { addedFiles: number | any[]; }) {
    let index = this.files_rut.length != event.addedFiles ? 0 : this.files_rut.length;
    console.log(this.files_rut.length);
    if (this.files_rut.length > 0) {
      this.toastyService.error(this.toastIconMax);
    } else if (Array.isArray(event.addedFiles)) {
      event.addedFiles.forEach((item: File) => {
        this.onValidatePixels(item)
          .then((value: boolean) => {
            if (value) {
              this.files_rut.push(item);
            } else {
              this.toastyService.error(this.toastRejectPixelsImg);
            }
          });
      });

    }
  }

  selectFileCamcom(event: { addedFiles: number | any[]; }) {
    let index = this.files_cam_com.length != event.addedFiles ? 0 : this.files_cam_com.length;
    console.log(this.files_cam_com.length);
    if (this.files_cam_com.length > 0) {
      this.toastyService.error(this.toastIconMax);
    } else if (Array.isArray(event.addedFiles)) {
      event.addedFiles.forEach((item: File) => {
        this.onValidatePixels(item)
          .then((value: boolean) => {
            if (value) {
              this.files_cam_com.push(item);
            } else {
              this.toastyService.error(this.toastRejectPixelsImg);
            }
          });
      });

    }
  }


  onValidatePixels(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const Img = new Image();
      Img.src = URL.createObjectURL(file);
      Img.onload = (e: any) => {
        console.log(e);
        const height = e.target.height;
        const width = e.path[0].width;
        if (height >= this.heightMin || width >= this.widthMin) {
          resolve(true);
        }
        resolve(false);
      };
    });

  }

  onRemove(event: File) {
    console.log(event);
    this.files_identifier_doc.splice(this.files_identifier_doc.indexOf(event), 1);
  }


  onChangeDocIde(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this.validateFileSize(file)) {
        this.doc_identi_docu = file;
      } else {
        event.target.value = ''; // Clear the input
      }
    }
  }

  onChangeRut(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this.validateFileSize(file)) {
        this.rut_docu = file;
      } else {
        event.target.value = ''; // Clear the input
      }
    }
  }

  onChangeCamCom(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this.validateFileSize(file)) {
        this.cam_com_docu = file;
      } else {
        event.target.value = ''; // Clear the input
      }
    }
  }

  onChangeCertBank(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this.validateFileSize(file)) {
        this.bank_certification_docu = file;
      } else {
        event.target.value = ''; // Clear the input
      }
    }
  }

  validateFileSize(file: File): boolean {
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      alert('El archivo es demasiado grande. El tamaño máximo permitido es 2MB.');
      return false;
    }
    return true;
  }

  membership_request() {

    this.validate_user = false;
    this.membership_error_message = '';
    if (this.registerForm.valid) {
      this.show_spinner = true;
      let registerForm = this.registerForm.value;

      let myObj_MemberShip;
      let email = "";
      if (this.show == true) {
        email = registerForm.email;
      } else {
        email = localStorage.getItem('user_email');
      }
      myObj_MemberShip = {
        "name_store": registerForm.name_store,
        "name_legal": registerForm.name_legal,
        "address": registerForm.neighborhood + ' ' + registerForm.via + ' # ' + registerForm.number_streeth + ' - ' + registerForm.sn,
        "telephone": registerForm.phone,
        "mobile": registerForm.mobile,
        "email": email,
        "number_identifier": registerForm.number_identifier,
        "manager": registerForm.name + ' ' + registerForm.second_name,
        "state_store": 'false',
        "city": registerForm.citieCtrl,
        "description": '',
        "postal_code": registerForm.postal_code,
        "storecategories": registerForm.categorystoreCtrl,
        "societytype": registerForm.societytypeCtrl,
        "departament": registerForm.departamentCtrll,
        "bussines_type": 1, // TODO: change to the selected bussines type
        "num_aprox_tx": this.parseFormattedNumber(registerForm.num_aprox_tx),
        "ticket_prom": this.parseFormattedNumber(registerForm.ticket_prom),
        "amount_aprox_tx_month": this.parseFormattedNumber(registerForm.amount_aprox_tx_month),
        "maximun_amount_link": this.parseFormattedNumber(registerForm.maximun_amount_link)
      };

      if (this.show == true) {

        this.apiService.ValidateUserExist(registerForm.email).subscribe(
          result => {
            console.log(result);
            if (result == true) {
              this.validate_user = true;
              this.show_spinner = false;
            } else {
              this.apiService.setMembershipRequest(myObj_MemberShip).subscribe(
                result => {
                  let myJSON = JSON.stringify(result);
                  let obj = JSON.parse(myJSON);
                  let id_store = obj.id_store;

                  const formDataDocIde = new FormData();
                  formDataDocIde.append('url_document', this.doc_identi_docu);
                  formDataDocIde.append('store', id_store);
                  formDataDocIde.append('documenttype', '1');
                  this.apiService.setLoadDocumentsStore(formDataDocIde).subscribe(
                    result => {
                      const formDataRut = new FormData();
                      formDataRut.append('url_document', this.rut_docu);
                      formDataRut.append('store', id_store);
                      formDataRut.append('documenttype', '2');
                      this.apiService.setLoadDocumentsStore(formDataRut).subscribe(
                        result => {
                          const formData = new FormData();
                          formData.append('url_document', this.cam_com_docu);
                          formData.append('store', id_store);
                          formData.append('documenttype', '3');
                          this.apiService.setLoadDocumentsStore(formData).subscribe(
                            result => {
                              const formDataAccountBank = new FormData();
                              formDataAccountBank.append('certification_url', this.bank_certification_docu);
                              formDataAccountBank.append('account_number', registerForm.account_number);
                              formDataAccountBank.append('responsible', registerForm.responsible);
                              formDataAccountBank.append('bank', registerForm.bankCtrl);
                              formDataAccountBank.append('typeaccount', registerForm.typeaccountCtrl);
                              formDataAccountBank.append('store', id_store);
                              formDataAccountBank.append('state', "false");
                              this.apiService.setBankAccountStore(formDataAccountBank).subscribe(
                                result => {
                                  // it's a user new so should be create a user register to set acces to client menu
                                  let myObj_user_client;
                                  let myObj_login;
                                  myObj_user_client = {
                                    "username": registerForm.email,
                                    "email": registerForm.email,
                                    "password": registerForm.password,
                                    "first_name": registerForm.name,
                                    "last_name": registerForm.second_name,
                                    "is_active": "true",
                                    "group_id": 2,
                                    "store": id_store,
                                    "type_user": 3,
                                    "type_identifier": registerForm.identifiersCtrl,
                                    "number_identifier": registerForm.number_identifier_person,

                                  };
                                  // this.apiService.sendEmailStoreCreationRequest(myObj_user_client).subscribe();
                                  this.apiService.registerUserFront(myObj_user_client).subscribe(
                                    result => {
                                      myObj_login = { "username": registerForm.email, "password": registerForm.password }
                                      this.apiService.loginUser(myObj_login).subscribe(
                                        (result_login: TokenObj) => {
                                          let user_id = result_login["user_id"];
                                          localStorage.setItem('mr-token-front', result_login.token);
                                          localStorage.setItem('id_user_front', result_login.user_id);
                                          localStorage.setItem('id_type_user', result_login.type_user);
                                          localStorage.setItem('personal_name', result_login.personal_name);
                                          localStorage.setItem('user_email', result_login.user_email);
                                          localStorage.setItem('id-store', result_login.id_store);
                                          this.router.navigate(['/sell/response']).then(() => {
                                            this.show_spinner = false;
                                            window.location.reload();
                                          });
                                        },
                                        error => console.log(error)
                                      );
                                    },
                                    error => console.log(error)
                                  );
                                },
                                error => console.log(error)
                              );
                            },
                            error => console.log(error)
                          );
                        },
                        error => console.log(error)
                      );
                    },
                    error => {
                      console.log(error);
                      this.show_spinner = false;
                      this.membership_error_message = error?.error?.message || 'Error al procesar la solicitud. Por favor, intente nuevamente.';
                    }
                  );
                },
                error => {
                  console.log(error);
                  this.show_spinner = false;
                  this.membership_error_message = error?.error?.message || 'Error al procesar la solicitud. Por favor, intente nuevamente.';
                }
              );

            }
          },
          error => {
            console.log(error);
            this.show_spinner = false;
            this.membership_error_message = error?.error?.message || 'Error al procesar la solicitud. Por favor, intente nuevamente.';
          }
        );
      } else {
        this.apiService.setMembershipRequest(myObj_MemberShip).subscribe(
          result => {
            let myJSON = JSON.stringify(result);
            let obj = JSON.parse(myJSON);
            let id_store = obj.id_store;

            const formDataDocIde = new FormData();
            formDataDocIde.append('url_document', this.doc_identi_docu);
            formDataDocIde.append('store', id_store);
            formDataDocIde.append('documenttype', '1');
            this.apiService.setLoadDocumentsStore(formDataDocIde).subscribe(
              result => {
                const formDataRut = new FormData();
                formDataRut.append('url_document', this.rut_docu);
                formDataRut.append('store', id_store);
                formDataRut.append('documenttype', '2');
                this.apiService.setLoadDocumentsStore(formDataRut).subscribe(
                  result => {
                    const formData = new FormData();
                    formData.append('url_document', this.cam_com_docu);
                    formData.append('store', id_store);
                    formData.append('documenttype', '3');
                    this.apiService.setLoadDocumentsStore(formData).subscribe(
                      result => {
                        const formDataAccountBank = new FormData();
                        formDataAccountBank.append('certification_url', this.bank_certification_docu);
                        formDataAccountBank.append('account_number', registerForm.account_number);
                        formDataAccountBank.append('responsible', registerForm.responsible);
                        formDataAccountBank.append('bank', registerForm.bankCtrl);
                        formDataAccountBank.append('typeaccount', registerForm.typeaccountCtrl);
                        formDataAccountBank.append('store', id_store);
                        formDataAccountBank.append('state', "false");
                        this.apiService.setBankAccountStore(formDataAccountBank).subscribe(
                          result => {
                            const id_user_front = localStorage.getItem('id_user_front');
                            let myObj_user_store = {
                              "store": id_store
                            };
                            this.apiService.updateStoreUserFront(myObj_user_store, id_user_front).subscribe(
                              result => {
                                let myJSON = JSON.stringify(result);
                                let obj = JSON.parse(myJSON);
                                let id_store = obj.result.store;
                                localStorage.setItem('id-store', id_store);
                                this.router.navigate(['/sell/response']).then(() => {
                                  window.location.reload();
                                });
                              },
                              error => console.log(error)
                            );

                          },
                          error => {
                            console.log(error);
                            this.show_spinner = false;
                            this.membership_error_message = error?.error?.message || 'Error al procesar la solicitud. Por favor, intente nuevamente.';
                          }
                        );
                      },
                      error => {
                        console.log(error);
                        this.show_spinner = false;
                        this.membership_error_message = error?.error?.message || 'Error al procesar la solicitud. Por favor, intente nuevamente.';
                      }
                    );
                  },
                  error => {
                    console.log(error);
                    this.show_spinner = false;
                    this.membership_error_message = error?.error?.message || 'Error al procesar la solicitud. Por favor, intente nuevamente.';
                  }
                );
              },
              error => {
                console.log(error);
                this.show_spinner = false;
                this.membership_error_message = error?.error?.message || 'Error al procesar la solicitud. Por favor, intente nuevamente.';
              }
            );
          },
          error => {
            console.log(error);
            this.show_spinner = false;
            this.membership_error_message = error?.error?.message || 'Error al procesar la solicitud. Por favor, intente nuevamente.';
          }
        );
      }

    } else {
      console.log("fails");
      // Marcar todos los campos como touched para mostrar los errores
      for (let i in this.registerForm.controls) {
        this.registerForm.controls[i].markAsTouched();
      }

      // Hacer scroll al primer campo inválido
      this.scrollToFirstInvalidControl();
    }


  }

  /**
   * Método para hacer scroll y enfocar el primer campo inválido del formulario
   */
  private scrollToFirstInvalidControl(): void {
    // Obtener el primer control inválido
    const firstInvalidControl = Object.keys(this.registerForm.controls).find(
      key => this.registerForm.controls[key].invalid
    );

    if (firstInvalidControl) {
      // Buscar el elemento en el DOM
      let element = document.querySelector(
        `[formControlName="${firstInvalidControl}"]`
      ) as HTMLElement;

      // Si no se encuentra, intenta con ng-select
      if (!element) {
        element = document.querySelector(
          `ng-select[formControlName="${firstInvalidControl}"]`
        ) as HTMLElement;
      }

      if (element) {
        // Hacer scroll suave al elemento
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        // Esperar un momento y luego enfocar el elemento
        setTimeout(() => {
          // Para ng-select, hacer click en el contenedor para abrir el dropdown
          if (element.tagName === 'NG-SELECT') {
            // Buscar el div con clase ng-select-container y hacer click
            const selectContainer = element.querySelector('.ng-select-container') as HTMLElement;
            if (selectContainer) {
              selectContainer.click();
            } else {
              // Si no encuentra el container, intenta con el input interno
              const input = element.querySelector('input') as HTMLElement;
              if (input) {
                input.focus();
                input.click();
              }
            }
          }
          // Para inputs normales y textareas
          else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.focus();
          }
          // Para mat-checkbox
          else if (element.tagName === 'MAT-CHECKBOX') {
            const checkbox = element.querySelector('input[type="checkbox"]') as HTMLElement;
            if (checkbox) {
              checkbox.focus();
            }
          }
          // Para inputs de archivo
          else if (element.getAttribute('type') === 'file') {
            element.focus();
          }
          // Para otros elementos, intentar enfocar el primer elemento enfocable
          else {
            const focusable = element.querySelector('input, select, textarea') as HTMLElement;
            if (focusable) {
              focusable.focus();
            }
          }
        }, 500);

        // Mostrar un mensaje al usuario
        this.toastyService.warning(
          'Por favor, completa todos los campos obligatorios',
          'Formulario incompleto',
          { timeOut: 4000, closeButton: true, progressBar: true }
        );
      }
    }
  }

  // Método para formatear en tiempo real mientras el usuario escribe
  onCurrencyInput(event: any, controlName: string): void {
    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart || 0;

    // Obtener el valor actual del input
    let value = input.value;

    // Remover todo excepto números
    const cleanValue = value.replace(/[^0-9]/g, '');

    if (cleanValue === '') {
      input.value = '';
      this.registerForm.get(controlName)?.setValue('', { emitEvent: false });
      return;
    }

    // Convertir a número y formatear con puntos de miles
    const numericValue = parseInt(cleanValue, 10);
    const formattedValue = '$ ' + numericValue.toLocaleString('es-CO');

    // Calcular la nueva posición del cursor
    const oldLength = value.length;
    const newLength = formattedValue.length;
    const newCursorPosition = cursorPosition + (newLength - oldLength);

    // Actualizar el valor
    input.value = formattedValue;
    this.registerForm.get(controlName)?.setValue(formattedValue, { emitEvent: false });

    // Restaurar la posición del cursor
    setTimeout(() => {
      input.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  }

  // Método para parsear el valor formateado a número
  parseFormattedNumber(value: string | number): number {
    if (!value) return 0;

    // Si ya es un número, devolverlo
    if (typeof value === 'number') return value;

    // Si es string, remover todo excepto números
    const numericValue = value.toString().replace(/[^0-9]/g, '');
    return parseInt(numericValue, 10) || 0;
  }

}

