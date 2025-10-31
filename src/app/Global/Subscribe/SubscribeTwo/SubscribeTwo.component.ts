import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'embryo-SubscribeTwo',
  templateUrl: './SubscribeTwo.component.html',
  styleUrls: ['./SubscribeTwo.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class SubscribeTwoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

