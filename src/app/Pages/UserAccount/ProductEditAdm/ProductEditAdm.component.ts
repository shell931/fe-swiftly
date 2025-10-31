import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/api.service';
import { Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../src/environments/environment';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';

// Third-party imports
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDropzoneModule } from 'ngx-dropzone';

declare let alertify: any;

export interface Category {
    id: string;
    name_category: string;
}
export interface Subcategory {
    id: number;
    name_subcategory: string;
}

export interface Image {
    image: string;
}


@Component({
    selector: 'app-ProductEditAdm',
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
        MatIconModule,
        MatSelectModule,
        MatListModule,
        MatCheckboxModule,
        NgSelectModule,
        NgxDropzoneModule
    ],
    templateUrl: './ProductEditAdm.component.html',
    styleUrls: ['./ProductEditAdm.component.scss']
})

export class ProductEditAdmComponent implements OnInit {

    // UI properties
    loaded: boolean = true;
    i: any = 0;
    btnDisabled: boolean = false;
    show: boolean = false;
    validate_img: boolean = false;
    validate_coun_img: boolean = false;
    obligatory_img: boolean = false;

    widthMin: Number = 100;
    heightMin: Number = 100;
    isApproved: boolean = false;
    selectedFiles!: FileList;
    files: File[] = [];
    subcategories: Subcategory[] = [];
    subcategorieslist: Subcategory[] = [];

    public subcategoryFilterCtrl: UntypedFormControl = new UntypedFormControl();
    productForm!: UntypedFormGroup;
    public availa: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
    // START ANGULAR MAT SEARCH CATEGORIES
    public categoryCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
    public subcategoryCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
    public categoryFilterCtrl: UntypedFormControl = new UntypedFormControl();

    // END ANGULAR MAT SEARCH CATEGORIES
    categorylist: Category[] = [];
    category: Category[] = [];
    id_product: any;
    get_pr: any[] = [];
    get_id_image: any[] = [];
    productsGrid: any;
    name_product: any;
    description_product: any;
    product_code: any;
    stock: any;
    brand: any;
    total_price: any;
    // discount_price: any;
    subcategory: any;
    get_id_category: any;
    availability: any;
    selectedValueSubcategory!: string | null;
    selectedValueCategory: any;
    selectedValueAvailable!: string | boolean;
    prod_category$!: Observable<Category[]>;
    sub_catego$!: Observable<Subcategory[]>;
    selectedProdCate: any;
    selectedSubcategory: any;
    selectedAvaila: any;


    toastvalidateimg: any = this.toastyService.error(
  "La imagen es requerida",
  "ingresa una imagen",
  { timeOut: 8000, closeButton: true, progressBar: true }
);


    toastsaveproduct: any = this.toastyService.success(
  "Producto registrado",
  "El producto o servicio ha sido registrado!",
  { timeOut: 8000, closeButton: true, progressBar: true }
);

    toastRejectPixelsImg: any = this.toastyService.error(
  "Dimensiones de imagen",
  "No pudimos subir algunas de tus imágenes\n Deben tener formato jpg o png\n Deben tener más de 700 píxeles en uno de sus lados.",
  { timeOut: 8000, closeButton: true, progressBar: true }
);


    constructor(
        private route: ActivatedRoute,
        public formBuilder: UntypedFormBuilder,
        private apiService: ApiService,
        private cookieService: CookieService,
        private toastyService: ToastrService,
        private router: Router,
    ) { }

    ngOnInit() {

        this.route.params.subscribe(res => {
            this.id_product = res.id_product;
        })

        console.log(this.id_product);

        this.productForm = this.formBuilder.group({
            name_product: ['', [Validators.required]],
            description_product: ['', [Validators.required]],
            product_code: ['', [Validators.required]],
            stock: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            categoryCtrl: new UntypedFormControl('', [Validators.required]),
            subcategoryCtrl: new UntypedFormControl('', [Validators.required]),
            brand: ['', [Validators.required]],
            // discount_price: ['', [Validators.required]],
            total_price: ['', [Validators.required, Validators.pattern("^[0-9.]*$")]],
            availa: new UntypedFormControl('', [Validators.required]),
        });

        this.apiService.getProductsbyIdAdmin(this.id_product).subscribe((res: any) => this.getProductData(res));

    }



