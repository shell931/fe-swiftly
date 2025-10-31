import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MainAdminPanelComponent } from './Main/Main.component';
import { MenuToggleModule } from './Core/Menu/MenuToggle.module';
import { AdminMenuItems } from './Core/Menu/MenuItems/MenuItems';
import { SideBarComponent } from './Shared/SideBar/SideBar.component';
import { EditProfileComponent } from './AdminAccount/EditProfile/EditProfile.component';
import { ProfileComponent } from './AdminAccount/Profile/Profile.component';
import { AdminProductsComponent } from './AdminProducts/AdminProducts/AdminProducts.component';

import { MenuListItemsComponent } from './Shared/MenuListItems/MenuListItems.component';
import { AdminHeaderComponent } from './Shared/Header/Header.component';
import { WidgetModule } from './Widget/Widget.module';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

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


import { RouterModule } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { AdminPanelRoutes } from './admin-panel-routing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { GlobalModule } from '../Global/Global.module';

/********** Custom option for ngx-translate ******/
export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
	declarations: [
		// All components are now standalone and imported instead of declared
	],
	imports: [		
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		MenuToggleModule,
		WidgetModule,
		// Standalone components should NOT be imported here - they are imported where needed
		// MainAdminPanelComponent,
		// SideBarComponent,
		// MenuListItemsComponent,
		// AdminHeaderComponent,
		// EditProfileComponent,
		// ProfileComponent,
		// AdminProductsComponent,
		MatButtonModule,
		MatCardModule,
		MatMenuModule,
		LayoutModule,
		MatToolbarModule,
		MatIconModule,
		MatInputModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatProgressSpinnerModule,
		MatTableModule,
		MatPaginatorModule,
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
		ScrollingModule,
		NgSelectModule,
		NgxDropzoneModule,
		RouterModule.forChild(AdminPanelRoutes),
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient]
			}
		}),
		HttpClientModule,
		GlobalModule,
		
	],
	providers: [
		AdminMenuItems,
		ToastrService
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	exports: [
		RouterModule,
		// Standalone components should not be exported from NgModules
		// MainAdminPanelComponent,
		// SideBarComponent,
		// MenuListItemsComponent,
		// AdminHeaderComponent,
	]

})

export class AdminPanelModule { }



