import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../Services/api.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

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
	selector: 'app-ProductsCreateAdm',
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
	templateUrl: './ProductsCreateAdm.component.html',
	styleUrls: ['./ProductsCreateAdm.component.scss']
})

export class ProductsCreateAdmComponent implements OnInit {


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

	public validate_img: boolean = false;
	public obligatory_img: boolean = false;
	public btnDisabled: boolean = false;
	public show: boolean = false;

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

	toastvalidateimg: any = this.toastyService.info(
  "ingresar por lo menos una imagen!",
  "Imagen",
  { timeOut: 4000, closeButton: true, progressBar: true }
);


	toastsaveproduct: any = this.toastyService.success(
  "el producto ha sido registrado!",
  "Producto registrado",
  { timeOut: 4000, closeButton: true, progressBar: true }
);

	toastRejectPixelsImg: any = this.toastyService.error(
  "No pudimos subir algunas de tus imágenes\n Deben tener formato jpg o png\n Deben tener más de 700 píxeles en uno de sus lados.",
  "Dimension de imagen",
  { timeOut: 8000, closeButton: true, progressBar: true }
);



	constructor(
		public formBuilder: UntypedFormBuilder,
		private apiService: ApiService,
		private cookieService: CookieService,
		private toastyService: ToastrService,
		private router: Router,
	) { }



	ngOnInit() {
		this.productForm = this.formBuilder.group({
			name_product: ['', [Validators.required]],
			description_product: ['', [Validators.required]],
			product_code: ['', [Validators.required]],
			stock: ['', [Validators.required,Validators.pattern("^[0-9]*$")]],
			categoryCtrl: new UntypedFormControl('', [Validators.required]),
			subcategoryCtrl: new UntypedFormControl('', [Validators.required]),
			brand: ['', [Validators.required]],
			// discount_price: ['', [Validators.required]],
			total_price: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
			availa: new UntypedFormControl('', [Validators.required]),
		});

		// Inicializar el observable de subcategorías con un array vacío
		this.sub_catego$ = of([]);

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
			(			error: any) => console.log(error)
		);
		// END ANGULAR MAT SEARCH CATEGORIES

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


	onRemove(event: File) {
		console.log('Removing file:', event);
		const index = this.files.indexOf(event);
		if (index > -1) {
			this.files.splice(index, 1);
		}
	}

	selectFile(event: { addedFiles: number | any[]; } | any) {
		console.log('selectFile called with event:', event);
		console.log('Event type:', typeof event);
		console.log('Event keys:', event ? Object.keys(event) : 'null');
		this.validate_img = false;
		this.obligatory_img = false;
		
		// Handle different event types from ngx-dropzone
		let addedFiles: File[] = [];
		
		// ngx-dropzone puede pasar los archivos de diferentes formas
		if (event && event.addedFiles && Array.isArray(event.addedFiles)) {
			addedFiles = event.addedFiles;
			console.log('Files from event.addedFiles:', addedFiles.length);
		} else if (Array.isArray(event)) {
			addedFiles = event;
			console.log('Event is array:', addedFiles.length);
		} else {
			console.log('Unknown event structure:', event);
		}
		
		console.log('Processed files count:', addedFiles.length);
		
		if (Array.isArray(addedFiles) && addedFiles.length > 0) {
			// Validate and add each file
			addedFiles.forEach((file: File) => {
				console.log('Processing file:', file.name, file.type, file.size);
				
				// Verificar que sea una imagen
				if (!file.type || !file.type.startsWith('image/')) {
					this.validate_img = true;
					this.toastyService.error('Solo se permiten archivos de imagen (JPG, PNG)');
					return;
				}
				
				// Check if file is already in the array
				const fileExists = this.files.some(f => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified);
				if (fileExists) {
					console.log('File already exists:', file.name);
					return;
				}
				
				// Validar dimensiones
				this.onValidatePixels(file)
					.then((isValid) => {
						if (isValid) {
							this.files.push(file);
							console.log('✅ Imagen agregada exitosamente:', file.name);
							console.log('Total files:', this.files.length);
						} else {
							this.validate_img = true;
							this.toastyService.error(this.toastRejectPixelsImg);
						}
					})
					.catch((error) => {
						console.error('Error validating image:', error);
						this.validate_img = true;
						this.toastyService.error('Error al validar la imagen');
					});
			});
		} else {
			console.log('⚠️ No files to process. Event structure:', JSON.stringify(event, null, 2));
		}
	}

