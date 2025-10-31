import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { AdminMenuItems } from '../../Core/Menu/MenuItems/MenuItems';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Menu, ChildrenItems } from '../../../Models/Menus';
import { ApiService } from '../../../Services/api.service';

@Component({
	selector: 'app-menu-list-items',
	templateUrl: './MenuListItems.component.html',
	styleUrls: ['./MenuListItems.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		MatIconModule,
		MatListModule,
		MatDividerModule,
		TranslateModule
	]
})

export class MenuListItemsComponent implements OnInit {

	menulist: Menu[] = [];
	get_menu: Menu[] = [];
	constructor(public menuItems: AdminMenuItems,
		private apiService: ApiService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		public translate: TranslateService) { }

	ngOnInit() {		
		this.get_menu = [];
		this.apiService.getMenus().subscribe((data: any[]) => {
				this.menulist = data;
				for (const item of this.menulist) {
					const get_state = (item && item.route_menu) ? item.route_menu : '';
					const get_name = (item && item.name_menu) ? item.name_menu : '';
					const get_type = "link";
					const get_icon = (item && item.icon_menu) ? item.icon_menu : '';
					this.get_menu.push({state:get_state,name:get_name,type:get_type,icon:get_icon});
				}
			}, error => console.log(error));
		
	}
}

