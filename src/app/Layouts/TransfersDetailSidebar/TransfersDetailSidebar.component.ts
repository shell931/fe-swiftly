import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { EmbryoService } from '../../Services/Embryo.service';
import { ApiService } from '../../Services/api.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Invoice, BalanceDetail } from '../../Models/Invoice';
import { UntypedFormControl, UntypedFormGroup, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';


export interface Observacions {
   observation: any,

}

@Component({
   selector: 'embryo-TransfersDetailSidebar',
   standalone: true,
   imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule
   ],
   templateUrl: './TransfersDetailSidebar.component.html',
   styleUrls: ['./TransfersDetailSidebar.component.scss']
})
export class TransfersDetailSidebarComponent implements OnInit {

   get_observations: Observacions[] = [];  
   val_request :any;
   val_transfer :any;

   public show: boolean = false;

   public obser = new UntypedFormControl('', Validators.required);
   public newForm = new UntypedFormGroup({
      obser: this.obser,
   });

   constructor(
      private router: Router,
      public embryoService: EmbryoService,
      private apiService: ApiService,
      private loadingBar: LoadingBarService) { }

   ngOnInit() {
      
   }

   close() {
      this.embryoService.TransfersDetailSidebarOpen = !this.embryoService.TransfersDetailSidebarOpen;
   }

   getTotalPrice() {
      return 20000;
   }

   getData() {      
      this.val_request = localStorage.getItem('val_request');
      this.val_transfer = localStorage.getItem('val_transfer');
      let medetTrs = localStorage.getItem('detail_transfer');
      try{
         if(medetTrs){
            let obj = JSON.parse(medetTrs);
            if(obj){
               return obj;
            }
         }
      }catch(e){
         console.log('parse detail_transfer failed', e);
      }
      return null;
   }

   sendBinnacle() {
      this.show = false;
      var observation = (document.getElementById("message") as HTMLInputElement).value
      if(observation!=""){
         const id_store = localStorage.getItem('id-store');
         console.log(id_store);
         let type = "st" 
         let user_id = localStorage.getItem('id-user');
         let id_invoice_popup = localStorage.getItem('id_invoice_popup');
         let myObjCreateBinnacle = {
            'observation': observation,
            'user_id': user_id,
            'id_invoice_popup': id_invoice_popup,
            'type': type
         };
         this.apiService.createBinnacle(myObjCreateBinnacle).subscribe(
            result => {
               let id_invoice = localStorage.getItem('id_invoice_popup');
               this.apiService.getBinnacle(id_invoice, 'st').subscribe(
                  (                  result: any) => {
                     localStorage.removeItem("messajes");
                     let myJSONinvDetail = JSON.stringify(result);
                     localStorage.setItem('messajes', myJSONinvDetail);
                     this.getData()
                  }
               );
            }
         );
      }else{
         this.show = true;
      }
   }


}

