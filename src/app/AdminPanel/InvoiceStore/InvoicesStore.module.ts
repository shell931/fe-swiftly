import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import { InvoicesStoreComponent } from './InvoicesStore/InvoicesStore.component';
import { InvoicesStoreRoutes} from './InvoicesStore.routing';

@NgModule({
	imports: [
		InvoicesStoreComponent,
		MatIconModule,
		MatButtonModule,
		MatCardModule,
		MatTableModule,
      CommonModule,
      MatFormFieldModule,
      MatInputModule,
      MatPaginatorModule,
		RouterModule.forChild(InvoicesStoreRoutes)
	]
})
export class InvoicesStoreModule { }

