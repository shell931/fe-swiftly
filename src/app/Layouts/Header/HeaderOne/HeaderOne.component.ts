import { Component, OnInit, HostListener, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { ReactiveFormsModule, UntypedFormControl, FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { EmbryoService } from '../../../Services/Embryo.service';
import { Subject } from 'rxjs';
import { ApiService } from '../../../Services/api.service';
import { environment } from '../../../../../src/environments/environment';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { AppLogoComponent } from '../../../Global/AppLogo/AppLogo.component';
import { HeaderCartComponent } from '../../../Global/HeaderCart/HeaderCart.component';
import { WishListComponent } from '../../../Global/WishList/WishList.component';
import { PromoDialogComponent } from '../../../Global/PromoDialog/PromoDialog.component';
import $ from 'jquery';
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
}

export interface InfoProd {
   name_product: any;
}



interface subcategoryNode {
   id: number;
   name_category: string;
   children?: subcategoryNode[];
}


@Component({
   selector: 'HeaderOne',
   templateUrl: './HeaderOne.component.html',
   styleUrls: ['./HeaderOne.component.scss', './footer-mobile-cart.css'],
   standalone: true,
   imports: [
      CommonModule,
      RouterModule,
      ReactiveFormsModule,
      FormsModule,
      MatMenuModule,
      MatButtonModule,
      MatAutocompleteModule,
      MatOptionModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      // MatDialogModule is not required for service usage in TS here
      AppLogoComponent,
      HeaderCartComponent,
      WishListComponent
   ]
})
export class HeaderOneComponent implements OnInit, OnDestroy {

   get_product: Prod[] = [];
   toggleActive: boolean = false;
   isMobileMenuOpen: boolean = false;
   cartProducts: any;
   popupResponse: any;
   wishlistProducts: any;
   treeControl = new NestedTreeControl<subcategoryNode>(node => node.children);
   dataSourceTree = new MatTreeNestedDataSource<subcategoryNode>();
   category: InfoProd[] = [];
   get_categories: subcategoryNode[] = [];
   id_store: any;
   id: any;
   address: any;
   description : any;
   email : any;
   logo_store : any;
   logo_store_up: any;
   manager : any;
   name_store :any;
   number_identifier :any;
   state_store :any;
   telephone :any;
   id_departament :any;
   id_city :any;
   id_category :any;
   logo_store_save :any;
   city : any;
   department: any;
   public validate_img: boolean = false;

   productsGrid: any;
   url = "/products/accessories/118";

   // Variables to search
   products: any[] = [];
   startAt = new Subject()
   endAt = new Subject()
   lastkeypress: number = 0;

   myControl = new UntypedFormControl('');
   options: string[] = [];
   data: any = '';

   @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

   /** Clear the search input and suggestions */
   clearSearch() {
      try { this.myControl.setValue(''); } catch {}
      this.data = '';
      this.options = [];
   }


   public show: boolean = false;
   public show_add: boolean = false;
   public show_store_pr: boolean = false;
   public show_acces_store: boolean = false;
   public show_acces_sell: boolean = false;
   public show_info: boolean = true;

   // Auto-hide header variables
   private lastScrollTop = 0;
   private scrollThreshold = 5; // Minimum scroll distance to trigger hide/show
   private headerElement: HTMLElement | null = null;
   private isHeaderHidden = false;
   private scrollTimeout: any;

   // Route detection for cart page
   public isOnCartPage = false;

  constructor(
      public embryoService: EmbryoService,
      private apiService: ApiService,
      private router: Router,
      private dialog: MatDialog,
   ) { }

   ngOnInit() {
      // Clear search input to ensure placeholder shows
      this.clearSearch();
      this.data = '';

      this.addBodyClass();
      this.initAutoHideHeader();

      // Check current route and set cart page flag
      this.checkCurrentRoute();
      
      // Subscribe to route changes
      this.router.events.subscribe((event) => {
         if (event instanceof NavigationEnd) {
            this.checkCurrentRoute();
            this.blurSearchInput(); // ensure keyboard hides after navigation
            this.clearSearch(); // clear search value when navigating to home or any page
         }
      });

      // Additional initialization for header
      setTimeout(() => {
         this.ensureHeaderVisibility();
      }, 500);

      this.apiService.getStoreCategories().subscribe(res => this.getCategoriesMenu(res, this.id));
      const token_front = localStorage.getItem('mr-token-front');
      const id_type_user = localStorage.getItem('id_type_user');
      const store = localStorage.getItem('id-store');
      this.id_store = store;
      
      console.log('=== DEBUG AUTHENTICATION ===');
      console.log('token_front:', token_front);
      console.log('id_type_user:', id_type_user);
      console.log('store:', store);
      
      if (token_front) {
         this.show_add = false;
         if (id_type_user == "2") {
            // it's a store
            this.show_store_pr = true;
            this.show = false;
            console.log('User is a store - showing store menu');
            this.apiService.getStoreData(this.id_store).subscribe(res => {
               this.getDataStore(res)
            }, error => console.log(error));
         } else {
            // it's not a store
            this.show = true;
            this.show_store_pr = false;
            console.log('User is not a store - showing regular menu');
         }
         if (store == "null") {
            this.show_acces_sell = true;
         } else {
            this.show_acces_store = true;
         }
      } else {
         this.show = false;
         this.show_store_pr = false;
         this.show_add = true;
         this.show_acces_store = false;
         this.show_acces_sell = true;
         console.log('No token - showing login menu');
      }
      
      console.log('Final menu state:');
      console.log('show:', this.show);
      console.log('show_store_pr:', this.show_store_pr);
      console.log('show_add:', this.show_add);
   }
   private blurSearchInput() {
      try { this.searchInput?.nativeElement.blur(); } catch {}
      try { (document.activeElement as HTMLElement)?.blur?.(); } catch {}
   }

   // Open promo dialog before navigating to Sign In / Register
   public openSignInWithPromo(event?: Event) {
      try { event?.preventDefault?.(); } catch {}
      const promoKey = 'signinPromoShown';
      if (!sessionStorage.getItem(promoKey)) {
         sessionStorage.setItem(promoKey, 'true');
         const dialogRef = this.dialog.open(PromoDialogComponent, {
            panelClass: 'promo-dialog-panel',
            maxWidth: 'none',
            width: 'auto',
            backdropClass: 'promo-backdrop',
            disableClose: false,
            autoFocus: false,
            restoreFocus: false,
            data: {
              imageUrl: 'https://market-docus-v2.s3.us-east-2.amazonaws.com/Modal+Crear+tienda.png',
              alt: 'Crea tu tienda'
            }
         });
         dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/session/signin']);
         });
      } else {
         this.router.navigate(['/session/signin']);
      }
   }

