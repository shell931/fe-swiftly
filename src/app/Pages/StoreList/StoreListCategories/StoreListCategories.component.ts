import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { EmbryoService } from '../../../Services/Embryo.service';
import { ApiService } from '../../../Services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';
import { environment } from '../../../../../src/environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
// import { NgxPaginationModule } from 'ngx-pagination'; // Temporarily disabled for standalone compatibility

const { isArray } = Array;

export interface Prod {
    image: string;
    name: string;
    price: string;
    produc_code: string;
    brand: string;
    product_code: string;
    discount_price: string;
    id_product: string;
    route_product: string;
    id_store: string;
    descriptions: string[];
    store_id: number;
}

export interface Card {
    title: string;
    subtitle: string;
    text: string;
}

interface subcategoryNode {
    id: number;
    name_category: string;
    children?: subcategoryNode[];
}

export interface Store {
    id_store: string;
    name_store: string;
    state_store: string;
    city: string;
    logo_store: string;
    route_store: string;
    description: string;
}

@Component({
    selector: 'app-StoreListCategoriesPage',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatPaginatorModule,
        MatTreeModule
    ],
    templateUrl: './StoreListCategories.component.html',
    styleUrls: ['./StoreListCategories.component.scss']
})

export class StoreListCategoriesComponent implements OnInit {

    treeControl = new NestedTreeControl<subcategoryNode>(node => node.children);
    dataSourceTree = new MatTreeNestedDataSource<subcategoryNode>();
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    productsGrid: Prod[] = [];
    dataSource = new MatTableDataSource<Prod>(this.productsGrid);
    obs: Observable<any>;
    id: any;
    get_product: Prod[] = [];
    loaded = false;
    @Output() addToCart: EventEmitter<any> = new EventEmitter();
    @Output() addToWishList: EventEmitter<any> = new EventEmitter();
    get_subca: any[] = [];
    get_categories: subcategoryNode[] = [];
    get_store: Store[] = [];
    storeGrid: Store[] = [];
    obsStore: Observable<any>;
    dataSourceStore = new MatTableDataSource<Store>(this.storeGrid);
    searchText:any;
    p:any;

