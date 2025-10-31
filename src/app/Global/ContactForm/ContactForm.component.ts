import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, UntypedFormGroup, UntypedFormBuilder, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'embryo-ContactForm',
  templateUrl: './ContactForm.component.html',
  styleUrls: ['./ContactForm.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class ContactFormComponent implements OnInit {

   contactForm  : UntypedFormGroup;
   emailPattern : any = /\S+@\S+\.\S+/;

   constructor(private formGroup : UntypedFormBuilder) { }

   ngOnInit() {
      this.contactForm = this.formGroup.group({
         first_name : ['', { validators: [Validators.required] }],
         last_name  : ['', { validators: [Validators.required] }],
         email      : ['', { validators: [Validators.required, Validators.pattern(this.emailPattern)] }],
         subject    : ['', { validators: [Validators.required] }],
         message    : ['', { validators: [Validators.required] }]
      })
   }

   public submitForm() {
      if(this.contactForm.valid)
      {
         console.log(this.contactForm.value)
      } else {
         for (let i in this.contactForm.controls) {
            this.contactForm.controls[i].markAsTouched();
         }
      }
   }

}

