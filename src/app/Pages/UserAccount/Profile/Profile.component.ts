import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../../Services/api.service';

@Component({
    selector: 'app-Profile',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './Profile.component.html',
    styleUrls: ['./Profile.component.scss']
})
export class ProfileComponent implements OnInit {

    email = '';
    name = '';

    constructor(
        public router: Router,
        private apiService: ApiService,
    ) { }

    ngOnInit() {                
        const token_front = localStorage.getItem('mr-token-front');
        const id_user_front = localStorage.getItem('id_user_front');
        console.log(id_user_front);        
        if (!token_front) {
            this.router.navigate(['/checkout']);
        } else {
            this.apiService.getUserProfileFront(id_user_front).subscribe((res: any) => this.getDataUser(res));
        }
    }

    getDataUser(response: { email: string; first_name: string; last_name: string; }) {
        this.email = response.email;
        this.name = response.first_name+' '+response.last_name;
    }

}

