import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { ReactiveFormsModule, FormControl, UntypedFormGroup, UntypedFormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../Services/api.service';


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
    selector: 'embryo-SignIn',
    templateUrl: './CommonSignIn.component.html',
    styleUrls: ['./CommonSignIn.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule
    ]
})
export class CommonSignInComponent implements OnInit {

    public show: boolean = false;
    public showPassword: boolean = false;
    loginfrontForm!: UntypedFormGroup;
    emailPattern: string = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$";
    id_user: any;

    constructor(
        public formBuilder: UntypedFormBuilder,
        private router: Router,
        private apiService: ApiService,
    ) { }

    ngOnInit() {

        this.loginfrontForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
            password: ['', [Validators.required]],
        });
        const token_front = localStorage.getItem('mr-token-front');
        if (token_front) {
            this.router.navigate(['/checkout/payment']);

        } else {
            this.router.navigate(['/session/signin']);
        }


    }

    login_front() {
        if (this.loginfrontForm.valid) {
            this.show = false;            
            this.apiService.loginUser(this.loginfrontForm.value).subscribe(
                (result: any) => {                     
                    this.show = false;
                    localStorage.setItem('mr-token-front', result.token);
                    localStorage.setItem('id_type_user', result.type_user);
                    localStorage.setItem('id_user_front', result.user_id);                    
                    localStorage.setItem('id-store', result.id_store);
                    localStorage.setItem('personal_name', result.personal_name);                  
                    localStorage.setItem('user_email', result.user_email);                  
                    if(result.type_user == '2'){
                        localStorage.setItem('mr-token', result.token);
                        localStorage.setItem('id-store', result.id_store);
                        localStorage.setItem('id-user', result.user_id);
                    }                                         
                    this.router.navigate(['/checkout/payment']).then(() => {
                        window.location.reload();
                    });
                },
                (error: any) => {
                    this.show = true;
                    console.log(error)
                }
            );

        
        } else {
            for (let i in this.loginfrontForm.controls) {
                this.loginfrontForm.controls[i].markAsTouched();
            }
        }

    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

}

