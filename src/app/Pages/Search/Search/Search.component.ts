import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ApiService } from '../../../Services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { EmbryoService } from '../../../Services/Embryo.service';
import { environment } from '../../../../../src/environments/environment';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

// Angular imports for standalone component
import { CommonModule, CurrencyPipe, AsyncPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// CDK imports
import { CdkTreeModule } from '@angular/cdk/tree';

// Schema import
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// External modules - NgxPaginationModule removed for standalone compatibility
import { GlobalModule } from '../../../Global/Global.module';
import { TemplatesModule } from '../../../Templates/Templates.module';

export interface Prod {
    image: string;
    name: string;
    price: string;
    produc_code: string;
    brand: string;
    product_code: string;
    discount_price: string;
    id_product: string;
    availability: boolean;
    route_product: string;
    id_store: string;
}


interface subcategoryNode {
    id: number;
    name_category: string;
    children?: subcategoryNode[];
    type: string;
    icon:any;
}

interface ExampleFlatNode {
    expandable: boolean;
    name: string;
    level: number;
    // Additional fields returned by the transformer — make them optional to keep compatibility
    id?: number;
    name_category?: string;
    icon?: any;
    type?: string;
}

@Component({
    selector: 'app-Search',
    standalone: true,
    imports: [
        CommonModule,
        CurrencyPipe,
        AsyncPipe,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MatCardModule,
        MatListModule,
        MatTreeModule,
        MatIconModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        CdkTreeModule,
        GlobalModule,
        TemplatesModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './Search.component.html',
    styleUrls: ['./Search.component.scss']
})

export class SearchComponent implements OnInit {


    private _transformer = (node: subcategoryNode, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.name_category,
            level: level,
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
    @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
    productsGrid: Prod[] = [];
    dataSource = new MatTableDataSource<Prod>(this.productsGrid);
    obs!: Observable<any>;
    id: any;
    get_product: Prod[] = [];
    get_categories: subcategoryNode[] = [];
    loaded = false;
    get_subca: any[] = [];
    p:any;
    product: any; // Added for template compatibility
    rate: number = 0; // Added for rating component

    constructor(private route: ActivatedRoute,
        private router: Router,
        public embryoService: EmbryoService,
        private apiService: ApiService,
        private changeDetectorRef: ChangeDetectorRef,

    ) {
        // this.dataSourceTree.data = TREE_DATA;
    }

    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

    toggleCategory(node: ExampleFlatNode) {
        this.treeControlN.toggle(node);
    }

    ngOnInit() {
        this.route.params.subscribe((res: any) => {
            this.id = res.id;
            this.apiService.FilterProducts(this.id).subscribe((res: any) => this.getProductData(res), (error: any) => console.log(error));
        })
        this.apiService.getCategories().subscribe((res: any) => this.getCategoriesMenu(res), (error: any) => console.log(error));
    }

    SearchByCategories(type: any, id_category: any){
    localStorage.removeItem("id_category_prod_search");
    localStorage.removeItem("type_cate_subcate_search");
    localStorage.setItem('id_category_prod_search', String(id_category));
    localStorage.setItem('type_cate_subcate_search', String(type));

        if(type=="category"){
            this.apiService.getProductsbyCategory(id_category).subscribe((res: any) => this.getProductData(res));
        }else{
            this.apiService.getProductsbySubcategory(id_category).subscribe((res: any) => this.getProductData(res));
        }
    }

    getCategoriesMenu(response: any) {
        this.get_categories = [];
        for (var i = 0; i < response.length; i++) {
            // Filtrar categorías hasta "escobillas"
            if (response[i].name_category && response[i].name_category.toLowerCase().includes('escobillas')) {
                break; // Detener cuando llegue a escobillas
            }
            
            let subcategor = this.createSubcategories(response[i].rel_categories);
            this.get_categories.push(
                {
                    id: response[i].id,
                    name_category: response[i].name_category,
                    type: 'category',
                    children: subcategor,
                    icon: response[i].icon,
                });
        }            
        this.dataSourceN.data = this.get_categories;
    }

    createSubcategories(subcate: any) {
        this.get_subca = [];
        for (var i = 0; i < subcate.length; i++) {
            this.get_subca.push(
                {
                    id: subcate[i].id,
                    name_category: subcate[i].name_subcategory,
                    type: 'subcategory'
                },
            );
        }
        return this.get_subca;
    }

    getProductData(response: any) {
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
            let get_availability = response[i].availability;
            let get_id_store = response[i].store;
            this.get_product.push({
                image: get_image,
                name: get_name_product,
                price: get_total_price,
                produc_code: get_produc_code,
                brand: get_brand,
                product_code: get_product_code,
                discount_price: get_discount_price,
                id_product: get_id_product,
                availability: get_availability,
                id_store: get_id_store,
                route_product: '/products/accessories/' + get_id_product
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

    public checkCartAlready(singleProduct: any) {
        const cartStored = localStorage.getItem("cart_item") || '[]';
        let products = JSON.parse(cartStored) || [];
        if (!products.some((item: any) => item.name == singleProduct.name)) {
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
            "canti": 1,
            "quantity": 1,
            "image": value.image,
            "route_product": value.route_product
        };

    const cartString = localStorage.getItem("cart_item") || '[]';
    let products = JSON.parse(cartString) || [];
        if (products.length > 0) {
            this.embryoService.addToCart(myObj_product);
            // let id_store_storage;
            // for (var i = 0; i < 1; i++) {
            //     id_store_storage = products[i].id_store;
            // }
            // if (id_store_storage == value.id_store) {
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

    public productAddToWishlist(value: any, index?: string) {
        this.embryoService.addToWishlist(value);
    }




}

