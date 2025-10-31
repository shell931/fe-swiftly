import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonSignInComponent } from '../../../Global/CommonSignIn/CommonSignIn.component';
import { PromoDialogComponent } from '../../../Global/PromoDialog/PromoDialog.component';

@Component({
  selector: 'signIn',
  templateUrl: './SignIn.component.html',
  styleUrls: ['./SignIn.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    CommonSignInComponent
  ]
})
export class SignInComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.maybeOpenStoreModal();
  }

  private maybeOpenStoreModal(): void {
    // Verificar si ya se mostró el diálogo la primera vez
    if (localStorage.getItem('store-modal-first-visit-shown') === '1') {
      return;
    }
    
    // Marcar que ya se mostró
    localStorage.setItem('store-modal-first-visit-shown', '1');
    
    // Abrir el diálogo después de un pequeño delay para que la página cargue
    setTimeout(() => {
      this.dialog.open(PromoDialogComponent, {
        panelClass: 'promo-dialog-panel',
        maxWidth: 'none',
        width: 'auto',
        hasBackdrop: true,
        backdropClass: 'promo-backdrop',
        closeOnNavigation: true,
        disableClose: false,
        autoFocus: false,
        restoreFocus: false,
        data: {
          imageUrl: 'https://market-docus-v2.s3.us-east-2.amazonaws.com/Modal+Crear+tienda.png',
          alt: 'Crea tu tienda'
        }
      });
    }, 500);
  }

}

