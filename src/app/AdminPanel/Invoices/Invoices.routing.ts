import { Routes } from '@angular/router';
import { InvoicesComponent } from './Invoices/Invoices.component';
import { InvoiceValidationComponent } from './InvoiceValidation/InvoiceValidation.component';

export const InvoicesRoutes: Routes = [
	{
		path      : '',
		component : InvoicesComponent
	},
	{
		path: 'validation_invoice/:id_invoice',
		component: InvoiceValidationComponent
	},
];

