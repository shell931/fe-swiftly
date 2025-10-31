import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { RatingComponent } from '../Rating/Rating.component';
import { AddToCardButtonComponent } from '../AddToCardButton/AddToCardButton.component';

@Component({
  selector: 'embryo-NewProductsCard',
  templateUrl: './NewProductsCard.component.html',
  styleUrls: ['./NewProductsCard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    CurrencyPipe,
    RatingComponent,
    AddToCardButtonComponent
  ]
})
export class NewProductsCardComponent implements OnInit {

   @Input() product : any;

   @Input() currency : string = '';

   @Output() addToCart: EventEmitter<any> = new EventEmitter();

   @Output() addToWishlist: EventEmitter<any> = new EventEmitter();

   constructor() { }

   ngOnInit() {
   }

   public addToCartProduct(value:any) {
      this.addToCart.emit(value);
   }

   public productAddToWishlist(value:any) {
      this.addToWishlist.emit(value);
   }

}

