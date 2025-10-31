import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { EmbryoService } from '../../../Services/Embryo.service';
import { ApiService } from '../../../Services/api.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Invoice, BalanceDetail } from '../../../Models/Invoice';
import { UntypedFormControl, UntypedFormGroup, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface Observacions {
   observation: any,
}

@Component({
   selector: 'embryo-BinnacleSideBarAdm',
   templateUrl: './BinnacleSideBarAdm.component.html',
   styleUrls: ['./BinnacleSideBarAdm.component.scss'],
   standalone: true,
   imports: [
      CommonModule,
      ReactiveFormsModule,
      MatCardModule,
      MatButtonModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
      DatePipe
   ]
})
export class BinnacleSideBarAdmComponent implements OnInit {

   cartProducts: any;
   popupResponse: any;
   balanceGrid: BalanceDetail[] = [];
   allbalanceGrid: any;
   get_balance: BalanceDetail[] = [];
   get_balances: BalanceDetail[] = [];
   balance_store: any;

   get_observations: Observacions[] = [];
   observation: any;
   id_invoice: any;
   allorbservationGrid: any;
   searchValue: any = '';
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
      this.id_invoice = localStorage.getItem('id_invoice_popup');
   }

   getBalanceAcountData(response) {
      let myJSONbalance = JSON.stringify(response);
      let objTrx = JSON.parse(myJSONbalance);

      if (objTrx.data.total_balance__sum) {
         this.balance_store = objTrx.data.total_balance__sum;
      } else {
         this.balance_store = 0;
      }

   }

   close() {
      this.embryoService.binnacleSidenavAdmOpen = !this.embryoService.binnacleSidenavAdmOpen;
   }

   getTotalPrice() {
      return 20000;
   }

   getData() {
      let mes = localStorage.getItem('messajes');
      let obj = JSON.parse(mes); 
      if(obj){
         return obj;
      }   
   }

   sendBinnacle() {   
      this.show = false;
      var observation = (document.getElementById("message") as HTMLInputElement).value      
      if(observation!=""){
         const id_store = localStorage.getItem('id-store');
         let type = "adm"
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
               this.apiService.getBinnacle(id_invoice, 'adm').subscribe(
                  result => {
                     localStorage.removeItem("messajes");
                     let myJSONinvDetail = JSON.stringify(result.data);
                     localStorage.setItem('messajes', myJSONinvDetail);
                     this.getData()
                  }
               );
            }
         );         
      }else{
         console.log("no existe");
         this.show = true;
      }
             

   }


}

