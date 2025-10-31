import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/api.service';
import { startWith, map } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';

export interface Group {
    id: string;
    name: string;
}

export interface Store {
    id_store: string;
    store: string;
}

@Component({
    selector: 'app-EditProfile',
    templateUrl: './CreateUser.component.html',
    styleUrls: ['./CreateUser.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        NgSelectModule,
        AsyncPipe
    ]
})

export class CreateUserComponent implements OnInit {


    @ViewChild('singleSelect', { static: true })
    singleSelect!: MatSelect;
    private _onDestroy = new Subject<void>();

    // START ANGULAR MAT SEARCH GROPUS    
    /** control for the selected bank */
    public groupCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
    public groupFilterCtrl: UntypedFormControl = new UntypedFormControl();
    // END ANGULAR MAT SEARCH GROPUS


    // START ANGULAR MAT SEARCH STORE    
    /** control for the selected bank */
    // END ANGULAR MAT SEARCH STORE


    public show: boolean = false;
    public show_fail_us: boolean = false;
    selectedUserType: any;
    group$!: Observable<Group[]>;

    public tip_usuario: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);

    userForm!: UntypedFormGroup;
    emailPattern: any = /\S+@\S+\.\S+/;
    toastOption: any = this.toastyService.success(
  "El usuario ha sido creado en el sistema!",
  "Usuario creado",
  { timeOut: 4000, closeButton: true, progressBar: true }
);
    formBuilder: any;
    selectedGroup: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formGroup: UntypedFormBuilder,
        private toastyService: ToastrService,
        private apiService: ApiService,
        private _formBuilder: UntypedFormBuilder) { }


    grouplist: Group[] = [];
    groups: Group[] = [];

    storelist: Store[] = [];
    store: Store[] = [];

    ngOnInit() {

        // START ANGULAR MAT SEARCH GROPUS     
        this.groups = [];
        this.apiService.getGroupsList().subscribe(
            (data: Group[]) => {
                this.grouplist = data;
                for (var i in this.grouplist) {
                    let get_id = this.grouplist[i]['id'];
                    let get_name = this.grouplist[i]['name'];
                    this.groups.push({ name: get_name, id: get_id });
                }
                this.group$ = this.getGroups("", this.groups);
            },
            error => console.log(error)
        );
        // END ANGULAR MAT SEARCH GROPUS


        this.userForm = this.formGroup.group({
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
            password: ['', [Validators.required]],
            groupCtrl: ['', [Validators.required]],
            
        });

    }


    getGroups(term: string = '', algo): Observable<Group[]> {
        let items = algo;
        if (term) {
            items = items.filter(x => x.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }


    /**
     * Function is used to submit the profile info.
     * If form value is valid, redirect to profile page.
     */
    submitProfileInfo() {
        // if (this.show == false) {


        if (this.userForm.valid) {
            let myObj;
            let values = this.userForm.value;
            let value_type = this.tip_usuario.value;
            myObj = { "username": values.email, "password": "safsfd", "first_name": values.first_name, "last_name": values.last_name, "email": values.email, "is_active": "true", "group_id": this.selectedGroup, "store": '', "type_user": 1 };
            this.apiService.registerUser(myObj).subscribe(
                result => {
                    //this.loginUser();
                    this.router.navigate(['/admin-panel/users']).then(() => {
                        this.toastyService.success(this.toastOption);
                    });
                },
                error => this.show_fail_us = !this.show_fail_us
            );
          
        } else {
            for (let i in this.userForm.controls) {
                this.userForm.controls[i].markAsTouched();
            }
        }


        // } else {
        //     if (this.groupCtrl.valid) {
        //         if (this.userForm.valid) {
        //             if (this.storeCtrl.valid) {
        //                 if (this.tip_usuario.valid) {

        //                     let myObj;
        //                     let values = this.userForm.value;
        //                     let value_groups = this.groupCtrl.value;
        //                     let value_store = this.storeCtrl.value;
        //                     let value_type = this.tip_usuario.value;
        //                     myObj = { "username": values.username, "password": "safsfd", "first_name": values.first_name, "last_name": values.last_name, "email": values.email, "is_active": "true", "group_id": value_groups.id, "store": value_store.id_store, "type_user": value_type };
        //                     this.apiService.registerUser(myObj).subscribe(
        //                         result => {
        //                             //this.loginUser();
        //                         },
        //                         error => console.log(error)
        //                     );
        //                     this.router.navigate(['/admin-panel/users']).then(() => {
        //                         this.toastyService.success(this.toastOption);
        //                     });

        //                 } else {
        //                     for (let i in this.userForm.controls) {
        //                         this.userForm.controls[i].markAsTouched();
        //                     }
        //                 }
        //             } else {
        //                 for (let i in this.userForm.controls) {
        //                     this.userForm.controls[i].markAsTouched();
        //                 }
        //             }

        //         } else {
        //             for (let i in this.userForm.controls) {
        //                 this.userForm.controls[i].markAsTouched();
        //             }
        //         }
        //     } else {
        //         for (let i in this.userForm.controls) {
        //             this.userForm.controls[i].markAsTouched();
        //         }
        //     }
        // }

    }

    tipoUsuario(tip) {
        let val_tip = tip.value;
        if (val_tip == 2) {
            this.show = !this.show;
        } else {
            this.show = false;
        }

    }

}



