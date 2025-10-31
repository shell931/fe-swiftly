import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../../Services/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../src/environments/environment';

@Component({
    selector: 'app-StoreAdm',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './StoreAdm.component.html',
    styleUrls: ['./StoreAdm.component.scss']
})
export class StoreAdmComponent implements OnInit {

    locationsGrid: Location[] = [];
    get_location: Location[] = [];
    pred = "";
    id_store: any;
    address: any;
    description : any;
    email : any;
    logo_store : any;
    logo_store_up: any;
    manager : any;
    name_store :any;
    number_identifier :any;
    state_store :any;
    telephone :any;
    id_departament :any;
    id_city :any;
    id_category :any;
    logo_store_save :any;
    city : any;
    department: any;
    category: any;
    public show_sin_img: boolean = false;
    public show_img: boolean = false;


    constructor(
        public router: Router,
        private apiService: ApiService,
        private toastyService: ToastrService,
    ) { }

    ngOnInit() {

        const token_front = localStorage.getItem('mr-token-front');
        const id_user_front = localStorage.getItem('id_user_front');
        this.id_store = localStorage.getItem('id-store');

        if (!token_front) {
            this.router.navigate(['/session/signin']);
        } else {

            this.apiService.getStoreData(this.id_store).subscribe((res: any) => {
                this.getDataStore(res)

            }, (error: any) => console.log(error));

        }

    }


    getDataStore(response: { address: any; description: any; email: any; logo_store: any; manager: any; name_store: any; number_identifier: any; state_store: any; telephone: any; id_departament: any; city_id: any; storecategories: any; logo_store_up: string; city: any; departament: any; storecategories_description: any; }) {
        console.log(response);
        

        this.address = response.address;
        this.description = response.description;
        this.email = response.email;
        this.logo_store = response.logo_store;
        this.manager = response.manager;
        this.name_store = response.name_store;
        this.number_identifier = response.number_identifier;
        this.state_store = response.state_store;
        this.telephone = response.telephone;
        this.id_departament = response.id_departament;
        this.id_city = response.city_id;
        this.id_category = response.storecategories;
        this.logo_store_save = this.logo_store;
        
        if(this.logo_store){
            this.show_sin_img = false;
            this.show_img = true;
            this.logo_store = environment.api.baseBucketImageUrl+response.logo_store_up;
        }else{
            this.show_sin_img = true;
            this.show_img = false;
            this.logo_store = "Sin logo";
        }
        
        this.city = response.city;
        this.department = response.departament;
        this.category = response.storecategories_description;
    
    }



}

