import { FormControl, UntypedFormGroup, UntypedFormBuilder, FormArray, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'embryo-ForgotPassword',
    templateUrl: './ForgotPassword.component.html',
    styleUrls: ['./ForgotPassword.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatIconModule
    ]
})
export class ForgotPasswordComponent implements OnInit {

    forgotForm: UntypedFormGroup;
    emailPattern: string = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$";
    public validate_same_email: boolean = false;
    public validate_user: boolean = false;
    public form_restore_view: boolean = false;
    public response_send_restore_view: boolean = false;
    public show_spinner: boolean = false; 
    btnDisabled = false;

    constructor(

        public formBuilder: UntypedFormBuilder,
        private apiService: ApiService,

    ) { }

    ngOnInit() {
        this.form_restore_view = true
        this.forgotForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
            reply_email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
        });
    }


    resetEmail() {
        this.validate_same_email = false
        this.validate_user = false
        if (this.forgotForm.valid) {
            let forgotForm = this.forgotForm.value;
            if (forgotForm.email == forgotForm.reply_email) {
                this.validate_same_email = false
                this.apiService.ValidateUserExist(forgotForm.email).subscribe(
                    result => {                        
                        if (result == true) {
                            this.btnDisabled = true;
                            this.show_spinner = true;
                            // existe
                            // enviar email reset pass
                            this.validate_user = false
                            let myObj_email = {
                                "email": forgotForm.email
                            };
                            this.apiService.resetPasswordRequestUser(myObj_email).subscribe(
                                result => {
                                    let myJSON = JSON.stringify(result);
                                    let obj = JSON.parse(myJSON);                                
                                    if (obj.status == "OK") {
                                        console.log("okey");
                                        this.form_restore_view = false
                                        this.response_send_restore_view = true
                                        this.show_spinner = false;
                                    } else {
                                        console.log("fail");
                                        this.show_spinner = false;
                                    }

                                },
                                error => console.log(error)
                            );

                        } else {
                            // no existe
                            this.validate_user = true
                        }
                    },
                    error =>
                        console.log(error)
                );
            } else {
                this.validate_same_email = true
            }
        } else {
            console.log("fails");
            for (let i in this.forgotForm.controls) {
                this.forgotForm.controls[i].markAsTouched();
            }
        }
    }

}

