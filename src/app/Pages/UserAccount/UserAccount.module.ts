import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, CurrencyPipe, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatChipsModule} from '@angular/material/chips';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSliderModule} from '@angular/material/slider';
import {MatRadioModule} from '@angular/material/radio';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BarRatingModule } from 'ngx-bar-rating';
import { UserAccountRoutes } from './UserAccount.routing';
import { AccountComponent } from './Account/Account.component';
import { ProfileComponent } from './Profile/Profile.component';
import { EditProfileComponent } from './EditProfile/EditProfile.component';
import { CardsComponent } from './Cards/Cards.component';
import { AddressComponent } from './Address/Address.component';
import { StoreAdmComponent } from './StoreAdm/StoreAdm.component';
import { StoreAdmEditComponent } from './StoreAdmEdit/StoreAdmEdit.component';
import { ProductsAdm } from './ProductsAdm/ProductsAdm.component';  
import { ProductsCreateAdmComponent } from './ProductsCreateAdm/ProductsCreateAdm.component';
import { ProductEditAdmComponent } from './ProductEditAdm/ProductEditAdm.component';
import { InvoiceAdmComponent } from './InvoiceAdm/InvoiceAdm.component';
import { InvoiceAdmDetailComponent } from './InvoiceAdmDetail/InvoiceAdmDetail.component';


import { BalanceStatusComponent } from './BalanceStatus/BalanceStatus.component';
import { BalanceResponseComponent } from './BalanceResponse/BalanceResponse.component';
import { TransfersComponent } from './Transfers/Transfers.component';
import { TransfersViewComponent } from './TransfersView/TransfersView.component';

import { AssistedSellingComponent } from './AssistedSelling/AssistedSelling.component';

import { AddressEditComponent } from './AddressEdit/AddressEdit.component';
import { AddressCreateComponent } from './AddressCreate/AddressCreate.component';
import { OrderHistoryComponent } from './OrderHistory/OrderHistory.component';
import { GridProductComponent } from './GridProduct/GridProduct.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxDropzoneModule } from 'ngx-dropzone';
// import { NgxPaginationModule } from 'ngx-pagination'; // Temporarily commented due to Ivy compatibility
import { BinnacleSideBarComponent } from '../../Layouts/BinnacleSideBar/BinnacleSideBar.component';
import { TransfersDetailSidebarComponent } from '../../Layouts/TransfersDetailSidebar/TransfersDetailSidebar.component';
import { FilterPipe } from './ProductsAdm/ProductsAdm.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {MatPaginatorModule} from '@angular/material/paginator';

// Temporarily commented out - incompatible with Angular Material 20
// // Temporarily commented out - incompatible with Angular Material 20
// import { MaterialFileInputModule } from 'ngx-material-file-input';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UserAccountRoutes),
    MatBadgeModule,
    MatButtonModule, 
    MatCardModule, 
    MatMenuModule, 
    MatToolbarModule, 
    MatIconModule, 
    MatInputModule, 
    MatDatepickerModule, 
    MatNativeDateModule, 
    MatProgressSpinnerModule,
    MatTableModule, 
    MatExpansionModule, 
    MatSelectModule, 
    MatSnackBarModule, 
    MatTooltipModule, 
    MatChipsModule, 
    MatListModule, 
    MatSidenavModule, 
    MatTabsModule, 
    MatProgressBarModule,
    MatCheckboxModule,
    MatSliderModule,
    MatRadioModule,
    MatDialogModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    BarRatingModule,
    NgxMatSelectSearchModule,
    NgxDropzoneModule,
    // NgxPaginationModule, // Temporarily commented due to Ivy compatibility
    MatPaginatorModule,
    SweetAlert2Module.forRoot(),

    // MaterialFileInputModule // Commented out - incompatible with Angular Material 20
  ],
  providers: [
    CurrencyPipe,
    AsyncPipe
  ],
  declarations: [
    // Components are standalone and imported where needed
    // BinnacleSideBarComponent,
    // TransfersDetailSidebarComponent,
    // AccountComponent, 
    // ProfileComponent, 
    // EditProfileComponent, 
    // CardsComponent, 
    // AddressComponent, 
    // StoreAdmComponent,
    // StoreAdmEditComponent,
    // AddressEditComponent,
    // AddressCreateComponent,
    // OrderHistoryComponent,
    // GridProductComponent,
    // ProductsAdm,
    // FilterPipe,
    // ProductsCreateAdmComponent,
    // ProductEditAdmComponent,
    // InvoiceAdmComponent,
    // InvoiceAdmDetailComponent,     
    // TransfersComponent,
    // TransfersViewComponent,
    // AssistedSellingComponent,
    // BalanceStatusComponent,
    // BalanceResponseComponent
   ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserAccountModule { }

