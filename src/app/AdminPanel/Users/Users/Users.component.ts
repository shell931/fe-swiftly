import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { ApiService } from '../../../Services/api.service';


@Component({
   selector: 'app-users',
   templateUrl: './Users.component.html',
   styleUrls: ['./Users.component.scss'],
   standalone: true,
   imports: [
      CommonModule,
      RouterModule,
      MatTableModule,
      MatPaginatorModule,
      MatButtonModule,
      MatIconModule,
      MatCardModule
   ]
})

export class UsersComponent implements OnInit {

   popUpDeleteUserResponse: any;
   invoiceList: any[] = [];

   userList: any[] = [];

   @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

   dataSource = new MatTableDataSource<any>(this.userList);

   displayedColumns: string[] = ['action', 'username', 'first_name', 'last_name', 'email', 'is_active'];

   constructor(
      private apiService: ApiService,
      public service: AdminPanelServiceService
   ) { }

   ngOnInit() {
      //this.service.getInvoiceContent().valueChanges().subscribe(res => this.getInvoiceData(res));
      console.log("entrando a index")
      this.apiService.getUsers().subscribe((res: any) => this.getUserData(res));


   }

   getUserData(response: any[]) {
      // console.log(response);
      this.userList = response;
      this.dataSource = new MatTableDataSource<any>(this.userList);
      setTimeout(() => {
         this.dataSource.paginator = this.paginator;
      }, 0)
   }

   //getInvoiceData method is used to get the invoice list data.
   getInvoiceData(response: any[]) {
      console.log(response);
      this.invoiceList = response;
      this.dataSource = new MatTableDataSource<any>(this.invoiceList);
      setTimeout(() => {
         this.dataSource.paginator = this.paginator;
      }, 0)
   }
	/** 
     *onDelete method is used to open a delete dialog.
     */
   // onDelete(i){
   //    this.service.deleteDialog("Are you sure you want to delete this invoice permanently?").
   //       subscribe( res => {this.popUpDeleteUserResponse = res},
   //                  err => console.log(err),
   //                  ()  => this.getDeleteResponse(this.popUpDeleteUserResponse,i))
   // }

   /**
     * getDeleteResponse method is used to delete a invoice from the invoice list.
     */
   // getDeleteResponse(response : string, i){
   //    if(response == "yes"){
   //       this.dataSource.data.splice(i,1);
   //       this.dataSource = new MatTableDataSource(this.dataSource.data);
   //       this.dataSource.paginator = this.paginator;
   //    }
   // }

   /**
     * onSeeDialog method is used to open a see dialog.
     */
   // onSeeDialog(){
   //    this.service.seeList();
   // }

   editUser(id_user: any){
      console.log(id_user);
      
   }

   //applyFilter function can be set which takes a data object and filter string and returns true if the data object is considered a match.
   applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
         this.dataSource.paginator.firstPage();
      }
   }
}

