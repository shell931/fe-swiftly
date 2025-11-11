import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes} from '@angular/router';
import { MainAdminPanelComponent } from './Main/Main.component';

export const AdminPanelRoutes : Routes = [
   {
      path : "",
      component : MainAdminPanelComponent,
      children: [
         {
            path: '',
            redirectTo: 'reports',
            pathMatch: 'full',
         },
         {
            path: 'reports',loadChildren: ()=>
            import('./Reports/Reports.module').then (m => m.ReportsModule)
         },
         {
            path: 'invoices',loadChildren: ()=>
            import('./Invoices/Invoices.module').then (m => m.InvoicesModule)
         },
         {
            path: 'invoices_store',loadChildren: ()=>
            import('./InvoiceStore/InvoicesStore.module').then (m => m.InvoicesStoreModule)
         },
         {
            path: 'products',loadChildren: ()=>
            import('./Products/Products.module').then(m => m.ProductsModule)
         },
         {
            path: 'account',loadChildren: ()=>
            import('./AdminAccount/AdminAccount.module').then (m => m.AdminAccountModule)
         },
         {
            path: 'users',loadChildren: ()=>
            import('./Users/Users.module').then (m => m.UsersModule)
         },
         {
            path: 'store',loadChildren: ()=>
            import('./Store/Store.module').then (m => m.StoreModule)
         },

         {
            path: 'admin_products',loadChildren: ()=>
            import('./AdminProducts/AdminProducts.module').then (m => m.AdminProductsModule)
         },

         {
            path: 'admin_transactions',loadChildren: ()=>
            import('./Transactions/Transactions.module').then (m => m.TransactionsModule)
         },

         {
            path: 'admin_transfers',loadChildren: ()=>
            import('./Transfers/Transfers.module').then (m => m.TransfersModule)
         }

      ]
   }
]
