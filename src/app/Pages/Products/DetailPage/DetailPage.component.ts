import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EmbryoService } from '../../../Services/Embryo.service';
import { ApiService } from '../../../Services/api.service';
import { environment } from '../../../../../src/environments/environment';
import { CommonModule } from '@angular/common';
import { ShopDetailsComponent } from '../../../Templates/ShopDetails/ShopDetails.component';

export interface Prod {
   image: string;
   // name_product: string;
   // total_price: string;
   product_code: string;
   brand: string;
   discount_price: number;
   // id_product: string;
   availablity: boolean;
   category: string;
   category_type: string;
   color: string;
   description: string;
   id: number;
   // image_gallery: string;
   name: string;
   popular: boolean;
   price: number;
   quantity: number;
   rating: number;
   status: boolean;
   // tags: string;
   type: string;
}

@Component({
   selector: 'app-DetailPage',
   standalone: true,
   imports: [CommonModule, ShopDetailsComponent],
   templateUrl: './DetailPage.component.html',
   styleUrls: ['./DetailPage.component.scss']
})
export class DetailPageComponent implements OnInit {

   id: any;
   type: any;
   apiResponse: any;
   singleProductData: any;
   productsList: any;
   productsGrid: any;
   get_pr: any[] = [];

   constructor(private route: ActivatedRoute,
      private router: Router,
      public embryoService: EmbryoService,
      private apiService: ApiService,) {

   }

   ngOnInit() {
      this.route.params.subscribe(res => {
         this.id = res.id;
         this.type = res.type;
      })
      this.apiService.getProductsbyId(this.id).subscribe(res => this.getProductData(res));
   }

   getProductData(response) {

      console.log('Product API Response:', response);
      

      // Process image gallery
      let gallery = response.rel_product || [];
      this.get_pr = [];
      for (var i = 0; i < gallery.length; i++) {
         if (gallery[i].image) {
            let image_route = this.buildImageUrl(gallery[i].image);
            this.get_pr[i] = image_route;
         }
      }

      // Build main product object
      let myObj_product; 
      myObj_product = { 
         availablity: response.availability,
         brand: response.brand,
         category: response.category || null,
         category_type: response.category_type || null,
         color: response.color || null,
         description: response.description_product,
         discount_price: response.discount_price,
         id: response.id_product,
         image: this.buildImageUrl(response.image),
         image_gallery: this.get_pr,
         name: response.name_product,
         popular: response.popular || false,
         price: response.total_price,
         product_code: response.product_code,
         stock: response.stock,
         rating: response.rating,
         store_id: response.store,
         status: response.status !== undefined ? response.status : true,
         type: response.type || null,
         quantity: response.quantity || 1,
         valid_quant: response.valid_quant || 1
      };
      
      console.log('Processed Product Data:', myObj_product);
      this.productsGrid = myObj_product;      
   }

   /**
    * buildImageUrl constructs a complete image URL from the image path
    */
   private buildImageUrl(imagePath: string): string {
      if (!imagePath) {
         console.warn('No image path provided');
         return '';
      }
      
      // If the image path is already a complete URL, return it as is
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
         return imagePath;
      }
      
      // Build the complete URL using the base bucket URL
      const completeUrl = environment.api.baseBucketImageUrl + imagePath;
      console.log('Built image URL:', completeUrl);
      return completeUrl;
   }

   // public getData() {
   //    this.embryoService.getProducts().valueChanges().subscribe(res => this.checkResponse(res));
   // }

   // public checkResponse(response) {
   //    this.productsList = null;
   //    this.productsList = response[this.type];
   //    for (let data of this.productsList) {
   //       if (data.id == this.id) {
   //          console.log("single");
   //          console.log(data);
   //          this.singleProductData = data;
   //          break;
   //       }
   //    }
   // }

   public addToCart(value) {
      this.embryoService.addToCart(value);
   }

   public addToWishList(value) {
      this.embryoService.addToWishlist(value);
   }

}

