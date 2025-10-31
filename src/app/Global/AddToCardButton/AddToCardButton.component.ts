import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'embryo-AddToCardButton',
  templateUrl: './AddToCardButton.component.html',
  styleUrls: ['./AddToCardButton.component.scss'],
  standalone: true,
   imports: [CommonModule, MatButtonModule]
})
export class AddToCardButtonComponent implements OnInit {

   @Input() product : any ;

   @Output() addToCart: EventEmitter<any> = new EventEmitter();

   constructor() { }

   ngOnInit() {
   }

   public addToCartProduct(product:any) {
      this.addToCart.emit(product);
   }
}

