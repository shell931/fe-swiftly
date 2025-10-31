import { Component, OnInit, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TimerCountDownComponent } from '../TimerCountDown/TimerCountDown.component';

@Component({
  selector: 'embryo-DealOfTheDay',
  templateUrl: './DealOfTheDay.component.html',
  styleUrls: ['./DealOfTheDay.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatGridListModule,
    MatButtonModule,
    CurrencyPipe,
    TimerCountDownComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class DealOfTheDayComponent implements OnInit {

   @Input() singleProduct : any; 

   @Input() currency : string = '';

   counterDateTime = new Date(new Date().setHours(20,0,0,0));

   constructor() {}

   ngOnInit() {
   }

   /**
    * getOfferImagePath is used to change the image path on click event. 
    */
   public getOfferImagePath(imgPath: any, index:number) {
      const active = document.querySelector('.border-active');
      if (active) { (active as HTMLElement).classList.remove('border-active'); }
      this.singleProduct.image = imgPath;
      const el = document.getElementById(index + '_img');
      if (el) { el.className += ' border-active'; }
   }

}

