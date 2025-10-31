import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDividerModule} from '@angular/material/divider';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';

import { LayoutModule } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';

import { GlobalModule } from '../../Global/Global.module';
import { TransfersComponent } from './Transfers/Transfers.component';
import { AdminProductsRoutes } from './Transfers.routing';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { TransfersDetailAdmSidebarSidebarComponent } from '../Shared/TransfersDetailAdmSidebar/TransfersDetailAdmSidebar.component';



@NgModule({
    declarations: [TransfersComponent, TransfersDetailAdmSidebarSidebarComponent],
    imports: [
        RouterModule.forChild(AdminProductsRoutes),
        CommonModule,
        LayoutModule,
        MatSidenavModule,
        MatIconModule,
        MatCheckboxModule,
        MatButtonModule,
        MatSelectModule,
        MatCardModule,
        MatMenuModule,        
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatDividerModule,
        MatListModule,
        TranslateModule,
        MatPaginatorModule,
        MatSortModule,
        MatGridListModule,
        GlobalModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMatSelectSearchModule,
        NgxDropzoneModule,
        MatProgressSpinnerModule,

    ],
    providers: [
      
    ],

})
export class TransfersModule { }



