import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgxDropzoneModule, NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../Services/api.service';

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
    selector: 'app-EditStore',
    templateUrl: './EditStore.component.html',
    styleUrls: ['./EditStore.component.scss'],
    standalone: true, // Force rebuild
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        NgxDropzoneModule,
        MatProgressSpinnerModule,
    ]
})
export class EditStoreComponent implements OnInit {


    departamentlist: Departament[] = [];
    departments: Departament[] = [];
    citietlist: City[] = [];
    cities: City[] = [];
    files: File[] = [];
    selectedFiles!: FileList;
    id_store: any;
    address: any;
    description: any;
    email: any;
    logo_store: any;
    logo_store_save: any;
    manager: any;
    name_store: any;
    number_identifier: any;
    state_store: any;
    telephone: any;
    selectedValue: any;
    selectedCityValue: any;
    selectedCategoryValue: any;
    id_city: any;
    id_departament: any;
    id_category: any;
    widthMin: Number = 700;
    heightMin: Number = 700;
    public show: boolean = false;
    storecategorylist: CategoryStore[] = [];
    storecategory: CategoryStore[] = [];

    // START ANGULAR MAT SEARCH DEPARTAMENT
    public departamentCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
    public citieCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
    public departamentFilterCtrl: UntypedFormControl = new UntypedFormControl();
    public citieFilterCtrl: UntypedFormControl = new UntypedFormControl();
    @ViewChild('singleSelect', { static: true })
    singleSelect!: MatSelect;
    private _onDestroy = new Subject<void>();
    // END ANGULAR MAT SEARCH DEPARTAMENT

    // START ANGULAR MAT SEARCH CATEGORY STORE
    public categorystoreCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
    public categorystoreFilterCtrl: UntypedFormControl = new UntypedFormControl();
    // END ANGULAR MAT SEARCH CATEGORY STORE


