import { Routes } from '@angular/router';

import { HomeoneComponent } from './HomeOne/HomeOne.component';

export const ProductsRoutes : Routes = [
	{ 
		path: '', 
		component: HomeoneComponent 
	},
   { 
      path: ':type', 
      component: HomeoneComponent 
   }
]
