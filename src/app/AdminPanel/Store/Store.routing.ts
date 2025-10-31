import { Routes } from '@angular/router';
import { StoreComponent } from './Store/Store.component';
import { AddStoreComponent } from './AddStore/AddStore.component';
import { EditStoreComponent } from './EditStore/EditStore.component';
import { StoreValidationComponent } from './StoreValidation/StoreValidation.component';

export const StoreRoutes: Routes = [

	{
		path: '',
		component: StoreComponent,
		children: [
			{
				path: 'store',
				component: StoreComponent
			},
		]
	},
	{
		path: 'create_store',
		component: AddStoreComponent,
		children: [
			{
				path: 'create_store',
				component: AddStoreComponent
			},
		]
	},
	{
		path: 'edit_store/:id_store',
		component: EditStoreComponent
	},
	{
		path: 'validation_store/:id_store',
		component: StoreValidationComponent
	},

];
