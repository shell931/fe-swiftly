import { Routes } from '@angular/router';
import { TransfersComponent } from './Transfers/Transfers.component';

export const AdminProductsRoutes: Routes = [

	{
		path: '',
		component: TransfersComponent,
		children: [
			{
				path: 'admin_transfers',
				component: TransfersComponent
			},
		]
	},

];
