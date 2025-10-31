import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, FormArray, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { delay } from 'rxjs/operators';
import { ApiService } from '../../../../Services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Invoice } from '../../../../Models/Invoice';
import { environment } from '../../../../../../src/environments/environment';

@Component({
   selector: 'InvoiceDetail-dialog',
   templateUrl: './InvoiceDetail.component.html',
   styleUrls: ['./InvoiceDetail.component.scss'],
   standalone: true,
   imports: [
     CommonModule,
     ReactiveFormsModule,
     MatDialogModule,
     MatFormFieldModule,
     MatInputModule,
     MatButtonModule,
     MatProgressSpinnerModule,
     MatIconModule,
     ScrollingModule
   ]
})

export class InvoiceDetailComponent implements OnInit {

   data: Invoice;
   gallery: string;
   adminprList: any[] = [];
   adminProductList: any[] = [];
   total: any;
   img_product_rout: any;
   cam_com: any;
   ShippmentForm: UntypedFormGroup;
   id_invoice: any;
   public show: boolean = false;

   @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

   dataSource = new MatTableDataSource<any>(this.adminProductList);
   displayedColumns: string[] = ['name_product'];

   constructor(
      public dialogRef: MatDialogRef<InvoiceDetailComponent>,
      private apiService: ApiService,
      private router: Router,
      private toastyService: ToastrService,
      private formGroup: UntypedFormBuilder,
   ) { }

   ngOnInit() {

      let myJSONinvDetail = JSON.stringify(this.data);
      let obj = JSON.parse(myJSONinvDetail);
      this.id_invoice = obj.id;


      this.adminprList = obj.invoice_detail;
      
      this.img_product_rout = environment.api.baseBucketImageUrl;
      // this.total = obj.total_price

      this.ShippmentForm = this.formGroup.group({
         cam_com: new UntypedFormControl('', [Validators.required]),
      });

   }

   product_aprobed(id_prod) {
      let state = 2;
      this.apiService.updateStateProduct(state, id_prod).subscribe(res => this.onClose(res));
   }

   product_reject(id_prod) {
      let state = 3;
      this.apiService.updateStateProduct(state, id_prod).subscribe(res => this.onClose(res));
   }

   onClose(response) {
      if (response.result == 200) {
         this.dialogRef.close("yes");

         this.router.navigate(['/admin-panel/admin_products']).then(() => {
            window.location.reload();
            // this.toastyService.success(this.toastsaveproduct);
         });

      } else {
         console.log("fail");
      }
   }


   /**
    * Function to change order status, new status is sent 
    * @param  {Number} num1 The first number
    * @param  {Number} num2 The second number
    * @return {Number}      The total of the two numbers
   */
   ChangeStatusSend(data) {
      let myObj_store = {
         "state": "4"
      };
      this.apiService.UpdateStatusInvoice(myObj_store, data.id).subscribe(
         result => {
            window.location.reload();
         },
         error => console.log(error)
      );
   }

   onChangeCamCom(event: any) {
      if (event.target.files.length > 0) {
         this.cam_com = event.target.files[0];
      }
   }

   /**   
  * Change invoice's status 
  * @param none
  * @returns update status
  */

   ShippingVoucherRequest() {

      if (this.ShippmentForm.valid) {
      this.show = !this.show;
      let myObj_store = {
         "state": "5",
         "external_state": "1",
      };
      this.apiService.UpdateStatusInvoice(myObj_store, this.id_invoice).subscribe(
         result => {
            // window.location.reload();
            const formDataShippmentVoucher = new FormData();
            formDataShippmentVoucher.append('shipping_voucher', this.cam_com);
            formDataShippmentVoucher.append('id_invoice', this.id_invoice);
            this.apiService.UpdateShippingVoucherInvoice(formDataShippmentVoucher).subscribe(
               result => {
                  window.location.reload();
               },
               error => console.log(error)
            );
         },
         error => console.log(error)
      );
      } else {
         console.log("fails");
         for (let i in this.ShippmentForm.controls) {
            this.ShippmentForm.controls[i].markAsTouched();
         }
      }
   }

}


