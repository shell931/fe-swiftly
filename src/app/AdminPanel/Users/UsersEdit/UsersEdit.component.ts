import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../../../Services/api.service';
import { Invoice } from '../../../Models/Invoice';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, FormArray, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
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

export interface isActive {
    active: boolean;
    desc: string;
}

@Component({
    selector: 'app-UsersEdit',
    templateUrl: './UsersEdit.component.html',
    styleUrls: ['./UsersEdit.component.scss'],
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

export class UsersEditComponent implements OnInit {

    userForm!: UntypedFormGroup;
    emailPattern: any = /\S+@\S+\.\S+/;
    groups: Group[] = [];
    status: isActive[] = [];
    grouplist: Group[] = [];
    group$!: Observable<Group[]>;
    selectedGroup: any;
    public groupFilterCtrl: UntypedFormControl = new UntypedFormControl();

    isActive: isActive[] = [];
    isActivelist: isActive[] = [];
    isactive$!: Observable<isActive[]>;
    selectedisActive: any;
    public isActiveFilterCtrl: UntypedFormControl = new UntypedFormControl();

    id: any;
    selectedValue: any;
    selectedValueisActive: any;

    constructor(
        public service: AdminPanelServiceService,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private formGroup: UntypedFormBuilder,
        private sanitizer: DomSanitizer

    ) { }

    ngOnInit() {

        this.route.params.subscribe(res => {
            this.id = res.id;
        })

        this.userForm = this.formGroup.group({
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
            groupCtrl: ['', [Validators.required]],
            isActive: ['', [Validators.required]],
        });

        this.apiService.getUserById(this.id).subscribe((res: any) => {
            this.getDataUser(res, this.id)
        }, (error: any) => console.log(error));

    }


    getDataUser(response: { data: { group_id: any; first_name: any; last_name: any; username: any; is_active: any; }; }, id_user: any) {


        console.log(response.data.group_id);

    this.userForm.get('first_name')?.setValue(response.data.first_name)
    this.userForm.get('last_name')?.setValue(response.data.last_name)
    this.userForm.get('email')?.setValue(response.data.username)

        // START ANGULAR MAT SEARCH GROPUS     
        this.groups = [];
        this.apiService.getGroupsList().subscribe(
            (data: any) => {
                this.grouplist = data;
                for (var i in this.grouplist) {
                    let get_id = this.grouplist[i]['id'];
                    let get_name = this.grouplist[i]['name'];
                    this.groups.push({ name: get_name, id: get_id });
                }
                this.setValueGroupSelect(this.groups, response.data.group_id);
                this.group$ = this.getGroups("", this.groups);
            },
            error => console.log(error)
        );
        // END ANGULAR MAT SEARCH GROPUS

        // START ANGULAR MAT SEARCH STATUS     
        this.status = [
            {
                active: false,
                desc: "desactivo"
            },
            {
                active: true,
                desc: "activo"
            }
        ];
        this.setValueStatusSelect(this.status, response.data.is_active);
    this.isactive$ = this.getState("", this.status);
    }


    setValueGroupSelect(groups: any[], group_id: any) {
        let count: number | undefined;
        for (var i = 0; i < groups.length; i++) {
            if (groups[i].id == group_id) {
                count = i;
                break;
            }
        }
        if (typeof count !== 'undefined') {
            this.selectedValue = groups[count].id;
        }
    }


    setValueStatusSelect(status: any[], is_active: any) {
        let count: number | undefined;
        for (var i = 0; i < status.length; i++) {
            if (status[i].active == is_active) {
                count = i;
                break;
            }
        }
        if (typeof count !== 'undefined') {
            this.selectedValueisActive = status[count].active;
        }
    }


    getGroups(term: string = '', algo: Group[]): Observable<Group[]> {
        let items = algo;
        if (term) {
            items = items.filter((x: { name: string; }) => x.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }

    getState(term: string = '', algo: isActive[]): Observable<isActive[]> {
        let items = algo;
        if (term) {
            items = items.filter((x: isActive) => x.desc.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }

    // Function to change order status, new status is sent 
    // @param  {Number} num1 The first number
    // @param  {Number} num2 The second number
    // @return {Number}      The total of the two numbers
    submitEditProfileInfo() {

        if (this.userForm.valid) {                                    
            
            let myObj;
            let values = this.userForm.value;            
            myObj ={
                "group_id": values.groupCtrl,
                "first_name": values.first_name,
                "last_name": values.last_name,
                "is_active": values.isActive,
                "email":values.email
            };

            console.log(myObj);                                
            this.apiService.UpdateUser(myObj, this.id).subscribe(
                result => {
                    window.location.reload();
                },                                
            );

        } else {
            for (let i in this.userForm.controls) {
                this.userForm.controls[i].markAsTouched();
            }
        }

    }


}

