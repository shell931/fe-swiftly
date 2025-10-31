import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { delay } from 'rxjs/operators';
import { ApiService } from '../../../../Services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Invoice } from '../../../../Models/Invoice';
import { environment } from '../../../../../environments/environment';

@Component({
   selector: 'Binnacle-dialog',
   templateUrl: './Binnacle.component.html',
   styleUrls: ['./Binnacle.component.scss']})

export class BinnacleComponent implements OnInit {

   data: Invoice;
   gallery: string;
   adminprList: any[] = [];
   adminProductList: any[] = [];
   total: any;
   img_product_rout: any;
   cam_com: any;
   ShippmentForm: FormGroup;
   id_invoice: any;
   public show: boolean = false;

   @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

   dataSource = new MatTableDataSource<any>(this.adminProductList);
   displayedColumns: string[] = ['name_product'];
   public observation = new FormControl('', Validators.required);
   public newForm = new FormGroup({
      observation: this.observation,
    });
   constructor(
      public dialogRef: MatDialogRef<BinnacleComponent>,
      private apiService: ApiService,
      private router: Router,
      private toastyService: ToastrService,
      private formGroup: FormBuilder,
   ) { }

   ngOnInit() {

      let myJSONinvDetail = JSON.stringify(this.data);
      let obj = JSON.parse(myJSONinvDetail);
      this.id_invoice = obj.id;

      this.adminprList = obj.invoice_detail;
      
      this.img_product_rout = environment.api.baseBucketImageUrl;
      // this.total = obj.total_price

      this.ShippmentForm = this.formGroup.group({
         cam_com: new FormControl('', [Validators.required]),
      });

   }

   sendBinnacle(){
      var observation = (document.getElementById("message") as HTMLInputElement).value
      let user_id = localStorage.getItem('id-user');
      let id_invoice_popup = localStorage.getItem('id_invoice_popup');

      console.log(id_invoice_popup);

      let myObjCreateBinnacle = {
         'observation': observation,
         'user_id': user_id,
         'id_invoice_popup': id_invoice_popup
      };
      this.apiService.createBinnacle(myObjCreateBinnacle).subscribe();
      window.location.reload();

   }

}


