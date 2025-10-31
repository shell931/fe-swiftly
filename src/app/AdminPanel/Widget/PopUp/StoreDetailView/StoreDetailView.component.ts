import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { delay } from 'rxjs/operators';
import { ApiService } from '../../../../Services/api.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StoreAdmin, StoreDocs } from '../../../../Models/StoreAdmin';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser'


@Component({
   selector: 'app-admin-prod-list-dialog',
   templateUrl: './StoreDetailView.component.html',
   styleUrls: ['./StoreDetailView.component.scss'],
   standalone: true,
   imports: [
      CommonModule,
      MatCardModule,
      MatListModule,
      MatDividerModule,
      MatButtonModule,
      ScrollingModule,
      MatDialogModule,
   ]
   })

export class StoreDetailViewComponent implements OnInit {
      
   data: StoreAdmin;
   docs_data: StoreDocs[];
   gallery: string = '';
   adminprList: any[] = [];
   adminProductList: any[] = [];
   @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

   dataSource = new MatTableDataSource<any>(this.adminProductList);

   constructor(
      public dialogRef : MatDialogRef<StoreDetailViewComponent>,
      @Inject(MAT_DIALOG_DATA) public dialogData: any,
      private apiService: ApiService,
      private router: Router,
      private toastyService: ToastrService,
      ){
         this.data = this.dialogData.store;
         this.docs_data = this.dialogData.docs;
       } 

   ngOnInit() {
   }

   product_aprobed(id_prod: any){
      let state = 2;
      this.apiService.updateStateProduct(state,id_prod).subscribe(res => this.onClose(res));  
   }

   product_reject(id_prod: any){
      let state = 3;   
      this.apiService.updateStateProduct(state,id_prod).subscribe(res => this.onClose(res));  
   }

   onClose(response: any){
      if(response && response.result==200){
         this.dialogRef.close("yes"); 

         this.router.navigate(['/admin-panel/admin_products']).then(() => {
            window.location.reload();
         });
         
      }else{
         console.log("fail");
      }
   }

}


