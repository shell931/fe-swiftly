import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'embryo-Testimonial',
  templateUrl: './Testimonial.component.html',
  styleUrls: ['./Testimonial.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class TestimonialComponent implements OnInit {

   @Input() data : any;

   constructor() { }

   ngOnInit() {
   }

}

