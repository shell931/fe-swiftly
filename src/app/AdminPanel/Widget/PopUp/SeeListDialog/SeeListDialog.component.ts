import { Component, OnInit } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-see-list-dialog',
	templateUrl: './SeeListDialog.component.html',
	styleUrls: ['./SeeListDialog.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		ScrollingModule,
		MatDialogModule,
		MatCardModule,
		MatButtonModule,
		RouterModule
	]
})
export class SeeListDialogComponent implements OnInit {
   // Using Angular CDK scrolling instead of PerfectScrollbar

	todayDate = new Date();
	
	constructor(public dialogRef : MatDialogRef<SeeListDialogComponent>) { }

	ngOnInit() {
	}

}

