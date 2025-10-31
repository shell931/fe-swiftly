import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';



// import { ChartsModule } from 'ng2-charts';
// Replacing the incompatible ngx-perfect-scrollbar with direct PerfectScrollbar import
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';;
import { LayoutModule } from '@angular/cdk/layout';
import { TitleComponent } from './TitleComponent/TitleComponent.component';
import { TopsideMenuComponent } from './Menu/TopsideMenu/TopsideMenu.component';
import { DeleteListDialogComponent } from './PopUp/DeleteListDialog/DeleteListDialog.component';
import { BuySellChartComponent } from './Charts/BuySellChart/BuySellChart.component';
import { SeeListDialogComponent } from './PopUp/SeeListDialog/SeeListDialog.component';
import { ShowCartDataComponent } from './PopUp/ShowCartData/ShowCartData.component';
import { StoreDetailViewComponent } from './PopUp/StoreDetailView/StoreDetailView.component';
import { TransactionDetailComponent } from './PopUp/TransactionDetail/TransactionDetail.component';
import { AddNewUserComponent } from './PopUp/AddNewUser/AddNewUser.component';
import { AdminProductValidComponent } from './PopUp/AdminProductValid/AdminProductValid.component';
import { TransactionComponent } from './PopUp/Transaction/Transaction.component';
import { TransferComponent } from './PopUp/Transfer/Transfer.component';
import { TransactionResponseComponent } from './PopUp/TransactionResponse/TransactionResponse.component';
import { InvoiceDetailComponent } from './PopUp/InvoiceDetail/InvoiceDetail.component';
import { InvoiceDetailUsrComponent } from './PopUp/InvoiceDetailUsr/InvoiceDetailUsr.component';



import { DeleteLocationUserComponent} from './PopUp/DeleteLocationUser/DeleteLocationUser.component';
import { FailTransactionGatewayComponent} from './PopUp/FailTransactionGateway/FailTransactionGateway.component';
import { FailErrorTransactionGatewayComponent} from './PopUp/FailErrorTransactionGateway/FailErrorTransactionGateway.component';


import { LocationPredeterminedComponent } from './PopUp/LocationPredetermined/LocationPredetermined.component';

import { HeaderUserProfileDropdownComponent } from './HeaderUserProfileDropdown/HeaderUserProfileDropdown.component';
import { RouterModule } from '@angular/router';

// Temporarily commented out - incompatible with Angular Material 20
// import { MaterialFileInputModule } from 'ngx-material-file-input';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
    declarations: [
        // Empty declarations - all components are imported instead
    ],
    imports: [
        SharedModule,
        MatAutocompleteModule,
        LayoutModule,
        // MaterialFileInputModule, // Commented out - incompatible with Angular Material 20
        SweetAlert2Module.forRoot(),
        // Import standalone components
        TitleComponent,
        TopsideMenuComponent,
        DeleteListDialogComponent,
        BuySellChartComponent,
        SeeListDialogComponent,
        ShowCartDataComponent,
        StoreDetailViewComponent,
        TransactionDetailComponent,
        AddNewUserComponent,
        HeaderUserProfileDropdownComponent,
        AdminProductValidComponent,
        TransactionComponent,
        TransferComponent,
        TransactionResponseComponent,
        InvoiceDetailComponent,
        DeleteLocationUserComponent,
        FailTransactionGatewayComponent,
        FailErrorTransactionGatewayComponent,
        LocationPredeterminedComponent,
        InvoiceDetailUsrComponent,
    ],
    exports: [
        // Exporting only the shared module
        SharedModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WidgetModule { }