    getProductData(response: { rel_product: any; name_product: any; description_product: any; product_code: any; stock: any; brand: any; total_price: any; subcategory: any; availability: any; }) {
        let gallery = response.rel_product;
        this.get_pr = [];
        this.name_product = response.name_product;
        this.description_product = response.description_product;
        this.product_code = response.product_code;
        this.stock = response.stock;
        this.brand = response.brand;
        this.total_price = response.total_price;
        // this.discount_price = response.discount_price;
        this.subcategory = response.subcategory;
        this.availability = response.availability;

        this.apiService.FindCategoryBySubcategory(this.subcategory).subscribe(
            (            dataCategory: { [x: string]: { [x: string]: any; }; }) => {
                let id_category: number = 0; // Initialize with a default value
                for (var i in dataCategory) {
                    id_category = dataCategory[i]['category'];
                }

                this.category = [];
                this.apiService.getCategories().subscribe(
                    (data: Category[]) => {
                        this.categorylist = data;
                        for (var i in this.categorylist) {
                            let get_id_category = this.categorylist[i]['id'];
                            let get_category = this.categorylist[i]['name_category'];
                            this.category.push({ name_category: get_category, id: get_id_category });
                        }
                        this.setValueCategoriesSelect(this.category, id_category);
                        this.prod_category$ = this.getCategoriesProd("", this.category);
                    },
                    (                    error: any) => console.log(error)
                );

                this.subcategories = [];
                this.apiService.getSubCategories(id_category).subscribe(
                    (data: Subcategory[]) => {
                        this.subcategorieslist = data;
                        for (var i in this.subcategorieslist) {
                            let get_id_subcategory = this.subcategorieslist[i]['id'];
                            let get_name_subcategory = this.subcategorieslist[i]['name_subcategory'];
                            this.subcategories.push({ id: get_id_subcategory, name_subcategory: get_name_subcategory });
                        }

                        this.setValueSubCategoriesSelect(this.subcategories, this.subcategory);
                        this.sub_catego$ = this.getSubcategories("", this.subcategories);
                    },
                    (                    error: any) => console.log(error)
                );

            },
            (            error: any) => console.log(error)
        );

        if (this.availability == true) {
            this.selectedValueAvailable = "Si"
        } else {
            this.selectedValueAvailable = "No"
        }

        this.get_pr = [];
        for (var i = 0; i < gallery.length; i++) {
            this.get_pr.push({
                id_image: gallery[i].id,
                image: gallery[i].image,
            });

        }

        const nameProductControl = this.productForm.get('name_product');
        if (nameProductControl) {
            nameProductControl.setValue(this.name_product);
        }
        const descriptionProductControl = this.productForm.get('description_product');
        if (descriptionProductControl) {
            descriptionProductControl.setValue(this.description_product);
        }
        const productCodeControl = this.productForm.get('product_code');
        if (productCodeControl) {
            productCodeControl.setValue(this.product_code);
        }
        const stockControl = this.productForm.get('stock');
        if (stockControl) {
            stockControl.setValue(this.stock);
        }
        const brandControl = this.productForm.get('brand');
        if (brandControl) {
            brandControl.setValue(this.brand);
        }
        // const totalPriceControl = this.productForm.get('total_price');
        // if (totalPriceControl) {
        //     totalPriceControl.setValue(Math.round(this.total_price));
        // }
        // this.productForm.get('total_price').setValue(Intl.NumberFormat().format(Math.round(this.total_price)))
        const totalPriceControl = this.productForm.get('total_price');
        if (totalPriceControl) {
            totalPriceControl.setValue(Math.round(this.total_price));
        }
        // const discountPriceControl = this.productForm.get('discount_price');
        // if (discountPriceControl) {
        //     discountPriceControl.setValue(this.discount_price);
        // }


    }



