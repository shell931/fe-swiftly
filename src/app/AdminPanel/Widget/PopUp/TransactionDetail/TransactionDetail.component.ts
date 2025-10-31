import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, UntypedFormGroup, UntypedFormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { delay } from 'rxjs/operators';
import { ApiService } from '../../../../Services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Transactions } from '../../../../Models/Transactions';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
   selector: 'TransactionDetail-dialog',
   standalone: true,
   imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, RouterModule],
   templateUrl: './TransactionDetail.component.html',
   styleUrls: ['./TransactionDetail.component.scss']
})

export class TransactionDetailComponent implements OnInit {

   data!: Transactions;
   gallery: string = '';
   adminprList: any[] = [];
   adminProductList: any[] = [];
   total: any;
   img_product_rout: any;
   cam_com: any;
   ShippmentForm!: UntypedFormGroup;
   id_invoice: any;
   public show: boolean = false;

   @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

   dataSource = new MatTableDataSource<any>(this.adminProductList);
   displayedColumns: string[] = ['name_product'];

   constructor(
      public dialogRef: MatDialogRef<TransactionDetailComponent>,
      private apiService: ApiService,
      private router: Router,
      private toastyService: ToastrService,
      private formGroup: UntypedFormBuilder,
   ) { }

   ngOnInit() {
   
   }
}


