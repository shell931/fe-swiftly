import { Component, OnInit, Input, OnChanges, Renderer2, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BarRatingModule } from 'ngx-bar-rating';

import { EmbryoService } from '../../Services/Embryo.service';

@Component({
   selector: 'embryo-ShopDetails',
   standalone: true,
   imports: [
      CommonModule,
      CurrencyPipe,
      MatDialogModule,
      MatButtonModule,
      BarRatingModule
   ],
   templateUrl: './ShopDetails.component.html',
   styleUrls: ['./ShopDetails.component.scss']
})
export class ShopDetailsComponent implements OnInit, OnChanges {

   @Input() detailData: any;
   @Input() currency: string = ''; // Initialize currency
   
   mainImgPath: string = ''; // Initialize mainImgPath
   totalPrice: any;
   type: any;
   colorsArray: string[] = [];
   sizeArray: number[] = [];
   quantityArray: number[] = [];
   productReviews: any;
   rate: number = 0; // Add missing rate property
   public validate_canti: boolean = false;
   public isImagePressed: boolean = false;

   constructor(private route: ActivatedRoute,
      private router: Router,
      public embryoService: EmbryoService,
      public dialog: MatDialog 
   ) {

   }

   ngOnInit() {
      this.mainImgPath = this.validateImageUrl(this.detailData.image);
      // Usar precio con descuento si existe, sino precio normal
      this.totalPrice = this.detailData.discount_price && this.detailData.discount_price > 0 
         ? this.detailData.discount_price 
         : this.detailData.price;
      
      // Initialize arrays dynamically based on product data
      this.initializeProductArrays();
      
      this.route.params.subscribe(res => {
         console.log(res);

         this.type = null;
         this.type = res.type;
      });
   }

   ngOnChanges() {
      this.totalPrice = null;
      this.mainImgPath = this.validateImageUrl(this.detailData.image);
      // Usar precio con descuento si existe, sino precio normal
      this.totalPrice = this.detailData.discount_price && this.detailData.discount_price > 0 
         ? this.detailData.discount_price 
         : this.detailData.price;
      
      // Re-initialize arrays when data changes
      this.initializeProductArrays();
   }

   /**
    * selectImage is used to change the main image when clicking thumbnails.
    */
   public selectImage(imgPath: string, index: number) {
      // Remover clase active de todos los thumbnails
      const activeElements = document.querySelectorAll('.thumbnail-item.active');
      activeElements.forEach(element => {
         element.classList.remove('active');
      });
      
      // Cambiar imagen principal con validación
      this.mainImgPath = this.validateImageUrl(imgPath);
      
      // Agregar clase active al thumbnail clickeado
      const thumbnailElements = document.querySelectorAll('.thumbnail-item');
      if (thumbnailElements[index]) {
         thumbnailElements[index].classList.add('active');
      }
   }

   /**
    * getImagePath - mantiene compatibilidad con el código existente
    */
   public getImagePath(imgPath: string, index: number) {
      this.selectImage(imgPath, index);
   }

   public calculatePrice(detailData: any, value: any) {
      detailData.valid_quant = value;
      if (!value) {
         value = 1;
         detailData.valid_quant = 0;
      }
      detailData.quantity = value;
      if(value <= detailData.stock){
         this.totalPrice = detailData.price * value;
      }else{
         this.totalPrice = detailData.price;
      }
   }

   private clampQuantity(value: any, maxStock: number): number {
      let num = parseInt(value, 10);
      if (isNaN(num) || num < 1) num = 1;
      if (typeof maxStock === 'number' && maxStock > 0 && num > maxStock) num = maxStock;
      return num;
   }

   public incrementQuantity(inputEl: HTMLInputElement, detailData: any) {
      const current = this.clampQuantity(inputEl?.value ?? 1, detailData?.stock);
      const next = this.clampQuantity(current + 1, detailData?.stock);
      try { inputEl.value = String(next); } catch {}
      this.calculatePrice(detailData, next);
   }

   public decrementQuantity(inputEl: HTMLInputElement, detailData: any) {
      const current = this.clampQuantity(inputEl?.value ?? 1, detailData?.stock);
      const next = this.clampQuantity(current - 1, detailData?.stock);
      try { inputEl.value = String(next); } catch {}
      this.calculatePrice(detailData, next);
   }

   public normalizeQuantity(inputEl: HTMLInputElement, detailData: any) {
      const normalized = this.clampQuantity(inputEl?.value ?? 1, detailData?.stock);
      try { inputEl.value = String(normalized); } catch {}
      this.calculatePrice(detailData, normalized);
   }

   public reviewPopup(detailData: any) { // Define type for detailData
      let reviews: any = null;
      for (let review of this.productReviews) {
         reviews = review.user_rating;
      }

   }

   public addToWishlist(value: any) {
      this.embryoService.addToWishlist(value);
   }

