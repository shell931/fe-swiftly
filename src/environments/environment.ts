// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: {
    // baseUrl: 'https://ofertas-swiftly.com/api/',
    // baseAuthUrl: 'https://ofertas-swiftly.com/auth/',
    baseUrl: 'http://192.168.1.5:8000/api/',
    baseAuthUrl: 'http://192.168.1.5:8000/auth/',

    baseBucketImageUrl: 'https://market-docus-v2.s3.us-east-2.amazonaws.com/',
    // baseAuthGateway: 'http://52.44.5.11:1700/marketgateway/public/'
    baseAuthGateway: 'https://ofertas-swiftly.com/gateway/public/',
    key: '2204119136',
    hash: 'bdd05095c22502bbd11161c206a99785c0d44abedc9b11cb9f96af4267e0993b342ef0d88956a356517bda1005c1ae437e609d789416200a746d2f438888fc95',
    productinfo: 'Compra en swiftly',
    url_response: 'http://localhost:4200/checkout/final-receipt',
    url_webhook: 'https://38d30d8e0158.ngrok-free.app/api/payment-webhook/'
  },
};


/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

