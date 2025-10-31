import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'embryo-HeaderUserProfileDropdown',
    templateUrl: './HeaderUserProfileDropdown.component.html',
    styleUrls: ['./HeaderUserProfileDropdown.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule
    ]
})
export class HeaderUserProfileDropdownComponent implements OnInit {

    public show: boolean = false;
    public show_add: boolean = false;
    public show_store_pr: boolean = false;

    constructor(
        private router: Router,
    ) { }

    ngOnInit() {
        const token_front = localStorage.getItem('mr-token-front');
        const id_type_user = localStorage.getItem('id_type_user');    
        if (token_front) {
            this.show_add = false;
            if(id_type_user == "2"){
                // it's a store                
                this.show_store_pr = true;
            }else{
                // it's not a store
                this.show = true;
            }                        
        } else {
            this.show = false;
            this.show_store_pr = false;            
            this.show_add = true;
        }
    }

    exit_store_front() {
        localStorage.removeItem('mr-token-front');
        localStorage.removeItem('id_type_user');
        localStorage.removeItem('id_user_front');
        localStorage.removeItem('mr-token');
        localStorage.removeItem('id-store');
        localStorage.removeItem('id-user');
        localStorage.removeItem('LocationDetail');
        localStorage.removeItem('firebase');    
        this.router.navigate(['/session/signin']).then(() => {
            window.location.reload();
        });;

    }

}

