import { Routes } from '@angular/router';

import { SellComponent } from './Sell/Sell.component';
import { SellResponseComponent } from './SellResponse/SellResponse.component';

export const SellRoutes: Routes = [
    {
        path: '',
        component: SellComponent
    },
    {
        path: 'response',
        component: SellResponseComponent
    },
    // {
    //     path: ':type',
    //     component: SearchComponent
    // }
	// {
	// 	path: ':id',
	// 	component: SellComponent
	// },
]
