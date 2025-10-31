import { Routes } from '@angular/router';

import { AccountComponent } from './Account/Account.component';
import { ProfileComponent } from './Profile/Profile.component';
import { EditProfileComponent } from './EditProfile/EditProfile.component';
import { CardsComponent } from './Cards/Cards.component';
import { AddressComponent } from './Address/Address.component';
import { AddressEditComponent } from './AddressEdit/AddressEdit.component';
import { AddressCreateComponent } from './AddressCreate/AddressCreate.component';
import { StoreAdmComponent } from './StoreAdm/StoreAdm.component';
import { StoreAdmEditComponent } from './StoreAdmEdit/StoreAdmEdit.component';
import { ProductsAdm } from './ProductsAdm/ProductsAdm.component';
import { ProductsCreateAdmComponent } from './ProductsCreateAdm/ProductsCreateAdm.component';
import { ProductEditAdmComponent } from './ProductEditAdm/ProductEditAdm.component';
import { InvoiceAdmComponent } from './InvoiceAdm/InvoiceAdm.component';
import { InvoiceAdmDetailComponent } from './InvoiceAdmDetail/InvoiceAdmDetail.component';


import { TransfersComponent } from './Transfers/Transfers.component';
import { TransfersViewComponent } from './TransfersView/TransfersView.component';

import { AssistedSellingComponent } from './AssistedSelling/AssistedSelling.component';

import { BalanceStatusComponent } from './BalanceStatus/BalanceStatus.component';
import { BalanceResponseComponent } from './BalanceResponse/BalanceResponse.component';


import { OrderHistoryComponent } from './OrderHistory/OrderHistory.component';
import { GridProductComponent } from './GridProduct/GridProduct.component';

export const UserAccountRoutes : Routes = [
   {
      path : '',
      loadComponent: () => import('./Account/Account.component').then(m => m.AccountComponent),
      children: [ 
         {
            path: 'profile',
            loadComponent: () => import('./Profile/Profile.component').then(m => m.ProfileComponent)
         },
         { 
            path: 'cards', 
            loadComponent: () => import('./Cards/Cards.component').then(m => m.CardsComponent)
         },
         { 
            path: 'address', 
            loadComponent: () => import('./Address/Address.component').then(m => m.AddressComponent)
         },

         { 
            path: 'product_adm', 
            loadComponent: () => import('./ProductsAdm/ProductsAdm.component').then(m => m.ProductsAdm)
         },

         { 
            path: 'invoice_adm', 
            loadComponent: () => import('./InvoiceAdm/InvoiceAdm.component').then(m => m.InvoiceAdmComponent)
         },
         { 
            path: 'invoice_adm/detail/:id', 
            loadComponent: () => import('./InvoiceAdmDetail/InvoiceAdmDetail.component').then(m => m.InvoiceAdmDetailComponent)
         },
         
         { 
            path: 'transfers_view', 
            loadComponent: () => import('./Transfers/Transfers.component').then(m => m.TransfersComponent)
         },

         { 
            path: 'transfers_view/view/:id', 
            loadComponent: () => import('./TransfersView/TransfersView.component').then(m => m.TransfersViewComponent)
         },

         { 
            path: 'assisted_selling', 
            loadComponent: () => import('./AssistedSelling/AssistedSelling.component').then(m => m.AssistedSellingComponent)
         },

      
         { 
            path: 'balance_status', 
            loadComponent: () => import('./BalanceStatus/BalanceStatus.component').then(m => m.BalanceStatusComponent)
         },
         { 
            path: 'balance_response', 
            loadComponent: () => import('./BalanceResponse/BalanceResponse.component').then(m => m.BalanceResponseComponent)
         },
         
         { 
            path: 'product_create', 
            loadComponent: () => import('./ProductsCreateAdm/ProductsCreateAdm.component').then(m => m.ProductsCreateAdmComponent)
         },

         { 
            path: 'product_adm/edit/:id_product', 
            loadComponent: () => import('./ProductEditAdm/ProductEditAdm.component').then(m => m.ProductEditAdmComponent)
         },
         
         { 
            path: 'store_adm', 
            loadComponent: () => import('./StoreAdm/StoreAdm.component').then(m => m.StoreAdmComponent)
         },

         { 
            path: 'store_adm/edit/:id_store', 
            loadComponent: () => import('./StoreAdmEdit/StoreAdmEdit.component').then(m => m.StoreAdmEditComponent)
         },

         { 
            path: 'address/edit/:id', 
            loadComponent: () => import('./AddressEdit/AddressEdit.component').then(m => m.AddressEditComponent)
         },
         { 
            path: 'address/create', 
            loadComponent: () => import('./AddressCreate/AddressCreate.component').then(m => m.AddressCreateComponent)
         },
         
         { 
            path: 'order-history', 
            loadComponent: () => import('./OrderHistory/OrderHistory.component').then(m => m.OrderHistoryComponent)
         },
         {
            path: 'profile/edit',
            loadComponent: () => import('./EditProfile/EditProfile.component').then(m => m.EditProfileComponent)
         },
         {
            path: 'grid-product',
            loadComponent: () => import('./GridProduct/GridProduct.component').then(m => m.GridProductComponent)
         }
      ]
   }
]
