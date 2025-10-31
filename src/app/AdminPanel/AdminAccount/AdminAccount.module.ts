import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';


import { LayoutModule } from '@angular/cdk/layout';

import { AccountComponent } from './Account/Account.component';			
import { AccountSettingComponent } from './AccountSetting/AccountSetting.component';
import { EditProfileComponent } from './EditProfile/EditProfile.component';
import { ProfileComponent } from './Profile/Profile.component';
import { AdminAccountRoutes} from './AdminAccount.routing';

@NgModule({
	declarations: [
		ProfileComponent,
		AccountComponent,
		AccountSettingComponent,
	
		EditProfileComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(AdminAccountRoutes),
		MatListModule,
		MatButtonModule,
		MatIconModule,
		MatCardModule,
		MatInputModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatRadioModule,
		MatSelectModule,
		FormsModule,
		ReactiveFormsModule,
		MatTableModule,
		LayoutModule,
		MatCheckboxModule
	]
})
export class AdminAccountModule { }



