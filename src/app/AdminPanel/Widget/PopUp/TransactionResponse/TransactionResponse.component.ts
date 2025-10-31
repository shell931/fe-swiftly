import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { delay } from 'rxjs/operators';
import { ApiService } from '../../../../Services/api.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Transactions } from '../../../../Models/Transactions';

@Component({
   selector: 'app-transaction-response-dialog',
   templateUrl: './TransactionResponse.component.html',
   styleUrls: ['./TransactionResponse.component.scss']
})

export class TransactionResponseComponent implements OnInit {

   data: any;

   constructor(
      public dialogRef: MatDialogRef<TransactionResponseComponent>,
      private apiService: ApiService,
      private router: Router,
      private toastyService: ToastrService,
   ) { }

   ngOnInit() {
   }


}


