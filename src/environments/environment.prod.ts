export const environment = {
  production: true,
  api: {
    get baseUrl() { return `${window.location.protocol}//${window.location.host}/api/`; },
    get baseAuthUrl() { return `${window.location.protocol}//${window.location.host}/auth/`; },
    baseBucketImageUrl: 'https://market-docus-v2.s3.us-east-2.amazonaws.com/',
    baseAuthGateway: 'https://ofertas-swiftly.com/gateway/public/',
    key: '2204119136',
    hash: 'bdd05095c22502bbd11161c206a99785c0d44abedc9b11cb9f96af4267e0993b342ef0d88956a356517bda1005c1ae437e609d789416200a746d2f438888fc95',
    productinfo: 'Compra en swiftly',
    get url_response() { return `${window.location.protocol}//${window.location.host}/swiftly/account/order-history`; },
    get url_webhook() { return `${window.location.protocol}//${window.location.host}/api/payment-webhook/`; }
    // get baseAuthGateway() { return `${window.location.protocol}//${window.location.host}/marketgateway/public/`; }
  },
  nodeOptions: '--openssl-legacy-provider'
};

