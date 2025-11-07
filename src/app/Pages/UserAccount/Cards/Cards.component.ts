import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

interface Card {
  id: number;
  brand: string;
  type: string;
  number: string;
}

@Component({
  selector: 'app-Cards',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './Cards.component.html',
  styleUrls: ['./Cards.component.scss']
})
export class CardsComponent implements OnInit {

  cards: Card[] = [
    { id: 1, brand: 'VISA', type: 'Crédito', number: '4545 4XXX XXX5 4545' },
    { id: 2, brand: 'MasterCard', type: 'Débito', number: '8585 8XXX XXX5 8585' }
  ];

  constructor() { }

  ngOnInit() {
  }

  deleteCard(cardId: number) {
    if (confirm('¿Está seguro que desea eliminar esta tarjeta?')) {
      this.cards = this.cards.filter(card => card.id !== cardId);
    }
  }

}

