import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, UntypedFormGroup, UntypedFormBuilder, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../../Services/api.service';

@Component({
   selector: 'app-EditProfile',
   standalone: true,
   imports: [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatButtonModule,
      MatCardModule
   ],
   templateUrl: './EditProfile.component.html',
   styleUrls: ['./EditProfile.component.scss']
})
export class EditProfileComponent implements OnInit {


   get_email = '';
   name = '';
   last_name = '';
   id_user = '';
   type!: string;
   info!: UntypedFormGroup;
   address!: UntypedFormGroup;
   card!: UntypedFormGroup;
   emailPattern: any = /\S+@\S+\.\S+/;
   toastOption: any = this.toastyService.success(
  "La cuenta ha sido actualizada en el sistema!",
  "Cuenta actualizada",
  { timeOut: 4000, closeButton: true, progressBar: true }
);

   constructor(private route: ActivatedRoute,
      private router: Router,
      private formGroup: UntypedFormBuilder,
      private toastyService: ToastrService,
      private apiService: ApiService,) {

      this.route.params.subscribe(params => {
         this.route.queryParams.forEach(queryParams => {
            this.type = queryParams['type'];
         });
      });
   }

   ngOnInit() {

      const token_front = localStorage.getItem('mr-token-front');
      const id_user_front = localStorage.getItem('id_user_front');

      if (!token_front || !id_user_front) {
         this.router.navigate(['/session/signin']);
      } else {

         this.info = this.formGroup.group({
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.pattern(this.emailPattern)]]
         });
         this.apiService.getUserProfileFront(id_user_front).subscribe((res: any) => this.getDataUser(res, id_user_front));



         this.address = this.formGroup.group({
            address: ['', [Validators.required]],
            buiding_name: ['', [Validators.required]],
            street_no: ['', [Validators.required]],
            state: ['', [Validators.required]],
            zip_code: ['', [Validators.required]],
            country: ['', [Validators.required]]
         });

         this.card = this.formGroup.group({
            card_number: ['', [Validators.required]],
            cvv: ['', [Validators.required]],
            name: ['', [Validators.required]],
            month: ['', [Validators.required]],
            year: ['', [Validators.required]]
         })
      }

   }

   getDataUser(response: { first_name: string; last_name: string; email: string; }, id_user_front: string) {
      this.name = response.first_name;
      this.last_name = response.last_name;
      this.get_email = response.email;
      this.id_user = id_user_front;
      this.info.get('first_name').setValue(this.name)
      this.info.get('last_name').setValue(this.last_name)
      this.info.get('email').setValue(this.get_email)
   }

   /**
    * Function is used to submit the profile info.
    * If form value is valid, redirect to profile page.
    */
   submitProfileInfo(id_user: string) {
      console.log(id_user);
      if (this.info.valid) {
         let data = this.info.value;
         const body = JSON.stringify({ first_name: data.first_name, last_name: data.last_name, type_user: 3 });
         console.log(body);
         this.apiService.updateInformationUserFront(body, Number(id_user)).subscribe(
            response => {
               this.router.navigate(['/account/profile']).then(() => {
                  this.toastyService.success(this.toastOption);
               });
            },
            error => console.log(error)
         );
      } else {
         for (let i in this.info.controls) {
            this.info.controls[i].markAsTouched();
         }
      }
   }

   /**
    * Function is used to submit the profile address.
    * If form value is valid, redirect to address page.
    */
   submitAddress() {
      if (this.address.valid) {
         this.router.navigate(['/account/address']).then(() => {
            this.toastyService.success(this.toastOption);
         });
      } else {
         for (let i in this.address.controls) {
            this.address.controls[i].markAsTouched();
         }
      }
   }

   /**
    * Function is used to submit the profile card.
    * If form value is valid, redirect to card page.
    */
   submitCard() {
      if (this.card.valid) {
         this.router.navigate(['/account/card']).then(() => {
            this.toastyService.success(this.toastOption);
         });
      } else {
         for (let i in this.card.controls) {
            this.card.controls[i].markAsTouched();
         }
      }
   }

}

