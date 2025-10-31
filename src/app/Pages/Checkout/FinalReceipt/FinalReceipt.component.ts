import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { EmbryoService } from '../../../Services/Embryo.service';
import { ApiService } from '../../../Services/api.service';

@Component({
   selector: 'app-FinalReceipt',
   templateUrl: './FinalReceipt.component.html',
   styleUrls: ['./FinalReceipt.component.scss'],
   standalone: true,
   imports: [
     CommonModule,
     RouterModule,
     MatCardModule,
     MatButtonModule,
     CurrencyPipe
   ]
})
export class FinalReceiptComponent implements OnInit {

   deliveryDate: any;
   products: any;
   userDetails: any;
   invoiceDetails: any;
   LocationDetail: any;
   todayDate: any = new Date();
   get_location: any;
   paymentStatus: string = 'success'; // 'success' | 'failed' | 'pending'
   externalPaymentData: any = null;

   constructor(
      public embryoService: EmbryoService,
      public router: Router,
      private apiService: ApiService,
      private route: ActivatedRoute
   ) {
      this.getDeliveryDate();
      try {
         const userStored = localStorage.getItem("user") || 'null';
         this.userDetails = userStored !== 'null' ? JSON.parse(userStored) : null;
      } catch (e) {
         this.userDetails = null;
      }
      try {
         const invoiceStored = localStorage.getItem("InvoiceDetail") || 'null';
         this.invoiceDetails = invoiceStored !== 'null' ? JSON.parse(invoiceStored) : null;
      } catch (e) {
         this.invoiceDetails = null;
      }
      try {
         const locationStored = localStorage.getItem("LocationDetail") || 'null';
         this.LocationDetail = locationStored !== 'null' ? JSON.parse(locationStored) : null;
      } catch (e) {
         this.LocationDetail = null;
      }
   }

   ngOnInit() {
      console.log("FinalReceiptComponent");

      // Verificar si hay parámetros de URL (callback de plataforma de pagos)
      this.route.queryParams.subscribe(params => {
         console.log('Query params received:', params);

         if (params['status'] || params['txnid'] || params['amount']) {
            // Es un callback de la plataforma de pagos
            this.handleExternalPaymentCallback(params);
         }
      });

      // Verificar si hay datos en localStorage (para casos de redirección POST)
      const sessionPaymentData = localStorage.getItem('payment_callback_data');
      if (sessionPaymentData) {
         try {
            this.externalPaymentData = JSON.parse(sessionPaymentData);
            localStorage.removeItem('payment_callback_data');
            this.handleExternalPaymentCallback(this.externalPaymentData);
         } catch (error) {
            console.error('Error parsing payment callback data:', error);
         }
      }
   }

   private handleExternalPaymentCallback(params: any) {
      console.log('Processing external payment callback:', params);

      // Determinar el estado del pago basado en los parámetros recibidos
      if (params['status'] === 'success' || params['result'] === 'success') {
         this.paymentStatus = 'success';
         // Procesar pago exitoso
         this.processSuccessfulPayment(params);
      } else if (params['status'] === 'failed' || params['result'] === 'failed') {
         this.paymentStatus = 'failed';
         // Procesar pago fallido
         this.processFailedPayment(params);
      } else {
         this.paymentStatus = 'pending';
         // Procesar pago pendiente
         this.processPendingPayment(params);
      }
   }

   private processSuccessfulPayment(params: any) {
      // Aquí puedes procesar los datos del pago exitoso
      console.log('Payment successful:', params);

      // Actualizar datos de la factura si es necesario
      if (params['txnid'] && this.invoiceDetails) {
         this.invoiceDetails.reference = params['txnid'];
         localStorage.setItem("InvoiceDetail", JSON.stringify(this.invoiceDetails));
      }

      // Opcional: Enviar datos al backend para confirmar el pago
      if (params['txnid'] && this.apiService.confirmExternalPayment) {
         this.apiService.confirmExternalPayment(params).subscribe(
            response => {
               console.log('Payment confirmed in backend:', response);
            },
            error => {
               console.error('Error confirming payment:', error);
            }
         );
      }
   }

   private processFailedPayment(params: any) {
      console.log('Payment failed:', params);
      // Redirigir a la página de fallo
      this.router.navigate(['/checkout/final-receipt-fail']);
   }

   private processPendingPayment(params: any) {
      console.log('Payment pending:', params);
      // Manejar pago pendiente
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
         this.get_location = {
            "id": id,
            "nameci": nameci,
            "departament": departament,
            "number": number,
            "neighborhood": neighborhood,
            "via": via,
            "sn": sn,
            "additional_data": additional_data,
            "phone": phone,
            "contact": contact,
            "predetermined": predetermined
         };
      }
   }

   public getDeliveryDate() {
      this.deliveryDate = new Date();
      this.deliveryDate.setDate(this.deliveryDate.getDate() + 5);
   }

   public calculateProductSinglePrice(product: any, value: any) {
      let price = 0;
      if (!value) {
         value = 1;
      }
      price = product.price * value;
      return price;
   }

   public calculateTotalPrice() {
      let subtotal = 0;
      if (this.embryoService.buyUserCartProducts && this.embryoService.buyUserCartProducts.length > 0) {
         for (let product of this.embryoService.buyUserCartProducts) {
            if (!product.quantity) {
               product.quantity = 1;
            }
            subtotal += (product.price * product.quantity);
         }
         return subtotal;
      }
      return subtotal;
   }

   public getTotalPrice() {
      let total = 0;
      if (this.embryoService.buyUserCartProducts && this.embryoService.buyUserCartProducts.length > 0) {
         for (let product of this.embryoService.buyUserCartProducts) {
            if (!product.quantity) {
               product.quantity = 1;
            }
            total += (product.price * product.quantity);
         }
         // total += (this.embryoService.shipping+this.embryoService.tax);
         return total;
      }
      return total;
   }

   public goToHome() {
      this.embryoService.removeBuyProducts();
      this.router.navigate(['/']);
   }

}

