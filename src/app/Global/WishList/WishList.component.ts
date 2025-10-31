import { Component, OnInit, OnChanges, Input, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { PopupManagerService } from '../../Services/popup-manager.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'embryo-WishList',
  templateUrl: './WishList.component.html',
  styleUrls: ['./WishList.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    CurrencyPipe
  ]
})
export class WishListComponent implements OnInit, OnChanges, OnDestroy {

   @Input() wishListProducts : any;

   @Input() count: number = 0;

   @Input() currency: string = '';

   @Output() removeWishListData : EventEmitter<any> = new EventEmitter();

   @Output() addAllWishlistToCart : EventEmitter<any> = new EventEmitter();

   @Output() addToCart: EventEmitter<any> = new EventEmitter();

   hiddenBadge = true;

   // Mobile responsive properties
   mobWidth: number = 0;
   mobScreenSize: number = 768;

   // Popup state properties
   isPopupOpen: boolean = false;
   showConfirmation: boolean = false;
   productToRemove: any = null;

   // Popup management
   private popupSubscription: Subscription = new Subscription();
   private readonly POPUP_TYPE = 'wishlist';

   constructor(private popupManager: PopupManagerService) { }

   ngOnInit() {
      this.updateScreenSize();
      this.setupPopupSubscription();
   }

   ngOnDestroy() {
      this.popupSubscription.unsubscribe();
   }

   private setupPopupSubscription() {
      this.popupSubscription = this.popupManager.popupState$.subscribe(state => {
         this.isPopupOpen = state.isOpen && state.popupType === this.POPUP_TYPE;
      });
   }

   @HostListener('window:resize', ['$event'])
   onResize(event: any) {
      this.updateScreenSize();
   }

   private updateScreenSize() {
      this.mobWidth = window.innerWidth;
   }

   ngOnChanges() {
      if(this.count && this.count != 0) {
         this.hiddenBadge = false;
      } else {
         this.hiddenBadge = true;
      }
   }

   public confirmationPopup(product:any) {
      this.productToRemove = product;
      this.showConfirmation = true;
   }

   public addAllToCart() {
      this.addAllWishlistToCart.emit(this.wishListProducts);
   }

   public calculatePrice(product: any) {
      let total = 0;
      if (product && typeof product.price === 'number' && typeof product.quantity === 'number') {
         total = product.price * product.quantity;
      } else if (product) {
         total = Number(product.price) * Number(product.quantity) || 0;
      }
      return total;
   }

   public addToCartProduct(product: any) {
      this.addToCart.emit(product);
   }

   // Popup management methods
   public togglePopup() {
      const success = this.popupManager.tryOpenPopup(this.POPUP_TYPE);
      if (!success) {
         console.log('No se puede abrir el popup de wishlist porque hay otro popup abierto');
      }
   }

   public closePopup() {
      this.popupManager.closePopup();
   }

   // Confirmation dialog methods
   public confirmRemove() {
      if (this.productToRemove) {
         this.removeWishListData.emit(this.productToRemove);
         this.productToRemove = null;
      }
      this.showConfirmation = false;
   }

   public cancelRemove() {
      this.showConfirmation = false;
      this.productToRemove = null;
   }

   // Handle remove button click
   public handleRemoveClick(event: Event, product: any) {
      event.stopPropagation();
      this.confirmationPopup(product);
   }

}

