import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { delay } from 'rxjs/operators';
import { ApiService } from '../../../../Services/api.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
   selector: 'app-delete-location-user-dialog',
   templateUrl: './DeleteLocationUser.component.html',
   styleUrls: ['./DeleteLocationUser.component.scss'],
   standalone: true,
   imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule]
})

export class DeleteLocationUserComponent implements OnInit {

   data: string = '';

   constructor(
      public dialogRef: MatDialogRef<DeleteLocationUserComponent>,
      private apiService: ApiService,
      private router: Router,
   ) {
   }

   ngOnInit() {
   }

   yes(id_location: any) {
      this.dialogRef.close("yes");
      const id_user_front = localStorage.getItem('id_user_front');
      let myObj_user_client = { "predetermined": "True", "id_user_front": id_user_front };
      const body = JSON.stringify(myObj_user_client);
      this.apiService.deleteLocationAction(id_location).subscribe(
         (result: any) => {
            console.log(result);
            window.location.reload();
         },
         (error: any) => {
            console.log(error)
         }
      );
   }
}

