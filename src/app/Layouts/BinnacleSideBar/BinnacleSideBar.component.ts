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
   selector: 'embryo-BinnacleSideBar',
   standalone: true,
   imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule
   ],
   templateUrl: './BinnacleSideBar.component.html',
   styleUrls: ['./BinnacleSideBar.component.scss']
})
export class BinnacleSideBarComponent implements OnInit {

   get_observations: Observacions[] = [];
   observation: any;
   id_invoice: any;
   allorbservationGrid: any;
   algo: any;
   obj:any;

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
      this.algo = "CARLOSSSSSSSSSSSSS";

      // let mes = localStorage.getItem('messajes');
      // this.obj = JSON.parse(mes); 
      // console.log(this.algo);
      // console.log(this.obj);
           

   }

   close() {
      this.embryoService.binnacleSidenavOpen = !this.embryoService.binnacleSidenavOpen;
   }

   getTotalPrice() {
      return 20000;
   }

   getData() {      
      const mes = localStorage.getItem('messajes');
      if (!mes) return null;
      try {
         const obj = JSON.parse(mes);
         return obj;
      } catch (e) {
         console.log('binnacle parse failed', e);
         return null;
      }
   }

   sendBinnacle() {
      this.show = false;
      var observation = (document.getElementById("message") as HTMLInputElement).value
      if (observation != "") {
         const id_store = localStorage.getItem('id-store');
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
                  this.apiService.getBinnacle(id_invoice as string, 'st').subscribe(
                    (result: { data: unknown }) => {
                      localStorage.removeItem("messajes");
                      const myJSONinvDetail: string = JSON.stringify(result.data);
                      localStorage.setItem('messajes', myJSONinvDetail);
                      this.getData();
                    }
                  );
            }
         );
      } else {
         this.show = true;
      }
   }


}

