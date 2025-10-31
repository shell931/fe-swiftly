import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import {TimerObservable} from "rxjs/observable/TimerObservable";
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { BuySellChartComponent } from '../../Widget/Charts/BuySellChart/BuySellChart.component';

@Component({
	selector: 'app-reports',
	templateUrl: './Reports.component.html',
	styleUrls: ['./Reports.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		MatCardModule,
		MatTabsModule,
		MatTableModule,
		MatChipsModule,
		MatMenuModule,
		MatIconModule,
		MatButtonModule,
		TranslateModule,
		BuySellChartComponent,
		DatePipe,
		CurrencyPipe
	]
})

export class ReportsComponent implements OnInit {
  
   tableTabData        : any;
   buySellChartContent : any;
   chartData           : any;

   displayedTransactionColumns : string [] = ['transid','date','account', 'type', 'amount','debit', 'balance'];

   displayedTransferColumns : string [] = ['transid','date','account', 'type', 'amount', 'balance','status'];

   displayedExpenseColumns : string [] = ['itmNo','date', 'type','companyName','amount','status'];
	
   constructor(private service : AdminPanelServiceService) {
   }

   ngOnInit() {
      this.service.getTableTabContent().valueChanges().subscribe(res => this.tableTabData = res);
      this.service.getBuySellChartContent().valueChanges().
            subscribe( res => (this.getChartData(res))
                     );

   }

   //getChartData method is used to get the chart data.
   getChartData(data){
      this.buySellChartContent= data;
      this.chartDataChange('week');
   }

   //chartDataChange method is used to change the chart data according to button event.
   chartDataChange(tag){
      if(this.buySellChartContent && this.buySellChartContent.length>0)
      for(var content of this.buySellChartContent){
         if(content.tag == tag){
            this.chartData = content;
         }
      }
   }
}

