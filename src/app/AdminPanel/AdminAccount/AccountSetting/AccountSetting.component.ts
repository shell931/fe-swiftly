import { Component, OnInit } from '@angular/core';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-account-setting',
  templateUrl: './AccountSetting.component.html',
  styleUrls: ['./AccountSetting.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class AccountSettingComponent implements OnInit {
	
	popUpDeleteUserResponse : any;
	
	selected = "1 month";

	reasons : any [] = [ 
		"This is temporary. I'll be back.",
		"My account was hacked.",
		"I have a privacy concern.",
		"Other"
	]

	howLongDeactivate : any [] = [
		"1 week",
		"1 month",
		"6 months",
		"1 year"
	]

	constructor(public service : AdminPanelServiceService) { }

	ngOnInit() {
		console.log("ESTPY EN NG___________1");
	}

	/** 
     *onDelete method is used to open a delete dialog.
     */
   onDelete(){
      this.service.deleteDialog("Are you sure you want to delete this account permanently?").
         subscribe( res => {this.popUpDeleteUserResponse = res},
                    err => console.log(err),
                    ()  => this.popUpDeleteUserResponse)
   }
}