    setValueSubCategoriesSelect(subcategories: string | any[], id_subcategory: any) {
        let count: number = 0;
        for (var i = 0; i < subcategories.length; i++) {
            subcategories[i].idt;
            if (subcategories[i].id == id_subcategory) {
                count = i;
            }
        }
        this.selectedValueSubcategory = subcategories[count].id;
    }

    setValueCategoriesSelect(categories: string | any[], id_category: any) {
        let count_cat: number = 0; // Initialize with default value
        for (var i = 0; i < categories.length; i++) {
            if (categories[i].id == id_category) {
                count_cat = i;
            }
        }
        // Check if the category exists before accessing it
        if (categories.length > 0 && categories[count_cat]) {
            this.selectedValueCategory = categories[count_cat].id;
        }
    }

    onSelect(event: any) {
        console.log('onSelect called with event:', event);
        if (event && event.addedFiles && Array.isArray(event.addedFiles)) {
            console.log('Adding files:', event.addedFiles.length);
            this.files.push(...event.addedFiles);
            this.validate_img = false;
            console.log('Total files after adding:', this.files.length);
        }
    }

    onRemove(event: File) {
        console.log(event);
        this.files.splice(this.files.indexOf(event), 1);
    }

    // Función para obtener preview de la imagen
    getImagePreview(file: File): string {
        return URL.createObjectURL(file);
    }

    // Función para formatear el tamaño del archivo
    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Función para manejar el input de archivo tradicional
    onFileInputChange(event: any) {
        console.log('onFileInputChange called with event:', event);
        const files = event.target.files;
        if (files && files.length > 0) {
            console.log('Files from input:', files.length);
            const fileArray = Array.from(files);
            fileArray.forEach((file: File) => {
                console.log('Adding file from input:', file.name);
                this.files.push(file);
            });
            this.validate_img = false;
            console.log('Total files after input:', this.files.length);
        }
    }

    deleteProduct(i: { id_image: any; }) {

        this.get_id_image.push(i.id_image);
        let galery = this.get_pr;
        this.get_pr = [];
        for (var a = 0; a < galery.length; a++) {
            if (galery[a].id_image != i.id_image) {
                this.get_pr.push({
                    id_image: galery[a].id_image,
                    image: galery[a].image,
                });
            }
        }
    }



    //START SET EVENT FROM DROPZONE COMPLEMENT
    selectFile(event: any) {
        console.log('selectFile called with event:', event);
        this.validate_img = false;
        this.obligatory_img = false;
        
        // ngx-dropzone can pass files in different ways
        let addedFiles = [];
        
        if (Array.isArray(event)) {
            // If event is directly an array of files
            addedFiles = event;
        } else if (event && event.addedFiles) {
            // If event has addedFiles property
            addedFiles = event.addedFiles;
        } else if (event && Array.isArray(event)) {
            // If event is an array
            addedFiles = event;
        }
        
        console.log('Processed files:', addedFiles);
        
        if (Array.isArray(addedFiles) && addedFiles.length > 0) {
            // Validate each file
            addedFiles.forEach((file: File) => {
                console.log('Processing file:', file.name, file.type);
                this.onValidatePixels(file)
                    .then((isValid) => {
                        if (isValid) {
                            this.files.push(file);
                            console.log('Imagen agregada exitosamente:', file.name);
                            console.log('Total files:', this.files.length);
                        } else {
                            this.validate_img = true;
                            this.toastyService.error('Las imágenes deben tener al menos 100x100 píxeles');
                        }
                    })
                    .catch((error) => {
                        console.error('Error validating image:', error);
                        this.validate_img = true;
                        this.toastyService.error('Error al validar la imagen');
                    });
            });
        } else {
            console.log('No files to process');
        }
    }

