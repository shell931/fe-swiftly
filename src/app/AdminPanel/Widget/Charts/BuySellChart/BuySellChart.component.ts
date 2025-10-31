import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-buy-sell-chart',
	templateUrl: './BuySellChart.component.html',
	styleUrls: ['./BuySellChart.component.scss'],
	standalone: true,
	imports: [CommonModule, BaseChartDirective]
})
export class BuySellChartComponent implements OnInit {

	@ViewChild(BaseChartDirective)
	public chart: BaseChartDirective;

	@Input() color :any;
   @Input() label :any;
   @Input() data  :any;
   showChart : boolean = false;
   //line chart options
	public lineChartOptions :any = {
      responsive: true,
      maintainAspectRatio: false,
		scales: {
         yAxes: [{
            gridLines: {
              display: true,
              drawBorder: false
            }
          }],
         xAxes: [{
            gridLines: {
              display: false,
              drawBorder: false
            }
         }]
      },
		tooltip: {
			enabled: true
		},
		legend: {
			display: false
		},
	}

	constructor() { }

	ngOnInit() {	
      setTimeout(()=>{
         this.showChart = true;
      },0)
	}
}

