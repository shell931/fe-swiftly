import { Routes } from '@angular/router';
import { AdminProductsComponent } from './AdminProducts/AdminProducts.component';

export const AdminProductsRoutes: Routes = [

	{
		path: '',
		component: AdminProductsComponent,
		children: [
			{
				path: 'admin_products',
				component: AdminProductsComponent
			},
		]
	},
	// {
	// 	path: 'create_store',
	// 	component: AddStoreComponent,
	// 	children: [
	// 		{
	// 			path: 'create_store',
	// 			component: AddStoreComponent
	// 		},
	// 	]
	// },	
];
