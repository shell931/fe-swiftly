import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
// import { MenuItems } from '../../../Core/menu/menu-items/menu-items';

@Component({
  selector: 'FooterOne',
  templateUrl: './FooterOne.component.html',
  styleUrls: ['./FooterOne.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule
  ]
})
export class FooterOneComponent implements OnInit {

   constructor(
    //  public menuItems : MenuItems,
               public translate: TranslateService) { }

   ngOnInit() {
    this.gotoTop();
    
   }

   gotoTop() {
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }
 

}

