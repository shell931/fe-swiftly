import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatSidenavModule, MatSidenav} from '@angular/material/sidenav';
// import { AngularFireDatabase, AngularFireList, AngularFireObject } from "@angular/fire/database";
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { ReviewPopupComponent } from '../Global/ReviewPopup/ReviewPopup.component';
import { ConfirmationPopupComponent } from '../Global/ConfirmationPopup/ConfirmationPopup.component';
import { LocationPredeterminedComponent } from '../AdminPanel/Widget/PopUp/LocationPredetermined/LocationPredetermined.component';
import { AddCartComponent } from '../AdminPanel/Widget/PopUp/AddCart/AddCart.component';
import { ShowCartDataComponent } from '../AdminPanel/Widget/PopUp/ShowCartData/ShowCartData.component';



interface Response {
   data: any;
}

export interface Product {
   name: string;
   image: string;
   price: string;
   produc_code: string;
}

@Injectable()
export class EmbryoService {

   sidenavOpen: boolean = false;
   paymentSidenavOpen: boolean = false;
   ubicationSidenavOpen: boolean = false;
   balanceSidenavOpen: boolean = false;
   binnacleSidenavOpen: boolean = false;
   binnacleSidenavAdmOpen: boolean = false;
   TransfersDetailSidebarOpen: boolean = false;
   TransfersDetailAdmSidebarOpen: boolean = false;
   isDirectionRtl: boolean = false;
   featuredProductsSelectedTab: any = 0;
   newArrivalSelectedTab: any = 0;
   currency: string = 'USD';
   language: string = 'en';
   shipping: number = 12.95;
   tax: number = 27.95;
   // products: AngularFireObject<any>;
   localStorageCartProducts: any;
   localStorageWishlist: any;
   navbarCartCount: number = 3;
   navbarWishlistProdCount = 0;
   buyUserCartProducts: any;
   get_product_data: Product | null = null;

   constructor(private http: HttpClient,
      private dialog: MatDialog,
      // private db: AngularFireDatabase,
      private toastyService: ToastrService,
      ) {

      this.calculateLocalWishlistProdCounts();
      this.calculateLocalCartProdCounts();
      localStorage.removeItem("user");
      localStorage.removeItem("byProductDetails");

      // this.db.object("products").valueChanges().subscribe(res => { this.setCartItemDefaultValue(res['gadgets'][1]) });
   }

   public setCartItemDefaultValue(setCartItemDefaultValue: any) {
      let products: any;
      const cartItem = localStorage.getItem("cart_item");
      products = cartItem ? JSON.parse(cartItem) : [];
      let found = products.some(function (el: { name: any; }, index: any) {
         if (el.name == setCartItemDefaultValue.name) {
            return true;
         }
      });
      if (!found) { products.push(setCartItemDefaultValue); }
      this.calculateLocalCartProdCounts();
   }

   public reviewPopup(singleProductDetails: any, reviews: any) {
      let review: MatDialogRef<ReviewPopupComponent>;
      const dialogConfig = new MatDialogConfig();
      if (this.isDirectionRtl) {
         dialogConfig.direction = 'rtl';
      } else {
         dialogConfig.direction = 'ltr';
      }

      review = this.dialog.open(ReviewPopupComponent, dialogConfig);
      review.componentInstance.singleProductDetails = singleProductDetails;
      review.componentInstance.reviews = reviews;

      return review.afterClosed();
   }

   public confirmationPopup(message: string) {
      let confirmationPopup: MatDialogRef<ConfirmationPopupComponent>;
      confirmationPopup = this.dialog.open(ConfirmationPopupComponent);
      confirmationPopup.componentInstance.message = message;
      return confirmationPopup.afterClosed();
   }

   public getProducts() {
      // In the original project this returned an AngularFire DB object with valueChanges().
      // Provide a safe default so callers can call `.valueChanges().subscribe(...)` without runtime errors.
      return {
         valueChanges: () => of([])
      } as any;
   }


   public addCartPopup(data: any) {
      let dialogRef_sta: MatDialogRef<AddCartComponent>;
      dialogRef_sta = this.dialog.open(AddCartComponent, {
         data: data,
         disableClose: false,
         hasBackdrop: false,
         panelClass: 'add-cart-dialog-panel'
      });
      return dialogRef_sta.afterClosed();
   }


   public ShowCartDataFinaly(data: any, total: any) {
      let dialogRef_sta: MatDialogRef<ShowCartDataComponent>;
      dialogRef_sta = this.dialog.open(ShowCartDataComponent);
      dialogRef_sta.componentInstance.data = data;
      dialogRef_sta.componentInstance.total = total;
      return dialogRef_sta.afterClosed();
   }

