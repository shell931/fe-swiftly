export interface Invoice {
    adress: string,
    created_at: string,
    departament: string,
    email: string,
    first_name_client: string,
    id_store_id: number,
    id: number,
    name_client: string,
    name_state: string,
    name_store: string,
    nameci: string,
    number_identifier: string,
    paymentmethod: string,
    phone: string,
    reference: string,
    reference_invoice: string,
    state_id: string,    
    total_price: number,
    percentage_sale: number,
    val_percentage_sale: number,
    percentage_commision_payment: number,
    val_percentage_commision_payment: number,
    percentage_rete_ica: number,
    val_percentage_rete_ica: number,
    percentage_rete_fuente: number,
    val_percentage_rete_fuente: number,
    val_percentage_rete_iva: number,
    percentage_commision_tax: number,
    val_percentage_commision_tax: number,
    total_balance: number,
    transaction_id: number,
    type_identifier: string,
    user_id: number,
    invoice_detail: string, 
    image_gallery:string,
    shipping_voucher:string,
    num_aprob:string,
    quot:string,
    brand:string,
    cod_reply:string,
    messaje_reply:string,
    num_recibo:string,
    type_service_id:number,
    type_service:string,
    getBinnacleFalse:string,
}


export interface InvoiceUser {
    reference: string,
    
}

export interface BalanceDetail {
    id: number,
    created_at: string,
    reference: string,
    state: string,
    total_balance: any
    
}

