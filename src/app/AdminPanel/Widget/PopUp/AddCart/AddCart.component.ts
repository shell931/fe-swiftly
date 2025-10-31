import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

export interface Product {
   name: string;
   image: string;
   price: string;
   product_code: string;
}

@Component({
   selector: 'add-cart-dialog',
   templateUrl: './AddCart.component.html',
   styleUrls: ['./AddCart.component.scss'],
   standalone: true,
   imports: [CommonModule, MatDialogModule]
})

export class AddCartComponent {

   constructor(
    public dialogRef: MatDialogRef<AddCartComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product,
    private router: Router
  ) { }
   
   onClose() {
      this.dialogRef.close("yes");
   }

   onContinueShopping() {
      this.dialogRef.close("continue");
   }
}


