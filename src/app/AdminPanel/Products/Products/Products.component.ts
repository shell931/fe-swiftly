import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { ApiService } from '../../../Services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { environment } from '../../../../../src/environments/environment';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSortModule } from '@angular/material/sort';
import { RatingComponent } from '../../../Global/Rating/Rating.component';

const { isArray } = Array;

export interface Prod {
    image: string;
    name_product: string;
    total_price: string;
    produc_code: string;
    brand: string;
    product_code: string;
    discount_price: string;
    id_product: any;
    type?: string; // Added optional type property
}

export interface Card {
    title: string;
    subtitle: string;
    text: string;
}

@Component({
    selector: 'app-products',
    templateUrl: './Products.component.html',
    styleUrls: ['./Products.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        MatToolbarModule,
        MatSortModule,
        CurrencyPipe,
        TranslatePipe,
        RatingComponent
    ]
})

export class ProductsComponent implements OnInit {
    get_menu: Prod[] = [];
    productsList: MatTableDataSource<Prod> = new MatTableDataSource<Prod>([]); // Explicitly specify Prod type
    productsGrid: Prod[] = [];
    popUpDeleteUserResponse: string = ''; // Initialized
    showType: string = 'grid';
    displayedProductColumns: string[] = ['id', 'image', 'name', 'brand', 'category', 'product_code', 'discount_price', 'price', 'action'];
    searchText: string = '';
    loaded: boolean = true;
    i: number = 0;
    p: number = 1;

    @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort?: MatSort;
    dataSource = new MatTableDataSource<Prod>(this.productsGrid);
    obs?: Observable<any>;

