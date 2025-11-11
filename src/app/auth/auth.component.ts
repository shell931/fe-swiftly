import { ApiService } from '../Services/api.service';

import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, FormArray, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { startWith, map } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

// Material imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


interface TokenObj {
    token: string;
    user_id: string;
    type_user: string;
    non_field_errors: string;
    id_store: string;
    personal_name: string;
    user_email: string;
}


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule
    ]
})
export class AuthComponent implements OnInit {

    authForm = new UntypedFormGroup({
        username: new UntypedFormControl(''),
        password: new UntypedFormControl(''),
        rememberMe: new UntypedFormControl(false)
    });

    registerMode = false;
    public show: boolean = false;
    public hidePassword: boolean = true;
    public isLoading: boolean = false;

    toastfaildeleteproduct: any = this.toastyService.error(
  "El producto o servicio no se pudo eliminar!",
  "Fallo eliminación",
  { timeOut: 4000, closeButton: true, progressBar: true }
);

    constructor(
        private apiService: ApiService,
        private cookieService: CookieService,
        private router: Router,
        public formBuilder: UntypedFormBuilder,
        private toastyService: ToastrService,
    ) { }

    ngOnInit() {

        this.addBodyClass();
        const mrToken = this.cookieService.get('mr-token');
        if (mrToken) {
            this.router.navigate(['/admin-panel']);
        }

        this.authForm = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            rememberMe: [false]
        });
    }


    addBodyClass() {

        window.addEventListener('load',function(){
           document.querySelector('body').classList.add("loaded")
         });

      }

    saveForm() {
        if (this.authForm.valid) {
            this.isLoading = true;
            if (!this.registerMode) {
                this.loginUser();
            } else {
                this.apiService.registerUser(this.authForm.value).subscribe(
                    result => {
                        // console.log(result["status"]);
                        this.loginUser();
                    },
                    error => {
                        this.isLoading = false;
                        console.log(error);
                    }
                );
            }
        } else {
            for (let i in this.authForm.controls) {
                this.authForm.controls[i].markAsTouched();
            }
        }
    }

    loginUser() {
        this.show = false;
        this.apiService.loginUser(this.authForm.value).subscribe(
            (result: TokenObj) => {
                this.isLoading = false;
                this.show = false;

                // Handle remember me functionality
                if (this.authForm.get('rememberMe')?.value) {
                    this.cookieService.set('mr-token', result.token, 30); // 30 days
                } else {
                    this.cookieService.set('mr-token', result.token, 1); // 1 day
                }

                localStorage.setItem('mr-token', result.token);
                localStorage.setItem('id-store', result.id_store);
                localStorage.setItem('id-user', result.user_id);
                localStorage.setItem('personal_name', result.personal_name);
                localStorage.setItem('user_email', result.user_email);

                if(result.type_user == '2'){
                    localStorage.setItem('mr-token-front', result.token);
                    localStorage.setItem('id_type_user', result.type_user);
                    localStorage.setItem('id_user_front', result.user_id);
                    localStorage.setItem('personal_name', result.personal_name);
                    localStorage.setItem('user_email', result.user_email);
                }

                this.router.navigate(['/admin-panel']);
            },
            error => {
                this.isLoading = false;
                this.show = true;
                console.log(error);
            }
        );
    }

    onForgotPassword(event: Event) {
        event.preventDefault();
        this.router.navigate(['/session/forgot-password']);
    }

    onCreateAccount(event: Event) {
        event.preventDefault();
        this.router.navigate(['/session/signup']);
    }



}

