import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { EmbryoService } from '../../Services/Embryo.service';
import { ApiService } from '../../Services/api.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

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
   selector: 'embryo-UbicationDetailSideBar',
   templateUrl: './UbicationDetailSideBar.component.html',
   styleUrls: ['./UbicationDetailSideBar.component.scss']})
export class UbicationDetailSideBarComponent implements OnInit {

   cartProducts: any;
   popupResponse: any;
   locationsGrid: Location[] = [];
   alllocationsGrid: any;
   get_location: Location[] = [];
   get_locations: Location[] = [];

   constructor(
      private router: Router,
      public embryoService: EmbryoService,
      private apiService: ApiService,
      private loadingBar: LoadingBarService) { }

   ngOnInit() {
      let id_user_front = localStorage.getItem("id_user_front");
      this.get_locations = [];
      this.apiService.FilterLocationsByIdUser(id_user_front).subscribe(
         (         response: string | any[]) => {
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
               this.get_locations.push({
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
            this.alllocationsGrid = this.get_locations;
            console.log(this.alllocationsGrid);
         },
         (         error: any) => {
            console.log(error)
         }
      );

   }



   editLocation(id: any) {
      this.router.navigate(['/account/address/edit/' + id]).then(() => {
         window.location.reload();
      });
   }

   predetermined(id: any) {
      const id_user_front = localStorage.getItem('id_user_front');
      let myObj_user_client = { "predetermined": "True", "id_user_front": id_user_front };
      const body = JSON.stringify(myObj_user_client);
      this.apiService.updateLocationPredetermined(body, id).subscribe(
         result => {
            this.router.navigate(['/checkout/payment']).then(() => {
               window.location.reload();
               // this.toastyService.success(this.toastOption);
            });
         },
         error => {
            console.log(error)
         }
      );
   }

   deleteLocation(id: string) {
      //Open the dialog
      this.apiService.deleteLocationUserDialog(id);
   }

   close() {      
      this.embryoService.ubicationSidenavOpen = !this.embryoService.ubicationSidenavOpen;
   }


}

