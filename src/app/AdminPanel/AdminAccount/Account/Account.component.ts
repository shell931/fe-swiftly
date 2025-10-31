import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-Account',
  templateUrl: './Account.component.html',
  styleUrls: ['./Account.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule
  ]
})
export class AccountComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log("ESTPY EN NG___________1");
  }

}

