export interface StoreAdmin {
    address: string,
    city: string,
    departament: string,
    description: string,
    email: string,
    logo_store: string,
    manager: string,
    name_store: string,
    number_identifier: string,
    state_store: string,
    telephone: string,
    storecategories_description: string,
}

export interface StoreDocs {
    id_documents: any,
    url_document: string,
    id_document_type: number,
    type: string,
    extension: string,
}

export interface StoreBankAccount {
    account_number: string,
    bank: string,
    certification_url: string,
    id_bank_account: number,
    responsible: string,
    state: boolean,
    store: string,
    store_name_legal: string,
    typeaccount: string,
}

