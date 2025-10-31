import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'embryo-SocialShare',
  templateUrl: './SocialShare.component.html',
  styleUrls: ['./SocialShare.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule
  ]
})
export class SocialShareComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

