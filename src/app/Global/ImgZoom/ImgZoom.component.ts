import { Component, OnInit, Renderer2, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import { trigger, transition, useAnimation } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'embryo-ImgZoom',
  templateUrl: './ImgZoom.component.html',
  styleUrls: ['./ImgZoom.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class ImgZoomComponent implements OnInit {

   img!: { parentElement: any; width: number; height: number; getBoundingClientRect: () => any; }; lens!: { offsetWidth: number; offsetHeight: number; }; result!: { offsetWidth: number; offsetHeight: number; }; cx!: number; cy!: number; container: any;
   hide = true;
   _triggerAnimationIn = false;
   notFirstTime = false;

   constructor(private renderer: Renderer2, private el: ElementRef) { }

   @ViewChild('img', { static: false })
  imgElmRef!: ElementRef;
   @ViewChild('result', { static: false })
  resultElmRef!: ElementRef;
   @ViewChild('container', { static: false })
  containerElmRef!: ElementRef;

   @Input() imgStyle = '';
   @Input() resultStyle = '';
   @Input() lensStyle = '';
   @Input() containerStyle = '';
   imgSrc!: string;

   @Input('imgSrc') set _imgSrc(val: string) {
    this.imgSrc = val;
    if (this.notFirstTime === true) {
      this.renderer.setStyle(this.result, 'backgroundImage', "url('" + val + "')");
    }
    this.notFirstTime = true;
    // this.renderer.setStyle(this.result, 'backgroundImage', val);
   }

   ngOnInit() {
      // Set default styles if not provided
      if (!this.resultStyle) {
         this.resultStyle = this.getDefaultResultStyle();
      }
      if (!this.lensStyle) {
         this.lensStyle = this.getDefaultLensStyle();
      }
      if (!this.containerStyle) {
         this.containerStyle = this.getDefaultContainerStyle();
      }
   }

   ngAfterViewInit() {
      this.img = this.imgElmRef.nativeElement;
      this.result = this.resultElmRef.nativeElement;
      this.container = this.containerElmRef.nativeElement;

      this.renderer.setAttribute(this.img, 'style', <string>this.imgStyle);
      this.renderer.setAttribute(this.result, 'style', <string>this.resultStyle);
      this.renderer.setAttribute(this.container, 'style', <string>this.containerStyle);
      this.imageZoom();
      this.renderer.setStyle(this.lens, 'visibility', 'hidden');
   }


   imageZoom() {
      /*create lens:*/
      this.lens = this.renderer.createElement('DIV');
      this.renderer.addClass(this.lens, 'img-zoom-lens');
      this.renderer.setAttribute(this.lens, 'style', <string>this.lensStyle);

      /*insert lens:*/
      this.renderer.insertBefore(this.img.parentElement, this.lens, this.img);

      /*calculate the ratio between result DIV and lens:*/
      this.cx = this.result.offsetWidth / this.lens.offsetWidth;
      this.cy = this.result.offsetHeight / this.lens.offsetHeight;

      /*set background properties for the result DIV:*/
      this.renderer.setStyle(this.result, 'backgroundImage', "url('" + this.imgSrc + "')");
      this.renderer.setStyle(this.result, 'backgroundSize', (this.img.width * this.cx) + 'px ' + (this.img.height * this.cy) + 'px');
      // this.renderer.setStyle(this.img.parentElement, 'position', 'relative')
      /*execute a function when someone moves the cursor over the image, or the lens:*/
      this.renderer.listen(this.lens, 'mousemove', this.moveLens.bind(this));
      this.renderer.listen(this.img, 'mousemove', this.moveLens.bind(this));

      /*and also for touch screens:*/
      this.renderer.listen(this.img, 'touchmove', this.moveLens.bind(this));
      this.renderer.listen(this.lens, 'touchmove', this.moveLens.bind(this));
   }

  moveLens(e: any) {
      let pos, x, y;
      /*prevent any other actions that may occur when moving over the image:*/
      e.preventDefault();
      /*get the cursor's x and y positions:*/
      pos = this.getCursorPos(e);
      /*calculate the position of the lens:*/
      x = pos.x - (this.lens.offsetWidth / 2);
      y = pos.y - (this.lens.offsetHeight / 2);


      /*prevent the lens from being positioned outside the image:*/
      if (x > this.img.width - this.lens.offsetWidth) {
        x = this.img.width - this.lens.offsetWidth;

        this.hide = true;
        this.renderer.setStyle(this.lens, 'visibility', 'hidden');
      } else {
        this.hide = false;
        this.renderer.setStyle(this.lens, 'visibility', 'visible');
      }

      if (x < 0) {
        x = 0;
        this.hide = true;
        this.renderer.setStyle(this.lens, 'visibility', 'hidden');
      }

      if (y > this.img.height - this.lens.offsetHeight) {
        y = this.img.height - this.lens.offsetHeight;
        this.hide = true;
        this.renderer.setStyle(this.lens, 'visibility', 'hidden');
      }

      if (y < 0) {
        y = 0;
        this.hide = true;
        this.renderer.setStyle(this.lens, 'visibility', 'hidden');
      }

      /*set the position of the lens:*/
      this.renderer.setStyle(this.lens, 'left', x + 'px');
      this.renderer.setStyle(this.lens, 'top', y + 'px');
      /*display what the lens 'sees':*/
      this.renderer.setStyle(this.result, 'backgroundPosition', '-' + (x * this.cx) + 'px -' + (y * this.cy) + 'px');
   }

  getCursorPos(e: any) {
    let a: any, x = 0, y = 0;
    e = e || (window as any).event;
    /*get the x and y positions of the image:*/
    a = (this.img && this.img.getBoundingClientRect) ? this.img.getBoundingClientRect() : { left: 0, top: 0 };
    /*support touch events*/
    const pageX = (e.touches && e.touches[0] && e.touches[0].pageX) ?? e.pageX ?? e.clientX ?? 0;
    const pageY = (e.touches && e.touches[0] && e.touches[0].pageY) ?? e.pageY ?? e.clientY ?? 0;
    /*calculate the cursor's x and y coordinates, relative to the image:*/
    x = pageX - a.left;
    y = pageY - a.top;
    /*consider any page scrolling:*/
    x = x - (window as any).pageXOffset;
    y = y - (window as any).pageYOffset;
    return {x : x, y : y};
  }

  /**
   * getDefaultResultStyle returns the default result style
   */
  public getDefaultResultStyle(): string {
    return 'width:300px; height:300px';
  }

  /**
   * getDefaultLensStyle returns the default lens style
   */
  public getDefaultLensStyle(): string {
    return 'width:30px; height:30px';
  }

  /**
   * getDefaultContainerStyle returns the default container style
   */
  public getDefaultContainerStyle(): string {
    return 'position: absolute';
  }

  /**
   * onImageError is used to handle image loading errors by setting a fallback image.
   */
  public onImageError(event: any) {
    console.log('Image loading error:', event);
    // Use a generic placeholder instead of a specific product image
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0xMjUgMTI1SDc1VjE3NUgxMjVWMTI1WiIgZmlsbD0iI0RFRTJFNiIvPgo8cGF0aCBkPSJNMTI1IDEwMEg3NVYxMjVIMTI1VjEwMFoiIGZpbGw9IiNERTJFMkUiLz4KPHN2ZyB4PSIxMjUiIHk9IjEwMCIgd2lkdGg9IjUwIiBoZWlnaHQ9Ijc1IiB2aWV3Qm94PSIwIDAgNTAgNzUiIGZpbGw9Im5vbmUiPgo8cGF0aCBkPSJNMjUgMTIuNUMzNS4yIDEyLjUgNDMuNSAyMC44IDQzLjUgMzFWMzcuNUM0My41IDQ3LjcgMzUuMiA1NiA0My41IDU2SDQzLjVWNjIuNUM0My41IDcyLjcgMzUuMiA4MSAyNSA4MUg2LjVDLTMuNyA4MSAtMTIgNzIuNyAtMTIgNjIuNVYzMS4wQy0xMiAyMC44IC0zLjcgMTIuNSA2LjUgMTIuNUgyNVoiIGZpbGw9IiNERTJFMkUiLz4KPC9zdmc+Cjwvc3ZnPgo=';
  }

}

