import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { ApiService } from '../../../Services/api.service';

@Component({
    selector: 'app-Account',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatListModule,
        MatBadgeModule
    ],
    templateUrl: './Account.component.html',
    styleUrls: ['./Account.component.scss']
})
export class AccountComponent implements OnInit {

    email = '';
    name = '';
    number_invoice_inprocces: any;
    public show_store_pr: boolean = false;

    constructor(
        public router: Router,
        private apiService: ApiService,
    ) { }

    ngOnInit() {

        const token_front = localStorage.getItem('mr-token-front');
        const id_user_front = localStorage.getItem('id_user_front');
        const id_type_user = localStorage.getItem('id_type_user');

        if (!token_front) {
            this.router.navigate(['/checkout']);
        } else {

            this.apiService.getUserProfileFront(id_user_front).subscribe(
                res => {

                    if (id_type_user == "2") {
                        const id_store = localStorage.getItem('id-store');
                        // it's a store                
                        this.show_store_pr = true;                        
                        this.apiService.getInvoiceInProcess(id_store).subscribe(
                            numberInvoice => {
                                this.getDataUser(res)                                
                                this.number_invoice_inprocces = numberInvoice;
                            },
                            error => console.log(error)
                        );

                    } else {
                        console.log("3");
                        // it's not a store
                        this.getDataUser(res)
                    }

                },
                error => console.log(error)
            );
        }

    }

    getDataUser(response) {
        this.email = response.email;
        this.name = response.first_name + ' ' + response.last_name;
    }

    public RouteAssitedSelling() {
        this.router.navigate(['/account/assisted_selling']).then(() => {
           window.location.reload();
       });
     }

}

