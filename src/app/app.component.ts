import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { GlobalModule } from './Global/Global.module';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoaderComponent } from './Global/Loader/Loader.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet, GlobalModule, LoadingBarModule, LoaderComponent],
})
export class AppComponent implements AfterViewInit {
  title = 'Swiftly';
  
  @ViewChild('animatedElement', { static: false }) animatedElement!: ElementRef;
  
  constructor(private router: Router, private viewportScroller: ViewportScroller) {
    // Inicialización del componente
    try { if ('scrollRestoration' in history) { (history as any).scrollRestoration = 'manual'; } } catch {}
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Forzar scroll al tope en toda navegación (múltiples estrategias)
        this.forceScrollTop();
      }
    });
  }

  private forceScrollTop() {
    try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch {}
    try { this.viewportScroller.scrollToPosition([0, 0]); } catch {}
    try { document.documentElement.scrollTop = 0; } catch {}
    try { (document.scrollingElement as HTMLElement).scrollTop = 0; } catch {}
    try { document.body.scrollTop = 0; } catch {}

    const selectors = [
      'html', 'body', 'main', '#main', '.main-content', '.content', '.page-content',
      '.container-fluid', '.store-page-container', '.store-main', '.container_search',
      'mat-sidenav-content', '.mat-drawer-content', '.cdk-virtual-scroll-viewport'
    ];
    try {
      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach((el) => {
          try { (el as HTMLElement).scrollTop = 0; } catch {}
        });
      });
    } catch {}

    // Reintentar tras render para casos con lazy content
    try {
      requestAnimationFrame(() => {
        setTimeout(() => {
          try { window.scrollTo(0, 0); } catch {}
          try { this.viewportScroller.scrollToPosition([0, 0]); } catch {}
        }, 0);
      });
    } catch {}
  }

  ngAfterViewInit() {
    // Configurar animaciones usando Web Animations API
    this.setupAnimations();
    // Fix buttons to ensure they work
    this.fixButtons();
  }

  /**
   * Fix Material buttons to ensure they capture clicks properly
   */
  private fixButtons() {
    // Use setTimeout to ensure DOM is fully rendered
    setTimeout(() => {
      // Find all Material buttons
      const buttons = document.querySelectorAll('button[mat-button], button[mat-raised-button], button[mat-flat-button], button[mat-stroked-button], button[mat-icon-button], button[mat-fab], button[mat-mini-fab], button.mat-mdc-button');
      
      buttons.forEach((button: Element) => {
        const btn = button as HTMLElement;
        
        // Skip specific buttons that should not have high z-index
        const isAddCardBtn = btn.classList.contains('add-card-btn');
        const isAddAddressBtn = btn.classList.contains('add-address-btn');
        const isCreateProductBtn = btn.classList.contains('create-product-btn');
        const isChatBtn = btn.classList.contains('chat-btn');
        const shouldUseLowZIndex = isAddCardBtn || isAddAddressBtn || isCreateProductBtn || isChatBtn;
        
        // Ensure button has pointer-events
        btn.style.pointerEvents = 'auto';
        btn.style.cursor = 'pointer';
        btn.style.position = shouldUseLowZIndex ? 'static' : 'relative';
        btn.style.zIndex = shouldUseLowZIndex ? '1' : '1000';
        
        // Make all decorative elements non-interactive
        const decorativeElements = btn.querySelectorAll('.mat-focus-indicator, .mat-mdc-button-touch-target, .mat-mdc-button-ripple, .mat-ripple, .mat-ripple-element, .mdc-button__ripple, .mdc-button__touch');
        decorativeElements.forEach((el: Element) => {
          const elem = el as HTMLElement;
          elem.style.pointerEvents = 'none';
          elem.style.position = 'absolute';
          elem.style.zIndex = '-1';
        });
        
        // Ensure button content doesn't block clicks
        const content = btn.querySelectorAll('*');
        content.forEach((el: Element) => {
          const elem = el as HTMLElement;
          if (!elem.classList.contains('mat-focus-indicator') && 
              !elem.classList.contains('mat-mdc-button-touch-target')) {
            elem.style.pointerEvents = 'none';
          }
        });
      });
    }, 100);
    
    // Re-apply fix after route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.fixButtons();
        }, 200);
      }
    });
  }

  /**
   * Configura animaciones usando la Web Animations API nativa
   */
  private setupAnimations() {
    // Definir keyframes para animación de fade in
    const fadeInKeyframes = [
      { opacity: 0, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ];

    const fadeInOptions: KeyframeAnimationOptions = {
      duration: 300,
      easing: 'ease-out',
      fill: 'forwards'
    };

    // Aplicar animación si el elemento existe
    if (this.animatedElement?.nativeElement) {
      this.animatedElement.nativeElement.animate(fadeInKeyframes, fadeInOptions);
    }
  }

  /**
   * Anima la entrada de un elemento
   */
  animateIn(element: HTMLElement) {
    const keyframes = [
      { 
        opacity: 0, 
        transform: 'translateX(100px) scale(0.8)',
        offset: 0 
      },
      { 
        opacity: 0.5, 
        transform: 'translateX(50px) scale(0.9)',
        offset: 0.5 
      },
      { 
        opacity: 1, 
        transform: 'translateX(0) scale(1)',
        offset: 1 
      }
    ];

    const options: KeyframeAnimationOptions = {
      duration: 400,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards'
    };

    return element.animate(keyframes, options);
  }

  /**
   * Anima la salida de un elemento
   */
  animateOut(element: HTMLElement) {
    const keyframes = [
      { opacity: 1, transform: 'translateX(0) scale(1)' },
      { opacity: 0, transform: 'translateX(-100px) scale(0.8)' }
    ];

    const options: KeyframeAnimationOptions = {
      duration: 300,
      easing: 'ease-in',
      fill: 'forwards'
    };

    return element.animate(keyframes, options);
  }

  /**
   * Animación de slide con bounce
   */
  slideWithBounce(element: HTMLElement) {
    const keyframes = [
      { transform: 'translateY(-100px)', opacity: 0 },
      { transform: 'translateY(20px)', opacity: 0.8 },
      { transform: 'translateY(-10px)', opacity: 0.9 },
      { transform: 'translateY(0)', opacity: 1 }
    ];

    const options: KeyframeAnimationOptions = {
      duration: 600,
      easing: 'ease-out',
      fill: 'forwards'
    };

    return element.animate(keyframes, options);
  }

  /**
   * Animación de rotación con fade
   */
  rotateAndFade(element: HTMLElement) {
    const keyframes = [
      { 
        opacity: 0, 
        transform: 'rotate(-180deg) scale(0.5)',
        filter: 'blur(5px)' 
      },
      { 
        opacity: 0.7, 
        transform: 'rotate(-90deg) scale(0.8)',
        filter: 'blur(2px)' 
      },
      { 
        opacity: 1, 
        transform: 'rotate(0deg) scale(1)',
        filter: 'blur(0px)' 
      }
    ];

    return element.animate(keyframes, {
      duration: 500,
      easing: 'ease-in-out',
      fill: 'forwards'
    });
  }

  /**
   * Animación en cadena para múltiples elementos
   */
  async animateList(elements: HTMLElement[], delay: number = 100) {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      
      // Aplicar animación
      this.animateIn(element);
      
      // Esperar el delay antes del siguiente elemento
      if (i < elements.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Método para manejar eventos de clic con animación
   */
  onElementClick(event: Event) {
    const element = event.target as HTMLElement;
    
    // Animación de pulso al hacer clic
    const pulseKeyframes = [
      { transform: 'scale(1)' },
      { transform: 'scale(1.1)' },
      { transform: 'scale(1)' }
    ];

    element.animate(pulseKeyframes, {
      duration: 200,
      easing: 'ease-in-out'
    });
  }

  /**
   * Animación de hover usando CSS custom properties
   */
  onMouseEnter(event: Event) {
    const element = event.target as HTMLElement;
    
    element.animate([
      { transform: 'translateY(0px)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
      { transform: 'translateY(-5px)', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }
    ], {
      duration: 200,
      fill: 'forwards',
      easing: 'ease-out'
    });
  }

  onMouseLeave(event: Event) {
    const element = event.target as HTMLElement;
    
    element.animate([
      { transform: 'translateY(-5px)', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' },
      { transform: 'translateY(0px)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
    ], {
      duration: 200,
      fill: 'forwards',
      easing: 'ease-in'
    });
  }

  /**
   * Animación de página usando Intersection Observer
   */
  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateIn(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    // Observar elementos con clase 'animate-on-scroll'
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }}
