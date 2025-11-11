import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ApiService } from '../../../Services/api.service';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { environment } from '../../../../../src/environments/environment';

export interface Departament {
    id_departament: string;
    departament: string;
}


export interface City {
    id_city: string;
    city: string;
}

export interface CategoryStore {
    id: number;
    name_category: string;
}

@Component({
    selector: 'app-StoreAdmEdit',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AsyncPipe,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatListModule,
        NgSelectModule,
        NgxDropzoneModule
    ],
    templateUrl: './StoreAdmEdit.component.html',
    styleUrls: ['./StoreAdmEdit.component.scss']
})
export class StoreAdmEditComponent implements OnInit {

    public departamentFilterCtrl: UntypedFormControl = new UntypedFormControl();
    public citieFilterCtrl: UntypedFormControl = new UntypedFormControl();
    public categorystoreCtrl: UntypedFormControl = new UntypedFormControl();
    public categorystoreFilterCtrl: UntypedFormControl = new UntypedFormControl();

    public show_spinner: boolean = false;
    departamentlist: Departament[] = [];
    departments: Departament[] = [];
    citietlist: City[] = [];
    cities: City[] = [];
    formBuilder: any;
    locationsGrid: Location[] = [];
    get_location: Location[] = [];
    pred = "";
    id_store: any;
    address: any;
    description: any;
    email: any;
    logo_store: any;
    validate_logo: any;
    manager: any;
    name_store: any;
    number_identifier: any;
    state_store: any;
    telephone: any;
    id_departament: any;
    id_city: any;
    id_category: any;
    logo_store_save: any;
    city: any;
    department: any;
    category: any;
    public show_sin_img: boolean = false;
    public show_img: boolean = false;
    storeForm!: UntypedFormGroup;
    emailPattern: any = /\S+@\S+\.\S+/;
    public show: boolean = false;
    depart$!: Observable<Departament[]>;
    city$!: Observable<City[]>;
    catego$!: Observable<CategoryStore[]>;
    selectedValue: any;
    selectedCityValue: any;
    selectedCategoryValue: any;
    storecategorylist: CategoryStore[] = [];
    storecategory: CategoryStore[] = [];
    files: File[] = [];
    widthMin = 700;
    heightMin = 700;
   toastRejectPixelsImg: any = this.toastyService.warning(
  "No pudimos subir algunas de tus imágenes\n Deben tener formato jpg o png\n Deben tener más de 700 píxeles en uno de sus lados.",
  "Dimension de imagen",
  { timeOut: 8000, closeButton: true, progressBar: true }
);
    toastIconMax: any = this.toastyService.warning(
  "Subir solo un logo para el comercio!",
  "Logo comercio",
  { timeOut: 4000, closeButton: true, progressBar: true }
);
   
    public validate_img: boolean = false;