    constructor(public translate: TranslateService,
        private router: Router,
        private adminPanelService: AdminPanelServiceService,
        private apiService: ApiService,
        private cookieService: CookieService,
        private toastyService: ToastrService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    toastdeleteproduct: any = this.toastyService.info(
        "El producto o servicio a sido eliminado!",
        "Producto eliminado",
        { timeOut: 8000, closeButton: true, progressBar: true }
    );

    toastfaildeleteproduct: any = this.toastyService.error(
        "Fallo eliminación del producto o servicio contacte con el administrador!",
        "Fallo eliminacion",
        { timeOut: 8000, closeButton: true, progressBar: true }
    );

    ngOnInit() {
        const id_store = localStorage.getItem('id-store');
        if (id_store) { // Check if id_store is not null
            this.apiService.getProductsbyStoreid(id_store).subscribe((res: Prod[]) => this.getProductData(res));
        }
    }

    getProductData(response: Prod[]) {
        this.productsGrid = []; // Reset to empty array instead of null
        this.get_menu = [];
        for (const item of response) {
            const get_image = environment.api.baseBucketImageUrl + item.image;
            const get_name_product = item.name_product;
            const get_total_price = item.total_price;
            const get_produc_code = item.product_code;
            const get_brand = item.brand;
            const get_product_code = item.product_code;
            const get_discount_price = item.discount_price;
            const get_id_product = item.id_product;
            this.get_menu.push({
                image: get_image,
                name_product: get_name_product,
                total_price: get_total_price,
                produc_code: get_produc_code,
                brand: get_brand,
                product_code: get_product_code,
                discount_price: get_discount_price,
                id_product: get_id_product
            });
        }
        this.productsGrid = this.get_menu;

        this.dataSource = new MatTableDataSource<Prod>(this.productsGrid);
        this.changeDetectorRef.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.obs = this.dataSource.connect();
    }

    public getProductResponse(response: any) {
        let products = ((response.men.concat(response.women)).concat(response.gadgets)).concat(response.accessories);
    }

    productShowType(type: string) {
        this.showType = type;
        if (type === 'list') {
            const listElement = document.getElementById('list');
            const gridElement = document.getElementById('grid');
            if (listElement && gridElement) {
                listElement.classList.add("active");
                gridElement.classList.remove('active');
                this.productsList = new MatTableDataSource<Prod>(this.productsGrid);
                setTimeout(() => {
                    this.productsList.paginator = this.paginator;
                    this.productsList.sort = this.sort;
                }, 0);
            }
        } else {
            this.dataSource = new MatTableDataSource<Prod>(this.productsGrid);
            this.changeDetectorRef.detectChanges();
            this.dataSource.paginator = this.paginator;
            this.obs = this.dataSource.connect();
            const gridElement = document.getElementById('grid');
            const listElement = document.getElementById('list');
            if (gridElement && listElement) {
                gridElement.classList.add("active");
                listElement.classList.remove('active');
            }
        }
    }

    onEditProduct(data: Prod) {
        console.log(data.id_product);
        this.router.navigate(['/admin-panel/product-edit', data.type || '', data.id_product]);
        this.adminPanelService.editProductData = data;
    }

    deleteProduct(i: number) {                
        this.adminPanelService.deleteDialog("Estas seguro de eliminar este produto permanentemente?")
            .subscribe((res: string) => { this.popUpDeleteUserResponse = res },
                err => console.log(err),
                () => this.getDeleteResponse(this.popUpDeleteUserResponse, i));
    }

    applyFilter(filterValue: string) {
        this.productsList.filter = filterValue.trim().toLowerCase();
        if (this.productsList.paginator) {
            this.productsList.paginator.firstPage();
        }
    }

    getDeleteResponse(response: string, i: number) {    
        if (response === "yes") {
            if (this.showType === 'grid') {
                const id_product = this.productsGrid[i].id_product;
                this.apiService.deleteProduct(id_product).subscribe(
                    (result: any) => { // Changed to any type
                        console.log('API Response:', result); // Log the API response for debugging
                        if (result && result.result === 200) { // Check if 'result' exists and equals 200
                            window.location.reload();                    
                        } else {
                            this.toastyService.error(this.toastfaildeleteproduct);
                        }
                    },
                    error => console.log(error)
                );
            } else if (this.showType === 'list') {
                const id_product = this.productsGrid[i].id_product;
                this.apiService.deleteProduct(id_product).subscribe(
                    (result: any) => { // Changed to any type
                        console.log('API Response:', result); // Log the API response for debugging
                        if (result && result.result === 200) { // Check if 'result' exists and equals 200
                            window.location.reload();                    
                        } else {
                            this.toastyService.error(this.toastfaildeleteproduct);
                        }
                    },
                    error => console.log(error)
                );
            }
        }
    }
}

// CLASS TO FILTER AND PAGINATE
@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {

    get_product: Prod[] = [];
    productsGrid: Prod[] = [];
    id: string = ''; // Initialized

    constructor(private route: ActivatedRoute,
        private router: Router,
        private apiService: ApiService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    transform(posts: Card[], find: string): Card[] {
        this.route.params.subscribe((res: Params) => {
            this.id = res.id || '';
        });
        const id_store = localStorage.getItem('id-store');
        if (id_store) { // Check if id_store is not null
            this.apiService.getProductsbyStoreid(id_store).subscribe((res: Prod[]) => this.getProductData(res, posts, find, id_store));
        }
        if (!posts) return [];
        if (!find) return posts;
        find = find.toLowerCase();
        return search(this.productsGrid, find);
    }

    getProductData(response: Prod[], posts: Card[], find: string, store_id: string) {
        this.get_product = [];
        for (const item of response) {
            const get_image = environment.api.baseBucketImageUrl + item.image;
            const get_name_product = item.name_product;
            const get_total_price = item.total_price;
            const get_produc_code = item.product_code;
            const get_brand = item.brand;
            const get_product_code = item.product_code;
            const get_discount_price = item.discount_price;
            const get_id_product = item.id_product;
            this.get_product.push({
                image: get_image,
                name_product: get_name_product,
                total_price: get_total_price,
                produc_code: get_produc_code,
                brand: get_brand,
                product_code: get_product_code,
                discount_price: get_discount_price,
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

