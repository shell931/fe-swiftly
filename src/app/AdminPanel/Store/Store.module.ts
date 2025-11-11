import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';


import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { StoreComponent } from './Store/Store.component';
import { AddStoreComponent } from './AddStore/AddStore.component';
import { EditStoreComponent } from './EditStore/EditStore.component';
import { StoreValidationComponent } from './StoreValidation/StoreValidation.component';
import { StoreRoutes} from './Store.routing';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxDropzoneModule } from 'ngx-dropzone';



// modules to mat-select-search
import {BrowserModule} from '@angular/platform-browser';
import {A11yModule} from '@angular/cdk/a11y';
import {BidiModule} from '@angular/cdk/bidi';
import {ObserversModule} from '@angular/cdk/observers';
import {OverlayModule} from '@angular/cdk/overlay';
import {PlatformModule} from '@angular/cdk/platform';
import {PortalModule} from '@angular/cdk/portal';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
   declarations: [
      StoreComponent, AddStoreComponent, EditStoreComponent
   ],
	imports: [
      MatExpansionModule,
		MatIconModule,
		MatButtonModule,
		MatCardModule,
		MatTableModule,
      CommonModule,
      MatFormFieldModule,
      MatInputModule,
      LayoutModule,
      MatPaginatorModule,
      RouterModule.forChild(StoreRoutes),
      FormsModule,
      ReactiveFormsModule,
      MatSelectModule,
      MatAutocompleteModule,
      NgxMatSelectSearchModule,
      NgxDropzoneModule,
      MatProgressSpinnerModule,
      // imports to mat-select-search
      SweetAlert2Module.forRoot(),
      NgSelectModule

	],
   exports: [
      StoreComponent, AddStoreComponent, EditStoreComponent
   ]
})
export class StoreModule { }


