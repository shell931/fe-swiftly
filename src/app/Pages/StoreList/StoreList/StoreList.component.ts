import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { EmbryoService } from '../../../Services/Embryo.service';
import { ApiService } from '../../../Services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';

import { NgxPaginationModule } from 'ngx-pagination';

import { environment } from '../../../../../src/environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
    icon:any;
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
    selector: 'app-StoreListPage',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatPaginatorModule,
        MatTreeModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './StoreList.component.html',
    styleUrls: ['./StoreList.component.scss']
})

export class StoreListComponent implements OnInit {

    treeControl = new NestedTreeControl<subcategoryNode>(node => node.children);
    dataSourceTree = new MatTreeNestedDataSource<subcategoryNode>();
    @ViewChild(MatPaginator, { static: false })
    paginator!: MatPaginator;
    productsGrid: Prod[] = [];
    dataSource = new MatTableDataSource<Prod>(this.productsGrid);
    obs!: Observable<any>;
    id: any;
    get_product: Prod[] = [];
    loaded = false;
    @Output() addToCart: EventEmitter<any> = new EventEmitter();
    @Output() addToWishList: EventEmitter<any> = new EventEmitter();
    get_subca: any[] = [];
    get_categories: subcategoryNode[] = [];
    get_store: Store[] = [];
    storeGrid: Store[] = [];
    filteredStores: Store[] = [];
    paginatedStores: Store[] = [];
    obsStore: Observable<Store[]> = of([]);
    dataSourceStore = new MatTableDataSource<Store>([]);
    searchText: string = '';
    pageSize: number = 8;
    currentPage: number = 0;
    