	//START SET EVENT FROM DROPZONE COMPLEMENT
	selectFileOld(event: any) {
		this.obligatory_img = false;
		this.validate_img = false;
		
		// Handle the event properly - event should have addedFiles property
		const addedFiles = event.addedFiles || [];
		Promise.all(addedFiles.map(async (item: File) => {
			try {
				const isValid = await this.onValidatePixels(item);
				if (isValid) {
					this.files.push(item);
				} else {
					this.validate_img = true;
					this.toastyService.error('Image dimensions must be at least 100x100 pixels');
				}
			} catch (error) {
				console.error('Error validating image:', error);
				this.toastyService.error('Error validating image');
			}
		}));

	}


	onValidatePixels(file: File): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const Img = new Image();
			Img.src = URL.createObjectURL(file);
			Img.onload = (e: any) => {
				const height = Img.height;
				const width = Img.width;
				// Validar que al menos uno de los lados tenga el mínimo requerido
				if (height >= this.heightMin || width >= this.widthMin) {
					resolve(true);
				} else {
					resolve(false);
				}
				URL.revokeObjectURL(Img.src);
			};
			Img.onerror = () => {
				reject(new Error('Error al cargar la imagen'));
			};
		});

	}
	//END SET EVENT FROM DROPZONE COMPLEMENT


	subcategoriesChangeAction(categori_id: any) {
		// START ANGULAR MAT SEARCH SUBCATEGORIES
		// Extraer el ID de la categoría - puede venir como número directo o como objeto
		let id_category: any;
		
		if (typeof categori_id === 'number' || typeof categori_id === 'string') {
			// Si viene como número o string directo
			id_category = categori_id;
		} else if (categori_id && typeof categori_id === 'object') {
			// Si viene como objeto, extraer el ID
			id_category = categori_id.id || categori_id.value?.id || categori_id.value;
		} else {
			id_category = null;
		}
		
		// Convertir a número si es string
		if (id_category && typeof id_category === 'string') {
			id_category = parseInt(id_category, 10);
		}
		
		console.log('Category ID received:', categori_id, 'Extracted ID:', id_category);
		
		// Limpiar la subcategoría seleccionada cuando se cambia la categoría
		this.selectedSubcategory = null;
		this.subcategoryCtrl.setValue(null);
		this.subcategoryFilterCtrl.setValue(null);
		
		// Inicializar con array vacío mientras se cargan las subcategorías
		this.subcategories = [];
		this.sub_catego$ = of([]);
		
		if (!id_category || isNaN(id_category)) {
			console.log('No valid category ID provided:', id_category);
			return;
		}
		
		this.apiService.getSubCategories(id_category).subscribe(
			(data: Subcategory[]) => {
				this.subcategorieslist = data || [];
				this.subcategories = [];
				
				if (this.subcategorieslist.length > 0) {
					for (var i in this.subcategorieslist) {
						let get_id_subcategory = this.subcategorieslist[i]['id'];
						let get_name_subcategory = this.subcategorieslist[i]['name_subcategory'];
						this.subcategories.push({ id: get_id_subcategory, name_subcategory: get_name_subcategory });
					}
				}
				
				// Actualizar el observable con las subcategorías (puede estar vacío)
				this.sub_catego$ = this.getSubcategories("", this.subcategories);
				console.log('Subcategorías cargadas:', this.subcategories.length);
			},
			(error: any) => {
				console.error('Error loading subcategories:', error);
				// En caso de error, inicializar con array vacío
				this.subcategories = [];
				this.sub_catego$ = of([]);
			}
		);
		// END ANGULAR MAT SEARCH SUBCATEGORIES

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
		this.obligatory_img = false;
		this.validate_img = false;
		
		// Validar que hay al menos una imagen
		if (this.files.length === 0) {
			this.obligatory_img = true;
			this.toastyService.error('Debes cargar al menos una imagen del producto');
			return;
		}

		// Validar que el formulario es válido
		if (!this.productForm.valid) {
			// Marcar todos los campos como touched para mostrar errores
			Object.keys(this.productForm.controls).forEach(key => {
				this.productForm.get(key)?.markAsTouched();
			});
			this.toastyService.error('Por favor completa todos los campos obligatorios');
			return;
		}

		// Validar que se haya seleccionado una subcategoría
		if (!this.selectedSubcategory) {
			this.toastyService.error('Por favor selecciona una subcategoría');
			return;
		}

		// Validar que se haya seleccionado disponibilidad
		if (this.selectedAvaila === null || this.selectedAvaila === undefined) {
			this.toastyService.error('Por favor selecciona la disponibilidad del producto');
			return;
		}

		this.btnDisabled = true;
		this.show = !this.show;
		
		let myObj_product;
		let values_productForm = this.productForm.value;
		const id_store = localStorage.getItem('id-store');

		if (!id_store) {
			this.toastyService.error('Error: No se encontró la tienda');
			this.btnDisabled = false;
			return;
		}

		myObj_product = {
			"name_product": values_productForm.name_product,
			"description_product": values_productForm.description_product,
			"product_code": values_productForm.product_code,
			"total_price": values_productForm.total_price,
			"availability": this.selectedAvaila,
			"stock": values_productForm.stock,
			"store": id_store,
			"brand": values_productForm.brand,
			"subcategory_id": this.selectedSubcategory,
			"features": 'na',
			"state": 1,
			"image": '1',
			"published": 'false'
		};

		// START CREATE REGISTER PRODUCT ON THE DB
		this.apiService.setProduct(myObj_product).subscribe(
			result => {
				try {
					let myJSON = JSON.stringify(result);
					let obj = JSON.parse(myJSON);
					let id_product = obj.id_product;
					let get_first_image_name = '';

					if (!id_product) {
						throw new Error('No se pudo obtener el ID del producto');
					}

					// START UPLOAD IMAGES ON S3 AWS ASSOCIATE TO THE PRODUCT
					let consec = 0;
					let uploadErrors = 0;
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
									// Update main image
									this.apiService.updateImageProduc(get_first_image_name, id_product).subscribe(
										result => {
											this.toastyService.success('Producto creado exitosamente');
											this.router.navigate(['/account/product_adm']);
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
								uploadErrors++;
								if (uploadErrors === this.files.length) {
									this.toastyService.error('Error al subir las imágenes');
									this.btnDisabled = false;
								}
							}
						);
					}
					// END UPLOAD IMAGES ON S3 AWS ASSOCIATE TO THE PRODUCT
				} catch (error) {
					console.error('Error processing product creation:', error);
					this.toastyService.error('Error al procesar la creación del producto');
					this.btnDisabled = false;
				}
			},
			error => {
				console.error('Error creating product:', error);
				this.toastyService.error('Error al crear el producto. Inténtalo de nuevo.');
				this.btnDisabled = false;
			}
		);
		// END CREATE REGISTER PRODUCT ON THE DB
	}

	/**
 * getImagePath is used to change the image path on click event.
 */
	public getImagePath(imgPath: string, index: number) {
		const borderActiveElement = document.querySelector('.border-active');
		if (borderActiveElement) {
		    borderActiveElement.classList.remove('border-active');
		}
		if (imgPath !== null && imgPath !== undefined) {
		    this.mainImgPath = imgPath;
		}
		
		if (index !== null && index !== undefined) {
		    const element = document.getElementById(`${index}_img`);
		    if (element) {
		        element.className += " border-active";
		    }
		}
	}

}


