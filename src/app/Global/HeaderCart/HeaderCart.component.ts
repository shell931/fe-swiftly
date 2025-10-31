import { Component, OnInit, OnChanges, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { PopupManagerService } from '../../Services/popup-manager.service';
import { Subscription } from 'rxjs';

@Component({
   selector: 'embryo-HeaderCart',
   templateUrl: './HeaderCart.component.html',
   styleUrls: ['./HeaderCart.component.scss'],
   standalone: true,
   imports: [
      CommonModule,
      RouterModule,
      MatMenuModule,
      MatIconModule,
      MatBadgeModule,
      MatButtonModule,
      CurrencyPipe
   ]
})
export class HeaderCartComponent implements OnInit, OnChanges, OnDestroy {

   @Input() cartProducts : any;
   @Input() count        : any;
   @Input() currency     : string = '';

   mobWidth : any;
   mobScreenSize : number = 1024;

   @Output() removeProductData : EventEmitter<any> = new EventEmitter();
   @Output() editProductData : EventEmitter<any> = new EventEmitter();
   @Output() updateQuantityData : EventEmitter<any> = new EventEmitter();

   hiddenBadge = true;
   isPopupOpen = false;
   showConfirmation = false;
   productToRemove: any = null;

   // Popup management
   private popupSubscription: Subscription = new Subscription();
   private readonly POPUP_TYPE = 'cart';

   constructor(
      private router: Router,
      private popupManager: PopupManagerService
   ) {
      this.updateMobileWidth();
      window.addEventListener('resize', () => {
         this.updateMobileWidth();
      });
   }

   private updateMobileWidth() {
      this.mobWidth = window.innerWidth;
   }



   ngOnInit() {
      // NO configurar event delegation - usar solo eventos directos
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

   private setupNuclearMobileEvents() {
      // Solo manejar overlay y close button, el resto con eventos directos
      document.addEventListener('click', (event: any) => {
         const target = event.target as HTMLElement;

         // Cerrar popup si click en overlay
         if (target.classList.contains('mobile-overlay')) {
            this.closePopup();
         }
      });
   }

   private getProductIndex(productCard: Element): number {
      const container = productCard.parentElement;
      if (!container) return -1;
      return Array.from(container.children).indexOf(productCard);
   }

   public togglePopup() {
      const success = this.popupManager.tryOpenPopup(this.POPUP_TYPE);
      if (!success) {
         console.log('No se puede abrir el popup del carrito porque hay otro popup abierto');
         return;
      }

      // Agregar feedback táctil para dispositivos móviles
      this.addTapFeedback();
      
      // En móviles, no usar overlay para evitar bloqueo de clics
      if (this.mobWidth < this.mobScreenSize) {
         // MODO MÓVIL: Sin overlay para evitar bloqueo de clics
      }
      
      // Pequeño delay para evitar conflictos con el overlay
      if (this.isPopupOpen) {
         setTimeout(() => {
            // Popup completamente abierto
         }, 100);
      }
   }

   private addTapFeedback() {
      // Agregar clase de feedback táctil
      const mobileButton = document.querySelector('.cart-trigger-mobile');
      if (mobileButton) {
         mobileButton.classList.add('tap-feedback');

         // Remover la clase después de la animación
         setTimeout(() => {
            mobileButton.classList.remove('tap-feedback');
         }, 300);
      }
   }

   ngOnChanges() {
      if(this.count && this.count != 0) {
         this.hiddenBadge = false;
      } else {
         this.hiddenBadge = true;
      }
   }

   public confirmationPopup(product:any) {
      this.removeProductData.emit(product);
   }

   public calculatePrice(product: { price: number; quantity: number; }) {
      let total = null;
      total = product.price*product.quantity;
      return total;
   }

   public getTotalPrice(): number {
      if (!this.cartProducts || this.cartProducts.length === 0) {
         return 0;
      }
      return this.cartProducts.reduce((total: number, product: any) => {
         return total + (product.price * product.quantity);
      }, 0);
   }


   public closePopup() {
      this.popupManager.closePopup();
   }

   public handleEditClick(event: Event, product: any) {
      // Prevenir propagación del evento
      if (event) {
         event.preventDefault();
         event.stopPropagation();
      }
      
      // Emitir evento para editar producto
      this.editProductData.emit(product);
   }
   
   // Método de prueba simple
   public testEditButton(product: any) {
      this.editProductData.emit(product);
   }

   public increaseQuantity(event: Event, product: any) {
      // Prevenir propagación del evento
      if (event) {
         event.preventDefault();
         event.stopPropagation();
      }
      
      // Incrementar cantidad
      const updatedProduct = { ...product, quantity: product.quantity + 1 };
      this.updateQuantityData.emit(updatedProduct);
   }

   public decreaseQuantity(event: Event, product: any) {
      // Prevenir propagación del evento
      if (event) {
         event.preventDefault();
         event.stopPropagation();
      }
      
      // Si la cantidad es 1, eliminar el producto
      if (product.quantity <= 1) {
         this.handleRemoveClick(event, product);
         return;
      }
      
      // Decrementar cantidad
      const updatedProduct = { ...product, quantity: product.quantity - 1 };
      this.updateQuantityData.emit(updatedProduct);
   }

   public handleRemoveClick(event: Event, product: any) {
      console.log('=== BOTÓN ELIMINAR CLICKEADO ===');
      console.log('Producto:', product);
      console.log('Ancho de pantalla:', this.mobWidth);
      console.log('Es móvil:', this.mobWidth < this.mobScreenSize);
      
      // Prevenir propagación del evento
      event.preventDefault();
      event.stopPropagation();
      
      // Mostrar diálogo de confirmación en todos los dispositivos
      this.productToRemove = product;
      this.showConfirmation = true;
      console.log('=== DIÁLOGO DE CONFIRMACIÓN MOSTRADO ===');
   }

   public confirmRemove() {
      if (this.productToRemove) {
         this.removeProductData.emit(this.productToRemove);
      }
      
      // Cerrar diálogo
      this.showConfirmation = false;
      this.productToRemove = null;
   }

   public cancelRemove() {
      // Cerrar diálogo sin eliminar
      this.showConfirmation = false;
      this.productToRemove = null;
   }

   public handleGoToCartClick(event: Event) {
      event.preventDefault();
      event.stopPropagation();
      this.closePopup();
      this.updateLocalCartProduct();
   }

   public updateLocalCartProduct() {
      // this.router.navigate(['/checkout']).then(() => {
      this.router.navigate(['/cart']).then(() => {
         window.location.reload();
      });
   }

}

