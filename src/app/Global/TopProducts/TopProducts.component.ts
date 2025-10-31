import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'embryo-TopProducts',
  templateUrl: './TopProducts.component.html',
  styleUrls: ['./TopProducts.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    CurrencyPipe
  ]
})
export class TopProductsComponent implements OnInit {

   @Input() products : any;

   @Input() currency : any;

   @Output() addToCart : EventEmitter<any> = new EventEmitter();

   gridLength = 4;
   randomSortProducts : any;

   constructor() { }

   ngOnInit() {
      if(this.products){
         this.randomSortProducts = this.products.sort( () => Math.random() - 0.5);
      }
   }

   public addToCartProduct(value:any) {
      value.status = 1;
      this.addToCart.emit(value);
   }

   public extendGridStructure(status) {
      if(status){
         if(this.gridLength != 12){
            this.gridLength += 4;
         }
      } else {
         if(this.gridLength != 4){
            this.gridLength -= 4;
         }
      }
   }

}