    public departamentCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formGroup: UntypedFormBuilder,
        private toastyService: ToastrService,
        private apiService: ApiService,
        private _formBuilder: UntypedFormBuilder) { }



    ngOnInit() {
        this.route.params.subscribe(res => {
            this.id_store = res.id_store;
        })

        this.storeForm = this.formGroup.group({
            name_store: ['', [Validators.required]],
            address: ['', [Validators.required]],
            telephone: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
            number_identifier: ['', [Validators.required]],
            manager: ['', [Validators.required]],
            description: ['', [Validators.required]],
            // departmentControl: new FormControl('', [Validators.required]),
            // cityControl: new FormControl('', [Validators.required]),
            categorystoreCtrl: new UntypedFormControl('', [Validators.required]),
            departamentCtrl: new UntypedFormControl('', [Validators.required]),
            citieCtrl: new UntypedFormControl('', [Validators.required]),

        });

        this.apiService.getStoreData(this.id_store).subscribe((res: any) => {
            this.getDataStore(res, this.id_store)
        }, (error: any) => console.log(error));
    }

    getDataStore(response: { address: any; description: any; email: any; logo_store: any; manager: any; name_store: any; number_identifier: any; state_store: any; telephone: any; id_departament: any; city_id: any; storecategories: any; logo_store_up: string; }, id_location: any) {

        this.address = response.address;
        this.description = response.description;
        this.email = response.email;
        this.logo_store = response.logo_store;
        this.validate_logo = response.logo_store;
        this.manager = response.manager;
        this.name_store = response.name_store;
        this.number_identifier = response.number_identifier;
        this.state_store = response.state_store;
        this.telephone = response.telephone;
        this.id_departament = response.id_departament;
        this.id_city = response.city_id;
        this.id_category = response.storecategories;

        if (this.logo_store) {
            this.show_sin_img = false;
            this.show_img = true;
            this.logo_store = environment.api.baseBucketImageUrl + response.logo_store_up;
            // Guardar la URL completa para poder restaurarla después
            this.logo_store_save = response.logo_store_up;
        } else {
            this.show_sin_img = true;
            this.show_img = false;
            this.logo_store = "Sin logo";
            this.logo_store_save = null;
        }


        this.storeForm.patchValue({
            name_store: this.name_store,
            address: this.address,
            telephone: this.telephone,
            email: this.email,
            number_identifier: this.number_identifier,
            manager: this.manager,
            description: this.description
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

                this.setValueDepartmentSelect(this.departments, this.id_departament);
                this.depart$ = this.getDepartment("", this.departments);

            },
            (            error: any) => console.log(error)
        );
        // END ANGULAR MAT SEARCH DEPARTAMENT


        // START ANGULAR MAT SEARCH CITIES
        this.cities = [];
        this.apiService.getCitiesFrontbyDepartments(this.id_departament).subscribe(
            (data: City[]) => {
                this.citietlist = data;
                for (var i in this.citietlist) {
                    let get_id_citie = this.citietlist[i]['id_city'];
                    let get_citie = this.citietlist[i]['city'];
                    this.cities.push({ city: get_citie, id_city: get_id_citie });
                }
                this.setValueCitiSelect(this.cities, this.id_city);
                this.city$ = this.getCity("", this.cities);
            },
        );

        // START ANGULAR MAT SEARCH CATE
        this.storecategory = [];
        this.apiService.getStoreCategories().subscribe(
            (data: CategoryStore[]) => {
                this.storecategorylist = data;
                for (var i in this.storecategorylist) {
                    let get_id_category = this.storecategorylist[i]['id'];
                    let get_name_category = this.storecategorylist[i]['name_category'];
                    this.storecategory.push({ name_category: get_name_category, id: get_id_category });
                }
                this.setValueCategorySelect(this.storecategory, this.id_category);
                this.catego$ = this.getCategory("", this.storecategory);
            },
        );
        // END ANGULAR MAT SEARCH CATE

    }


    setValueDepartmentSelect(departments: Departament[], id_departmen: string) {
        const foundDepartment = departments.find((dept: Departament) => dept.id_departament === id_departmen);
        if (foundDepartment) {
            this.selectedValue = foundDepartment.id_departament;
        }
    }

    getDepartment(term: string = '', algo: Departament[]): Observable<Departament[]> {
        let items = algo;
        if (term) {
            items = items.filter((x: { departament: string; }) => x.departament.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }

    citieChangeAction(departament_id: any) {
        this.selectedCityValue = null;
        // START ANGULAR MAT SEARCH CITIES
        let id_dep = departament_id;
        this.cities = [];
        this.apiService.getCitiesFrontbyDepartments(id_dep).subscribe(
            (data: City[]) => {
                this.citietlist = data;
                for (var i in this.citietlist) {
                    let get_id_citie = this.citietlist[i]['id_city'];
                    let get_citie = this.citietlist[i]['city'];
                    this.cities.push({ city: get_citie, id_city: get_id_citie });
                }
                // this.citieCtrl.setValue(this.cities[10]);
                this.city$ = this.getCity("", this.cities);
            },
            (            error: any) => console.log(error)
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

    getCategory(term: string = '', algo: CategoryStore[]): Observable<CategoryStore[]> {
        let items = algo;
        if (term) {
            items = items.filter((x: { name_category: string; }) => x.name_category.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }

    setValueCitiSelect(cities: City[], id_city: string) {
        const foundCity = cities.find((city: City) => city.id_city === id_city);
        if (foundCity) {
            this.selectedCityValue = foundCity.id_city;
        }
    }

    setValueCategorySelect(categories: CategoryStore[], id_category: number) {
        const foundCategory = categories.find((category: CategoryStore) => category.id === id_category);
        if (foundCategory) {
            this.selectedCategoryValue = foundCategory.id;
        }
    }

    //START SET EVENT FROM DROPZONE COMPLEMENT
    onSelect(event: any) {
        console.log('onSelect called with event:', event);
        this.validate_img = false;
        if (event && event.addedFiles && Array.isArray(event.addedFiles)) {
            console.log('Adding files:', event.addedFiles.length);
            if (this.files.length > 0) {
                this.toastyService.error(this.toastIconMax);
                return;
            }
            
            // Validar y agregar archivos
            const firstFile = event.addedFiles[0];
            if (firstFile) {
                this.onValidatePixels(firstFile)
                    .then(value => {
                        if (value) {
                            this.files.push(firstFile);
                            // Actualizar la vista previa con la nueva imagen inmediatamente
                            this.logo_store = URL.createObjectURL(firstFile);
                            this.show_img = true;
                            this.show_sin_img = false;
                            console.log('File added and preview updated');
                        } else {
                            this.validate_img = true;
                            this.toastyService.error(this.toastRejectPixelsImg);
                        }
                    })
                    .catch(error => {
                        console.error('Error validating file:', error);
                        this.validate_img = true;
                    });
            }
        }
    }

    selectFile(event: any) {
        this.validate_img = false;
        // Este método puede usarse como respaldo, pero onSelect es el principal
        if (event && event.addedFiles && Array.isArray(event.addedFiles)) {
            this.onSelect(event);
        }
    }


    onValidatePixels(file: File): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            const Img = new Image();
            Img.src = URL.createObjectURL(file);
            Img.onload = (e: Event) => {
                const height = Img.height;
                const width = Img.width;
                resolve(height >= this.heightMin || width >= this.widthMin);
            };
        });

    }

    onRemove(event: File) {
        console.log(event);
        this.files.splice(this.files.indexOf(event), 1);
        // Restaurar la imagen original cuando se elimina el archivo
        if (this.files.length === 0) {
            if (this.logo_store_save) {
                this.logo_store = environment.api.baseBucketImageUrl + this.logo_store_save;
                this.show_img = true;
                this.show_sin_img = false;
            } else {
                this.logo_store = "Sin logo";
                this.show_img = false;
                this.show_sin_img = true;
            }
        }
    }

    submitStoreInfo() {
        this.validate_img = false;
        if (this.validate_logo) {
            if (this.storeForm.valid) {
                this.show = !this.show;
                this.show_spinner = true;
                let myObj_store;
                let values_store = this.storeForm.value;
                // START UPDATE STORE ON DB
                myObj_store = {
                    "address": values_store.address,
                    "telephone": values_store.telephone,
                    "email": values_store.email,
                    "number_identifier": values_store.number_identifier,
                    "manager": values_store.manager,
                    "city": this.selectedCityValue,
                    "description": values_store.description,
                    "logo_store": 1,
                    "storecategories": this.selectedCategoryValue
                };
                this.apiService.updateStore(myObj_store, this.id_store).subscribe(
                    result => {
                        let myJSON = JSON.stringify(result);
                        let obj = JSON.parse(myJSON);
                        console.log(obj.result.id_store);
                        let id_store = obj.result.id_store;

                        if (this.files.length > 0) {
                            for (var i = 0; i < this.files.length; i++) {
                                const file = this.files[i];
                                const formDataLogo = new FormData();
                                formDataLogo.append('id_store', id_store);
                                formDataLogo.append('logo_store_up', file);
                                this.apiService.uploadIconStore(formDataLogo).subscribe(
                                    result => {
                                        console.log('Logo uploaded successfully:', result);
                                        // Esperar un momento para asegurar que el backend termine de procesar
                                        setTimeout(() => {
                                            this.show_spinner = false;
                                            this.toastyService.success('Logo actualizado exitosamente', 'Éxito', { timeOut: 3000 });
                                            this.router.navigate(['/account/store_adm']).then(() => {
                                                window.location.reload();
                                            });
                                        }, 500);
                                    },
                                    error => {
                                        console.error('Error uploading logo:', error);
                                        this.toastyService.error('Error al subir el logo. Por favor, inténtalo de nuevo.', 'Error', { timeOut: 5000 });
                                        this.show_spinner = false;
                                    }
                                );
                            }
                        } else {
                            this.show_spinner = false;
                            this.router.navigate(['/account/store_adm']).then(() => {
                                window.location.reload();
                            });
                        }
                    },
                    error => console.log(error)
                );
            } else {
                for (let i in this.storeForm.controls) {
                    this.storeForm.controls[i].markAsTouched();
                }
            }

        } else {
            if (this.files.length > 0) {
                if (this.storeForm.valid) {
                    this.show = !this.show;
                    this.show_spinner = true;
                    let myObj_store;
                    let values_store = this.storeForm.value;
                    // START UPDATE STORE ON DB
                    myObj_store = {
                        "address": values_store.address,
                        "telephone": values_store.telephone,
                        "email": values_store.email,
                        "number_identifier": values_store.number_identifier,
                        "manager": values_store.manager,
                        "city": this.selectedCityValue,
                        "description": values_store.description,
                        "logo_store": 1,
                        "storecategories": this.selectedCategoryValue
                    };
                    this.apiService.updateStore(myObj_store, this.id_store).subscribe(
                        result => {
                            let myJSON = JSON.stringify(result);
                            let obj = JSON.parse(myJSON);
                            console.log(obj.result.id_store);
                            let id_store = obj.result.id_store;

                            if (this.files.length > 0) {
                                for (var i = 0; i < this.files.length; i++) {
                                    const file = this.files[i];
                                    const formDataLogo = new FormData();
                                    formDataLogo.append('id_store', id_store);
                                    formDataLogo.append('logo_store_up', file);
                                    this.apiService.uploadIconStore(formDataLogo).subscribe(
                                        result => {
                                            console.log('Logo uploaded successfully:', result);
                                            // Esperar un momento para asegurar que el backend termine de procesar
                                            setTimeout(() => {
                                                this.show_spinner = false;
                                                this.toastyService.success('Logo actualizado exitosamente', 'Éxito', { timeOut: 3000 });
                                                this.router.navigate(['/account/store_adm']).then(() => {
                                                    window.location.reload();
                                                });
                                            }, 500);
                                        },
                                        error => {
                                            console.error('Error uploading logo:', error);
                                            this.toastyService.error('Error al subir el logo. Por favor, inténtalo de nuevo.', 'Error', { timeOut: 5000 });
                                            this.show_spinner = false;
                                        }
                                    );
                                }
                            } else {
                                this.show_spinner = false;
                                this.router.navigate(['/account/store_adm']).then(() => {
                                    window.location.reload();
                                });
                            }
                        },
                        error => console.log(error)
                    );
                } else {
                    for (let i in this.storeForm.controls) {
                        this.storeForm.controls[i].markAsTouched();
                    }
                }

            } else {
                // VALIDACION DE IMAGEN
                this.validate_img = true;

            }
        }

    }




}

