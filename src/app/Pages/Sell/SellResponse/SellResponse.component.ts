// libraries
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Angular Material imports for standalone component
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-SellResponse',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule
    ],
    templateUrl: './SellResponse.component.html',
    styleUrls: ['./SellResponse.component.scss']
})

export class SellResponseComponent implements OnInit {



    constructor(private route: ActivatedRoute,
    ) { }

    ngOnInit() {        
    }

}

