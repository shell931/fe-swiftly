import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { SocialShareComponent } from '../../../Global/SocialShare/SocialShare.component';

@Component({
  selector: 'embryo-ThankYou',
  templateUrl: './ThankYou.component.html',
  styleUrls: ['./ThankYou.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    SocialShareComponent
  ]
})
export class ThankYouComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

