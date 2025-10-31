import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'embryo-CtaTwo',
  templateUrl: './CTA-Two.component.html',
  styleUrls: ['./CTA-Two.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule]
})
export class CTATwoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

