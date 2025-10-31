import { Routes } from '@angular/router';
import { TransactionsComponent } from './Transactions/Transactions.component';

export const AdminProductsRoutes: Routes = [

	{
		path: '',
		component: TransactionsComponent,
		children: [
			{
				path: 'admin_transactions',
				component: TransactionsComponent
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
