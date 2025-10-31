import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CalculatorRoutes} from './Calculator.routing';
import {RouterModule} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
// import {NgxMaskModule} from 'ngx-mask'; // Removed - not compatible with standalone components


@NgModule({
  declarations: [
    // Components are now standalone
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(CalculatorRoutes),
        MatCardModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        ReactiveFormsModule,
        FormsModule,
        // NgxMaskModule, // Removed - not compatible with standalone components
    ],
    exports: [
        CommonModule,
        MatCardModule,
        ReactiveFormsModule,
        FormsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CalculatorModule {
}

