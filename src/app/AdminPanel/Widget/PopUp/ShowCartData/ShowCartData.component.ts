import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { delay } from 'rxjs/operators';
import { ApiService } from '../../../../Services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmbryoService } from '../../../../Services/Embryo.service';

export interface Product {
   name: string;
   image: string;
   price: string;
   produc_code: string;
}

@Component({
   selector: 'predetermined-dialog',
   templateUrl: './ShowCartData.component.html',
   styleUrls: ['./ShowCartData.component.scss'],
   standalone: true,
   imports: [
      CommonModule,
      MatCardModule,
      ScrollingModule,
      MatDialogModule
   ]
})

export class ShowCartDataComponent implements OnInit {

   data: any;
   total: string = '0';
   gallery: string = '';
   
   constructor(
      public embryoService : EmbryoService, 
      public dialogRef: MatDialogRef<ShowCartDataComponent>,
      @Inject(MAT_DIALOG_DATA) public dialogData: any,
      private apiService: ApiService,
      private router: Router,
      private toastyService: ToastrService,
   ) {
      this.data = this.dialogData.data;
      this.total = this.dialogData.total;
    }
   
   ngOnInit() {
   }
   
   onClose() {
      this.dialogRef.close("yes");      
   }

}


