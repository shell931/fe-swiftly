import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { RatingComponent } from '../../../Global/Rating/Rating.component';
import { ApiService } from '../../../Services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SweetAlertOptions } from 'sweetalert2';

const { isArray } = Array;

export interface Prod {
	image: string;
	name_product: string;
	total_price: string;
	produc_code: string;
	brand: string;
	product_code: string;
	id_product: any;
}

export interface Card {
	title: string;
	subtitle: string;
	text: string;
}

// CLASS TO FILTER AND PAGINATE
@Pipe({
	name: 'filter',
	standalone: true
})
export class FilterPipe implements PipeTransform {

	get_product: Prod[] = [];
	productsGrid: any;
	id: any;

	constructor(private route: ActivatedRoute,
		private router: Router,
		private apiService: ApiService,
		private changeDetectorRef: ChangeDetectorRef
	) { }

	transform(posts: Card[], find: string): Card[] {
		this.route.params.subscribe(res => {
			this.id = res.id;
		})
		// this.apiService.getProductStoresbyStoreid(this.id).subscribe(res => this.getProductData(res, posts, find, this.id));
		const id_store = localStorage.getItem('id-store');
		this.apiService.getProductsbyStoreid(id_store).subscribe((res: any) => this.getProductData(res, posts, find, id_store));
		if (!posts) return [];
		if (!find) return posts;
		find = find.toLowerCase();
		return search(this.productsGrid, find);
	}

	getProductData(response: string | any[], posts: Card[], find: string, store_id: string | null) {
		this.get_product = [];
		for (var i = 0; i < response.length; i++) {
			let get_image = environment.api.baseBucketImageUrl + response[i].image;
			let get_name_product = response[i].name_product;
			let get_total_price = response[i].total_price;
			let get_produc_code = response[i].product_code;
			let get_brand = response[i].brand;
			let get_product_code = response[i].product_code;
			let get_discount_price = response[i].discount_price;
			let get_id_product = response[i].id_product;
			this.get_product.push({
				image: get_image,
				name_product: get_name_product,
				total_price: get_total_price,
				produc_code: get_produc_code,
				brand: get_brand,
				product_code: get_product_code,
				id_product: get_id_product
			});
		}
		this.productsGrid = this.get_product;
	}
}

function search(entries: any[], search: string) {
	search = search.toLowerCase();
	return entries.filter(function (obj) {
		const keys: string[] = Object.keys(obj);
		return keys.some(function (key) {
			const value = obj[key];
			if (isArray(value)) {
				return value.some(v => {
					return v.toLowerCase().includes(search);
				});
			}
			else if (!isArray(value)) {
				return value.toString().toLowerCase().includes(search);
			}
		})
	});
}


@Component({
	selector: 'app-ProductsAdm',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		MatTableModule,
		MatSortModule,
		MatPaginatorModule,
		MatCardModule,
		MatIconModule,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		MatListModule,
		SweetAlert2Module,
		RatingComponent,
		CurrencyPipe
	],
	templateUrl: './ProductsAdm.component.html',
	styleUrls: ['./ProductsAdm.component.scss']
})

export class ProductsAdm implements OnInit {


	get_menu: Prod[] = [];
	productsList: any;
	popUpDeleteUserResponse: any;
	showType: string = 'grid';
	displayedProductColumns: string[] = ['action', 'id', 'image', 'name', 'brand', 'category', 'product_code', 'discount_price', 'price'];
	searchText:any;
	p:any;
	loaded: boolean = true; // Add missing property
	card: any; // Add missing property for template reference

	@ViewChild(MatPaginator, { static: false })
	paginator: MatPaginator = new MatPaginator;
	@ViewChild(MatSort, { static: false })
	sort: MatSort = new MatSort;
	productsGrid: Prod[] = [];
	dataSource = new MatTableDataSource<Prod>(this.productsGrid);
	obs: Observable<any> | undefined;
	alertOpt: SweetAlertOptions = {};

	toastdeleteproduct: any = this.toastyService.success(
  "el producto ha sido eliminado!",
  "producto eliminado",
  { timeOut: 4000, closeButton: true, progressBar: true }
);

	toastfaildeleteproduct: any = this.toastyService.error(
  "Fallo eliminacion",
  "Fallo eliminación del producto o servicio contacte con el administrador!",
  { timeOut: 8000, closeButton: true, progressBar: true }
);

	

	constructor(
		public translate: TranslateService,
		private router: Router,
		private apiService: ApiService,
		private cookieService: CookieService,
		private toastyService: ToastrService,
		private changeDetectorRef: ChangeDetectorRef
	) { }

	ngOnInit() {
		const id_store = localStorage.getItem('id-store');
		this.apiService.getProductsbyStoreid(id_store).subscribe((res: any) => this.getProductData(res));
	}


