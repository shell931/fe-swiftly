import {Component, OnInit} from '@angular/core';
import {Calculator} from '../../../Models/Calculator';
import {CalculatorCardItem, CardCalculatorComponent} from '../CardCalculator/CardCalculator.component';
import {CalculatorService} from '../../../Services/calculator.service';
import {UntypedFormControl, UntypedFormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-calculator',
  templateUrl: './Calculator.component.html',
  styleUrls: ['./Calculator.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CardCalculatorComponent,
    CurrencyPipe
  ]
})
export class CalculatorComponent implements OnInit {

  public calculateData: Calculator;
  public itemsKompralo: Array<CalculatorCardItem> = [];
  public itemsWithHoldings: Array<CalculatorCardItem> = [];
  public footerCommissions: CalculatorCardItem;
  public footerWithHoldings: CalculatorCardItem;
  public form: UntypedFormGroup;
  public calculatorTypeId: number;
  public hasCalculated: boolean = false;

  constructor(
    private calculatorService: CalculatorService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(async data => {
      this.calculatorTypeId = data.calculatorTypeId;
      await this.initValues();
    });
  }

  private async initValues(): Promise<any> {
    this.form = new UntypedFormGroup({
      amount: new UntypedFormControl(0, Validators.required),
      vatPercentage: new UntypedFormControl(0)
    });

    // Initialize calculateData but don't show summary until calculation is performed
    this.calculateData = new Calculator();
    this.hasCalculated = false;

    this.footerCommissions = {text: 'Total comisión Swiftly', value: 0};
    this.footerWithHoldings = {text: 'Total Retenciones', value: 0};

    this.itemsKompralo = [
      {text: 'Comisión plataforma de pago', value: 0},
      {text: 'IVA comisión', value: 0},
      {text: 'Comisión Marketplace', value: 0},
      {text: 'IVA Comisión', value: 0},
    ];

    this.itemsWithHoldings = [
      {text: 'Retención de renta', value: 0},
      {text: 'Retención ICA', value: 0},
      {text: 'Retención IVA', value: 0},
    ];
  }

  public async calculate(): Promise<any> {
    this.calculateData = await this.calculatorService.calculate(this.form.value.amount, this.form.value.vatPercentage, this.calculatorTypeId);
    this.footerCommissions = {text: 'Total comisión Swiftly', value: this.calculateData.totalCommission};
    this.footerWithHoldings = {text: 'Total Retenciones', value: this.calculateData.totalWithholding};

    this.itemsKompralo = [
      {text: 'Comisión plataforma de pago ' + this.calculateData.perPaymentPlatformCommission, value: this.calculateData.paymentPlatformCommission},
      {text: 'IVA comisión', value: this.calculateData.vatCommission},
      {text: 'Comisión Marketplace ' + this.calculateData.perMarketPlaceCommission, value: this.calculateData.marketPlaceCommission},
      {text: 'IVA Comisión', value: this.calculateData.vatMarketPlaceCommission},
    ];

    this.itemsWithHoldings = [
      {text: 'Retención de renta', value: this.calculateData.rentWithholding},
      {text: 'Retención ICA', value: this.calculateData.icaWithholding},
      {text: 'Retención IVA', value: this.calculateData.vatWithholding},
    ];

    this.hasCalculated = true;
  }

}