    constructor(private route: ActivatedRoute,
        private router: Router,
        public embryoService: EmbryoService,
        private apiService: ApiService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit() {        

        this.route.params.subscribe(res => {
            this.id = res.id;
            // Cargar tiendas filtradas por categoría si hay un id
            if (this.id) {
                this.apiService.getStoreWithoutAuthbyIdCategory(this.id).subscribe(res => this.getStoreData(res));
            } else {
                this.apiService.getStoreWithoutAuth().subscribe(res => this.getStoreData(res));
            }
        })
        this.apiService.getStoreCategories().subscribe(res => this.getCategoriesMenu(res, this.id));
    }

    getCategoriesMenu(response, id_store) {
        this.get_categories = [];
        for (var i = 0; i < response.length; i++) {
            // let subcategor = this.createSubcategories(response[i].rel_categories, id_store);
            this.get_categories.push(
                {
                    id: response[i].id,
                    name_category: response[i].name_category
                    // type: 'category',
                    // children: subcategor,
                });
        }

        this.dataSourceTree.data = this.get_categories;

        
    }

 

    // createSubcategories(subcate, id_store) {
    //     this.get_subca = [];
    //     for (var i = 0; i < subcate.length; i++) {
    //         this.get_subca.push(
    //             {
    //                 id_store: id_store,
    //                 id: subcate[i].id,
    //                 name_category: subcate[i].name_subcategory,
    //                 type: 'subcategory'
    //             },
    //         );
    //     }
    //     return this.get_subca;
    // }


    getStoreData(response) {
        this.storeGrid = null;
        this.get_store = [];
        for (var i = 0; i < response.length; i++) {
            let get_id_store = response[i].id_store;
            let get_name_store = response[i].name_store;
            let get_state_store = response[i].state_store;
            let get_city = response[i].city;
            let get_logo_store = response[i].logo_store;
            let get_description = response[i].description;
            this.get_store.push({
                id_store: get_id_store,
                name_store: get_name_store,
                state_store: get_state_store,
                city: get_city,
                logo_store: environment.api.baseBucketImageUrl + response[i].logo_store_up,
                route_store: '/storefront/' + get_id_store,
                description: get_description,
            });
        }
        this.storeGrid = this.get_store;
        this.dataSourceStore = new MatTableDataSource<Store>(this.storeGrid);
        this.changeDetectorRef.detectChanges();
        this.dataSourceStore.paginator = this.paginator;
        this.obsStore = this.dataSourceStore.connect();
        // Aplicar filtro si hay texto de búsqueda
        if (this.searchText) {
            this.applyFilter();
        }
    }

    public onLoad() {
        this.loaded = true;
     }

    trackByStoreId(index: number, item: Store): any {
        return item?.id_store || index;
    }

    /**
     * Aplica el filtro de búsqueda a las tiendas
     */
    applyFilter(): void {
        try {
            // Verificar que hay tiendas
            if (!this.storeGrid || !Array.isArray(this.storeGrid) || this.storeGrid.length === 0) {
                this.dataSourceStore.data = [];
                this.dataSourceStore.paginator = this.paginator;
                this.obsStore = this.dataSourceStore.connect();
                return;
            }
            
            // Obtener el texto de búsqueda de forma segura
            const searchValue = (this.searchText || '').trim().toLowerCase();
            
            // Si no hay texto, mostrar todas
            if (!searchValue) {
                this.dataSourceStore.data = this.storeGrid;
            } else {
                // Filtrar por nombre, descripción o estado
                const filtered = this.storeGrid.filter(store => {
                    if (!store) return false;
                    
                    // Convertir a string antes de toLowerCase
                    const name = String(store.name_store || '').toLowerCase();
                    const desc = String(store.description || '').toLowerCase();
                    const state = String(store.state_store || '').toLowerCase();
                    const city = String(store.city || '').toLowerCase();
                    
                    return name.includes(searchValue) || 
                           desc.includes(searchValue) || 
                           state.includes(searchValue) ||
                           city.includes(searchValue);
                });
                
                this.dataSourceStore.data = filtered;
            }
            
            // Actualizar el paginador
            this.dataSourceStore.paginator = this.paginator;
            this.obsStore = this.dataSourceStore.connect();
            this.changeDetectorRef.detectChanges();
        } catch (error) {
            console.error('Error applying filter:', error);
        }
    }


}

// CLASS TO FILTER AND PAGINATE
// @Pipe({
//     name: 'filter'
// })
// export class FilterPipe implements PipeTransform {

//     get_product: Prod[] = [];
//     productsGrid: any;
//     id: any;
//     get_store: Store[] = [];
//     storeGrid: Store[] = [];
//     obsStore: Observable<any>;
//     dataSourceStore = new MatTableDataSource<Store>(this.storeGrid);
//     @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

//     constructor(private route: ActivatedRoute,
//         private router: Router,
//         public embryoService: EmbryoService,
//         private apiService: ApiService,
//         private changeDetectorRef: ChangeDetectorRef
//     ) { }

//     transform(posts: Card[], find: string): Card[] {
//         this.route.params.subscribe(res => {
//             this.id = res.id;
//         })
//         // this.apiService.getProductStoresbyStoreid(this.id).subscribe(res => this.getStoreData(res, posts, find, this.id));
//         this.apiService.getStoreWithoutAuth().subscribe(res => this.getStoreData(res, posts, find, this.id));
//         if (!posts) return [];
//         if (!find) return posts;
//         find = find.toLowerCase();
//         return search(this.storeGrid, find);
//     }

//     getStoreData(response, posts, find, store_id) {
//         this.storeGrid = null;
//         this.get_store = [];
//         for (var i = 0; i < response.length; i++) {
//             let get_id_store = response[i].id_store;
//             let get_name_store = response[i].name_store;
//             let get_state_store = response[i].state_store;
//             let get_city = response[i].city;
//             let get_logo_store = response[i].logo_store;
//             let get_description = response[i].description;

//             this.get_store.push({
//                 id_store: get_id_store,
//                 name_store: get_name_store,
//                 state_store: get_state_store,
//                 city: get_city,
//                 logo_store: environment.api.baseBucketImageUrl + response[i].logo_store_up,
//                 route_store: '/storefront/' + get_id_store,
//                 description: get_description,

//             });
//         }
//         this.storeGrid = this.get_store;
//         this.dataSourceStore = new MatTableDataSource<Store>(this.storeGrid);
//         this.changeDetectorRef.detectChanges();
//         this.dataSourceStore.paginator = this.paginator;
//         this.obsStore = this.dataSourceStore.connect();
//     }
    
// }


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