trackByFn(index: number, item: any): any {
  return item || index;
}

trackByCategoryId(index: number, item: any): any {
  return item?.id || index;
}
   addBodyClass() {

         window.addEventListener('load', function () {
             const b = document.querySelector('body');
             if (b) b.classList.add("loaded");
          });


       $(document).ready(() => {
         // Auto-hide header functionality is handled by initAutoHideHeader() in ngOnInit
         // Mobile menu functionality is now handled by Angular (toggleMobileMenu method)
      });


    }


   getDataStore(response) {

      this.address = response.address;
      this.description = response.description;
      this.email = response.email;
      this.logo_store = response.logo_store;
      this.manager = response.manager;
      this.name_store = response.name_store;
      this.number_identifier = response.number_identifier;
      this.state_store = response.state_store;
      this.telephone = response.telephone;
      this.id_departament = response.id_departament;
      this.id_city = response.city_id;
      this.id_category = response.storecategories;

      if(this.logo_store){
          this.validate_img = false;
      }else{
         this.validate_img = true;
      }

      this.city = response.city;
      this.department = response.departament;
      this.category = response.storecategories_description;

   }

   exit_store_front() {
      console.log('=== EJECUTANDO EXIT_STORE_FRONT ===');
      localStorage.removeItem('mr-token-front');
      localStorage.removeItem('id_type_user');
      localStorage.removeItem('id_user_front');
      localStorage.removeItem('mr-token');
      localStorage.removeItem('id-store');
      localStorage.removeItem('id-user');
      localStorage.removeItem('user_email');
      localStorage.removeItem('personal_name');
      localStorage.removeItem('LocationDetail');
      localStorage.removeItem('firebase');
      this.router.navigate(['/session/signin']).then(() => {
         window.location.reload();
      });;

   }


   public toggleSearch() {
      document.querySelector('app-main').classList.toggle('form-open');
   }

   public toggleSidebar() {
      this.embryoService.sidenavOpen = !this.embryoService.sidenavOpen;
   }

   public toggleMobileMenu() {
      console.log('=== TOGGLE MOBILE MENU ===', this.isMobileMenuOpen);
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
   }
   
   public closeMobileMenu() {
      this.isMobileMenuOpen = false;
   }
   
   @HostListener('document:keydown.escape', ['$event'])
   onEscapeKey(event: KeyboardEvent) {
      if (this.isMobileMenuOpen) {
         this.closeMobileMenu();
      }
   }
   

   public onMenuClick(menuItem: string) {
      console.log('=== MENU CLICK ===', menuItem);
   }

   public onCommerceMenuClick(menuItem: string) {
      console.log('=== COMERCIO MENU CLICK ===', menuItem);
      console.log('show_store_pr:', this.show_store_pr);
      console.log('validate_img:', this.validate_img);
   }

   public closeMobileMenuOnBackdrop(event: Event) {
      // Cerrar si el click es en el backdrop (mainMenu) o fuera del contenido
      const target = event.target as HTMLElement;
      const currentTarget = event.currentTarget as HTMLElement;
      
      // Si el click es en el div mainMenu directamente (backdrop) o fuera de la lista
      if (target === currentTarget || target.classList.contains('mainMenu')) {
         this.isMobileMenuOpen = false;
      }
      
      // También cerrar si el click es fuera de .table-cell (el contenido)
      if (!target.closest('.table-cell') && target.closest('.mainMenu')) {
         this.isMobileMenuOpen = false;
      }
   }

   public directRemoveProduct(value: any) {
      console.log('=== ELIMINANDO PRODUCTO DIRECTAMENTE EN HEADER ===');
      console.log('Value:', value);
      
      // ELIMINAR DIRECTAMENTE
      this.embryoService.removeLocalCartProduct(value);
      
      console.log('=== PRODUCTO ELIMINADO DEL SERVICIO ===');
   }

   public handleUpdateQuantity(value: any) {
      console.log('=== ACTUALIZANDO CANTIDAD EN HEADER ===');
      console.log('Producto con nueva cantidad:', value);
      
      // Actualizar cantidad sin mostrar notificaciones
      this.embryoService.updateCartProductQuantity(value);
      
      console.log('=== CANTIDAD ACTUALIZADA EN EL SERVICIO ===');
      console.log('Nueva cantidad:', value.quantity);
   }

   public handleEditProduct(value: any) {
      console.log('=== EDITANDO PRODUCTO EN HEADER ===');
      console.log('Producto editado:', value);
      
      // Primero remover el producto anterior
      this.embryoService.removeLocalCartProduct(value);
      
      // Luego agregar el producto con la nueva cantidad
      this.embryoService.addToCart(value);
      
      console.log('=== PRODUCTO ACTUALIZADO EN EL SERVICIO ===');
      console.log('Nueva cantidad:', value.quantity);
   }

   public openConfirmationPopup(value: any) {
      let message = "Estas seguro de eliminar este item?";
      this.embryoService.confirmationPopup(message).
         subscribe(res => { this.popupResponse = res },
            err => console.log(err),
            () => this.getPopupResponse(this.popupResponse, value, 'cart')
         );
   }

   public getPopupResponse(response: any, value: any, type) {
      if (response) {
         if (type == 'cart') {
            this.embryoService.removeLocalCartProduct(value);
         } else {
            this.embryoService.removeLocalWishlistProduct(value);
         }
      }
   }

   public addAllWishlistToCart(values: any) {
      this.embryoService.addAllWishListToCart(values);
   }

   public openWishlistConfirmationPopup(value: any) {
      // Eliminar directamente sin segundo diálogo de confirmación
      this.embryoService.removeLocalWishlistProduct(value);
   }

   public selectedCurrency(value: any) {
      this.embryoService.currency = value;
   }

   public selectedLanguage(value: any) {
      this.embryoService.language = value;
   }

   public addToCart(value: any) {
      this.embryoService.addToCart(value, 'wishlist');
   }

   public search($event: any) {
      if ($event.timeStamp - this.lastkeypress > 200) {
         // defensive: event may not have target/value
         try{ console.log($event.target?.value); }catch(e){}
         this.apiService.getProductsWithoutAuth().subscribe((res: any) => this.getProductData(res));
      }
      this.lastkeypress = $event.timeStamp
   }



   getPosts(string_search: string) {
      // Hide mobile keyboard on iOS by removing focus before navigation
      try { this.searchInput?.nativeElement.blur(); } catch {}
      try { (document.activeElement as HTMLElement)?.blur?.(); } catch {}
      this.router.navigate(['/search/' + string_search])
         .then(() => {
            window.scrollTo({ top: 0 });
         });
   }

   getPostsEnter(event: any) {
      try { event?.preventDefault?.(); } catch {}
      const string_search = (this.myControl.value as string) || '';
      // Hide mobile keyboard on iOS by removing focus before navigation
      try { this.searchInput?.nativeElement.blur(); } catch {}
      try { (document.activeElement as HTMLElement)?.blur?.(); } catch {}
      this.router.navigate(['/search/' + string_search])
         .then(() => {
            window.scrollTo({ top: 0 });
         });
   }

   public updated(event: any) {
      let key_arrow = event.keyCode;
      if (key_arrow == 37 || key_arrow == 38 || key_arrow == 39 || key_arrow == 40) {
         return false;
      } else {
         this.options = [];
         if (this.myControl.value.length > 0) {
            // console.log(this.myControl);
            this.apiService.FilterProducts(this.myControl.value).subscribe(
               (data: InfoProd[]) => {
                  let all = []
                  for (var i in data) {
                     let get_name_product = data[i]['name_product'];
                     all.push(get_name_product);
                  }
                  let searchedWord = this.myControl.value
                  for (let key in all) {
                     let r = all[key].search(new RegExp(searchedWord, "i"));
                     if (r != -1) {
                        this.options.push(all[key])
                     }
                  }

               },
               error => console.log(error)
            );

         } else {
            this.options = []
         }
      }
   }


   getCategoriesMenu(response: any, id_store: any) {
      this.get_categories = [];
      for (var i = 0; i < response.length; i++) {
          // let subcategor = this.createSubcategories(response[i].rel_categories, id_store);
          this.get_categories.push(
              {
                  id: response[i].id,
                  name_category: response[i].name_category

              });
      }

      this.dataSourceTree.data = this.get_categories;
      console.log(this.dataSourceTree.data);
  }


   getProductData(response: any) {
      this.get_product = [];

      let length
      if (response.length < 12) {
         length = response.length;
      } else {
         length = 12;
      }

      for (var i = 0; i < length; i++) {
         let get_image = environment.api.baseBucketImageUrl + response[i].image;
         let get_name_product = response[i].name_product;
         let get_total_price = response[i].total_price;
         let get_produc_code = response[i].product_code;
         let get_brand = response[i].brand;
         let get_product_code = response[i].product_code;
         let get_discount_price = response[i].discount_price;
         let get_id_product = response[i].id_product;
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
            id_store: get_id_store,
            route_product: '/products/accessories/' + get_id_product
         });
      }
      // console.log(this.get_product);
      this.productsGrid = this.get_product;
   }

   public RouteAssitedSelling() {
      this.router.navigate(['/account/assisted_selling']).then(() => {
         window.location.reload();
     });
   }

   // Auto-hide header methods
   private initAutoHideHeader() {
      // Wait for DOM to be ready
      setTimeout(() => {
         // Try multiple selectors to find the header
         this.headerElement = document.querySelector('header.kompraloheader') || 
                             document.querySelector('#header') ||
                             document.querySelector('header') ||
                             document.querySelector('.fixedheader') ||
                             document.querySelector('.header-middle');
         
         if (this.headerElement) {
            // Add initial styles
            this.headerElement.style.transition = 'transform 0.3s ease-in-out';
            this.headerElement.style.transform = 'translateY(0)';
            this.isHeaderHidden = false;
         }
      }, 200);
   }

   @HostListener('window:scroll', ['$event'])
   onWindowScroll() {
      // Clear any existing timeout
      if (this.scrollTimeout) {
         clearTimeout(this.scrollTimeout);
      }

      // Re-find header element if not found initially
      if (!this.headerElement) {
         this.headerElement = document.querySelector('header.kompraloheader') || 
                             document.querySelector('#header') ||
                             document.querySelector('header') ||
                             document.querySelector('.fixedheader') ||
                             document.querySelector('.header-middle');
      }

      if (!this.headerElement) return;

      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollDifference = Math.abs(currentScrollTop - this.lastScrollTop);

      // Always show header when at the top of the page
      if (currentScrollTop <= 50) {
         if (this.isHeaderHidden) {
            this.headerElement.style.transform = 'translateY(0)';
            this.isHeaderHidden = false;
         }
         this.lastScrollTop = currentScrollTop;
         return;
      }

      // Only trigger if scroll difference is significant
      if (scrollDifference < this.scrollThreshold) return;

      // Hide when scrolling down, show when scrolling up
      if (currentScrollTop > this.lastScrollTop && currentScrollTop > 100) {
         // Scrolling down - hide header
         if (!this.isHeaderHidden) {
            this.headerElement.style.transform = 'translateY(-100%)';
            this.isHeaderHidden = true;
         }
      } else if (currentScrollTop < this.lastScrollTop) {
         // Scrolling up - show header (always show when scrolling up)
         if (this.isHeaderHidden) {
            this.headerElement.style.transform = 'translateY(0)';
            this.isHeaderHidden = false;
         }
      }

      this.lastScrollTop = currentScrollTop;

      // Set timeout to ensure header shows after scroll stops
      this.scrollTimeout = setTimeout(() => {
         if (this.headerElement && this.isHeaderHidden) {
            this.headerElement.style.transform = 'translateY(0)';
            this.isHeaderHidden = false;
         }
      }, 150);
   }

   // Ensure header is visible and properly initialized
   private ensureHeaderVisibility() {
      if (!this.headerElement) {
         this.headerElement = document.querySelector('header.kompraloheader') || 
                             document.querySelector('#header') ||
                             document.querySelector('header') ||
                             document.querySelector('.fixedheader') ||
                             document.querySelector('.header-middle');
      }

      if (this.headerElement) {
         this.headerElement.style.transition = 'transform 0.3s ease-in-out';
         this.headerElement.style.transform = 'translateY(0)';
         this.isHeaderHidden = false;
      }
   }

   // Check if current route is cart page
   private checkCurrentRoute() {
      const currentUrl = this.router.url;
      this.isOnCartPage = currentUrl === '/cart' || currentUrl.startsWith('/cart');
   }

   ngOnDestroy() {
      // Clean up if needed
      if (this.scrollTimeout) {
         clearTimeout(this.scrollTimeout);
      }
      if (this.headerElement) {
         this.headerElement.style.transform = 'translateY(0)';
         this.headerElement.style.transition = '';
      }
   }

}



