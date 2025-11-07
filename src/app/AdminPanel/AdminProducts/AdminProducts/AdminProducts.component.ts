import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Router } from '@angular/router';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { ApiService } from '../../../Services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Products } from '../../../Models/Products';
import { environment } from '../../../../../src/environments/environment';


@Component({
	selector: 'admin-app-products',
	templateUrl: './AdminProducts.component.html',
	styleUrls: ['./AdminProducts.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		MatTableModule,
		MatPaginatorModule,
		MatCardModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule
	]
})

export class AdminProductsComponent implements OnInit, AfterViewInit {


	adminprList: any[] = [];
	adminProductList: any[] = [];
	get_pr: any[] = [];
	productsGrid: any;
	@ViewChild(MatPaginator, { static: false })
	paginator!: MatPaginator; // Definite assignment assertion

	dataSource = new MatTableDataSource<any>(this.adminProductList);
	displayedColumns: string[] = ['action','name_store', 'created_at', 'product_code', 'name_product', 'namecategory', 'namesubcategory', 'total_price', 'published', 'name_state'];

	constructor(
		private apiService: ApiService,
		public service: AdminPanelServiceService,
		private changeDetectorRef: ChangeDetectorRef
	) { }

	ngOnInit() {
	this.apiService.getAdminProduct().subscribe((res: any) => this.getProductsData(res), (error: any) => console.log(error));
	}

	ngAfterViewInit() {
		// Asegurar que el paginador esté conectado después de que la vista esté inicializada
		if (this.paginator && this.dataSource) {
			this.dataSource.paginator = this.paginator;
		}
	}

	getProductsData(response : any) {
		console.log(response);
		this.adminprList = response;
		this.dataSource = new MatTableDataSource<any>(this.adminprList);
		this.changeDetectorRef.detectChanges();
		setTimeout(() => {
			if (this.paginator) {
				this.dataSource.paginator = this.paginator;
				// Forzar actualización del paginador
				this.changeDetectorRef.detectChanges();
			}
		}, 100)
	}


	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}


	onSeeDialog(data : { id_product: any; }) {
		this.apiService.getProductsConfirmbyId(data.id_product).subscribe((res: any) => this.getProductData(res), (error: any) => console.log(error));
	}

	getProductData(response: any) {		
		let gallery = response.rel_product;
		this.get_pr = [];
		for (var i = 0; i < gallery.length; i++) {
			let image_route = environment.api.baseBucketImageUrl + gallery[i].image;
			this.get_pr[i] = image_route;
		}

	let myObj_product: any;
		myObj_product = {
			availablity: true,
			brand: response.brand,
			category: "Jewellery",
			category_type: "accessories",
			color: "Black",
			description: response.description_product,
			discount_price: response.discount_price,
			id: response.id_product,
			image: response.image,
			image_gallery: this.get_pr,
			name: response.name_product,
			popular: false,
			price: response.total_price,
			product_code: response.product_code,
			quantity: response.stock,
			rating: response.rating,
			store_id: response.store,
			status: true,
			type: "accessories",
		};
	this.productsGrid = myObj_product;
		console.log(this.productsGrid);
		this.apiService.PopUpAdminProductsValidate(this.productsGrid);
	}


}

