import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/api.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';

// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

// Third party imports
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { take, takeUntil } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';
declare let alertify: any;

export interface Category {
   id: string;
   name_category: string;
}
export interface Subcategory {
   id: number;
   name_subcategory: string;
}

@Component({
   selector: 'app-add-product',
   templateUrl: './AddProduct.component.html',
   styleUrls: ['./AddProduct.component.scss'],
   standalone: true,
   imports: [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      RouterModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatCardModule,
      MatProgressSpinnerModule,
      MatIconModule,
      MatSelectModule,
      MatOptionModule,
      NgSelectModule,
      NgxDropzoneModule,
      AsyncPipe,
   ]
})

export class AddProductComponent implements OnInit {

   widthMin: number = 700;
   heightMin: number = 700;
   isApproved: boolean = false;
   selectedFiles!: FileList;
   files: File[] = [];
   subcategories: Subcategory[] = [];
   subcategorieslist: Subcategory[] = [];

   public subcategoryFilterCtrl: UntypedFormControl = new UntypedFormControl();
   next_id_image: any;
   doc_identi_docu: any;
   form!: UntypedFormGroup;
   mainImgPath!: string;
   colorsArray: string[] = ["Red", "Blue", "Yellow", "Green"];
   sizeArray: number[] = [36, 38, 40, 42, 44, 46, 48];
   quantityArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
   public imagePath: any;
   prod_category$!: Observable<Category[]>;
   sub_catego$!: Observable<Subcategory[]>;
   selectedProdCate: any;
   selectedSubcategory: any;
   selectedAvaila: any;

   "data": any = [
      {
         "image": "https://via.placeholder.com/625x800",
         "image_gallery": [
            "https://via.placeholder.com/625x800",
            "https://via.placeholder.com/625x800",
            "https://via.placeholder.com/625x800",
            "https://via.placeholder.com/625x800",
            "https://via.placeholder.com/625x800"
         ]
      }
   ]

