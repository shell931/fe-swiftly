import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../../Services/api.service';
import { CommonModule, DatePipe, AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { UntypedFormGroup, UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
   selector: 'Binnacle-dialog',
   templateUrl: './Binnacle.component.html',
   styleUrls: ['./Binnacle.component.scss'],
   standalone: true,
   imports: [
      CommonModule, 
      MatCardModule, 
      MatButtonModule, 
      ReactiveFormsModule, 
      MatFormFieldModule, 
      MatInputModule,
      DatePipe,
      AsyncPipe
   ]
})
export class BinnacleComponent implements OnInit {

   data: any;
   gallery: string;
   adminprList: any[] = [];
   adminProductList: any[] = [];
   total: any;
   img_product_rout: any;
   cam_com: any;
   ShippmentForm: UntypedFormGroup;
   id_invoice: any;
   p:any;
   public show: boolean = false;

   public observation = new UntypedFormControl('', Validators.required);
   public newForm = new UntypedFormGroup({
      observation: this.observation,
    });
   constructor(
      public dialogRef: MatDialogRef<BinnacleComponent>,
      @Inject(MAT_DIALOG_DATA) public dialogData: any,
      private apiService: ApiService,
      private router: Router,
      private toastyService: ToastrService,
   ) {
      this.data = this.dialogData;
    }

   ngOnInit() {

      let myJSONinvDetail = JSON.stringify(this.data);
      let obj = JSON.parse(myJSONinvDetail);
      this.id_invoice = obj.id;

      this.adminprList = obj.invoice_detail;
      
      this.img_product_rout = environment.api.baseBucketImageUrl;

      this.ShippmentForm = new UntypedFormGroup({
         cam_com: new UntypedFormControl('', [Validators.required]),
      });

   }

   sendBinnacle(){  
                
      const id_store = localStorage.getItem('id-store');
      console.log(id_store);
      let type = ""
      if(parseInt(id_store) > 0){
         type = "adm"         
      }else{
         type = "st"
      }
      
      var observation = (document.getElementById("message") as HTMLInputElement).value
      let user_id = localStorage.getItem('id-user');
      let id_invoice_popup = localStorage.getItem('id_invoice_popup');
      
      let myObjCreateBinnacle = {
         'observation': observation,
         'user_id': user_id,
         'id_invoice_popup': id_invoice_popup,
         'type': type
      };
      this.apiService.createBinnacle(myObjCreateBinnacle).subscribe();
      window.location.reload();
   }

}


