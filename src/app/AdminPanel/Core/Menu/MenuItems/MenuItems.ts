import { Injectable } from '@angular/core';
import { ApiService } from '../../../../Services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  children?: ChildrenItems[];
}

const MENUITEMS2: Menu[] = [
  // {
  //   state: 'admin-panel/reports',
  //   name: 'Reports',
  //   type: 'link',
  //   icon: 'poll'
  // },
  // {
  //   state: 'admin-panel/invoices',
  //   name: 'Invoices.',
  //   type: 'link',
  //   icon: 'recent_actors'
  // },
  // {
  //   state: 'admin-panel',
  //   name: 'Products',
  //   type: 'sub',
  //   icon: 'shopping_cart',
  //   children: [
  //     { state: 'products', name: 'Products', type: 'link' },
  //     { state: 'product-add', name: 'Product Add', type: 'link' }
  //   ]
  // },
  // {
  //   state: 'admin-panel/account/profile',
  //   name: 'Profile',
  //   type: 'link',
  //   icon: 'account_circle'
  // },
  // {
  //   state: '/home',
  //   name: 'Go To Site',
  //   type: 'link',
  //   icon: 'home'
  // }
];



const MENUITEMS: Menu[] = [];




@Injectable()
export class AdminMenuItems {

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  getAll(): Menu[] {
    // this.apiService.getMovies().subscribe(
    //   data => {
    //     console.log(data);
    //     // this.movies = this.movies.filter(mov => mov.id !== movie.id);
    //   },
    //   error => console.log(error)

    // );
    return MENUITEMS2;
  }
}