   productForm!: UntypedFormGroup;
   public availa: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);

   // START ANGULAR MAT SEARCH CATEGORIES
   /** control for the selected bank */
   public categoryCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
   public subcategoryCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
   public categoryFilterCtrl: UntypedFormControl = new UntypedFormControl();
   // END ANGULAR MAT SEARCH CATEGORIES

   categorylist: Category[] = [];
   category: Category[] = [];

   toastvalidateimg: any = this.toastyService.warning(
      "Ingresar por lo menos una imagen!",
      "Imagen",
      { timeOut: 8000, closeButton: true, progressBar: true }
   );

   toastsaveproduct: any = this.toastyService.success(
      "el producto o servicio ha sido registrado!",
      "Producto registrado!",
      { timeOut: 8000, closeButton: true, progressBar: true }
   );


   toastRejectPixelsImg: any = this.toastyService.warning(
      "No pudimos subir algunas de tus imágenes\n Deben tener formato jpg o png\n Deben tener más de 700 píxeles en uno de sus lados.",
      "Dimension de imagen",
      { timeOut: 8000, closeButton: true, progressBar: true }
   );

   public show: boolean = false;

   constructor(
      public formBuilder: UntypedFormBuilder,
      private apiService: ApiService,
      private cookieService: CookieService,
      private toastyService: ToastrService,
      private router: Router,
   ) { }

   btnDisabled = false;

   ngOnInit() {

      this.productForm = this.formBuilder.group({
         name_product: ['', [Validators.required]],
         description_product: ['', [Validators.required]],
         product_code: ['', [Validators.required]],
         stock: ['', [Validators.required]],
         categoryCtrl: new UntypedFormControl('', [Validators.required]),
         subcategoryCtrl: new UntypedFormControl('', [Validators.required]),
         brand: ['', [Validators.required]],
         discount_price: ['', [Validators.required]],
         total_price: ['', [Validators.required]],
         availa: new UntypedFormControl('', [Validators.required]),
      });

      // START ANGULAR MAT SEARCH CATEGORIES
      this.category = [];
      this.apiService.getCategories().subscribe(
         (data: Category[]) => {
            this.categorylist = data;
            for (var i in this.categorylist) {
               let get_id_category = this.categorylist[i]['id'];
               let get_category = this.categorylist[i]['name_category'];
               this.category.push({ name_category: get_category, id: get_id_category });
            }

            this.prod_category$ = this.getCategoriesProd("", this.category);

         },
         (error: any) => console.log(error)
      );
      // END ANGULAR MAT SEARCH CATEGORIES

      this.mainImgPath = this.data[0].image;
      this.form = this.formBuilder.group({
         name: [],
         price: [],
         availablity: [],
         product_code: [],
         description: [],
         tags: [],
         features: []
      });
   }



   onSelect(event: { addedFiles: any; }) {
      console.log(event);
      this.files.push(...event.addedFiles);
   }

   onRemove(event: File) {
      console.log(event);
      this.files.splice(this.files.indexOf(event), 1);
   }


   //START SET EVENT FROM DROPZONE COMPLEMENT
   selectFile(event: { addedFiles: number | any[]; }) {

      if (Array.isArray(event.addedFiles)) {
         event.addedFiles.forEach((item: File) => {
            this.onValidatePixels(item)
               .then((value: boolean) => {
                  if (value) {
                     this.files.push(item);
                  } else {
                     this.toastyService.error(this.toastRejectPixelsImg);
                  }

               }).catch((e) => { this.toastyService.error(this.toastRejectPixelsImg); });
         });
      }

   }

   onValidatePixels(file: File): Promise<boolean> {
      return new Promise((resolve, reject) => {
         const Img = new Image();
         Img.src = URL.createObjectURL(file);
         Img.onload = (e: any) => {
            try {
               const height = e.target?.height || Img.height;
               const width = (e.target && e.target.width) || (Img && (Img as any).width) || 0;
               if (height >= this.heightMin || width >= this.widthMin) {
                  resolve(true);
                  return;
               }
            } catch (err) {
               // swallow and reject
            }
            resolve(false);
         };
      });

   }
   //END SET EVENT FROM DROPZONE COMPLEMENT



   subcategoriesChangeAction(categori_id: { id: any; }) {
      // START ANGULAR MAT SEARCH SUBCATEGORIES
      let id_category = categori_id.id;
      this.subcategories = [];
      this.apiService.getSubCategories(id_category).subscribe(
         (data: Subcategory[]) => {
            this.subcategorieslist = data;
            if (this.subcategorieslist && this.subcategorieslist.length > 0) {
               for (var i in this.subcategorieslist) {
                  let get_id_subcategory = this.subcategorieslist[i]['id'];
                  let get_name_subcategory = this.subcategorieslist[i]['name_subcategory'];
                  this.subcategories.push({ id: get_id_subcategory, name_subcategory: get_name_subcategory });
               }
            } else {
               // Si no hay subcategorías, agregar opción "Otros" con id 0
               this.subcategories.push({ id: 0, name_subcategory: 'Otros' });
            }
            this.sub_catego$ = this.getSubcategories("", this.subcategories);
         },
         (error: any) => {
            console.log(error);
            // En caso de error, agregar opción "Otros" con id 0
            this.subcategories = [{ id: 0, name_subcategory: 'Otros' }];
            this.sub_catego$ = this.getSubcategories("", this.subcategories);
         }
      );
      // END ANGULAR MAT SEARCH SUBCATEGORIES

   }



   onChangeDocIde(event: any) {
      console.log(event);

      if (event.target.files.length > 0) {
         this.doc_identi_docu = event.target.files[0];
      }
   }

   getCategoriesProd(term: string = '', algo: Category[]): Observable<Category[]> {
      let items = algo;
      if (term) {
         items = items.filter((x: { name_category: string; }) => x.name_category.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
      }
      return of(items).pipe(delay(500));
   }

   getSubcategories(term: string = '', algo: Subcategory[]): Observable<Subcategory[]> {
      let items = algo;
      if (term) {
         items = items.filter((x: { name_subcategory: string; }) => x.name_subcategory.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
      }
      return of(items).pipe(delay(500));
   }


   submitProductInfo() {

      if (this.files.length > 0) {
         if (this.productForm.valid) {
            // Validar que se haya seleccionado una subcategoría válida (permite 0, rechaza null/undefined/negativos)
            if (this.selectedSubcategory === null || this.selectedSubcategory === undefined || this.selectedSubcategory < 0) {
               this.toastyService.error('Por favor selecciona una subcategoría válida');
               return;
            }

            this.btnDisabled = true;
            this.show = !this.show;
            let myObj_product;
            let values_productForm = this.productForm.value;

            const id_store = localStorage.getItem('id-store');
            // Convertir subcategory_id 0 a null para el backend
            const subcategoryId = this.selectedSubcategory === 0 ? null : this.selectedSubcategory;

            myObj_product = {
               "name_product": values_productForm.name_product,
               "description_product": values_productForm.description_product,
               "product_code": values_productForm.product_code,
               "total_price": values_productForm.total_price,
               "availability": this.selectedAvaila,
               "stock": values_productForm.stock,
               "store": id_store,
               "brand": values_productForm.brand,
               "subcategory_id": subcategoryId,
               "discount_price": values_productForm.discount_price,
               "features": 'na',
               "state": 1,
               "image": '1',
               "published": 'false'
            };

            // START CREATE REGITER PRODUCT ON THE DB
            this.apiService.setProduct(myObj_product).subscribe(
               result => {
                  let myJSON = JSON.stringify(result);
                  let obj = JSON.parse(myJSON);
                  let id_product = obj.id_product;
                  let get_first_image_name = '';

                  // START UPLOAD IMAGES ON S3 AWS ASOCIATE TO THE PRODUCT
                  let consec = 0;
                  var today = new Date();
                  for (var i = 0; i < this.files.length; i++) {

                     const file = this.files[i];
                     let type = file.type;
                     let type_sp = type.split("/");
                     let get_type_img = type_sp[1];
                     var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                     var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                     var dateTime = date + ' ' + time;
                     var dates_as_int = [dateTime];
                     const dates = dates_as_int.map(date => new Date(date).getTime());
                     const namefile = id_store + '-' + this.selectedSubcategory + '-' + dates + i + '.' + get_type_img;

                     if (i == 0) {
                        get_first_image_name = namefile;
                     }

                     const formDataDocIde = new FormData();
                     formDataDocIde.append('image', file);
                     formDataDocIde.append('product', id_product);
                     formDataDocIde.append('image_name', namefile);

                     this.apiService.uploadFile(formDataDocIde).subscribe(
                        result => {
                           consec = consec + 1;
                           if ((consec == this.files.length) && (result)) {
                              this.apiService.updateImageProduc(get_first_image_name, id_product).subscribe(
                                 result => {
                                    this.router.navigate(['/admin-panel/products']).then(() => {
                                       // this.toastyService.success(this.toastsaveproduct);
                                    });
                                 },
                                 error => console.log(error)
                              );

                           }
                        },
                        error => console.log(error)
                     );
                  }
                  // END UPLOAD IMAGES ON S3 AWS ASOCIATE TO THE PRODUCT
               },
               error => console.log(error)
            );
            // END CREATE REGISTER PRODUCT ON THE DB
         } else {
            for (let i in this.productForm.controls) {
               this.productForm.controls[i].markAsTouched();
            }
         }

      } else {
         this.toastyService.error(this.toastvalidateimg);
      }
      return false;
   }


   /**
    * getImagePath is used to change the image path on click event.
    */
   public getImagePath(imgPath: string, index: number) {
      const active = document.querySelector('.border-active') as HTMLElement | null;
      if (active) {
         active.classList.remove('border-active');
      }

      this.mainImgPath = imgPath;

      const el = document.getElementById(index + '_img') as HTMLElement | null;
      if (el) {
         el.classList.add('border-active');
      }
   }
}

