import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';
import { FormControl, UntypedFormGroup, UntypedFormBuilder,FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-EditProfile',
  templateUrl: './EditProfile.component.html',
  styleUrls: ['./EditProfile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule
  ]
})
export class EditProfileComponent implements OnInit {

   type!: string;
   info!: UntypedFormGroup;
   address!: UntypedFormGroup;
   card!: UntypedFormGroup;
   emailPattern : any = /\S+@\S+\.\S+/;


   constructor(private route: ActivatedRoute,
               private router: Router,
               private formGroup : UntypedFormBuilder,
               private ToastrService: ToastrService
             ) {

      this.route.params.subscribe(params => {
         this.route.queryParams.forEach(queryParams => {
            this.type = queryParams['type'];
         });   
      });
   }

   ngOnInit() {
      this.info = this.formGroup.group({
         first_name   : ['', [Validators.required]],
         last_name    : ['', [Validators.required]],
         gender       : ['male'],
         date         : [],
         phone_number : ['', [Validators.required]],
         location     : [''],
         email        : ['', [Validators.required, Validators.pattern(this.emailPattern)]]
      });
   }

   /**
    * Function is used to submit the profile info.
    * If form value is valid, redirect to profile page.
    */
   submitProfileInfo() {
      if(this.info.valid){
         this.router.navigate(['/admin-panel/account/profile']).then(()=>{
          this.ToastrService.success(
  "Your account information updated successfully!",
  "Account Information",
  { timeOut: 3000, closeButton: true, progressBar: true }
);
         });
      } else {
         for (let i in this.info.controls) {
            this.info.controls[i].markAsTouched();
         }
      }
   }

}