    onValidatePixels(file: File): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            const Img = new Image();
            Img.src = URL.createObjectURL(file);
            Img.onload = (e: any) => {
                const height = e.target.height;
                const width = e.target.width;
                if (height >= this.heightMin && width >= this.widthMin) {
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
    //END SET EVENT FROM DROPZONE COMPLEMENT

    // Helper function to handle image deletion
    private handleImageDeletion(product_id: any) {
        if (this.get_id_image.length > 0) {
            let consec_del = 0;
            let deleteErrors = 0;
            
            for (var a = 0; a < this.get_id_image.length; a++) {
                console.log("Elimina imagen" + a);
                let myObj_product = {
                    "image_id": this.get_id_image[a]
                };
                this.apiService.DeleteProductImage(myObj_product).subscribe(
                    data => {
                        consec_del = consec_del + 1;
                        if ((consec_del == this.get_id_image.length) && (data)) {
                            this.toastyService.success('Producto actualizado exitosamente');
                            this.router.navigate(['/account/product_adm']);
                        }
                    },
                    error => {
                        console.error('Error deleting image:', error);
                        deleteErrors++;
                        if (deleteErrors === this.get_id_image.length) {
                            this.toastyService.error('Error al eliminar las imágenes');
                            this.btnDisabled = false;
                        }
                    }
                );
            }
        } else {
            this.toastyService.success('Producto actualizado exitosamente');
            this.router.navigate(['/account/product_adm']);
        }
    }



    getCategoriesProd(term: string = '', algo: Category[]): Observable<Category[]> {
        let items = algo;
        if (term) {
            items = items.filter((x: { name_category: string; }) => x.name_category.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }


    subcategoriesChangeAction(categori_id: { id: any; }) {

        this.selectedValueSubcategory = null;
        // START ANGULAR MAT SEARCH SUBCATEGORIES
        let id_category = categori_id.id;
        this.subcategories = [];
        this.apiService.getSubCategories(id_category).subscribe(
            (data: Subcategory[]) => {
                this.subcategorieslist = data;
                for (var i in this.subcategorieslist) {
                    let get_id_subcategory = this.subcategorieslist[i]['id'];
                    let get_name_subcategory = this.subcategorieslist[i]['name_subcategory'];
                    this.subcategories.push({ id: get_id_subcategory, name_subcategory: get_name_subcategory });
                }
                this.sub_catego$ = this.getSubcategories("", this.subcategories);
            },
            (            error: any) => console.log(error)
        );
        // END ANGULAR MAT SEARCH SUBCATEGORIES

    }


    getSubcategories(term: string = '', algo: Subcategory[]): Observable<Subcategory[]> {
        let items = algo;
        if (term) {
            items = items.filter((x: { name_subcategory: string; }) => x.name_subcategory.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }



    submitProductInfo() {
        console.log('submitProductInfo called');
        console.log('Files to upload:', this.files.length);
        console.log('Files array:', this.files);

        if (this.productForm.valid) {
            this.validate_coun_img = false;
            this.apiService.getCountImagesProducts(this.id_product).subscribe(
                (                result: any) => {

                    let count_images_product = result;
                    let count_images_to_upload = this.files.length;
                    let count_images_to_delete = this.get_id_image.length;
                    
                    console.log('Image counts:', {
                        current: count_images_product,
                        toUpload: count_images_to_upload,
                        toDelete: count_images_to_delete
                    });
                    let comod = 0;

                    if (count_images_product <= count_images_to_delete) {
                        if (count_images_to_upload < 1) {
                            comod = 1;
                        } else {
                            comod = 0;
                        }
                    } else {
                        comod = 0;
                    }

                    if (comod == 1) {
                        this.validate_coun_img = true;
                    } else {
                        this.btnDisabled = true;
                        this.show = !this.show;
                        let myObj_product;
                        let values_productForm = this.productForm.value;
                        // let total = values_productForm.total_price.replace(/\./g,'');
                        console.log(this.selectedValueAvailable);
                        let total = values_productForm.total_price;
                        if(this.selectedValueAvailable=="Si"){
                            this.selectedValueAvailable = true;
                        }else if(this.selectedValueAvailable=="No"){
                            this.selectedValueAvailable = false;
                        }
                        console.log(this.selectedValueAvailable);

                        myObj_product = {
                            "name_product": values_productForm.name_product,
                            "description_product": values_productForm.description_product,
                            "product_code": values_productForm.product_code,
                            "total_price": total,
                            "availability": this.selectedValueAvailable,
                            "stock": values_productForm.stock,
                            "brand": values_productForm.brand,
                            "subcategory": this.selectedValueSubcategory,
                            // "discount_price": values_productForm.discount_price,
                            "edit_pr": 1,
                            // "published": false,
                        };
                        this.apiService.updateProduc(JSON.stringify(myObj_product), this.id_product).subscribe(
                            result => {
                                console.log('Product updated, checking files:', this.files.length);
                                if (this.files.length > 0) {
                                    console.log('Starting image upload process...');
                                    const id_store = localStorage.getItem('id-store');
                                    let product_id = this.id_product;
                                    let get_first_image_name = '';
                                    // START UPLOAD IMAGES ON S3 AWS ASSOCIATE TO THE PRODUCT
                                    var today = new Date();
                                    let consec = 0;
                                    for (var i = 0; i < this.files.length; i++) {
                                        const file = this.files[i];
                                        console.log(`Processing file ${i + 1}/${this.files.length}:`, file.name);
                                        let type = file.type;
                                        let type_sp = type.split("/");
                                        let get_type_img = type_sp[1];
                                        let myObj_image;
                                        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                                        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                                        var dateTime = date + ' ' + time;
                                        var dates_as_int = [dateTime];
                                        const dates = dates_as_int.map(date => new Date(date).getTime());
                                        const namefile = id_store + '-' + this.selectedValueSubcategory + '-' + dates + i + '.' + get_type_img;

                                        if (i == 0) {
                                            get_first_image_name = namefile;
                                        }

                                        const formDataDocIde = new FormData();
                                        formDataDocIde.append('image', file);
                                        formDataDocIde.append('product', product_id);
                                        formDataDocIde.append('image_name', namefile);
                                        
                                        console.log('Uploading file:', namefile);

                                        this.apiService.uploadFile(formDataDocIde).subscribe(
                                            result => {
                                                console.log(`File ${i + 1} upload result:`, result);
                                                consec = consec + 1;
                                                console.log(`Uploaded ${consec}/${this.files.length} files`);
                                                if ((consec == this.files.length) && (result)) {
                                                    console.log('All files uploaded, updating main image...');
                                                    this.apiService.updateImageProduc(get_first_image_name, product_id).subscribe(
                                                        result => {
                                                            console.log('Main image updated, handling deletions...');
                                                            this.handleImageDeletion(product_id);
                                                        },
                                                        error => {
                                                            console.error('Error updating main image:', error);
                                                            this.toastyService.error('Error al actualizar la imagen principal');
                                                            this.btnDisabled = false;
                                                        }
                                                    );
                                                }
                                            },
                                            error => {
                                                console.error('Error uploading file:', error);
                                                this.toastyService.error('Error al subir las imágenes');
                                                this.btnDisabled = false;
                                            }
                                        );

                                    }
                                    // END UPLOAD IMAGES ON S3 AWS ASOCIATE TO THE PRODUCT
                                } else {
                                    console.log('No files to upload, handling deletions only...');
                                    this.handleImageDeletion(this.id_product);
                                }
                            },
                            error => console.log(error)
                        );
                    }

                },
                (                error: any) => console.log(error)
            );


        } else {
            for (let i in this.productForm.controls) {
                this.productForm.controls[i].markAsTouched();
            }
        }
        return false;
    }



}


