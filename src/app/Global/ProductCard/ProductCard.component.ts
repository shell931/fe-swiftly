import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RatingComponent } from '../Rating/Rating.component';
import { AddToCardButtonComponent } from '../AddToCardButton/AddToCardButton.component';

@Component({
  selector: 'embryo-ProductCard',
  templateUrl: './ProductCard.component.html',
  styleUrls: ['./ProductCard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe,
    RatingComponent,
    AddToCardButtonComponent
  ]
})
export class ProductCardComponent implements OnInit {

   @Input() product : any;

   @Input() index   : any;

   @Input() currency : string = '';

   @Input() type  : string = '';

   @Output() addToCart: EventEmitter<any> = new EventEmitter();

   @Output() addToWishlist: EventEmitter<any> = new EventEmitter();

   constructor() { }

   ngOnInit() {
   }

   public addToCartProduct(value:any) {
      this.addToCart.emit(value);
   }

   public productAddToWishlist(value: any, parentClass: string) {
      const el = document.getElementById(parentClass);
      if (el && !el.classList.contains('wishlist-active')) {
         el.className += ' wishlist-active';
         // Cambiar el ícono del corazón a lleno
         const heartIcon = el.querySelector('i');
         if (heartIcon) {
            heartIcon.className = 'fa fa-heart';
         }
      }
      this.addToWishlist.emit(value);
   }

   public checkCartAlready(singleProduct: any): boolean {
      const stored = localStorage.getItem('cart_item') || '[]';
      const products: any[] = JSON.parse(stored) || [];
      return !products.some((item: any) => item.id == singleProduct.id);
   }

   public checkWishlistAlready(singleProduct: any): boolean {
      const wishlistItem = localStorage.getItem("wishlist_item");
      if (wishlistItem) {
         const wishlistProducts = JSON.parse(wishlistItem);
         return wishlistProducts.some((item: any) => item.name === singleProduct.name);
      }
      return false;
   }

}

