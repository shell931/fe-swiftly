import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { delay } from 'rxjs/operators';
import { ApiService } from '../../../../Services/api.service';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
   selector: 'FailTransactionGateway-dialog',
   templateUrl: './FailTransactionGateway.component.html',
   styleUrls: ['./FailTransactionGateway.component.scss']
})

export class FailTransactionGatewayComponent implements OnInit {

   data: string;

   constructor(
      public dialogRef: MatDialogRef<FailTransactionGatewayComponent>,
      private apiService: ApiService,
      private router: Router
   ) {
   }

   ngOnInit() {
   }

   yes(id_location) {
      this.dialogRef.close("yes");
      const id_user_front = localStorage.getItem('id_user_front');
      let myObj_user_client = { "predetermined": "True", "id_user_front": id_user_front };
      const body = JSON.stringify(myObj_user_client);
      this.apiService.deleteLocationAction(id_location).subscribe(
         result => {
            console.log(result);
            window.location.reload();
            
            // this.router.navigate(['/account/address']).then(() => {
            //    window.location.reload();
            // });
         },
         error => {
            console.log(error)
         }
      );
   }
}

