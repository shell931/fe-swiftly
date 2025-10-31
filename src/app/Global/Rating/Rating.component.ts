import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarRatingModule } from 'ngx-bar-rating';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'embryo-Rating',
  templateUrl: './Rating.component.html',
  styleUrls: ['./Rating.component.scss'],
  standalone: true,
  imports: [CommonModule, BarRatingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RatingComponent implements OnInit {

   @Input() rate : any;

   constructor() { }

   ngOnInit() {
   }

}