   /*
      ----------  Cart Product Function  ----------
   */
   // Adding new Product to cart in localStorage
   public addToCart(data: any, type: any = "") {
      let products: any;
      const cartItem = localStorage.getItem("cart_item");
      products = cartItem ? JSON.parse(cartItem) : [];
      let productsLength = products.length;
      let toastOption = this.toastyService.success('Producto agregado al carrito', 'Agregando producto');
      
      // Si viene desde favoritos, forzar cantidad a 1
      if (type == 'wishlist') {
         data.quantity = 1;
         data.canti = 1;
      }
      
      let found = products.some((el: any, index: number) => {
         if (el.name == data.name) {
            if (!data.quantity) { data.quantity = 1 }
            // Si viene desde favoritos, reemplazar cantidad existente con 1
            if (type == 'wishlist') {
               products[index]['quantity'] = 1;
               products[index]['canti'] = 1;
            } else {
               products[index]['quantity'] = data.quantity;
            }
            return true;
         }
      });
      if (!found) { products.push(data); }
      if (productsLength == products.length) {
         toastOption.title = "Producto ya fue agregado";
         toastOption.message = "Ya agregaste este producto al carrito";
      }
      if (type == 'wishlist') {
         this.removeLocalWishlistProduct(data);
      }

      this.get_product_data = {
         name:data.name,
         image:data.image,
         price:data.price,
         produc_code:data.produc_code};
      this.addCartPopup(this.get_product_data);

      setTimeout(() => {
         localStorage.setItem("cart_item", JSON.stringify(products));
         this.calculateLocalCartProdCounts();
      }, 500);
   }

   // Update quantity without showing notifications
   public updateCartProductQuantity(data: any) {
      let products: any;
      const cartItem = localStorage.getItem("cart_item");
      products = cartItem ? JSON.parse(cartItem) : [];
      
      let found = products.some((el: any, index: number) => {
         if (el.name == data.name) {
            if (!data.quantity) { data.quantity = 1 }
            products[index]['quantity'] = data.quantity;
            return true;
         }
      });
      
      if (!found) { 
         products.push(data); 
      }

      localStorage.setItem("cart_item", JSON.stringify(products));
      this.calculateLocalCartProdCounts();
   }

   public buyNow(data: any) {
      let products: any;
      const cartItem = localStorage.getItem("cart_item");
      products = cartItem ? JSON.parse(cartItem) : [];

      let found = products.some((el: any, index: number) => {
         if (el.name == data.name) {
            if (!data.quantity) { data.quantity = 1 }
            products[index]['quantity'] = data.quantity;
            return true;
         }
      });
      if (!found) { products.push(data); }

      localStorage.setItem("cart_item", JSON.stringify(products));
      this.calculateLocalCartProdCounts();
   }

   public updateAllLocalCartProduct(products: any) {
      localStorage.removeItem('cart_item');
      localStorage.setItem("cart_item", JSON.stringify(products))
   }

   // returning LocalCarts Product Count
   public calculateLocalCartProdCounts() {
      this.localStorageCartProducts = null;
      const cartItem = localStorage.getItem("cart_item");
      this.localStorageCartProducts = cartItem ? JSON.parse(cartItem) : [];
      this.navbarCartCount = +((this.localStorageCartProducts).length);
   }

   // Removing cart from local
   public removeLocalCartProduct(product: any) {
      const cartItem = localStorage.getItem("cart_item");
      let products: any = cartItem ? JSON.parse(cartItem) : [];

      for (let i = 0; i < products.length; i++) {
         if (products[i].name === product.name) {
            products.splice(i, 1);
            break;
         }
      }

    this.toastyService.info('Producto eliminado del carrito', 'Eliminando producto', {
      timeOut: 1000,
      progressBar: true,
      closeButton: true
    });
      setTimeout(() => {
         // ReAdding the products after remove
         localStorage.setItem("cart_item", JSON.stringify(products));
         this.calculateLocalCartProdCounts();
      }, 500);
   }

   /*
      ----------  Wishlist Product Function  ----------
   */

   // Adding new Product to Wishlist in localStorage
   public addToWishlist(data: any) {
     this.toastyService.info(
       "Product adding to the wishlist",
       "Adding Product To Wishlist",
       { timeOut: 1000, progressBar: true, closeButton: true }
     );

      let products: any;
      const wishlistItem = localStorage.getItem("wishlist_item");
      products = wishlistItem ? JSON.parse(wishlistItem) : [];
      let productsLength = products.length;

      let found = products.some((el: any, index: number) => {
         if (el.name == data.name) {
            if (!data.quantity) { data.quantity = 1 }
            products[index]['quantity'] = data.quantity;
            return true;
         }
      });
      if (!found) { products.push(data); }

 if (productsLength == products.length) {
  // Producto ya estaba en la lista
  this.toastyService.warning(
    "You have already added this product to wishlist",
    "Product Already Added",
    { timeOut: 1000 }
  );
} else {
  // Producto nuevo agregado a la lista
  this.toastyService.success(
    "Product adding to the wishlist",
    "Adding Product To Wishlist",
    { timeOut: 1000 }
  );
}

      setTimeout(() => {
         localStorage.setItem("wishlist_item", JSON.stringify(products));
         this.calculateLocalWishlistProdCounts();
      }, 500);

   }

