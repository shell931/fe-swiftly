import { Routes } from '@angular/router';
import { StoreListComponent } from './StoreList/StoreList.component';
import { StoreListCategoriesComponent } from './StoreListCategories/StoreListCategories.component';
export const StoreListRoutes : Routes = [
	{
		path: '',
		component: StoreListComponent
	},
	{
		path: '',
		component: StoreListCategoriesComponent
	},
]
