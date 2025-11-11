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

const MENUITEMS_DEFAULT: Menu[] = [
  {
    state: 'admin-panel/reports',
    name: 'Reportes',
    type: 'link',
    icon: 'poll'
  },
  {
    state: 'admin-panel/invoices',
    name: 'Facturas',
    type: 'link',
    icon: 'receipt'
  },
  {
    state: 'admin-panel/invoices_store',
    name: 'Facturas Tienda',
    type: 'link',
    icon: 'receipt_long'
  },
  // {
  //   state: 'admin-panel/products',
  //   name: 'Productos',
  //   type: 'link',
  //   icon: 'shopping_cart'
  // },
  {
    state: 'admin-panel/admin_products',
    name: 'Admin Productos',
    type: 'link',
    icon: 'inventory'
  },
  {
    state: 'admin-panel/users',
    name: 'Usuarios',
    type: 'link',
    icon: 'people'
  },
  {
    state: 'admin-panel/store',
    name: 'Tiendas',
    type: 'link',
    icon: 'store'
  },
  {
    state: 'admin-panel/admin_transactions',
    name: 'Transacciones',
    type: 'link',
    icon: 'payments'
  },
  {
    state: 'admin-panel/admin_transfers',
    name: 'Transferencias',
    type: 'link',
    icon: 'swap_horiz'
  },
  // {
  //   state: 'admin-panel/account/profile',
  //   name: 'Perfil',
  //   type: 'link',
  //   icon: 'account_circle'
  // }
];



@Injectable()
export class AdminMenuItems {

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  getAll(): Menu[] {
    return MENUITEMS_DEFAULT;
  }
}

