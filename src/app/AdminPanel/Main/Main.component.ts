import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AdminPanelServiceService } from '../Service/AdminPanelService.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { EmbryoService } from '../../Services/Embryo.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SideBarComponent } from '../Shared/SideBar/SideBar.component';
import { AdminHeaderComponent } from '../Shared/Header/Header.component';

@Component({
    selector: 'app-main-admin-panel',
    templateUrl: './Main.component.html',
    styleUrls: ['./Main.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatSidenavModule,
        SideBarComponent,
        AdminHeaderComponent
    ]
})

export class MainAdminPanelComponent implements OnInit, OnDestroy {

    deviceInfo: any = null;
    private _mediaSubscription: Subscription;
    private _routerEventsSubscription: Subscription;
    private _router: Subscription;
    isMobile: boolean = false;
    isMobileStatus: boolean;
    layout: any = "ltr";
    rtlStatus: boolean = false;

    /** Used for toggle the sidebar menu. **/
    @ViewChild('sidenav', { static: true }) sidenav;

    constructor(public coreService: AdminPanelServiceService,
        public router: Router,
        private activatedRoute: ActivatedRoute,
        // private deviceService: any,
        // private media: MediaObserver,
        private cookieService: CookieService,
        public embryoService: EmbryoService, ) { }

    ngOnInit() {
        console.log("ngOnInit - MainAdminPanelComponent");
        this.addBodyClass();

        // Verificar token inicial
        this.checkAuthentication();

        // Verificar token en cada cambio de navegación
        this._routerEventsSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                // Verificar autenticación en cada navegación
                this.checkAuthentication();

                // Cerrar sidenav en mobile
                if (this.isMobile) {
                    this.sidenav.close();
                }
            }
        });

        // TODO: Fix DeviceDetectorService import
        // this.deviceInfo = this.deviceService.getDeviceInfo();
        if (this.deviceInfo && (this.deviceInfo.device == 'ipad' || this.deviceInfo.device == 'iphone' || this.deviceInfo.device == 'android')) {
            this.coreService.sidenavMode = 'over';
            this.coreService.sidenavOpen = false;
        }

        if ((this.activatedRoute.snapshot.url[0]?.path) == 'admin-panel') {
            // document.getElementById('html').classList.add('admin-panel');
        } else {
            // document.getElementById('html').classList.remove("user-end");
        }
    }

    /**
     * Verificar si el usuario está autenticado
     */
    private checkAuthentication(): void {
        const mrToken = this.cookieService.get('mr-token');
        console.log("Verificando token:", mrToken ? "Existe" : "No existe");

        if (!mrToken || mrToken.trim() === '') {
            console.log("No hay token válido, redirigiendo a /auth");
            this.router.navigate(['/auth']).then(() => {
                // Forzar recarga si es necesario
                if (window.location.pathname !== '/auth') {
                    window.location.href = '/auth';
                }
            });
        }
    }

    get sidenavMode(): 'side' | 'over' | 'push' {
        return this.coreService.sidenavMode as 'side' | 'over' | 'push';
    }


    addBodyClass() {

        window.addEventListener('load',function(){
           document.querySelector('body').classList.add("loaded")
         });


         var className = "inverted";
         var scrollTrigger = 60;

         window.onscroll = function() {

           if (window.scrollY >= scrollTrigger || window.pageYOffset >= scrollTrigger) {
             document.getElementsByClassName("fixedheader")[0].classList.add(className);
             document.getElementsByClassName("back-to-top")[0].classList.add("visible");
           } else {
             document.getElementsByClassName("fixedheader")[0].classList.remove(className);
             document.getElementsByClassName("back-to-top")[0].classList.remove("visible");
           }
         };


      }

    logout(){
        console.log("Cerrando sesión...");
        // Eliminar cookie y localStorage
        this.cookieService.delete('mr-token');
        this.cookieService.delete('mr-token', '/'); // Eliminar también de la ruta raíz
        localStorage.clear();
        sessionStorage.clear();

        // Remover clase del body si existe
        document.getElementById('html')?.classList.remove("admin-panel");

        // Navegar a auth y forzar recarga
        this.router.navigate(['/auth']).then(() => {
            window.location.href = '/auth';
        });
    }


    /**
      * changeRTL method is used to change the layout of template rtl.
      */
    changeRTL() {
        this.layout = "rtl"
        this.rtlStatus = true;
    }

    /**
      * changeLTR method is used to change the layout of template ltr.
      */
    changeLTR() {
        this.layout = "ltr"
        this.rtlStatus = false;
    }

    /**
      *As router outlet will emit an activate event any time a new component is being instantiated.
      */
    onActivate(e) {
        window.scroll(0, 0);
    }

    /**
     * Cleanup subscriptions
     */
    ngOnDestroy() {
        if (this._routerEventsSubscription) {
            this._routerEventsSubscription.unsubscribe();
        }
        if (this._mediaSubscription) {
            this._mediaSubscription.unsubscribe();
        }
        if (this._router) {
            this._router.unsubscribe();
        }
    }
}

