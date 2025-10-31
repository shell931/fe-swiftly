import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ms-add-new-client',
  templateUrl: './AddNewUser.component.html',
  styleUrls: ['./AddNewUser.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class AddNewUserComponent implements OnInit {

	addNewUserForm    : UntypedFormGroup;
	emailPattern 		: string = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$";

	constructor( private formBuilder : UntypedFormBuilder,
					 public dialogRef    : MatDialogRef<AddNewUserComponent>) { }

	ngOnInit() {
		this.addNewUserForm = this.formBuilder.group({
			name 	     : ['',[Validators.required]],
			email 		 : ['',[Validators.required,Validators.pattern(this.emailPattern)]],
			accessType       : ['',[Validators.required]]
		})
	}

	// onFormSubmit method is submit a add new user form.
	onFormSubmit(){
		this.dialogRef.close(this.addNewUserForm.value);
	}
}
