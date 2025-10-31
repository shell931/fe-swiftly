import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MenuListItemsComponent } from '../MenuListItems/MenuListItems.component';

@Component({
	selector: 'app-side-bar',
	templateUrl: './SideBar.component.html',
	styleUrls: ['./SideBar.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		NgScrollbarModule,
		MenuListItemsComponent
	]
})

export class SideBarComponent implements OnInit {

	constructor() { }

	ngOnInit() {
	}

}
	