   public addToCart(value: any) {

      this.validate_canti = false;
      
      if (value.valid_quant == 0) {
         this.validate_canti = true;
      } else {
         let myObj_product = {
            "brand": value.brand,
            "discount_price": value.discount_price,
            "id_product": value.id,
            "id_store": value.store_id,
            "name": value.name,
            "price": value.price,
            "produc_code": value.product_code,
            "quantity": value.quantity,
            "canti":  value.quantity,
            "image": value.image,
            "route_product": "na",
            "stock": value.stock
         };

         let cartItem = localStorage.getItem("cart_item");
         let products = cartItem ? JSON.parse(cartItem) : []; // Handle null case
         if (products.length > 0) {
            this.embryoService.addToCart(myObj_product);

            // let id_store_storage;
            // for (var i = 0; i < 1; i++) {
            //    id_store_storage = products[i].id_store;
            // }         
            // console.log(id_store_storage);      
            // console.log(value.store_id);
            // if (id_store_storage == value.store_id) {
            //    this.embryoService.addToCart(value);
            // }
            // else {
            //    const dialogRef = this.dialog.open(DialogContentProductDiferentStoreDetail, {
            //       width: '500px',
            //     });      
            //    dialogRef.afterClosed().subscribe(result => {
            //       console.log(`Dialog result: ${result}`);
            //    });
            // }
         } else {
            this.embryoService.addToCart(myObj_product);
         }
         // this.embryoService.addToCart(value);
      }
   }

   public buyNow(detailData: any) {
      // Agregar automáticamente al carrito sin mostrar diálogo
      this.embryoService.buyNow(detailData);
      
      // Redirigir al carrito después de agregar
      setTimeout(() => {
         this.router.navigate(['/cart']);
      }, 100);
   }

   /**
    * initializeProductArrays initializes colors, sizes, and quantities based on product data
    */
   public initializeProductArrays() {
      // Initialize colors from product data or use empty array
      this.colorsArray = this.detailData?.colors || [];
      
      // Initialize sizes from product data or use empty array
      this.sizeArray = this.detailData?.sizes || [];
      
      // Initialize quantity array based on stock or default range
      const maxQuantity = this.detailData?.stock || 10;
      this.quantityArray = Array.from({ length: Math.min(maxQuantity, 10) }, (_, i) => i + 1);
   }

   /**
    * validateImageUrl checks if the image URL is valid and returns a placeholder if not
    */
   public validateImageUrl(imageUrl: string): string {
      if (!imageUrl || imageUrl.trim() === '' || imageUrl === 'null' || imageUrl === 'undefined') {
         console.log('Invalid image URL provided:', imageUrl);
         return this.getPlaceholderImage();
      }
      
      // Log the image URL being used for debugging
      console.log('Using image URL:', imageUrl);
      return imageUrl;
   }

   /**
    * getPlaceholderImage returns a generic placeholder image
    */
   public getPlaceholderImage(): string {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0xMjUgMTI1SDc1VjE3NUgxMjVWMTI1WiIgZmlsbD0iI0RFRTJFNiIvPgo8cGF0aCBkPSJNMTI1IDEwMEg3NVYxMjVIMTI1VjEwMFoiIGZpbGw9IiNERTJFMkUiLz4KPHN2ZyB4PSIxMjUiIHk9IjEwMCIgd2lkdGg9IjUwIiBoZWlnaHQ9Ijc1IiB2aWV3Qm94PSIwIDAgNTAgNzUiIGZpbGw9Im5vbmUiPgo8cGF0aCBkPSJNMjUgMTIuNUMzNS4yIDEyLjUgNDMuNSAyMC44IDQzLjUgMzFWMzcuNUM0My41IDQ3LjcgMzUuMiA1NiA0My41IDU2SDQzLjVWNjIuNUM0My41IDcyLjcgMzUuMiA4MSAyNSA4MUg2LjVDLTMuNyA4MSAtMTIgNzIuNyAtMTIgNjIuNVYzMS4wQy0xMiAyMC44IC0zLjcgMTIuNSA2LjUgMTIuNUgyNVoiIGZpbGw9IiNERTJFMkUiLz4KPC9zdmc+Cjwvc3ZnPgo=';
   }

   /**
    * getPaymentMethodsImage returns the payment methods image if available
    */
   public getPaymentMethodsImage(): string | null {
      // This could be made configurable through environment or service
      // For now, return null to hide the payment methods image
      return null;
   }

   /**
    * onImageError is used to handle image loading errors by setting a fallback image.
    */
   public onImageError(event: any) {
      console.error('Image loading error for URL:', event.target.src);
      console.log('Product data:', this.detailData);
      console.log('Image gallery:', this.detailData?.image_gallery);
      
      // Prevent infinite loop if fallback also fails
      if (event.target.src.includes('data:image/svg+xml')) {
         console.log('Fallback image also failed to load');
         return;
      }
      
      // Use a generic placeholder instead of a specific product image
      event.target.src = this.getPlaceholderImage();
   }
}

@Component({
   selector: 'ProductGrid-modal-product-diferent-store',
   standalone: true,
   imports: [
      CommonModule,
      MatDialogModule,
      MatButtonModule
   ],
   templateUrl: 'ProductGrid-modal-product-diferent-store.html',
})

export class DialogContentProductDiferentStoreDetail { }


