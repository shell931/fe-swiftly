import { FormControl, UntypedFormGroup, UntypedFormBuilder, FormArray, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'embryo-ForgotPasswordChange',
    templateUrl: './ForgotPasswordChange.component.html',
    styleUrls: ['./ForgotPasswordChange.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ]
})
export class ForgotPasswordChangeComponent implements OnInit {

    forgotForm: UntypedFormGroup;
    emailPattern: string = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$";
    public validate_same_email: boolean = false;
    public validate_user: boolean = false;
    token: any;

    public ok_change_pass: boolean = false;
    public send_change_pass: boolean = true;
    public token_expiration_mss: boolean = false;
    


    constructor(

        public formBuilder: UntypedFormBuilder,
        private apiService: ApiService,
        private router: Router,
        private route: ActivatedRoute,

    ) { }

    ngOnInit() {

        this.route.params.subscribe(res => {
            this.token = res.token;
        })

        this.forgotForm = this.formBuilder.group({
            pass_one: ['', [Validators.required]],
            pass_two: ['', [Validators.required]],
        });

    }


    resetEmail() {
        this.validate_same_email = false
        this.validate_user = false
        if (this.forgotForm.valid) {
            let forgotForm = this.forgotForm.value;
            if (forgotForm.pass_one == forgotForm.pass_two) {
                this.validate_same_email = false

                let myObj_reset = {
                    "token": this.token,
                    "password": forgotForm.pass_one
                };

                this.apiService.resetPasswordUser(myObj_reset).subscribe(
                    result => {
                        let myJSON = JSON.stringify(result);
                        let obj = JSON.parse(myJSON);
                        console.log(obj.status);
                        
                        if (obj.status == "OK") {
                            console.log("okey");

                            this.ok_change_pass = true
                            this.send_change_pass = false

                        } else if (obj.status == "notfound") {

                            console.log("not founnn");                            
                            this.token_expiration_mss = true                            
                            // this.show_spinner = false;
                        } else{                            
                            console.log("fail");
                        }

                    },
                    
                    error => this.token_expiration_mss = true 
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

