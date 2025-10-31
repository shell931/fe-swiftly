import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RefreshPageAfterWelcomeRoutes } from './RefreshPageAfterWelcome.routing';
import { RefreshPageAfterWelcomeComponent } from './RefreshPageAfterWelcome/RefreshPageAfterWelcome.component';

import { GlobalModule } from '../../Global/Global.module';
import { TemplatesModule } from '../../Templates/Templates.module';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutModule } from '@angular/cdk/layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatTreeModule} from '@angular/material/tree';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxDropzoneModule } from 'ngx-dropzone';
// Temporarily commented out - incompatible with Angular Material 20
// import { MaterialFileInputModule } from 'ngx-material-file-input';


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

import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
	bootstrap: [
		RefreshPageAfterWelcomeComponent,
	  ],
	imports: [
		MatTreeModule,
		CdkTreeModule,
		NgxPaginationModule,
		CommonModule,
		RouterModule.forChild(RefreshPageAfterWelcomeRoutes),
		LayoutModule,
		MatCardModule,
		MatButtonModule,
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
		GlobalModule,
		TemplatesModule,		
		FormsModule,
		ReactiveFormsModule,
		NgxMatSelectSearchModule,
		NgxDropzoneModule,
		// MaterialFileInputModule, // Commented out - incompatible with Angular Material 20
		NgSelectModule
	],
	exports:[
		MatTreeModule,
		CdkTreeModule,
	],
	providers: [
	
	],
	declarations: [	
		RefreshPageAfterWelcomeComponent,
	]
})
export class RefreshPageAfterWelcomeModule { }


