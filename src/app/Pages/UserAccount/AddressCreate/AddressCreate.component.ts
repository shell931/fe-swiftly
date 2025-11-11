import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, FormArray, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../Services/api.service';
import { MatSelect } from '@angular/material/select';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { of } from 'rxjs';
// import { log } from 'node:console';

export interface Departament {
    id_departament: string;
    departament: string;
}


export interface City {
    id_city: string;
    city: string;
}


@Component({
    selector: 'app-AddressCreate',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AsyncPipe,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        NgSelectModule
    ],
    templateUrl: './AddressCreate.component.html',
    styleUrls: ['./AddressCreate.component.scss']
})
export class AddressCreateComponent implements OnInit {

    id: any;
    neighborhood: any;
    number: any;
    via: any;
    sn: any;
    additional_data: any;
    phone: any;
    nameci: any;
    departament: any
    contact: any;
    id_city: any;
    id_departament: any;
    formLocationCreate!: UntypedFormGroup;
    dep_id: any;
    citietlist: City[] = [];
    depart$!: Observable<Departament[]>;
    city$!: Observable<City[]>;
    selectedCity: any;


    // START ANGULAR MAT SEARCH DEPARTAMENT    
    public departamentCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
    public departamentCtrll: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
    public departamentFilterCtrl: UntypedFormControl = new UntypedFormControl();
    public citieCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
    public citieFilterCtrl: UntypedFormControl = new UntypedFormControl();
    @ViewChild('singleSelect', { static: true })
    singleSelect!: MatSelect;
    private _onDestroy = new Subject<void>();
    // END ANGULAR MAT SEARCH DEPARTAMENT
    // START ANGULAR MAT SEARCH CITY
    public cityCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
    public cityFilterCtrl: UntypedFormControl = new UntypedFormControl();
    // END ANGULAR MAT SEARCH CITY
    departments: Departament[] = [];
    cities: City[] = [];
    department_selected: Departament[] = [];
    departamentlist: Departament[] = [];

    formData!: UntypedFormGroup;
    selectedValue: any;
    selectedCityValue: any;
    toastOption:any = this.toastyService.success(
  "La ubicación ha sido creada!",
  "Ubicación creada",
  { timeOut: 4000, closeButton: true, progressBar: true }
);



    constructor(private route: ActivatedRoute,
        private router: Router,
        private formGroup: UntypedFormBuilder,
        private toastyService: ToastrService,
        private apiService: ApiService,) {

    }

    ngOnInit() {

        const token_front = localStorage.getItem('mr-token-front');
        const id_user_front = localStorage.getItem('id_user_front');

        if (!token_front || !id_user_front) {
            this.router.navigate(['/session/signin']);
        } else {

            this.route.params.subscribe(res => {
                this.id = res.id;
            })

            this.formLocationCreate = this.formGroup.group({
                neighborhood: ['', [Validators.required]],
                via: ['', [Validators.required]],
                number: ['', [Validators.required]],
                sn: ['', [Validators.required]],
                // departmentControl: new FormControl('', [Validators.required]),
                // cityControl: new FormControl('', [Validators.required]),
                contact: new UntypedFormControl('', [Validators.required]),
                phone: new UntypedFormControl('', [Validators.required]),
                additional_data: new UntypedFormControl('', [Validators.required]),
                id: [''],
                departamentCtrll: new UntypedFormControl('', [Validators.required]),
                citieCtrl: new UntypedFormControl('', [Validators.required]),
            });


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

        }

    }




    getDepartment(term: string = '', algo: Departament[]): Observable<Departament[]> {
        let items = algo;
        if (term) {
            items = items.filter((x: { departament: string; }) => x.departament.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }

    citieChangeAction(departament: any) {
        // START ANGULAR MAT SEARCH CITIES
        // El evento change de ng-select pasa el valor directamente (id_departament)
        let id_dep = departament;
        
        // Si es un objeto, extraer el id_departament
        if (departament && typeof departament === 'object' && departament.id_departament) {
            id_dep = departament.id_departament;
        }
        
        // Limpiar la selección de ciudad cuando cambia el departamento
        this.formLocationCreate.get('citieCtrl')?.setValue('');
        this.selectedCity = null;
        
        if (id_dep) {
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
        }
        // END ANGULAR MAT SEARCH CITIES
    }


    getCity(term: string = '', algo: City[]): Observable<City[]> {
        let items = algo;
        if (term) {
            items = items.filter((x: { city: string; }) => x.city.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }

    updateLocationUserFront() {             
        // Actualizar validación antes de verificar
        this.formLocationCreate.updateValueAndValidity();
        
        // Asegurar que selectedCity tenga el valor del formulario si no está establecido
        if (!this.selectedCity && this.formLocationCreate.get('citieCtrl')?.value) {
            this.selectedCity = this.formLocationCreate.get('citieCtrl')?.value;
        }
        
        if (this.formLocationCreate.valid) {
            let get_values_location = this.formLocationCreate.value;
            const id_user_front = localStorage.getItem('id_user_front');
            let myObj_user_client = {
                "city": this.selectedCity || get_values_location.citieCtrl, "neighborhood": get_values_location.neighborhood, "via": get_values_location.via,
                "number": get_values_location.number, "sn": get_values_location.sn,
                "additional_data": get_values_location.additional_data, "phone": get_values_location.phone, "contact": get_values_location.contact,
                "latitude": 0, "longitude": 0,
                "user": [id_user_front]
            };

            this.apiService.SetLocationClient(myObj_user_client).subscribe(
                reponse => {
                    console.log(reponse);
                    this.router.navigate(['/account/address']).then(() => {
                        // window.location.reload();
                        this.toastyService.success(this.toastOption);
                    });
                },
                error => console.log(error)
            );

        } else {
            for (let i in this.formLocationCreate.controls) {
                this.formLocationCreate.controls[i].markAsTouched();
            }
        }

    }


}