    // Función para mezclar array aleatoriamente
    private shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
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
        })
        localStorage.removeItem("id_category");
        
        this.apiService.getStoreWithoutAuth().subscribe((res: any) => this.getStoreData(res));
        this.apiService.getStoreCategories().subscribe((res: any) => this.getCategoriesMenu(res, this.id));
    }

    GetProductCategory(id_category: string){        
        localStorage.removeItem("id_category");
        localStorage.setItem('id_category', id_category);
        this.apiService.getStorebyCategory(id_category).subscribe((res: any) => this.getStoreData(res));        
    }

    getCategoriesMenu(response: string | any[], id_store: any) {
        this.get_categories = [];
        for (var i = 0; i < response.length; i++) {
            this.get_categories.push(
                {
                    id: response[i].id,
                    name_category: response[i].name_category,
                    icon: response[i].icon
                });
        }

        this.dataSourceTree.data = this.get_categories;
    }


    getStoreData(response: string | any[]) {
        try {
            this.storeGrid = [];
            this.get_store = [];
            
            if (!response || !Array.isArray(response)) {
                this.filteredStores = [];
                this.dataSourceStore.data = [];
                this.updatePaginator();
                return;
            }
            
            for (var i = 0; i < response.length; i++) {
                if (response[i]) {
                    this.get_store.push({
                        id_store: response[i].id_store || '',
                        name_store: response[i].name_store || '',
                        state_store: response[i].state_store || '',
                        city: response[i].city || '',
                        logo_store: environment.api.baseBucketImageUrl + (response[i].logo_store_up || ''),
                        route_store: '/storefront/' + (response[i].id_store || ''),
                        description: response[i].description || '',
                    });
                }
            }
            
            this.storeGrid = this.get_store;
            // Mezclar aleatoriamente al inicio
            if (this.storeGrid.length > 0) {
                this.filteredStores = this.shuffleArray([...this.storeGrid]);
            } else {
                this.filteredStores = [];
            }
            
            // Actualizar el dataSource con las tiendas filtradas
            this.dataSourceStore.data = this.filteredStores;
            this.currentPage = 0;
            this.updatePaginator();
            
            // Usar setTimeout para evitar errores de detección de cambios
            setTimeout(() => {
                this.changeDetectorRef.detectChanges();
            }, 0);
        } catch (error) {
            console.error('Error en getStoreData:', error);
            this.filteredStores = [];
            this.storeGrid = [];
            this.dataSourceStore.data = [];
        }
    }

    /**
     * Actualiza el paginator y calcula las tiendas paginadas
     */
    updatePaginator(): void {
        setTimeout(() => {
            if (this.paginator && this.dataSourceStore) {
                this.dataSourceStore.paginator = this.paginator;
            }
            this.updatePaginatedStores();
        }, 0);
    }

    /**
     * Actualiza las tiendas paginadas según la página actual
     */
    updatePaginatedStores(): void {
        const startIndex = this.currentPage * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedStores = this.filteredStores.slice(startIndex, endIndex);
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Maneja el cambio de página
     */
    onPageChange(event: any): void {
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize;
        this.updatePaginatedStores();
    }

    /**
     * Aplica el filtro de búsqueda a las tiendas
     */
    applyFilter(): void {
        try {
            // Verificar que hay tiendas
            if (!this.storeGrid || !Array.isArray(this.storeGrid) || this.storeGrid.length === 0) {
                this.filteredStores = [];
                this.dataSourceStore.data = [];
                this.updatePaginator();
                return;
            }
            
            // Obtener el texto de búsqueda de forma segura
            const searchValue = (this.searchText || '').trim().toLowerCase();
            
            // Si no hay texto, mostrar todas aleatorias
            if (!searchValue) {
                this.filteredStores = this.shuffleArray([...this.storeGrid]);
            } else {
                // Filtrar por nombre, descripción o estado
                const filtered = this.storeGrid.filter(store => {
                    if (!store) return false;
                    
                    // Convertir a string antes de toLowerCase
                    const name = String(store.name_store || '').toLowerCase();
                    const desc = String(store.description || '').toLowerCase();
                    const state = String(store.state_store || '').toLowerCase();
                    
                    return name.includes(searchValue) || 
                           desc.includes(searchValue) || 
                           state.includes(searchValue);
                });
                
                // Ordenar alfabéticamente por nombre
                this.filteredStores = filtered.sort((a, b) => {
                    const nameA = String(a?.name_store || '').toLowerCase();
                    const nameB = String(b?.name_store || '').toLowerCase();
                    return nameA.localeCompare(nameB);
                });
            }
            
            // Actualizar el dataSource con las tiendas filtradas
            this.dataSourceStore.data = this.filteredStores;
            this.currentPage = 0;
            this.updatePaginator();
        } catch (error) {
            console.error('Error en applyFilter:', error);
            // En caso de error, mostrar todas las tiendas
            if (this.storeGrid && Array.isArray(this.storeGrid)) {
                this.filteredStores = [...this.storeGrid];
                this.dataSourceStore.data = this.filteredStores;
                this.updatePaginator();
            }
        }
    }

    public onLoad() {
        this.loaded = true;
    }

    trackByStoreId(index: number, store: Store): string {
        return store.id_store || index.toString();
    }


}

// CLASS TO FILTER AND PAGINATE
@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {

    get_product: Prod[] = [];
    productsGrid: any;
    id: any;
    get_store: Store[] = [];
    storeGrid: Store[] = [];
    obsStore!: Observable<any>;
    dataSourceStore = new MatTableDataSource<Store>(this.storeGrid);
    @ViewChild(MatPaginator, { static: false })
    paginator!: MatPaginator;

    constructor(private route: ActivatedRoute,
        private router: Router,
        public embryoService: EmbryoService,
        private apiService: ApiService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    transform(posts: Card[], find: string): Card[] {
        this.route.params.subscribe(res => {
            this.id = res.id;
        })
        let id_category_F = localStorage.getItem('id_category');        
        this.apiService.getStoreWithoutAuthbyIdCategory(id_category_F).subscribe((res: any) => this.getStoreData(res, posts, find, this.id));
        if (!posts) return [];
        if (!find) return posts;
        find = find.toLowerCase();
        return search(this.storeGrid, find);
    }

    getStoreData(response: string | any[], posts: Card[], find: string, store_id: any) {                
        
        
        this.storeGrid =  [];
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

