import { Component, OnInit, Input, OnChanges, OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-page-one-slider',
  templateUrl: './HomePageOneSlider.component.html',
  styleUrls: ['./HomePageOneSlider.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class HomePageOneSliderComponent implements OnInit, OnChanges, OnDestroy {

   @Input() isRTL : boolean = false;

   slideConfig : any;
   currentSlide: number = 0;
   autoSlideInterval: any;

   // Array de banners modernos para el carousel
   banners = [
     {
       id: 1,
       image: 'assets/kompralostyle/image/catalog/slideshow/home3/slide1.jpg',
       title: '¡LANZAMIENTOS!',
       subtitle: 'HASTA 40% OFF',
       description: 'Televisores Smart TV de las mejores marcas',
       brands: ['Samsung', 'LG', 'Panasonic', 'Sony'],
       buttonText: 'Ver Ofertas',
       link: '/products'
     },
     {
       id: 2,
       image: 'assets/kompralostyle/image/catalog/slideshow/home3/slide3.jpg',
       title: '¡NUEVOS PRODUCTOS!',
       subtitle: 'HASTA 30% OFF',
       description: 'Smartphones y Tablets de última generación',
       brands: ['Apple', 'Samsung', 'Huawei', 'OnePlus'],
       buttonText: 'Comprar Ahora',
       link: '/products'
     },
     {
       id: 3,
       image: 'assets/kompralostyle/image/catalog/slideshow/home3/sliderbanner.jpg',
       title: 'OFERTAS ESPECIALES',
       subtitle: 'HASTA 50% OFF',
       description: 'Productos seleccionados con descuentos increíbles',
       brands: ['Sony', 'Apple', 'Samsung'],
       buttonText: 'Ver Todo',
       link: '/products'
     }
   ];

  constructor() { }

  ngOnInit() {
    // Iniciar el carousel automático
    this.startAutoSlide();
    
    // Optimizar la carga de imágenes
    this.optimizeImageLoading();
  }

  // Método para generar srcset responsivo para las imágenes
  getResponsiveImageSrc(imagePath: string): string {
    const basePath = imagePath.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    const extension = imagePath.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] || '.jpg';
    
    // Generar diferentes tamaños para srcset
    const sizes = [
      { width: 480, suffix: '_480w' },
      { width: 768, suffix: '_768w' },
      { width: 1024, suffix: '_1024w' },
      { width: 1200, suffix: '_1200w' },
      { width: 1920, suffix: '_1920w' }
    ];
    
    return sizes.map(size => 
      `${basePath}${size.suffix}${extension} ${size.width}w`
    ).join(', ');
  }

  // Método para precargar la siguiente imagen
  preloadNextImage(): void {
    const nextIndex = (this.currentSlide + 1) % this.banners.length;
    const nextBanner = this.banners[nextIndex];
    
    if (nextBanner) {
      const img = new Image();
      img.src = nextBanner.image;
      img.loading = 'eager';
    }
  }

  // Método para optimizar la carga de imágenes
  optimizeImageLoading(): void {
    // Precargar la siguiente imagen
    this.preloadNextImage();
    
    // Precargar todas las imágenes después de un delay
    setTimeout(() => {
      this.banners.forEach(banner => {
        const img = new Image();
        img.src = banner.image;
        img.loading = 'lazy';
      });
    }, 1000);
  }

   ngOnDestroy() {
     this.stopAutoSlide();
   }

   ngOnChanges() {
      this.slideConfig = {
         slidesToShow: 1,
         slidesToScroll:1,
         autoplay: true,
         autoplaySpeed: 2000,
         dots: false,
         rtl: this.isRTL,
         responsive: [
          {
             breakpoint: 768,
             settings: {
                arrows: false,
                slidesToShow: 1
             }
             },
          {
             breakpoint: 480,
             settings: {
                arrows: false,
                slidesToShow: 1
             }
          }
         ]
      };
   }

   startAutoSlide() {
     this.autoSlideInterval = setInterval(() => {
       this.nextSlide();
     }, 5000); // Cambiar cada 5 segundos
   }

   stopAutoSlide() {
     if (this.autoSlideInterval) {
       clearInterval(this.autoSlideInterval);
     }
   }

   nextSlide() {
     this.currentSlide = (this.currentSlide + 1) % this.banners.length;
     // Precargar la siguiente imagen
     this.preloadNextImage();
   }

   prevSlide() {
     this.currentSlide = this.currentSlide === 0 ? this.banners.length - 1 : this.currentSlide - 1;
   }

   goToSlide(index: number) {
     this.currentSlide = index;
   }

   pauseAutoSlide() {
     this.stopAutoSlide();
   }

   resumeAutoSlide() {
     this.startAutoSlide();
   }

   onMouseEnter() {
     this.stopAutoSlide();
   }

   onMouseLeave() {
     this.startAutoSlide();
   }

   onImageError(event: any, banner: any) {
     console.log('Error cargando imagen:', banner.image);
     // Usar una imagen por defecto si la original falla
     event.target.src = 'assets/images/default-banner.jpg';
   }

}

