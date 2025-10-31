import { HostListener,Component, OnInit, OnChanges, Input, Output, EventEmitter, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
// import { Observable, of as observableOf, interval, Subscription } from 'rxjs';
import { map, take, delay, withLatestFrom, finalize, tap } from 'rxjs/operators';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { EmbryoService } from '../Services/Embryo.service';
// import { MenuItems } from '../Core/menu/menu-items/menu-items';
import { Directionality } from '@angular/cdk/bidi';
import { TranslateService } from '@ngx-translate/core';
import { Meta, Title } from "@angular/platform-browser";
// import { ApiService } from '../Services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { UntypedFormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderOneComponent } from '../Layouts/Header/HeaderOne/HeaderOne.component';
import { FooterOneComponent } from '../Layouts/Footer/FooterOne/FooterOne.component';


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

@Component({
   selector: 'app-main-admin-panel',
   templateUrl: './Main.component.html', // Use simple template for testing
   styleUrls: ['./Main.component.scss'],
   standalone: true,
   imports: [
      CommonModule,
      RouterModule,
      RouterOutlet,
      MatSidenavModule,
      MatListModule,
      MatButtonModule,
      MatCardModule,
      MatIconModule,
      MatToolbarModule,
      HeaderOneComponent, 
      FooterOneComponent,
  
   ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class MainComponent implements OnInit {

   @Input() cartProducts : any;
   @Input() count        : any;
   @Input() currency     : string | undefined;

   timer = 0;
   isRtl: any;
   // private _dirChangeSubscription = Subscription.EMPTY;
   currentUrl: any;
   myControl = new UntypedFormControl();

   get_product: Prod[] = [];
   toggleActive: boolean = false;

   popupResponse: any;
   wishlistProducts: any;

   category: InfoProd[] = [];

   productsGrid: any;
   url = "/products/accessories/118";

   // Variables to search
   products: any;
   // startAt = new Subject()
   // endAt = new Subject()
   lastkeypress: number = 0;
   options: string[] = [];
   data: any;


   constructor(private loader: LoadingBarService,
      public embryoService: EmbryoService,
      // public menuItems: MenuItems,
      // dir: Directionality,
      public translate: TranslateService,
      private router: Router,
      meta: Meta, title: Title,
      private activatedRoute: ActivatedRoute,
      // private apiService: ApiService,
      private cookieService: CookieService,
   ) {


      title.setTitle('Swiftly');

      meta.addTags([
         { name: 'author', content: 'The IRON Network' },
         { name: 'keywords', content: ' angular, angular 2, angular 6, angular 7, angular material, clean, creative, ecommerce, frontend, online store, shop, shopping, store, typescript, ui framework ' },
         { name: 'description', content: 'Embryo is an E-Commerce angular 7 based template with material design. It also comes with Angular cli. Now you have all the power to maintain your ecommerce site. Responsive design gives your user to use in any modern devices. Clean Code gives you the power to customize the code as per as your requirments. Embryo has all the basics functionality which is required in ecommerce site. Rtl design makes the multi-language support with more easy way.' }
      ]);

      if (this.embryoService.isDirectionRtl) {
         this.isRtl = 'rtl';
      } else {
         this.isRtl = 'ltr';
      }

      this.router.events
         .subscribe((event) => {
            if (event instanceof NavigationEnd) {
               this.currentUrl = event.url;
            }
         });
   }

   ngOnInit() {
      const mrToken = this.cookieService.get('mr-token');
      if (!mrToken) {
         //  this.router.navigate(['/home']);
      } else {
         console.log("die");
      }
      // this.startTimer();
      // document.getElementById('html').classList.remove("admin-panel");
      // document.getElementById('html').classList.add("user-end");
   }



   // public startTimer() {
   //    this.timer = 0;
   //    interval(1000).pipe(
   //       take(3),
   //       tap(value => { this.timer = value + 1; }),
   //       finalize(() => this.loader.complete()),
   //    ).subscribe();

   //    // We're sure that subscription has been made, we can start loading bar service
   //    this.loader.start();
   // }

   public hideSideNav() {
      this.embryoService.sidenavOpen = false;
   }

   public changeDirection() {
      if (this.isRtl == "rtl") {
         this.isRtl = "ltr";
         this.embryoService.isDirectionRtl = false;
      } else {
         this.isRtl = "rtl"
         this.embryoService.isDirectionRtl = true;
      }

      this.embryoService.featuredProductsSelectedTab = 0;
      this.embryoService.newArrivalSelectedTab = 0;
   }

   /**
    * On window scroll add class header-fixed.
    */
   @HostListener('window:scroll', ['$event'])
   onScrollEvent($event: any) {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const appMain = document.querySelector('app-main');
      if (scrollTop >= 200) {
         if (appMain) appMain.classList.add("header-fixed");
      } else {
         if (appMain) appMain.classList.remove("header-fixed");
      }
   }

   /**
     *As router outlet will emit an activate event any time a new component is being instantiated.
     */
   onActivate(e: any) {
      window.scroll(0, 0);
   }



   public toggleSearch() {
      const appMain = document.querySelector('app-main');
      if (appMain) appMain.classList.toggle('form-open');
   }

   public toggleSidebar() {
      this.embryoService.sidenavOpen = !this.embryoService.sidenavOpen;
   }

   public getPopupResponse(response: any, value: any, type: any) {
      if (response) {
         if (type == 'cart') {
            this.embryoService.removeLocalCartProduct(value);
         } else {
            this.embryoService.removeLocalWishlistProduct(value);
         }
      }
   }




}

