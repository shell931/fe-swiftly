import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'embryo-LanguageDropDown',
  templateUrl: './LanguageDropDown.component.html',
  styleUrls: ['./LanguageDropDown.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule
  ]
})
export class LanguageDropDownComponent implements OnInit {

   @Input() selectedValue : any;
   @Output() selectedLanguage : EventEmitter<any> = new EventEmitter();

   currentLang = 'en';

   langArray = [
      {
         name:"English",
         value:"en"
      }, {
         name: "French",
         value:"fr"
      }
   ]

   constructor(public translate: TranslateService) { }

   ngOnInit() {
   }

   selectionChange(data) {
      if(data && data.value){
         this.selectedLanguage.emit(data.value);
         this.translate.use(data.value)
      }
   }
}

