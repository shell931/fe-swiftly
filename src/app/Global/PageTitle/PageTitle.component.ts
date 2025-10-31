import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'embryo-PageTitle',
  templateUrl: './PageTitle.component.html',
  styleUrls: ['./PageTitle.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class PageTitleComponent implements OnInit {

  @Input() heading    : string = '';
  @Input() subHeading : string = '';

   constructor() { }

   ngOnInit() {
   }

}