   // returning LocalWishlist Product Count
   public calculateLocalWishlistProdCounts() {
      this.localStorageWishlist = null;
      const wishlistItem = localStorage.getItem("wishlist_item");
      this.localStorageWishlist = wishlistItem ? JSON.parse(wishlistItem) : [];
      this.navbarWishlistProdCount = +((this.localStorageWishlist).length);
   }


   // Removing Wishlist from local
   public removeLocalWishlistProduct(product: any) {
      const wishlistItem = localStorage.getItem("wishlist_item");
      let products: any = wishlistItem ? JSON.parse(wishlistItem) : [];

      for (let i = 0; i < products.length; i++) {
         if (products[i].productId === product.productId) {
            products.splice(i, 1);
            break;
         }
      }
      this.toastyService.info(
        "Product removing from wishlist",
        "Remove Product From Wishlist",
        { timeOut: 1000, progressBar: true, closeButton: true }
      );
      setTimeout(() => {
         // ReAdding the products after remove
         localStorage.setItem("wishlist_item", JSON.stringify(products));
         this.calculateLocalWishlistProdCounts();
      }, 500);

   }

   public addAllWishListToCart(dataArray: any) {
      let a: any;
      const cartItem = localStorage.getItem("cart_item");
      a = cartItem ? JSON.parse(cartItem) : [];

      for (let singleData of dataArray) {
         // Forzar cantidad a 1 para todos los productos desde favoritos
         singleData.quantity = 1;
         singleData.canti = 1;
         a.push(singleData);
      }

      this.toastyService.info(
        "Products adding to the cart",
        "Adding All Product To Cart",
        { timeOut: 1000, progressBar: true, closeButton: true }
      );

      setTimeout(() => {
         localStorage.removeItem('wishlist_item');
         localStorage.setItem("cart_item", JSON.stringify(a));
         this.calculateLocalCartProdCounts();
         this.calculateLocalWishlistProdCounts();
      }, 500);

   }

   /**
    * getBlogList used to get the blog list.
    */
   public getBlogList() {
      // Return safe default with valueChanges() to match original AngularFire pattern
      return {
         valueChanges: () => of([])
      } as any;
   }

   /**
    * getContactInfo used to get the contact infomation.
    */
   public getContactInfo() {
      // Return safe default
      return {
         valueChanges: () => of(null)
      } as any;
   }

   /**
    * getTermCondition used to get the term and condition.
    */
   public getTermCondition() {
      return {
         valueChanges: () => of([])
      } as any;
   }

   /**
    * getPrivacyPolicy used to get the privacy policy.
    */
   public getPrivacyPolicy() {
      return {
         valueChanges: () => of([])
      } as any;
   }

   /**
    * getFaq used to get the faq.
    */
   public getFaq() {
      return {
         valueChanges: () => of([])
      } as any;
   }

   /**
    * getProductReviews used to get the product review.
    */
   public getProductReviews() {
      return {
         valueChanges: () => of([])
      } as any;
   }

   /**
    * Buy Product functions
    */
   public addBuyUserDetails(formdata: any, num_aprob: any, date: any, reference: any) {

      let InvoiceDetail = { "num_aprob": num_aprob, "date": date, "reference": reference };
      localStorage.setItem("InvoiceDetail", JSON.stringify(InvoiceDetail));

      localStorage.setItem("user", JSON.stringify(formdata));

      const cartItem = localStorage.getItem("cart_item");
      let product = cartItem ? JSON.parse(cartItem) : [];
      localStorage.setItem("byProductDetails", JSON.stringify(product));
      const buyProductDetails = localStorage.getItem("byProductDetails");
      this.buyUserCartProducts = buyProductDetails ? JSON.parse(buyProductDetails) : [];

      localStorage.removeItem("cart_item");
      this.calculateLocalCartProdCounts();
   }

   public removeBuyProducts() {
      localStorage.removeItem("byProductDetails");
      const buyProductDetails = localStorage.getItem("byProductDetails");
      this.buyUserCartProducts = buyProductDetails ? JSON.parse(buyProductDetails) : [];
   }

   /**
    * getTeam used to get the team data.
    */
   public getTeam() {
      let team: any;
      // team = this.db.list("team");
      return team;
   }

   /**
    * getTestimonial used to get the testimonial data.
    */
   public getTestimonial() {
      let testimonial: any;
      // testimonial = this.db.object("testimonial");
      return testimonial;
   }

   /**
    * getMissionVision used to get the Mission and Vision data.
    */
   public getMissionVision() {
      let mission_vision: any;
      // mission_vision = this.db.list("mission_vision");
      return mission_vision;
   }

   /**
    * getAboutInfo used to get the about info data.
    */
   public getAboutInfo() {
      let about_info: any;
      // about_info = this.db.object("about_info");
      return about_info;
   }

}

