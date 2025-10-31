import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, FormArray, Validators } from '@angular/forms';
import { EmbryoService } from '../../../Services/Embryo.service';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../Services/api.service';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Observable, Subscription } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoadScriptsService } from "../../../load-scripts.service";
import { environment } from '../../../../environments/environment';
import { PopupManagerService } from '../../../Services/popup-manager.service';

// Angular imports for standalone component
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

export interface Location {
   id: number;
   nameci: string;
   departament: string;
   number: string;
   neighborhood: string;
   via: string;
   sn: string;
   additional_data: string;
   phone: string;
   contact: string;
   predetermined: boolean;
}

export interface Month {
   id: number;
   month: string;
}

export interface Year {
   id: number;
   year: string;
}

export interface Product {
   name: string;
   image: string;
   price: number;
   produc_code: string;
   quantity: number;
   price_cant: number;
   stock: number;
}

@Component({
   selector: 'app-Payment',
   standalone: true,
   imports: [
      CommonModule,
      CurrencyPipe,
      FormsModule,
      ReactiveFormsModule,
      RouterModule,
      MatCardModule,
      MatListModule,
      MatDividerModule
   ],
   templateUrl: './Payment.component.html',
   styleUrls: ['./Payment.component.scss']
})
export class PaymentComponent implements OnInit, AfterViewInit {

   public show: boolean = false;
   locationsGrid: Location[] = [];
   alllocationsGrid: any;
   get_location: Location[] = [];
   get_locations: Location[] = [];
   cart_data_arr: Product[] = [];
   step = 0;
   id_com!: string | null;
   isDisabledPaymentStepTwo = true;
   isDisabledPaymentStepThree = false;
   emailPattern: any = /\S+@\S+\.\S+/;
   months$!: Observable<Month[]>;
   years$!: Observable<Year[]>;
   selectedMonth: any;
   selectedYear: any;

   key: any;
   api_key: any;
   txnid: any;
   amount: any;
   productinfo: any;
   email: any;
   quota: any;
   brand: any;
   expiryMonth: any;
   expiryYear: any;
   firstname: any;
   typeIdentification: any;
   billingNumberIdentifier: any;
   billingAddress: any;
   billingNames: any;
   billingLastNames: any;
   billingEmail: any;
   callerPhoneNumber: any;
   id_city: any;
   city: any;
   public validate_ubication: boolean = false;


   offerCards: any = [
      {
         id: 1,
         name: "Debit Card",
         content: "Visa Mega Shopping Offer"
      },
      {
         id: 2,
         name: "Credit Card",
         content: "American Express 20% Flat"
      },
      {
         id: 3,
         name: "Debit Card",
         content: "BOA Buy 1 Get One Offer"
      },
      {
         id: 4,
         name: "Master Card",
         content: "Mastercard Elite Card"
      },
      {
         id: 5,
         name: "Debit Card",
         content: "Visa Mega Shopping Offer"
      }
   ]

   bankCardsImages: any = [
      {
         id: 1,
         image: "assets/images/client-logo-1.png"
      },
      {
         id: 2,
         image: "assets/images/client-logo-2.png"
      },
      {
         id: 3,
         image: "assets/images/client-logo-3.png"
      },
      {
         id: 4,
         image: "assets/images/client-logo-4.png"
      },
      {
         id: 5,
         image: "assets/images/client-logo-5.png"
      }
   ]

   months: Month[] = [
      {
         id: 1,
         month: '01'
      },
      {
         id: 2,
         month: '02'
      },
      {
         id: 3,
         month: '03'
      },
      {
         id: 4,
         month: '04'
      },
      {
         id: 5,
         month: '05'
      },
      {
         id: 6,
         month: '06'
      },
      {
         id: 7,
         month: '07'
      },
      {
         id: 8,
         month: '08'
      },
      {
         id: 9,
         month: '09'
      },
      {
         id: 10,
         month: '10'
      },
      {
         id: 11,
         month: '11'
      },
      {
         id: 12,
         month: '12'
      }
   ]


   years: Year[] = [
      {
         id: 1,
         year: '20'
      },
      {
         id: 2,
         year: '21'
      },
      {
         id: 3,
         year: '22'
      },
      {
         id: 4,
         year: '23'
      },
      {
         id: 5,
         year: '24'
      },
      {
         id: 6,
         year: '25'
      },
      {
         id: 7,
         year: '26'
      },
      {
         id: 8,
         year: '27'
      },
      {
         id: 9,
         year: '28'
      },
      {
         id: 10,
         year: '29'
      },
   ]

