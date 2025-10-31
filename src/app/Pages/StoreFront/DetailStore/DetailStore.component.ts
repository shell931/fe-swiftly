import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, Pipe, PipeTransform, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { EmbryoService } from '../../../Services/Embryo.service';
import { ApiService } from '../../../Services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';
import { environment } from '../../../../../src/environments/environment';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RatingComponent } from '../../../Global/Rating/Rating.component';
import { AddToCardButtonComponent } from '../../../Global/AddToCardButton/AddToCardButton.component';

const { isArray } = Array;

// FilterPipe definition moved here
@Pipe({
    name: 'filter',
    standalone: true
})
export class FilterPipe implements PipeTransform {
    
    transform(posts: any[], find: string): any[] {
        if (!posts) return [];
        if (!find) return posts;
        find = find.toLowerCase();
        return search(posts, find);
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

export interface Prod {
    image: string;
    name: string;
    price: string;
    produc_code: string;
    brand: string;
    product_code: string;
    id_product: string;
    availability: boolean;
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
    id_store: number;
    id: number;
    name_category: string;
    icon:any;
    children?: subcategoryNode[];
    type: string;
}


interface ExampleFlatNode {
    expandable: boolean;
    name: string;
    level: number;
    // Additional fields returned by the transformer — make them optional to keep compatibility
    id_store?: number;
    id?: number;
    name_category?: string;
    icon?: any;
    type?: string;
}

@Component({
    selector: 'app-DetailStorePage',
    templateUrl: './DetailStore.component.html',
    styleUrls: ['./DetailStore.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        MatCardModule,
        MatListModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatTreeModule,
        MatPaginatorModule,
        CurrencyPipe,
        RatingComponent,
        AddToCardButtonComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class DetailStoreComponent implements OnInit {

    private _transformer = (node: subcategoryNode, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.name_category,
            level: level,
            id_store: node.id_store,
            id: node.id,
            name_category: node.name_category,            
            icon: node.icon,            
            type: node.type
        };
    }

    treeControlN = new FlatTreeControl<ExampleFlatNode>(
        node => node.level, node => node.expandable);

    treeFlattener: MatTreeFlattener<subcategoryNode, ExampleFlatNode, ExampleFlatNode> = new MatTreeFlattener<subcategoryNode, ExampleFlatNode, ExampleFlatNode>(
        (node: subcategoryNode, level: number) => {
            const flat: ExampleFlatNode = {
                expandable: !!node.children && node.children.length > 0,
                name: node.name_category,
                level: level,
                id_store: node.id_store,
                id: node.id,
                name_category: node.name_category,
                icon: node.icon,
                type: node.type
            };
            return flat;
        },
        (node: ExampleFlatNode) => node.level,
        (node: ExampleFlatNode) => node.expandable,
        (node: subcategoryNode) => node.children);

    dataSourceN = new MatTreeFlatDataSource<subcategoryNode, ExampleFlatNode>(this.treeControlN, this.treeFlattener);

    treeControl = new NestedTreeControl<subcategoryNode>(node => node.children);
    dataSourceTree = new MatTreeNestedDataSource<subcategoryNode>();
    @ViewChild(MatPaginator, { static: false })
    paginator!: MatPaginator;
    productsGrid: Prod[] = [];
    dataSource = new MatTableDataSource<Prod>(this.productsGrid);
    obs!: Observable<any>;
    id: any;
    storeGrid: any;
    get_product: Prod[] = [];
    loaded = false;
    @Output() addToCart: EventEmitter<any> = new EventEmitter();
    @Output() addToWishList: EventEmitter<any> = new EventEmitter();
    get_subca: any[] = [];
    get_categories: subcategoryNode[] = [];
    searchText: any;
    p: any;
    name_store: any;
    product: any; // Add missing property
    rate: number = 0; // Add missing property
    i: number = 0; // Add missing property for loop index

    constructor(private route: ActivatedRoute,
        private router: Router,
        public embryoService: EmbryoService,
        private apiService: ApiService,
        private changeDetectorRef: ChangeDetectorRef,

    ) { }

    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

    ngOnInit() {
        this.route.params.subscribe(res => {
            this.id = res.id;
        })
        localStorage.removeItem("type_cate_subcate");
        localStorage.removeItem("id_category_prod");
        this.apiService.getStoreData(this.id).subscribe((res: any) => this.getStoreData(res));
        // this.apiService.getViewProductsWithoutAuth().subscribe(res => this.getProductData(res,this.id));
        this.apiService.getProductStoresbyStoreid(this.id).subscribe((res: any) => this.getProductData(res, this.id));
        this.apiService.getCategoriesStore(this.id).subscribe((res: any) => this.getCategoriesMenu(res, this.id));
    }


    SearchStoreCategories(type: string, id_store: any, id: string | null){
        localStorage.removeItem("id_category_prod");
        localStorage.removeItem("type_cate_subcate");
        localStorage.setItem('id_category_prod', id!);
        localStorage.setItem('type_cate_subcate', type);
        if (type == "category") {
            this.apiService.getProductsbyCategorybyStore(id, id_store).subscribe((res: any) => this.getProductData(res, id_store));
        } else {
            this.apiService.getProductsbySubcategorybyStore(id, id_store).subscribe((res: any) => this.getProductData(res, id_store));
        }    
    }

    getCategoriesMenu(response: string | any[], id_store: any) {        
        this.get_categories = [];
        for (var i = 0; i < response.length; i++) {
            let subcategor = this.createSubcategories(response[i].rel_categories, id_store);
            this.get_categories.push(
                {
                    id_store: id_store,
                    id: response[i].id,
                    name_category: response[i].name_category,
                    icon: response[i].icon,
                    type: 'category',
                    children: subcategor,
                });
        }            
        this.dataSourceTree.data = this.get_categories;
        this.dataSourceN.data = this.get_categories;
    }

    createSubcategories(subcate: string | any[], id_store: any) {
        this.get_subca = [];
        for (var i = 0; i < subcate.length; i++) {
            this.get_subca.push(
                {
                    id_store: id_store,
                    id: subcate[i].id,
                    name_category: subcate[i].name_subcategory,
                    type: 'subcategory'
                },
            );
        }
        return this.get_subca;
    }

    getStoreData(response: { logo_store: any; name_store: any; state_store: any; }) {

        let myObj_store;
        myObj_store = {
            logo_store: response.logo_store,
            name_store: response.name_store,
            state_store: response.state_store,
        };
        this.name_store = response.name_store;
        this.storeGrid = myObj_store;
    }

    getProductData(response: string | any[], store_id: any) {    
        this.get_product = [];    
        for (var i = 0; i < response.length; i++) {
            let get_image = environment.api.baseBucketImageUrl + response[i].image;
            let get_name_product = response[i].name_product;
            let get_total_price = response[i].total_price;
            let get_produc_code = response[i].product_code;
            let get_brand = response[i].brand;
            let get_product_code = response[i].product_code;
            let get_id_product = response[i].id_product;
            let get_id_store = response[i].store;
            let get_availability = response[i].availability;
            this.get_product.push({
                image: get_image,
                name: get_name_product,
                price: get_total_price,
                produc_code: get_produc_code,
                brand: get_brand,
                product_code: get_product_code,
                id_product: get_id_product,
                id_store: get_id_store,
                route_product: '/products/accessories/' + get_id_product,
                descriptions: ['row1', 'row2'],
                availability: get_availability,
                store_id: store_id
            });
        }

        this.productsGrid = this.get_product;    
        this.dataSource = new MatTableDataSource<Prod>(this.productsGrid);
        this.changeDetectorRef.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.obs = this.dataSource.connect();


    }


    public onLoad() {
        this.loaded = true;
    }

    public checkCartAlready(singleProduct: { name: any; }) {
        let products = JSON.parse(localStorage.getItem("cart_item")!) || [];
        if (!products.some((item: { name: any; }) => item.name == singleProduct.name)) {
            return true;
        }
    }

    public addToCartProduct(value: any) {
        let myObj_product = {
            "brand": value.brand,
            "discount_price": value.discount_price,
            "id_product": value.id_product,
            "id_store": value.id_store,
            "name": value.name,
            "price": value.price,
            "produc_code": value.produc_code,
            "quantity": 1,
            "canti": 1,
            "image": value.image,
            "route_product": value.route_product
        };

    let products = JSON.parse(localStorage.getItem("cart_item") || '[]') || [];
        if (products.length > 0) {

            this.embryoService.addToCart(myObj_product);

            // let id_store_storage;
            // for (var i = 0; i < 1; i++) {
            //     id_store_storage = products[i].id_store;
            // }
            // console.log(id_store_storage);
            // console.log(value.store_id);
            // if (id_store_storage == value.store_id) {
            //     this.embryoService.addToCart(value);
            // }
            // else {
            //     //   const dialogRef = this.dialog.open(DialogContentProductDiferentStoreDetail, {
            //     //      width: '500px',
            //     //    });      
            //     //   dialogRef.afterClosed().subscribe(result => {
            //     //      console.log(`Dialog result: ${result}`);
            //     //   });
            // }
        } else {
            this.embryoService.addToCart(myObj_product);
        }

    }

    public productAddToWishlist(value: any, index?: any) {
        this.embryoService.addToWishlist(value);
    }

}