	getProductData(response: string | any[]) {
		this.productsGrid = [];
		this.get_menu = [];
		for (var i = 0; i < response.length; i++) {
			let get_image = environment.api.baseBucketImageUrl + response[i].image;
			let get_name_product = response[i].name_product;
			let get_total_price = response[i].total_price;
			let get_produc_code = response[i].product_code;
			let get_brand = response[i].brand;
			let get_product_code = response[i].product_code;
			let get_discount_price = response[i].discount_price;
			let get_id_product = response[i].id_product;
			this.get_menu.push({
				image: get_image,
				name_product: get_name_product,
				total_price: get_total_price,
				produc_code: get_produc_code,
				brand: get_brand,
				product_code: get_product_code,
				id_product: get_id_product
			});
		}
		this.productsGrid = this.get_menu;

		this.dataSource = new MatTableDataSource<Prod>(this.productsGrid);
		this.setupFilterPredicate(this.dataSource);
		this.changeDetectorRef.detectChanges();
		this.dataSource.paginator = this.paginator;
		this.obs = this.dataSource.connect();
	}

	//getProductResponse method is used to get the response of all products.
	public getProductResponse(response: { men: string | any[]; women: any; gadgets: any; accessories: any; }) {
		let products = ((response.men.concat(response.women)).concat(response.gadgets)).concat(response.accessories);
	}

	/**
* productShowType method is used to select the show type of product.
*/
	productShowType(type: string) {
		this.showType = type;
		if (type === 'list') {
			this.productsList = new MatTableDataSource(this.productsGrid);
			this.setupFilterPredicate(this.productsList);
			setTimeout(() => {
				this.productsList.paginator = this.paginator;
				this.productsList.sort = this.sort;
			}, 0);
		} else {
			this.dataSource = new MatTableDataSource<Prod>(this.productsGrid);
			this.setupFilterPredicate(this.dataSource);
			this.changeDetectorRef.detectChanges();
			this.dataSource.paginator = this.paginator;
			this.obs = this.dataSource.connect();
		}
	}

	/**
  * onEditProduct method is used to open the edit page and edit the product.
  */
	// onEditProduct(data) {
	// 	console.log(data.id_product);

	// 	this.router.navigate(['/admin-panel/product-edit', data.type, data.id_product]);
	// 	this.adminPanelService.editProductData = data;
	// }


	setupFilterPredicate(dataSource: MatTableDataSource<Prod>) {
		dataSource.filterPredicate = (data: Prod, filter: string) => {
			const searchStr = filter.toLowerCase();
			const nameMatch = data.name_product?.toLowerCase().includes(searchStr) || false;
			const brandMatch = data.brand?.toLowerCase().includes(searchStr) || false;
			const productCodeMatch = data.product_code?.toLowerCase().includes(searchStr) || false;
			const producCodeMatch = data.produc_code?.toLowerCase().includes(searchStr) || false;
			const priceMatch = data.total_price?.toString().toLowerCase().includes(searchStr) || false;
			const idMatch = data.id_product?.toString().toLowerCase().includes(searchStr) || false;
			
			return nameMatch || brandMatch || productCodeMatch || producCodeMatch || priceMatch || idMatch;
		};
	}

	applyFilter(filterValue: string | Event) {
		let value: string = '';
		
		// Handle both Event and string types
		if (typeof filterValue === 'string') {
			value = filterValue;
		} else if (filterValue && filterValue.target) {
			value = (filterValue.target as HTMLInputElement).value;
		}
		
		value = value.trim().toLowerCase();
		
		// Apply filter to list view
		if (this.showType === 'list' && this.productsList) {
			this.productsList.filter = value;
			if (this.productsList.paginator) {
				this.productsList.paginator.firstPage();
			}
		}
		
		// Apply filter to grid view
		if (this.showType === 'grid' && this.dataSource) {
			this.dataSource.filter = value;
			if (this.dataSource.paginator) {
				this.dataSource.paginator.firstPage();
			}
		}
	}

	/**
* getDeleteResponse method is used to delete a product from the product list.
*/
	getDeleteResponse(data: { name_product: any; id_product: any; }) {
		console.log(data.name_product);
		
		if (this.showType == 'grid') {
			let id_product = data.id_product;
			this.apiService.deleteProduct(id_product).subscribe(
				(result: any) => {
					if (result.result === 200) {
						window.location.reload();
					} else {
						this.toastyService.error(this.toastfaildeleteproduct);
					}
				},
				error => console.log(error)
			);
		} 
		// else if (this.showType == 'list') {
		// 	let id_product = this.productsGrid[i];
		// 	id_product = id_product["id_product"];
		// 	this.apiService.deleteProduct(id_product).subscribe(
		// 		result => {
		// 			if (result["result"] == 200) {
		// 				window.location.reload();
		// 			} else {
		// 				this.toastyService.error(this.toastfaildeleteproduct);
		// 			}
		// 		},
		// 		error => console.log(error)
		// 	);

		// }
	}

}



