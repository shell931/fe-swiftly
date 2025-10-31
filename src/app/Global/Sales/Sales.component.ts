import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'embryo-Sales',
  templateUrl: './Sales.component.html',
  styleUrls: ['./Sales.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SalesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