    storeForm!: UntypedFormGroup;
    emailPattern: any = /\S+@\S+\.\S+/;
    formBuilder: any;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formGroup: UntypedFormBuilder,
        private toastyService: ToastrService,
        private apiService: ApiService,
        private _formBuilder: UntypedFormBuilder) { }


    toastOption: any = this.toastyService.success(
        "La tienda ha sido actualizada en el sistema!",
        "Tienda actualizada",
        { timeOut: 4000, closeButton: true, progressBar: true }
    );
    toastIconMax: any = this.toastyService.warning(
        "Subir solo un logo para el comercio!",
        "Logo comercio",
        { timeOut: 4000, closeButton: true, progressBar: true }
    );


    toastvalidateimg: any = this.toastyService.warning(
        "Ingresar logo!",
        "Logo",
        { timeOut: 4000, closeButton: true, progressBar: true }
    );

    toastRejectPixelsImg: any = this.toastyService.warning(
        "No pudimos subir algunas de tus imágenes\n Deben tener formato jpg o png\n Deben tener más de 700 píxeles en uno de sus lados.",
        "Dimension de imagen",
        { timeOut: 8000, closeButton: true, progressBar: true }
    );

    ngOnInit() {
        this.route.params.subscribe((res: Params) => {
            this.id_store = res.id_store;
        })
        console.log(this.id_store);
        this.storeForm = this.formGroup.group({
            name_store: ['', [Validators.required]],
            address: ['', [Validators.required]],
            telephone: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
            number_identifier: ['', [Validators.required]],
            manager: ['', [Validators.required]],
            description: ['', [Validators.required]],
            departmentControl: new UntypedFormControl('', [Validators.required]),
            cityControl: new UntypedFormControl('', [Validators.required]),
            categorystoreCtrl: new UntypedFormControl('', [Validators.required]),
        });

        this.apiService.getStoreData(this.id_store).subscribe((res: any) => {
            this.getDataStore(res, this.id_store)
        }, (error: any) => console.log(error));
    }

    getDataStore(response: { address: any; description: any; email: any; logo_store: any; manager: any; name_store: any; number_identifier: any; state_store: any; telephone: any; id_departament: any; city_id: any; storecategories: any; }, id_location: any) {

        this.address = response.address;
        this.description = response.description;
        this.email = response.email;
        this.logo_store = response.logo_store;
        this.manager = response.manager;
        this.name_store = response.name_store;
        this.number_identifier = response.number_identifier;
        this.state_store = response.state_store;
        this.telephone = response.telephone;
        this.id_departament = response.id_departament;
        this.id_city = response.city_id;
        this.id_category = response.storecategories;
        this.logo_store_save = this.logo_store;
        this.logo_store = 'https://store-ever-icon-store.s3.us-east-2.amazonaws.com/' + this.logo_store;


        this.storeForm.get('name_store')?.setValue(this.name_store)
        this.storeForm.get('address')?.setValue(this.address)
        this.storeForm.get('telephone')?.setValue(this.telephone)
        this.storeForm.get('email')?.setValue(this.email)
        this.storeForm.get('number_identifier')?.setValue(this.number_identifier)
        this.storeForm.get('manager')?.setValue(this.manager)
        this.storeForm.get('description')?.setValue(this.description)

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
                this.departamentCtrl.setValue(this.departments[10]);
                this.departamentFilterCtrl.valueChanges
                    .pipe(takeUntil(this._onDestroy))
                    .subscribe(() => {
                        this.filterDepartament();
                    });
            },
            (error: any) => console.log(error)
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
                this.citieCtrl.setValue(this.cities[10]);
            },
            (error: any) => console.log(error)
        );
        // END ANGULAR MAT SEARCH CITIES

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
                this.categorystoreCtrl.setValue(this.storecategory[10]);
            },
        );
        // END ANGULAR MAT SEARCH CATE

    }


    setValueCategorySelect(categories: string | any[], id_category: any) {
        let count;
        for (var i = 0; i < categories.length; i++) {
            categories[i].id;
            if (categories[i].id == id_category) {
                count = i;
            }
        }
        this.selectedCategoryValue = categories[count!];
    }



    setValueDepartmentSelect(departments: string | any[], id_departmen: any) {
        let count;
        for (var i = 0; i < departments.length; i++) {
            departments[i].id_departament;
            if (departments[i].id_departament == id_departmen) {
                count = i;
            }
        }
        this.selectedValue = departments[count!];
    }

    setValueCitiSelect(cities: string | any[], id_city: any) {
        let count;
        for (var i = 0; i < cities.length; i++) {
            if (cities[i].id_city == id_city) {
                count = i;
            }
        }
        this.selectedCityValue = cities[count!];
    }

    //START SET EVENT FROM DROPZONE COMPLEMENT
    selectFile(event: NgxDropzoneChangeEvent) {
        // event.addedFiles is an array of File; index variable not needed
        console.log(this.files.length);
        if (this.files.length > 0) {
            this.toastyService.error(this.toastIconMax);
        } else if (Array.isArray(event.addedFiles)) {
            event.addedFiles.map((item: any) => {
                this.onValidatePixels(item)
                    .then((value: boolean) => {
                        if (value) {
                            this.files.push(item);
                        } else {
                            this.toastyService.error(this.toastRejectPixelsImg);
                        }
                    });
            });
        }
    }


    onValidatePixels(file: File): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const Img = new Image();
            Img.src = URL.createObjectURL(file);
            Img.onload = (e: any) => {
                console.log(e);
                const height = e.target?.height ?? 0;
                const width = e.path?.[0]?.width ?? e.target?.width ?? 0;
                if (height >= this.heightMin || width >= this.widthMin) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            };
            Img.onerror = () => {
                resolve(false);
            };
        });

    }


    onRemove(event: File) {
        console.log(event);
        this.files.splice(this.files.indexOf(event), 1);
    }
    //END SET EVENT FROM DROPZONE COMPLEMENT


    // START ANGULAR MAT SEARCH DEPARTAMENTS
    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
    protected filterDepartament() {
        if (!this.departments) {
            return;
        }
        // get the search keyword
        let search = this.departamentFilterCtrl.value;
        if (!search) {
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
    }
    // END START ANGULAR MAT SEARCH DEPARTAMENTS




    citieChangeAction(departament: { value: any; }) {

        this.selectedCityValue = null;
        // START ANGULAR MAT SEARCH CITIES
        let get_data_dep = departament.value;
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
                this.citieCtrl.setValue(this.cities[10]);
            },
            (error: any) => console.log(error)
        );
        // END ANGULAR MAT SEARCH CITIES

    }


    submitStoreInfo() {
        if (this.storeForm.valid) {
            this.show = !this.show;
            let myObj_store;
            let values_store = this.storeForm.value;

            // START UPDATE STORE ON DB
            myObj_store = {
                "name_store": values_store.name_store, "address": values_store.address,
                "telephone": values_store.telephone, "email": values_store.email,
                "number_identifier": values_store.number_identifier, "manager": values_store.manager,
                "state_store": "true", "city": values_store.cityControl.id_city,
                "description": values_store.description,
                "logo_store": this.logo_store_save, "storecategories": values_store.categorystoreCtrl.id
            };

            this.apiService.updateStore(myObj_store, this.id_store).subscribe(
                (result: { [x: string]: any; }) => {

                    if (this.files.length > 0) {
                        let store_id = result["id_store"];
                        // START UPLOAD IMAGES ON S3 AWS ASOCIATE TO THE LOGO
                        // let today = new Date();
                        // let name_logo = '';
                        // for (var i = 0; i < this.files.length; i++) {
                        //     const file = this.files[i];
                        //     const namefile = this.logo_store_save;
                        //     this.apiService.uploadIconStore(file, namefile);
                        //     name_logo = namefile;
                        // }
                        // END UPLOAD IMAGES ON S3 AWS ASOCIATE TO THE LOGO
                    }

                },
                (error: any) => console.log(error)
            );
            // END UPDATE STORE ON DB
            if (this.files.length > 0) {
                setTimeout(() => {
                    window.location.reload();
                }, 10000);
            } else {
                this.show = !this.show;
                this.router.navigate(['/admin-panel/store/edit_store/', this.id_store]).then(() => {
                    this.toastyService.success(this.toastOption);
                });
            }

        } else {
            for (let i in this.storeForm.controls) {
                this.storeForm.controls[i].markAsTouched();
            }
        }

    }

}