   private _onDestroy = new Subject<void>();


   public monthFilterCtrl: UntypedFormControl = new UntypedFormControl();
   public monthCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);

   public yearFilterCtrl: UntypedFormControl = new UntypedFormControl();
   public yearCtrl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);

   paymentFormOne!: UntypedFormGroup;

   constructor(public embryoService: EmbryoService,
      private formGroup: UntypedFormBuilder,
      public router: Router,
      private apiService: ApiService,
      private _LoadScript: LoadScriptsService,
      private popupManager: PopupManagerService) {

      this.embryoService.removeBuyProducts();
      _LoadScript.Carga(["card/card"]);
   }

   ngOnInit() {

      const token_front = localStorage.getItem('mr-token-front');
      const id_user_front = localStorage.getItem('id_user_front');
      localStorage.removeItem("TokenPaymentGateway");
      this.id_com = id_user_front;
      if (token_front) {

         this.paymentFormOne = this.formGroup.group({
            user_details: this.formGroup.group({
               first_name: ['', [Validators.required]],
               last_name: ['', [Validators.required]],
               street_name_number: ['', [Validators.required]],
               apt: ['', [Validators.required]],
               zip_code: ['', [Validators.required]],
               city: ['', [Validators.required]],
               country: ['', [Validators.required]],
               mobile: ['', [Validators.required]],
               email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
               share_email: ['', [Validators.pattern(this.emailPattern)]],
            }),
            offers: this.formGroup.group({
               discount_code: [''],
               card_type: [1],
               card_type_offer_name: [null]
            }),
            payment: this.formGroup.group({
               card_number: ['', [Validators.required]],
               user_card_name: ['', [Validators.required]],
               cvv: ['', [Validators.required]],
               expiry_date: ['',],
               quota: ['', [Validators.required]],
               card_id: [1],
               bank_card_value: [null],
               // monthControl: new FormControl('', [Validators.required]),
               yearControl: new UntypedFormControl('', [Validators.required]),
               monthCtrl: new UntypedFormControl('', [Validators.required]),
            })
         });

         this.apiService.PredeterminateLocationsByIdUser(id_user_front).subscribe((res: any) => this.getDataLocations(res));

         // START ANGULAR MAT SEARCH MONTH

         this.months$ = this.getMonths("", this.months);
         this.years$ = this.getYears("", this.years);


      } else {
         this.router.navigate(['/checkout']);

      }


   }

   ngOnDestroy() {
      this._onDestroy.next();
      this._onDestroy.complete();
   }

   getDataLocations(response: any) {
      for (var i = 0; i < response.length; i++) {
         let id = response[i].id;
         let nameci = response[i].nameci;
         let departament = response[i].departament;
         let number = response[i].number;
         let neighborhood = response[i].neighborhood;
         let via = response[i].via;
         let sn = response[i].sn;
         let additional_data = response[i].additional_data;
         let phone = response[i].phone;
         let contact = response[i].contact;
         let predetermined = response[i].predetermined;
         this.get_location.push({
            id: id,
            nameci: nameci,
            departament: departament,
            number: number,
            neighborhood: neighborhood,
            via: via,
            sn: sn,
            additional_data: additional_data,
            phone: phone,
            contact: contact,
            predetermined: predetermined
         });

         let LocationDetail = { "id": id, "nameci": nameci, "departament": departament, "number": number, "neighborhood": neighborhood, "via": via, "sn": sn, "additional_data": additional_data, "phone": phone, "contact": contact, "predetermined": predetermined };
         localStorage.setItem("LocationDetail", JSON.stringify(LocationDetail));
      }
      this.locationsGrid = this.get_location;
   }

   ngAfterViewInit() {
   }

   public setStep(index: number) {
      this.step = index;
      switch (index) {
         case 0:
            this.isDisabledPaymentStepTwo = true;
            this.isDisabledPaymentStepThree = true;
            break;
         case 1:
            this.isDisabledPaymentStepThree = false;
            break;
         default:

            break;
      }
   }

   public toggleRightSidenav() {
      // Abrir el popup del carrito usando el PopupManagerService
      this.popupManager.tryOpenPopup('cart');
   }

   public getCartProducts() {
      let total = 0;
      if (this.embryoService.localStorageCartProducts && this.embryoService.localStorageCartProducts.length > 0) {
         for (let product of this.embryoService.localStorageCartProducts) {
            if (!product.quantity) {
               product.quantity = 1;
            }
            total += (product.price * product.quantity);
         }
         // total += (this.embryoService.shipping + this.embryoService.tax);
         return total;
      }
      return total;
   }

   public submitPayment() {
      let userDetailsGroup = <UntypedFormGroup>(this.paymentFormOne.controls['user_details']);
      if (userDetailsGroup.valid) {
         switch (this.step) {
            case 0:
               this.step = 1;
               this.isDisabledPaymentStepTwo = false;
               break;
            case 1:
               this.step = 2;
               break;

            default:
               // code...
               break;
         }
      } else {
         this.isDisabledPaymentStepTwo = true;
         this.isDisabledPaymentStepThree = true;
         for (let i in userDetailsGroup.controls) {
            userDetailsGroup.controls[i].markAsTouched();
         }
      }
   }

   public selectedPaymentTabChange(value: any) {
      let paymentGroup = <UntypedFormGroup>(this.paymentFormOne.controls['payment']);

      paymentGroup.markAsUntouched();

      if (value && value.index == 1) {
         paymentGroup.controls['card_number'].clearValidators();
         paymentGroup.controls['user_card_name'].clearValidators();
         paymentGroup.controls['cvv'].clearValidators();
         paymentGroup.controls['expiry_date'].clearValidators();

         paymentGroup.controls['bank_card_value'].setValidators([Validators.required]);
      } else {

         paymentGroup.controls['card_number'].setValidators([Validators.required]);
         paymentGroup.controls['user_card_name'].setValidators([Validators.required]);
         paymentGroup.controls['cvv'].setValidators([Validators.required]);
         paymentGroup.controls['expiry_date'].setValidators([Validators.required]);

         paymentGroup.controls['bank_card_value'].clearValidators();
      }

      paymentGroup.controls['card_number'].updateValueAndValidity();
      paymentGroup.controls['user_card_name'].updateValueAndValidity();
      paymentGroup.controls['cvv'].updateValueAndValidity();
      paymentGroup.controls['expiry_date'].updateValueAndValidity();
      paymentGroup.controls['bank_card_value'].updateValueAndValidity();
   }


   getMonths(term: string = '', algo: Month[] = []): Observable<Month[]> {
      let items: Month[] = algo;
      if (term) {
         items = items.filter((x: Month) => x.month.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
      }
      return of(items).pipe(delay(500));
   }

   getYears(term: string = '', algo: Year[] = []): Observable<Year[]> {
      let items: Year[] = algo;
      if (term) {
         items = items.filter((x: Year) => x.year.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
      }
      return of(items).pipe(delay(500));
   }


   public finalStep() {
      this.validate_ubication = false;

      this.show = true;
      let paymentData = this.paymentFormOne.value;

      let card_number = paymentData.payment.card_number.trim();
      card_number = card_number.replace(/ /g, "");
      let get_brand = this.GetCardType(card_number);
      let cvv = paymentData.payment.cvv;
      const id_user_front = localStorage.getItem('id_user_front');

         this.apiService.PredeterminateLocationsByIdUser(id_user_front).subscribe(
      (response: any) => {
            if (response.length == 0) {
               this.validate_ubication = true;
               this.show = false;
            } else {

               let products = localStorage.getItem("cart_item")
               for (var i = 0; i < response.length; i++) {
                  this.txnid = Date.now();
                  this.amount = this.getCartProducts();
                  this.productinfo = Date.now();
                  this.email = response[i].email;
                  this.quota = paymentData.payment.quota;
                  this.brand = get_brand;
                  this.expiryMonth = this.selectedMonth;
                  this.expiryYear = this.selectedYear;
                  this.firstname = response[i].first_name + ' ' + response[i].last_name;
                  this.typeIdentification = 1;
                  this.billingNumberIdentifier = response[i].number_identifier;
                  this.billingAddress = response[i].via + ' #' + response[i].number + ' - ' + response[i].sn + ' ' + response[i].neighborhood;
                  this.billingNames = response[i].first_name;
                  this.billingLastNames = response[i].last_name;
                  this.billingEmail = response[i].email;
                  this.callerPhoneNumber = response[i].phone;
                  this.id_city = response[i].id_city;
                  this.city = response[i].nameci;
               }
               let JsonDataTransaction = {
                  "webProductsReference": this.txnid,
                  "txnid": this.txnid,
                  "typeIdentification": this.typeIdentification,
                  "identificationNumber": this.billingNumberIdentifier,
                  "total": this.amount,
                  "typeTax": 1,
                  "tax": 0,
                  "address": this.billingAddress,
                  "department": 1,
                  "id_city": this.id_city,
                  "city": this.city,
                  "email": this.email,
                  "phone": this.callerPhoneNumber,
                  "celphone": this.callerPhoneNumber,
                  "franquicia": this.brand,
                  "productinfo": this.productinfo,
                  "firstname": this.firstname,
                  "billingNames": this.billingNames,
                  "billingLastNames": this.billingLastNames,
                  "billingEmail": this.billingEmail,
                  "id_user_front": id_user_front,
                  "products": products

               };
               console.log(JsonDataTransaction);

               this.apiService.SendTransactionDataToBackend(JsonDataTransaction).subscribe(
                  dataTransaction => {
                     let myJSONTrx = JSON.stringify(dataTransaction);
                     let objTrx = JSON.parse(myJSONTrx);
                     let TxrResult = objTrx.result;

                     if (TxrResult == 200) {
                        // Discount Stock
                        const cartStored = localStorage.getItem('cart_item') || '[]';
                        const cart_data = JSON.parse(cartStored);
                        this.cart_data_arr = [];
                        for (var i = 0; i < cart_data.length; i++) {
                           let newstock = cart_data[i].stock - cart_data[i].quantity;
                           console.log("stock " + newstock);
                           let myObj_stock = {
                              "newstock": newstock
                           };
                           this.apiService.updateStock(myObj_stock, cart_data[i].id_product).subscribe();
                        }

                        this.embryoService.addBuyUserDetails(this.paymentFormOne.value, objTrx.num_aprob, objTrx.date, objTrx.reference);

                        const form = document.createElement('form');
                        form.method = 'POST';
                        form.action = environment.api.baseAuthGateway + 'checkoutpay';
                        const fields = {
                           key: environment.api.key,
                           txnid: this.txnid,
                           amount: this.amount,
                           productinfo: environment.api.productinfo,
                           firstname: this.firstname,
                           email: this.email,
                           hash: environment.api.hash,
                           url_response: environment.api.url_response,
                           url_webhook: environment.api.url_webhook
                        };
                        type FieldsType = typeof fields;
                        for (const name of Object.keys(fields) as Array<keyof FieldsType>) {
                           const input = document.createElement('input');
                           input.type = 'hidden';
                           input.name = String(name);
                           input.value = String(fields[name]);
                           form.appendChild(input);
                        }
                        document.body.appendChild(form);
                        form.submit();


                        // this.apiService.sendEmailCustomerRequest(JsonDataTransaction).subscribe();
                        // this.apiService.sendSellerStoreEmail(JsonDataTransaction).subscribe();

                        // this.router.navigate(['/checkout/final-receipt']);

                     } else if (TxrResult == 400) {
                        // this.apiService.sendEmailRejectionTransactionCustomer(JsonDataTransaction).subscribe();
                        // this.ErrorTransactionPaymentGateway(objTrx.message_reply)
                     } else if (TxrResult == 500) {
                        // this.FailTransactionPaymentGateway()
                     }

            },
         (error: any) => this.FailTransactionPaymentGateway()
               );
            }
      },
      (error: any) => console.log(error)
      );


   }



   // public finalStep() {
   //     this.validate_ubication = false;
   //     let paymentGroup = <FormGroup>(this.paymentFormOne.controls['payment']);
   //     if (paymentGroup.valid) {

   //         this.show = true;
   //         let paymentData = this.paymentFormOne.value;

   //         let card_number = paymentData.payment.card_number.trim();
   //         card_number = card_number.replace(/ /g, "");
   //         let get_brand = this.GetCardType(card_number);

   //         const id_user_front = localStorage.getItem('id_user_front');

   //         this.apiService.getAutenticationGateway().subscribe(
   //             response => {
   //                 let myJSON = JSON.stringify(response);
   //                 let obj = JSON.parse(myJSON);
   //                 let api_key_gateway = obj.api_key;
   //                 let account_id_gateway = obj.account_id;

   //                 this.apiService.PredeterminateLocationsByIdUser(id_user_front).subscribe(
   //                     response => {
   //                         if (response.length == 0) {
   //                             this.validate_ubication = true;
   //                             this.show = false;
   //                         } else {
   //                             let products = localStorage.getItem("cart_item")
   //                             for (var i = 0; i < response.length; i++) {
   //                                 this.key = account_id_gateway;
   //                                 this.api_key = api_key_gateway;
   //                                 this.txnid = Date.now();
   //                                 this.amount = this.getCartProducts();
   //                                 this.productinfo = Date.now();
   //                                 this.email = response[i].email;
   //                                 this.quota = paymentData.payment.quota;
   //                                 this.brand = get_brand;
   //                                 this.expiryMonth = this.selectedMonth;
   //                                 this.expiryYear = this.selectedYear;
   //                                 this.firstname = response[i].first_name + ' ' + response[i].last_name;
   //                                 this.typeIdentification = 1;
   //                                 this.billingNumberIdentifier = "1022381182";
   //                                 this.billingAddress = response[i].via + ' #' + response[i].number + ' - ' + response[i].sn + ' ' + response[i].neighborhood;
   //                                 this.billingNames = response[i].first_name;
   //                                 this.billingLastNames = response[i].last_name;
   //                                 this.billingEmail = response[i].email;
   //                                 this.callerPhoneNumber = response[i].phone;
   //                                 this.id_city = response[i].id_city;
   //                                 this.city = response[i].nameci;
   //                             }

   //                             this.apiService.AuthPaymentGateway(account_id_gateway, api_key_gateway).subscribe(
   //                                 data => {
   //                                     var myJSON = JSON.stringify(data);
   //                                     var obj = JSON.parse(myJSON);
   //                                     localStorage.setItem("TokenPaymentGateway", obj.data.access_token);

   //                                     let cvv = paymentData.payment.cvv;
   //                                     let JsonHashCard = {
   //                                         "number": card_number,
   //                                         "code": cvv
   //                                     };

   //                                     this.apiService.HashCardPaymentGateway(JsonHashCard).subscribe(
   //                                         dataHashCard => {
   //                                             let myJSONHashCard = JSON.stringify(dataHashCard);
   //                                             let obj = JSON.parse(myJSONHashCard);
   //                                             let CardHashed = obj.data;
   //                                             const tokenPaymentGateway = localStorage.getItem('TokenPaymentGateway');

   //                                             let JsonDataTransaction = {
   //                                                 "tokenPaymentGateway": tokenPaymentGateway,
   //                                                 "key": this.key,
   //                                                 "txnid": this.txnid,
   //                                                 "amount": this.amount,
   //                                                 "productinfo": this.productinfo,
   //                                                 "firstname": this.firstname,
   //                                                 "email": this.email,
   //                                                 "api_key": this.api_key,
   //                                                 "quota": this.quota,
   //                                                 "brand": this.brand,
   //                                                 "expiryMonth": this.expiryMonth,
   //                                                 "expiryYear": this.expiryYear,
   //                                                 "card": CardHashed,
   //                                                 "typeIdentification": this.typeIdentification,
   //                                                 "billingNumberIdentifier": this.billingNumberIdentifier,
   //                                                 "billingAddress": this.billingAddress,
   //                                                 "billingNames": this.billingNames,
   //                                                 "billingLastNames": this.billingLastNames,
   //                                                 "billingEmail": this.billingEmail,
   //                                                 "callerPhoneNumber": this.callerPhoneNumber,
   //                                                 "id_city": this.id_city,
   //                                                 "city": this.city,
   //                                                 "id_user_front": id_user_front,
   //                                                 "products": products
   //                                             };


   //                                             this.apiService.SendTransactionDataToBackend(JsonDataTransaction).subscribe(
   //                                                 dataTransaction => {
   //                                                     let myJSONTrx = JSON.stringify(dataTransaction);
   //                                                     let objTrx = JSON.parse(myJSONTrx);

   //                                                     let TxrResult = objTrx.result;
   //                                                     if (TxrResult == 200) {
   //                                                         // Discount Stock
   //                                                         const cart_data = JSON.parse(localStorage.getItem('cart_item'));
   //                                                         this.cart_data_arr = [];
   //                                                         for (var i = 0; i < cart_data.length; i++) {
   //                                                             let newstock = cart_data[i].stock - cart_data[i].quantity;
   //                                                             console.log(newstock);
   //                                                             let myObj_stock = {
   //                                                                 "newstock": newstock
   //                                                             };
   //                                                             this.apiService.updateStock(myObj_stock, cart_data[i].id_product).subscribe();
   //                                                         }

   //                                                         this.embryoService.addBuyUserDetails(this.paymentFormOne.value, objTrx.num_aprob, objTrx.date, objTrx.reference);
   //                                                         const id_user_front = localStorage.getItem('id_user_front');

   //                                                         this.router.navigate(['/checkout/final-receipt']);
   //                                                     } else if (TxrResult == 400) {
   //                                                         console.log("transaccion rechazada");
   //                                                         this.ErrorTransactionPaymentGateway(objTrx.message_reply)
   //                                                     } else if (TxrResult == 500) {
   //                                                         this.FailTransactionPaymentGateway()
   //                                                     }

   //                                                 },
   //                                                 // error => console.log(error)
   //                                                 error => this.FailTransactionPaymentGateway()
   //                                             );

   //                                         },
   //                                         error => console.log(error)
   //                                     );


   //                                 },
   //                                 error => console.log(error)
   //                             );

   //                         }

   //                     },
   //                     error => console.log(error)
   //                 );
   //             },
   //             error => console.log(error)
   //         );
   //     } else {
   //         console.log("fsfsd");

   //         for (let i in paymentGroup.controls) {
   //             paymentGroup.controls[i].markAsTouched();
   //         }
   //     }
   // }



   // public finalStep() {
   //     this.validate_ubication = false;
   //     let paymentGroup = <FormGroup>(this.paymentFormOne.controls['payment']);
   //     if (paymentGroup.valid) {

   //         this.show = true;
   //         let paymentData = this.paymentFormOne.value;

   //         let card_number = paymentData.payment.card_number.trim();
   //         card_number = card_number.replace(/ /g, "");
   //         let get_brand = this.GetCardType(card_number);
   //         let cvv = paymentData.payment.cvv;
   //         const id_user_front = localStorage.getItem('id_user_front');

   //         this.apiService.PredeterminateLocationsByIdUser(id_user_front).subscribe(
   //             response => {
   //                 if (response.length == 0) {
   //                     this.validate_ubication = true;
   //                     this.show = false;
   //                 } else {
   //                     let products = localStorage.getItem("cart_item")
   //                     for (var i = 0; i < response.length; i++) {
   //                         this.txnid = Date.now();
   //                         this.amount = this.getCartProducts();
   //                         this.productinfo = Date.now();
   //                         this.email = response[i].email;
   //                         this.quota = paymentData.payment.quota;
   //                         this.brand = get_brand;
   //                         this.expiryMonth = this.selectedMonth;
   //                         this.expiryYear = this.selectedYear;
   //                         this.firstname = response[i].first_name + ' ' + response[i].last_name;
   //                         this.typeIdentification = 1;
   //                         this.billingNumberIdentifier = "1022381182";
   //                         this.billingAddress = response[i].via + ' #' + response[i].number + ' - ' + response[i].sn + ' ' + response[i].neighborhood;
   //                         this.billingNames = response[i].first_name;
   //                         this.billingLastNames = response[i].last_name;
   //                         this.billingEmail = response[i].email;
   //                         this.callerPhoneNumber = response[i].phone;
   //                         this.id_city = response[i].id_city;
   //                         this.city = response[i].nameci;
   //                     }

   //                     let JsonDataTransaction = {
   //                         "webProductsReference": this.txnid,
   //                         "txnid": this.txnid,
   //                         "typeIdentification": this.typeIdentification,
   //                         "identificationNumber": this.billingNumberIdentifier,
   //                         "brand": get_brand,
   //                         "cardNumber": card_number,
   //                         "expiryMonth": this.selectedMonth,
   //                         "expiryYear": this.selectedYear.substr(-2),
   //                         "securityCode": cvv,
   //                         "quota": this.quota,
   //                         "total": this.amount,
   //                         "typeTax": 1,
   //                         "tax": 0,
   //                         "address": this.billingAddress,
   //                         "department": 1,
   //                         "id_city": this.id_city,
   //                         "city": this.city,
   //                         "email": this.email,
   //                         "phone": this.callerPhoneNumber,
   //                         "celphone": this.callerPhoneNumber,
   //                         "franquicia": this.brand,
   //                         "productinfo": this.productinfo,
   //                         "firstname": this.firstname,
   //                         "billingNames": this.billingNames,
   //                         "billingLastNames": this.billingLastNames,
   //                         "billingEmail": this.billingEmail,
   //                         "id_user_front": id_user_front,
   //                         "products": products

   //                     };
   //                     console.log(JsonDataTransaction);
   //                     this.apiService.SendTransactionDataToBackend(JsonDataTransaction).subscribe(
   //                         dataTransaction => {
   //                             let myJSONTrx = JSON.stringify(dataTransaction);
   //                             let objTrx = JSON.parse(myJSONTrx);
   //                             let TxrResult = objTrx.result;

   //                             if (TxrResult == 200) {
   //                                 // Discount Stock
   //                                 const cart_data = JSON.parse(localStorage.getItem('cart_item'));
   //                                 this.cart_data_arr = [];
   //                                 for (var i = 0; i < cart_data.length; i++) {
   //                                     let newstock = cart_data[i].stock - cart_data[i].quantity;
   //                                     console.log("stock " + newstock);
   //                                     let myObj_stock = {
   //                                         "newstock": newstock
   //                                     };
   //                                     this.apiService.updateStock(myObj_stock, cart_data[i].id_product).subscribe();
   //                                 }

   //                                 this.apiService.sendEmailCustomerRequest(JsonDataTransaction).subscribe();
   //                                 this.apiService.sendSellerStoreEmail(JsonDataTransaction).subscribe();
   //                                 this.embryoService.addBuyUserDetails(this.paymentFormOne.value, objTrx.num_aprob, objTrx.date, objTrx.reference);
   //                                 const id_user_front = localStorage.getItem('id_user_front');

   //                                 this.router.navigate(['/checkout/final-receipt']);
   //                             } else if (TxrResult == 400) {
   //                                 this.apiService.sendEmailRejectionTransactionCustomer(JsonDataTransaction).subscribe();
   //                                 this.ErrorTransactionPaymentGateway(objTrx.message_reply)
   //                             } else if (TxrResult == 500) {
   //                                 this.FailTransactionPaymentGateway()
   //                             }

   //                         },
   //                         error => this.FailTransactionPaymentGateway()
   //                     );
   //                 }
   //             },
   //             error => console.log(error)
   //         );

   //     } else {
   //         console.log("fail");

   //         for (let i in paymentGroup.controls) {
   //             paymentGroup.controls[i].markAsTouched();
   //         }
   //     }
   // }



   FailTransactionPaymentGateway() {
      this.show = false;
      let messaje = "El servicio presenta inconvenientes, intentelo nuevamente";
      this.apiService.FailTransactionDialog(messaje);
   }

   ErrorTransactionPaymentGateway(message_reply: string) {
      this.show = false;
      let messaje = message_reply;
      this.apiService.ErrorTransactionDialog(messaje);
   }

   stablish_predermined(id: any) {
      // Redirigir a la página de ubicaciones/direcciones
      this.router.navigate(['/account/address']);
   }


   GetCardType(number: string) {
      // visa
      var re = new RegExp("^4");
      if (number.match(re) != null)
         return "visa";

      // Mastercard
      // Updated for Mastercard 2017 BINs expansion
      // if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number))
      var rem = new RegExp("^5");
      if (number.match(rem) != null)
         return "mastercard";

      // AMEX
      re = new RegExp("^3[47]");
      if (number.match(re) != null)
         return "amex";

      // Discover
      re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
      if (number.match(re) != null)
         return "discover";

      // Diners
      re = new RegExp("^36");
      if (number.match(re) != null)
         return "diners";

      // Diners - Carte Blanche
      re = new RegExp("^30[0-5]");
      if (number.match(re) != null)
         return "Diners - Carte Blanche";

      // JCB
      re = new RegExp("^35(2[89]|[3-8][0-9])");
      if (number.match(re) != null)
         return "JCB";

      // Visa Electron
      re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
      if (number.match(re) != null)
         return "Visa Electron";

      return "";
   }

   numberOnly(event: any): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
         return false;
      }
      return true;
   }

}




