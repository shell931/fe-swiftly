import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'embryo-AppLogo',
  templateUrl: './AppLogo.component.html',
  styleUrls: ['./AppLogo.component.scss'],
  standalone: true,
  imports: [RouterModule]
})
export class AppLogoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

