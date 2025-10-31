import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';

import { LayoutModule } from '@angular/cdk/layout';

import { InvoicesComponent } from './Invoices/Invoices.component';
import { InvoiceValidationComponent } from './InvoiceValidation/InvoiceValidation.component';
import { InvoicesRoutes } from './Invoices.routing';

import { MatExpansionModule } from '@angular/material/expansion';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

import {MatBadgeModule} from '@angular/material/badge';
import { BinnacleSideBarAdmComponent } from '../Shared/BinnacleSideBarAdm/BinnacleSideBarAdm.component';

import {ReactiveFormsModule} from '@angular/forms';

import {MatSidenavModule} from '@angular/material/sidenav';


@NgModule({
	declarations: [],
	imports: [
		InvoicesComponent,
		InvoiceValidationComponent,
		BinnacleSideBarAdmComponent,
		MatSidenavModule,
		FormsModule,
		ReactiveFormsModule,
		MatBadgeModule,
		MatIconModule,
		MatButtonModule,
		MatCardModule,
		MatTableModule,
		CommonModule,
		MatFormFieldModule,
		MatInputModule,
		LayoutModule,
		MatPaginatorModule,
		RouterModule.forChild(InvoicesRoutes),
		SweetAlert2Module.forRoot(),
		MatExpansionModule,
		MatProgressBarModule,
		MatCheckboxModule
	],
	exports: [
		MatProgressBarModule
	]
})
export class InvoicesModule { }



