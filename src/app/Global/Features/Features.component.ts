import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'embryo-Features',
  templateUrl: './Features.component.html',
  styleUrls: ['./Features.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule]
})
export class FeaturesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

