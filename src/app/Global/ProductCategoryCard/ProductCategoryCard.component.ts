import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'embryo-ProductCategoryCard',
  templateUrl: './ProductCategoryCard.component.html',
  styleUrls: ['./ProductCategoryCard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class ProductCategoryCardComponent implements OnInit {

   @Input() productCategory : any;

   @Input() totalProducts : any;

   constructor() { }

   ngOnInit() {
   }

}

