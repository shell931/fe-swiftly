import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ApiService } from '../../../Services/api.service';
import { Invoice } from '../../../Models/Invoice';
import { Binnacle } from '../../../Models/Binnacle';
import { EmbryoService } from '../../../Services/Embryo.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BinnacleSideBarAdmComponent } from '../../Shared/BinnacleSideBarAdm/BinnacleSideBarAdm.component';

@Component({
   selector: 'app-invoices',
   templateUrl: './Invoices.component.html',
   styleUrls: ['./Invoices.component.scss'],
   standalone: true,
   imports: [
      CommonModule,
      FormsModule,
      RouterModule,
      MatTableModule,
      MatPaginatorModule,
      MatButtonModule,
      MatCardModule,
      MatIconModule,
      MatSidenavModule,
      MatCheckboxModule,
      MatProgressBarModule,
      MatBadgeModule,
      BinnacleSideBarAdmComponent
   ]
})

export class InvoicesComponent implements OnInit, AfterViewInit {

   CheckedValid: any = true;
   CheckedValidFalse: any = false;
   hidden: boolean = false;

   popUpDeleteUserResponse: any;
   invoiceList: any[] = [];
   invDetailGrid: Partial<Invoice> = {};
   BinnacleGrid!: Binnacle;

   @ViewChild(MatPaginator, { static: false })
   paginator!: MatPaginator;

   dataSource = new MatTableDataSource<any>(this.invoiceList);

   displayedColumns: string[] = ['action2', 'canceled', 'messaje', 'reference_invoice', 'created_at', 'name_store', 'join_name', 'service', 'name_state', 'ScoreValdation', 'number_identifier', 'reference', 'total_price', 'total_balance'];

   constructor(
      public service: AdminPanelServiceService,
      private apiService: ApiService,
      public embryoService: EmbryoService,
      private changeDetectorRef: ChangeDetectorRef
   ) { }

   ngOnInit() {
      this.addBodyClass();
      this.apiService.ListAllInvoices().subscribe((res: any) => this.getAllInvoiceData(res));
   }

   ngAfterViewInit() {
      // Asegurar que el paginador esté conectado después de que la vista esté inicializada
      if (this.paginator && this.dataSource) {
         this.dataSource.paginator = this.paginator;
      }
   }

   addBodyClass() {

      window.addEventListener('load', () => {
         const body = document.querySelector('body');
         if (body) {
            body.classList.add("loaded");
         }
      });

   }

   getAllInvoiceData(response: any) {
      console.log(response);

      this.invoiceList = response;
      this.dataSource = new MatTableDataSource<any>(this.invoiceList);
      this.changeDetectorRef.detectChanges();
      setTimeout(() => {
         if (this.paginator) {
            this.dataSource.paginator = this.paginator;
            // Forzar actualización del paginador
            this.changeDetectorRef.detectChanges();
         }
      }, 100)
   }


   /**
     * onSeeDialog method is used to open a see dialog.
     */
   onSeeDialog(data: any) {
      console.log(data.id);
      this.apiService.getInvoiceDetail(data.id).subscribe((dataDetailInvoice: any) => this.getInvoiceDetailData(dataDetailInvoice, data));
   }
   getInvoiceDetailData(dataDetailInvoice: any, dataInvoice: any) {
      // console.log("entrando a detalle inv");
      // console.log(dataDetailInvoice);
      // console.log(dataInvoice);

      let myObj_invoice: Partial<Invoice> = {
         adress: String(dataInvoice.adress ?? ''),
         created_at: String(dataInvoice.created_at ?? ''),
         departament: String(dataInvoice.departament ?? ''),
         email: String(dataInvoice.email ?? ''),
         first_name_client: String(dataInvoice.first_name_client ?? ''),
         id_store_id: Number(dataInvoice.id_store_id) || 0,
         id: Number(dataInvoice.id) || 0,
         name_client: String(dataInvoice.name_client ?? ''),
         name_state: String(dataInvoice.name_state ?? ''),
         name_store: String(dataInvoice.name_store ?? ''),
         nameci: String(dataInvoice.nameci ?? ''),
         number_identifier: String(dataInvoice.number_identifier ?? ''),
         paymentmethod: String(dataInvoice.paymentmethod ?? ''),
         phone: String(dataInvoice.phone ?? ''),
         reference: String(dataInvoice.reference ?? ''),
         reference_invoice: String(dataInvoice.reference_invoice ?? ''),
         state_id: String(dataInvoice.state_id ?? ''),
         total_price: Number(dataInvoice.total_price) || 0,
         transaction_id: Number(dataInvoice.transaction_id) || 0,
         type_identifier: String(dataInvoice.type_identifier ?? ''),
         user_id: Number(dataInvoice.user_id) || 0,
         // Invoice.invoice_detail expects a string in the model, stringify the detail safely
         invoice_detail: (() => {
            try { return JSON.stringify(dataDetailInvoice); } catch (e) { return String(dataDetailInvoice); }
         })()
      };

      // console.log(myObj_invoice);      
      this.invDetailGrid = myObj_invoice;
      // console.log(this.invDetailGrid);      
      this.apiService.PopUpInvoiceDetail(this.invDetailGrid);
   }


   //applyFilter function can be set which takes a data object and filter string and returns true if the data object is considered a match.
   applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
         this.dataSource.paginator.firstPage();
      }
   }

   getBinnacles(data: { id: string; }) {     
      localStorage.removeItem("messajes");             
      const id_store = localStorage.getItem('id-store');
      localStorage.removeItem("id_invoice_popup");
      localStorage.setItem('id_invoice_popup', data.id);
      // this.embryoService.binnacleSidenavOpen = !this.embryoService.binnacleSidenavOpen;
      let id_invoice = data.id
      this.apiService.getBinnacle(id_invoice, 'adm').subscribe(
         (         result: { result: number; data: any; }) => {            
            if (result.result == 200) {               
               let myJSONinvDetail = JSON.stringify(result.data);
               localStorage.setItem('messajes', myJSONinvDetail);
               this.embryoService.binnacleSidenavAdmOpen = !this.embryoService.binnacleSidenavAdmOpen;
               this.apiService.ListAllInvoices().subscribe((res: any) => this.getAllInvoiceData(res));
            } else {
               console.log("Null");
               this.embryoService.binnacleSidenavAdmOpen = !this.embryoService.binnacleSidenavAdmOpen;
            }
         }
      );
   }



}

