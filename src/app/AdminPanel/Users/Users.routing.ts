import { Routes } from '@angular/router';
import { UsersComponent } from './Users/Users.component';
import { CreateUserComponent } from './CreateUser/CreateUser.component';
import { UsersEditComponent } from './UsersEdit/UsersEdit.component';


export const UsersRoutes: Routes = [

	{
		path: '',
		component: UsersComponent,
		children: [
			{
				path: 'users',
				component: UsersComponent
			},
		]
	},
	{
		path: 'create',
		component: CreateUserComponent,
		children: [
			{
				path: 'create',
				component: CreateUserComponent
			},
		]
	},	
	{
		path: 'edit/:id',
		component: UsersEditComponent,
		children: [
			{
				path: 'edit',
				component: UsersEditComponent
			},
		]
	},
];

