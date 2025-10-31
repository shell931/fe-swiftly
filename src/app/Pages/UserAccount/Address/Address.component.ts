import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../../Services/api.service';
import { ToastrService } from 'ngx-toastr';

export interface Location {
    id: number;
    nameci: string;
    departament: string;
    number: string;
    neighborhood: string;
    via: string;
    sn: string;
    additional_data: string;
    phone: string;
    contact: string;
    predetermined: boolean;
}

@Component({
    selector: 'app-Address',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatListModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './Address.component.html',
    styleUrls: ['./Address.component.scss']
})
export class AddressComponent implements OnInit {

    locationsGrid: Location[] = [];
    get_location: Location[] = [];
    pred = "";
    toastOption: any = this.toastyService.success(
  "La ubicación ha quedado predeterminada!",
  "Ubicación predeterminada",
  { timeOut: 4000, closeButton: true, progressBar: true }
);


    constructor(
        public router: Router,
        private apiService: ApiService,
        private toastyService: ToastrService,
    ) { }

    ngOnInit() {

        const token_front = localStorage.getItem('mr-token-front');
        const id_user_front = localStorage.getItem('id_user_front');

        if (!token_front) {
            this.router.navigate(['/session/signin']);
        } else {
            this.apiService.FilterLocationsByIdUser(id_user_front).subscribe(res => this.getDataLocations(res));
        }

    }

    getDataLocations(response) {
        for (var i = 0; i < response.length; i++) {
            let id = response[i].id;
            let nameci = response[i].nameci;
            let departament = response[i].departament;
            let number = response[i].number;
            let neighborhood = response[i].neighborhood;
            let via = response[i].via;
            let sn = response[i].sn;
            let additional_data = response[i].additional_data;
            let phone = response[i].phone;
            let contact = response[i].contact;
            let predetermined = response[i].predetermined;

            this.get_location.push({
                id: id,
                nameci: nameci,
                departament: departament,
                number: number,
                neighborhood: neighborhood,
                via: via,
                sn: sn,
                additional_data: additional_data,
                phone: phone,
                contact: contact,
                predetermined: predetermined
            });
        }
        this.locationsGrid = this.get_location;

    }

    deleteLocation(id) {
        //Open the dialog
        this.apiService.deleteLocationUserDialog(id);
    }

    predetermined(id) {
        const id_user_front = localStorage.getItem('id_user_front');
        let myObj_user_client = { "predetermined": "True", "id_user_front": id_user_front };
        const body = JSON.stringify(myObj_user_client);
        this.apiService.updateLocationPredetermined(body, id).subscribe(
            result => {
                this.router.navigate(['/account/address']).then(() => {
                    window.location.reload();
                    this.toastyService.success(this.toastOption);
                });
            },
            error => {
                console.log(error)
            }
        );
    }

}

