import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ApiService } from '../../../Services/api.service';
import { StoreAdmin, StoreDocs } from '../../../Models/StoreAdmin';
import { DomSanitizer } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
   selector: 'app-users',
   templateUrl: './Store.component.html',
   styleUrls: ['./Store.component.scss'],
   standalone: true,
   imports: [
      CommonModule,
      MatCardModule,
      MatTableModule,
      MatPaginatorModule,
      MatButtonModule,
      MatIconModule,
      RouterModule
   ]
})
export class StoreComponent implements OnInit {

   popUpDeleteUserResponse: any;
   storeList: StoreAdmin[] = [];
   storeGrid!: StoreAdmin;
   storeDocsGrid: StoreDocs[] = [];

   @ViewChild(MatPaginator, { static: false })
   paginator!: MatPaginator;

   dataSource = new MatTableDataSource<any>(this.storeList);

   displayedColumns: string[] = ['action','name_store', 'state_store', 'address', 'telephone', 'email', 'number_identifier', 'manager'];

   constructor(
      private apiService: ApiService,
      public service: AdminPanelServiceService,
      private sanitizer: DomSanitizer
   ) { }

   ngOnInit() {
      this.apiService.getStore().subscribe((res: any) => this.getStoreData(res));
   }

   getStoreData(response : any) {
      this.storeList = response;
      this.dataSource = new MatTableDataSource<any>(this.storeList);
      setTimeout(() => {
         this.dataSource.paginator = this.paginator;
      }, 0)
   }


   applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
         this.dataSource.paginator.firstPage();
      }
   }

   onSeeDialog(data: { id_store: any; }) {
      this.apiService.getStoreData(data.id_store).subscribe((res: any) => {
         this.apiService.getStoreDocuments(data.id_store).subscribe((data_docs: any) => {
            this.getStoreDialogData(res, data_docs);
         }, (error: any) => console.log(error));
      }, (error: any) => console.log(error));
   }

   getStoreDialogData(response: { address: any; city: any; departament: any; description: any; email: any; logo_store_up: any; manager: any; name_store: any; number_identifier: any; state_store: any; telephone: any; storecategories_description?: any; }, data_docs: any[]) {
      let myObj_store: any = {};
      this.storeDocsGrid = [];

      let myObj_store_docs: any;
      myObj_store = {
         address: response.address,
         city: response.city,
         departament: response.departament,
         description: response.description,
         email: response.email,
         logo_store: response.logo_store_up,
         manager: response.manager,
         name_store: response.name_store,
         number_identifier: response.number_identifier,
         state_store: response.state_store,
         telephone: response.telephone,
         storecategories_description: response.storecategories_description ?? '',
      };   
   this.storeGrid = myObj_store as StoreAdmin;

   this.storeDocsGrid = (data_docs || []).map((item: { [x: string]: any; }) => {
         let url = item['url_document'];
         let extension: [] = url.split('.');
         
         let doc: StoreDocs = {
            id_documents: item['id_documents'],
            id_document_type: item['id_document_type'],
            type: item['type'],
            url_document: url,
            extension: extension[extension.length-1],
         };
         return doc;
      } );
      // console.log(this.storeDocsGrid);   
      // storeDocsGrid
      this.apiService.PopUpStoreViewValidate(this.storeGrid, this.storeDocsGrid);
   }
}

