import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, FormArray, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../Services/api.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { PromoDialogComponent } from '../../../Global/PromoDialog/PromoDialog.component';

export interface Departament {
    id_departament: string;
    departament: string;
}

export interface Identifiers {
    id: string;
    type_identifier: string;
}

export interface City {
    id_city: string;
    city: string;
}

interface TokenObj {
    token: string;
    user_id: string;
    type_user: string;
    non_field_errors: string;
    id_store: string;
    personal_name: string;
    user_email: string;
}


@Component({
    selector: 'embryo-Register',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        NgSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        AsyncPipe
    ],
    templateUrl: './Register.component.html',
    styleUrls: ['./Register.component.scss']
})
export class RegisterComponent implements OnInit {

    departamentlist: Departament[] = [];
    departments: Departament[] = [];
    identifierstlist: Identifiers[] = [];
    identifiers: Identifiers[] = [];
    citietlist: City[] = [];
    cities: City[] = [];
    registerForm!: UntypedFormGroup;
    emailPattern: string = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$";
    formBuilder: any;
    identifier$!: Observable<Identifiers[]>;
    depart$!: Observable<Departament[]>;
    city$!: Observable<City[]>;
    selectIdentifiers: any;
    selectedCity: any;
    public validate_user: boolean = false;
    public isLoading: boolean = false;


    // START ANGULAR MAT SEARCH    
    public departamentCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
    public departamentFilterCtrl: UntypedFormControl = new UntypedFormControl();

    public citieCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
    public citieFilterCtrl: UntypedFormControl = new UntypedFormControl();

    public identifiersCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
    public identifiersFilterCtrl: UntypedFormControl = new UntypedFormControl();

    @ViewChild('singleSelect', { static: true })
    singleSelect!: MatSelect;
    private _onDestroy = new Subject<void>();
    // END ANGULAR MAT SEARCH


    constructor(
        private router: Router,
        private formGroup: UntypedFormBuilder,
        private toastyService: ToastrService,
        private apiService: ApiService,
        private dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.maybeOpenStoreModal();
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
        // END ANGULAR MAT SEARCH DEPARTAMENT

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

        this.registerForm = this.formGroup.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            second_name: ['', [Validators.required, Validators.minLength(2)]],
            number_identifier: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            neighborhood: ['', [Validators.required]],
            via: ['', [Validators.required]],
            number_streeth: ['', [Validators.required]],
            sn: ['', [Validators.required]],
            aditional_data: ['', [Validators.required]],
            phone: ['', [Validators.required, Validators.minLength(7)]],
            contact: ['', [Validators.required]],
            identifiersCtrl: new UntypedFormControl('', [Validators.required]),
            departamentCtrl: new UntypedFormControl('', [Validators.required]),
            citieCtrl: new UntypedFormControl('', [Validators.required]),
        });
    }



    citieChangeAction(departament: any) {
        // START ANGULAR MAT SEARCH CITIES
        if (departament && departament.id_departament) {
            let id_dep = departament.id_departament;
            this.cities = [];
            this.registerForm.get('citieCtrl')?.setValue('');
            this.selectedCity = null;
            
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
                error => {
                    console.error('Error loading cities:', error);
                }
            );
        }
        // END ANGULAR MAT SEARCH CITIES
    }


    getIdentifiers(term: string = '', algo: Identifiers[]): Observable<Identifiers[]> {
        let items = algo;
        if (term) {
            items = items.filter(x => x.type_identifier.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
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

    private maybeOpenStoreModal(): void {
        // Verificar si ya se mostró el diálogo la primera vez
        if (localStorage.getItem('store-modal-first-visit-shown') === '1') {
            return;
        }
        
        // Marcar que ya se mostró
        localStorage.setItem('store-modal-first-visit-shown', '1');
        
        // Abrir el diálogo después de un pequeño delay para que la página cargue
        setTimeout(() => {
            this.dialog.open(PromoDialogComponent, {
                panelClass: 'promo-dialog-panel',
                maxWidth: 'none',
                width: 'auto',
                hasBackdrop: true,
                backdropClass: 'promo-backdrop',
                closeOnNavigation: true,
                disableClose: false,
                autoFocus: false,
                restoreFocus: false,
                data: {
                    imageUrl: 'https://market-docus-v2.s3.us-east-2.amazonaws.com/Modal+Crear+tienda.png',
                    alt: 'Crea tu tienda'
                }
            });
        }, 500);
    }

    register_user_front() {
        this.validate_user = false;
        this.isLoading = true;
        
        if (this.registerForm.valid) {
            let values_register = this.registerForm.value;
            let myObj_user_client = { 
                "username": values_register.email, 
                "password": values_register.password, 
                "first_name": values_register.name, 
                "last_name": values_register.second_name, 
                "email": values_register.email, 
                "is_active": "true", 
                "group_id": 2, 
                "store": '', 
                "type_user": 3, 
                "type_identifier": this.selectIdentifiers, 
                "number_identifier": values_register.number_identifier 
            };

            this.apiService.ValidateUserExist(values_register.email).subscribe(
                (result: boolean) => {
                    if (result == true) {
                        this.isLoading = false;
                        this.validate_user = true;
                    } else {
                        this.apiService.registerUserFront(myObj_user_client).subscribe(
                            result => {
                                let myObj_login = { "username": values_register.email, "password": values_register.password };
                                this.apiService.loginUser(myObj_login).subscribe(
                                    (result_login) => {
                                        this.isLoading = false;
                                        const login = result_login as TokenObj;
                                        localStorage.setItem('mr-token-front', login.token);
                                        localStorage.setItem('id_user_front', login.user_id);
                                        localStorage.setItem('id_type_user', login.type_user);
                                        localStorage.setItem('personal_name', login.personal_name);
                                        localStorage.setItem('user_email', login.user_email);
                                        localStorage.setItem('id-store', login.id_store);
                                        
                                        this.toastyService.success('¡Registro exitoso! Bienvenido a nuestra plataforma.', 'Éxito');
                                        this.router.navigate(['/sell/response']).then(() => {
                                            window.location.reload();
                                        });
                                    },
                                    error => {
                                        this.isLoading = false;
                                        console.error('Login error:', error);
                                        this.toastyService.error('Error al iniciar sesión después del registro', 'Error');
                                    }
                                );
                            },
                            error => {
                                this.isLoading = false;
                                this.validate_user = true;
                                console.error('Registration error:', error);
                                this.toastyService.error('Error al registrar usuario', 'Error');
                            }
                        );
                    }
                },
                (error: any) => {
                    this.isLoading = false;
                    console.error('Validation error:', error);
                    this.toastyService.error('Error al validar usuario', 'Error');
                }
            );
        } else {
            this.isLoading = false;
            for (let i in this.registerForm.controls) {
                this.registerForm.controls[i].markAsTouched();
            }
            this.toastyService.warning('Por favor completa todos los campos requeridos', 'Formulario incompleto');
        }
    }

}

