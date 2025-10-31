import { Routes } from '@angular/router';

import { DetailStoreComponent } from './DetailStore/DetailStore.component';

export const DetailStoreRoutes : Routes = [


    // { 
	// 	path: '', 
	// 	component: DetailStoreComponent
	// },

	{
		path: ':id',
		component: DetailStoreComponent
	},
  

]
