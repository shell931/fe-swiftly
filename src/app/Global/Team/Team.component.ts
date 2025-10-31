import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'embryo-Team',
  templateUrl: './Team.component.html',
  styleUrls: ['./Team.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class TeamComponent implements OnInit {

   @Input() data : any;

   constructor() { }

   ngOnInit() {
   }

}

