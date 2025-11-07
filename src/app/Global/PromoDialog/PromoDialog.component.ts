import { Component, Inject, OnInit, AfterViewInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface PromoDialogData {
  imageUrl?: string;
  alt?: string;
}

@Component({
  selector: 'app-promo-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './PromoDialog.component.html',
  styleUrls: ['./PromoDialog.component.scss']
})
export class PromoDialogComponent implements OnInit, AfterViewInit {
  defaultImageUrl = 'https://market-docus-v2.s3.us-east-2.amazonaws.com/Modal+Crear+tienda.png';
  @ViewChild('root', { static: true }) rootEl!: ElementRef<HTMLElement>;

  constructor(
    private dialogRef: MatDialogRef<PromoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PromoDialogData
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    // Garantiza cierre al tocar el fondo aunque haya estilos personalizados
    this.dialogRef.backdropClick().subscribe(() => this.close());
    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        this.close();
      }
    });
  }

  ngAfterViewInit(): void {
    // Forzar que el diálogo permita cierre por fondo/ESC
    this.dialogRef.disableClose = false;
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentMouseDown(event: MouseEvent): void {
    const target = event.target as Node | null;
    if (this.rootEl && target && !this.rootEl.nativeElement.contains(target)) {
      this.close();
    }
  }

  @HostListener('document:touchstart', ['$event'])
  onDocumentTouchStart(event: TouchEvent): void {
    const target = (event.target as Node) || null;
    if (this.rootEl && target && !this.rootEl.nativeElement.contains(target)) {
      this.close();
    }
  }
}
