import {Component, Input, OnInit} from '@angular/core';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';

export interface CalculatorCardItem {
  text: string;
  value: number;
}

@Component({
  selector: 'app-card-calculator',
  templateUrl: './CardCalculator.component.html',
  styleUrls: ['./CardCalculator.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    CurrencyPipe
  ]
})
export class CardCalculatorComponent implements OnInit {

  @Input() title: string;

  @Input() items: Array<CalculatorCardItem> = [];

  @Input() footer: CalculatorCardItem;

  constructor() { }

  ngOnInit(): void {
  }

}

