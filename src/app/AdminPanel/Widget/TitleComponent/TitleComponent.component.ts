import { Component, OnInit, Input } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'anglo-title-component',
	templateUrl: './TitleComponent.component.html',
	styleUrls: ['./TitleComponent.component.scss'],
	standalone: true,
	imports: [CommonModule, MatCardModule, TranslateModule]
})
export class TitleComponent implements OnInit {

	@Input() title :any;

	constructor(public translate : TranslateService) { }

	ngOnInit() {
	}

}

