import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'embryo-CollectionGallery',
  templateUrl: './CollectionGallery.component.html',
  styleUrls: ['./CollectionGallery.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule]
})
export class CollectionGalleryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

