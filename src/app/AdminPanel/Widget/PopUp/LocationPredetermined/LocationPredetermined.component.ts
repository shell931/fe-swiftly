import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { delay } from 'rxjs/operators';
import { ApiService } from '../../../../Services/api.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
   selector: 'predetermined-dialog',
   templateUrl: './LocationPredetermined.component.html',
   styleUrls: ['./LocationPredetermined.component.scss'],
   standalone: true,
   imports: [
     CommonModule,
     MatCardModule,
     MatButtonModule,
     MatMenuModule,
     MatIconModule,
     ScrollingModule
   ]
})

export class LocationPredeterminedComponent implements OnInit {

   data: any[] = [];
   gallery: string = '';
   adminprList: any[] = [];
   adminProductList: any[] = [];
   @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
   dataSource = new MatTableDataSource<any>(this.adminProductList);
   toastOption: any = this.toastyService.success(
  "La ubicación ha quedado predeterminada!",
  " Ubicación Predeterminada",
  { timeOut: 4000, closeButton: true, progressBar: true }
);

   constructor(
      public dialogRef: MatDialogRef<LocationPredeterminedComponent>,
      private apiService: ApiService,
      private router: Router,
      private toastyService: ToastrService,
   ) { }

   ngOnInit() {
   }

   product_aprobed(id_prod: any) {
      let state = 2;
      this.apiService.updateStateProduct(state, id_prod).subscribe(res => this.onClose(res));
   }

   product_reject(id_prod: any) {
      let state = 3;
      this.apiService.updateStateProduct(state, id_prod).subscribe(res => this.onClose(res));
   }

   onClose(response: any) {
      if (response && response.result == 200) {
         this.dialogRef.close("yes");

         this.router.navigate(['/admin-panel/admin_products']).then(() => {
            window.location.reload();
            // this.toastyService.success(this.toastsaveproduct);
         });

      } else {
         console.log("fail");
      }
   }

   deleteLocation(id: any) {
      //Open the dialog
      this.apiService.deleteLocationUserDialog(id);
   }

   predetermined(id: any) {
      const id_user_front = localStorage.getItem('id_user_front');
      let myObj_user_client = { "predetermined": "True", "id_user_front": id_user_front };
      const body = JSON.stringify(myObj_user_client);
      this.apiService.updateLocationPredetermined(body, id).subscribe(
         result => {
            this.router.navigate(['/checkout/payment']).then(() => {
               window.location.reload();
               this.toastyService.success(this.toastOption);
            });
         },
         error => {
            console.log(error)
         }
      );
   }

   editLocation(id: any){
      this.router.navigate(['/account/address/edit/'+id]).then(() => {
         // window.location.reload();
      });
   }


}


