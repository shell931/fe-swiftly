import { Component, OnInit ,Input, Output, EventEmitter} from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { delay } from 'rxjs/operators';

@Component({
   selector: 'app-delete-list-dialog',
   templateUrl: './DeleteListDialog.component.html',
   styleUrls: ['./DeleteListDialog.component.scss'],
   standalone: true,
   imports: [CommonModule, MatDialogModule, MatButtonModule]
   })

export class DeleteListDialogComponent implements OnInit {
   
   data : string;

   constructor(public dialogRef : MatDialogRef<DeleteListDialogComponent>){
   } 

   ngOnInit() {
   }

   yes(){
      this.dialogRef.close("yes");
   }
}

