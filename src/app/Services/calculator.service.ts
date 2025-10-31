import {Injectable} from '@angular/core';
import {Calculator} from '../Models/Calculator';
import {HttpClient} from '@angular/common/http';
import {DecimalPipe} from '@angular/common';
import {formatNumber} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  public calculator: Calculator = new Calculator();

  public calcParams: any;

  constructor(
    private httpService: HttpClient
  ) {
  }

  public getCalculatorParameters(): Promise<any> {
    return this.httpService.get('assets/calculator/parameters.json').toPromise();
  }

  public async calculate(purchaseValue: number, vatPercentage: number, calculatorTypeId: number = 1): Promise<Calculator> {
    try {
      const response = await this.getCalculatorParameters();
      this.calcParams = response.find((data: any) => data.id === calculatorTypeId);
      this.calculator = new Calculator();

      this.calculator.title = this.calcParams?.data?.TITLE;
      this.calculator.purchaseValue = purchaseValue;
      this.calculator.taxableBase = purchaseValue;
      this.calculator.vat = this.calculator.taxableBase * (vatPercentage / 100);
      this.calculator.perPaymentPlatformCommission = formatNumber(this.calcParams?.data?.PER_PAYMENT_PLATFORM_COMMISSION * 100, 'en-US', '1.0-3') + '%';
      this.calculator.paymentPlatformCommission = this.calculator.purchaseValue * this.calcParams?.data?.PER_PAYMENT_PLATFORM_COMMISSION;
      this.calculator.vatCommission = this.calculator.paymentPlatformCommission * (vatPercentage / 100);
      this.calculator.perMarketPlaceCommission = formatNumber(this.calcParams?.data?.PER_MARKET_PLACE_COMMISSION * 100, 'en-US', '1.0-3') + '%';
      this.calculator.marketPlaceCommission = this.calculator.purchaseValue * this.calcParams?.data?.PER_MARKET_PLACE_COMMISSION;
      this.calculator.vatMarketPlaceCommission = this.calculator.marketPlaceCommission * (vatPercentage / 100);
      this.calculator.rentWithholding = this.calculator.taxableBase * this.calcParams?.data?.PER_RENT_WITHHOLDING;
      this.calculator.icaWithholding = this.calculator.taxableBase * this.calcParams?.data?.PER_ICA_WITHHOLDING;
      this.calculator.vatWithholding = this.calculator.vat * this.calcParams?.data?.PER_VAT_WITHHOLDING;

      this.calculator.totalCommission = (
        this.calculator.paymentPlatformCommission +
        this.calculator.vatCommission +
        this.calculator.marketPlaceCommission +
        this.calculator.vatMarketPlaceCommission
      );

      this.calculator.totalWithholding = (
        this.calculator.rentWithholding +
        this.calculator.icaWithholding +
        this.calculator.vatWithholding
      );

      this.calculator.totalWithholdingCommissions = this.calculator.totalCommission + this.calculator.totalWithholding;
      this.calculator.totalTransfer = this.calculator.purchaseValue - this.calculator.totalWithholdingCommissions;
      return this.calculator;
    } catch (e) {
      console.log('Error in calculate');
      return this.calculator;
    }
  }
}

