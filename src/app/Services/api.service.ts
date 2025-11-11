import { Injectable } from '@angular/core';
import {MatDialogModule, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { AdminProductValidComponent } from '../AdminPanel/Widget/PopUp/AdminProductValid/AdminProductValid.component';
import { TransactionComponent } from '../AdminPanel/Widget/PopUp/Transaction/Transaction.component';
import { TransferComponent } from '../AdminPanel/Widget/PopUp/Transfer/Transfer.component';
import { TransactionResponseComponent } from '../AdminPanel/Widget/PopUp/TransactionResponse/TransactionResponse.component';
import { InvoiceDetailComponent } from '../AdminPanel/Widget/PopUp/InvoiceDetail/InvoiceDetail.component';
import { TransactionDetailComponent } from '../AdminPanel/Widget/PopUp/TransactionDetail/TransactionDetail.component';
import { InvoiceDetailUsrComponent } from '../AdminPanel/Widget/PopUp/InvoiceDetailUsr/InvoiceDetailUsr.component';
import { StoreDetailViewComponent } from '../AdminPanel/Widget/PopUp/StoreDetailView/StoreDetailView.component';
import { LocationPredeterminedComponent } from '../AdminPanel/Widget/PopUp/LocationPredetermined/LocationPredetermined.component';
import { PopUpHomeComponent } from '../AdminPanel/Widget/PopUp/PopUpHome/PopUpHome.component';
import { SeeListDialogComponent } from '../AdminPanel/Widget/PopUp/SeeListDialog/SeeListDialog.component';
import { DeleteLocationUserComponent } from '../AdminPanel/Widget/PopUp/DeleteLocationUser/DeleteLocationUser.component';
import { FailTransactionGatewayComponent } from '../AdminPanel/Widget/PopUp/FailTransactionGateway/FailTransactionGateway.component';
import { FailErrorTransactionGatewayComponent } from '../AdminPanel/Widget/PopUp/FailErrorTransactionGateway/FailErrorTransactionGateway.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../src/environments/environment';
import { BinnacleComponent } from '../AdminPanel/Widget/PopUp/Binnacle/Binnacle.component';
import { StoreAdmin } from '../Models/StoreAdmin';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    //BASE URL'S FROM BACKEND
    baseUrl = environment.api.baseUrl;
    baseAuthUrl = environment.api.baseAuthUrl;
    baseUrlApiPaymentGateway = environment.api.baseAuthGateway;

    baseMenusUrl = `${this.baseUrl}menus/`;
    baseUsersUrl = `${this.baseUrl}users/`;
    baseGropusUrl = `${this.baseUrl}group-list/`;
    baseStoreUrl = `${this.baseUrl}store/`;
    baseUpdateStoreUrl = `${this.baseUrl}store_update/`;
    baseUpdatePercentageStoreUrl = `${this.baseUrl}update_percentage_store/`;
    baseStoreByCategory = `${this.baseUrl}store_by_category_data/`;
    baseStoreDataUrl = `${this.baseUrl}store_complete_data/`;
    baseStoreDocumentsUrl = `${this.baseUrl}store_documents/`;
    baseStoreBankAccountsUrl = `${this.baseUrl}bank_accounts/`;
    baseStoreWithoutAutUrl = `${this.baseUrl}store_front/`;
    baseValidateUserExist = `${this.baseUrl}validate_user/`;
    baseDepartmentsUrl = `${this.baseUrl}departments/`;
    baseCitiesUrl = `${this.baseUrl}cities/`;
    baseProductsUrl = `${this.baseUrl}products/`;
    baseCategoriesUrl = `${this.baseUrl}categories/`;
    basePercentageSaleUrl = `${this.baseUrl}payment_percentages_sale/`;
    basePercentageTaxUrl = `${this.baseUrl}percentages_tax/`;
    basePercentagePaymentUrl = `${this.baseUrl}payment_percentages_payment/`;
    baseApiTransactionUrl = `${this.baseUrl}get_con_api_data/`;
    baseSocietyTypeUrl = `${this.baseUrl}society_type/`;
    baseSubCategoriesUrl = `${this.baseUrl}subcategories/`;
    baseFindCategoryBySubcategoryUrl = `${this.baseUrl}find_category_by_subcategory/`;
    baseCategoriesStoreUrl = `${this.baseUrl}category_store/`;
    baseImagesUrl = `${this.baseUrl}images/`;
    baseLastImageIdUrl = `${this.baseUrl}last_image/`;
    baseCountImageIdUrl = `${this.baseUrl}count_image_prod/`;
    baseProductWithoutAutUrl = `${this.baseUrl}product_store/`;
    baseViewProductWithoutAutUrl = `${this.baseUrl}view/product_store/`;
    baseProducConfirmUrl = `${this.baseUrl}product_confirm/`;
    baseProductStoreWithoutAutUrl = `${this.baseUrl}store_products_front/`;
    baseAdminProductsUrl = `${this.baseUrl}admin_products/`;
    baseFilterProductsUrl = `${this.baseUrl}product_filter/`;
    baseLocationClientUrl = `${this.baseUrl}location_client/`;
    baseDepartmentsFrontUrl = `${this.baseUrl}departments_front/`;
    baseCitiesFrontUrl = `${this.baseUrl}cities_front/`;
    baseBanksFrontUrl = `${this.baseUrl}banks/`;
    baseTypeAccountsFrontUrl = `${this.baseUrl}type_accounts/`;
    baseUsersFrontUrl = `${this.baseUrl}user_front/`;
    baseUsersResetPassRequestFrontUrl = `${this.baseUrl}password_reset_market/`;
    baseUpdateUserUrl = `${this.baseUrl}user_group_edit/`;
    baseCancelTransactionFrontUrl = `${this.baseUrl}cancel_transaction/`;
    basesetContraTransactionFrontUrl = `${this.baseUrl}contra_transaction/`;
    baseUsersResetPassFrontUrl = `${this.baseUrl}password_reset_market/confirm/`;
    baseUsersTypeUrl = `${this.baseUrl}user_type/`;
    baseUsersGroupUrl = `${this.baseUrl}user_group/`;
    baseLocationByUser = `${this.baseUrl}locations_by_user/`;
    baseLocationPredeterByUser = `${this.baseUrl}location_client_checkout/`;
    baseAutenticationGateway = `${this.baseUrl}data_autentication_gateway/`;
    baseGetUserId = `${this.baseUrl}user_store/`;
    baseLocationById = `${this.baseUrl}locations_by_id/`;
    baseGetUserDataById = `${this.baseUrl}get_user/`;
    baseLocationUpdatePredById = `${this.baseUrl}general_update_location/`;
    baseLocationProdCategory = `${this.baseUrl}products_categories/`;
    baseLocationProdSubcategory = `${this.baseUrl}product_subcategory/`;
    baseTypeIdentifiersFrontUrl = `${this.baseUrl}type_identifier_front/`;
    baseCreateProductFrontUrl = `${this.baseUrl}create_product/`;
    baseListInvoicesFrontUrl = `${this.baseUrl}list_invoice/`;
    baseListInvoicesByStoreFrontUrl = `${this.baseUrl}invoice_by_store/`;
    baseListInvoicesByUserFrontUrl = `${this.baseUrl}list_user_invoice/`;
    baseListHeaderInvoiceFrontUrl = `${this.baseUrl}invoice_header/`;
    baseListDetailInvoicesFrontUrl = `${this.baseUrl}invoice_detail/`;
    baseInvoiceProcesFrontUrl = `${this.baseUrl}invoice_process_status/`;
    baseCheckoutInvoiceFrontUrl = `${this.baseUrl}check_invoice/`;
    baseListDetailInvoicesUserFrontUrl = `${this.baseUrl}list_user_invoice_detail/`;
    baseUpdateInvoiceStatusFrontUrl = `${this.baseUrl}update_status_invoice/`;
    baseUpdateCheckCallControllFrontUrl = `${this.baseUrl}update_checkvalidation_invoice/`;
    baseUpdateCheckRecordFrontUrl = `${this.baseUrl}update_checkrecord_invoice/`;
    baseUpdateCheckShipmentFrontUrl = `${this.baseUrl}update_checkshipment_invoice/`;
    baseUpdateCheckFinalyFrontUrl = `${this.baseUrl}update_checkfinaly_invoice/`;


    baseUpdateShippingVoucherInvoiceFrontUrl = `${this.baseUrl}update_shippingvoucher_invoice/`;
    baseUpdateLetterReceivedInvoiceFrontUrl = `${this.baseUrl}update_letterreceived_invoice/`;
    baseStoreCategoriesFrontUrl = `${this.baseUrl}store_categories/`;
    baseRequestMembershipFrontUrl = `${this.baseUrl}membership_request/`;
    baseAssistedSellingFrontUrl = `${this.baseUrl}set_assisted_selling/`;
    baseLoadDocumentsFrontUrl = `${this.baseUrl}load_documents/`;
    baseLoadLogoStoreUrl = `${this.baseUrl}load_logo/`;
    baseLoadImageProductFrontUrl = `${this.baseUrl}load_images/`;
    baseDeleteProductImageUrl = `${this.baseUrl}delete_images/`;
    baseBankAccountsFrontUrl = `${this.baseUrl}bank_accounts_save/`;
    baseGetAllTransactionsUrl = `${this.baseUrl}get_all_transactions/`;
    basesendEmailTransferRequest = `${this.baseUrl}send_email_transfer_request/`;
    basesendEmailReplyTransfer = `${this.baseUrl}send_email_reply_transfer/`;
    basesendEmailRejectionTransactionCustomer =`${this.baseUrl}send_email_rejection_transaction/`;
    basesendEmailStoreCreationRequest = `${this.baseUrl}send_email_store_creation_request/`;
    basesendCustomerStoreEmail = `${this.baseUrl}send_customer_store_email/`;
    basesendSellerStoreEmail = `${this.baseUrl}send_seller_store_email/`;
    baseSendEmailWelcomeStore = `${this.baseUrl}send_email_welcome_store/`;
    baseGetBalanceAccountFrontUrl = `${this.baseUrl}get_balance_account/`;
    baseGetBalanceDetailAccountFrontUrl = `${this.baseUrl}get_balance_detail_account/`;
    baseRequestTransferFrontUrl = `${this.baseUrl}transfer_request/`;
    baseGetTransferDataFrontUrl = `${this.baseUrl}get_transfer_data/`;
    baseListTransfersByStoreFrontUrl = `${this.baseUrl}get_all_transfer_data/`;
    baseListTransfersByIdFrontUrl = `${this.baseUrl}get_transfer_detail_data/`;
    baseChangeStateTransferFrontUrl = `${this.baseUrl}status_transfer/`;
    baseListTransactionsByStoreFrontUrl = `${this.baseUrl}get_transaction_by_store/`;
    baseListTransactionsByIdFrontUrl = `${this.baseUrl}get_transaction_by_id/`;

    //BASE URL'S FROM PAYMENT GATEWAY
    baseAuthPaymentGateway = `${this.baseUrlApiPaymentGateway}/api/auth/accountlogin`;
    baseHashcardPaymentGateway = `${this.baseUrlApiPaymentGateway}/api/v1/hashcard`;
    TransactionFromBackendUrl = `${this.baseUrl}set_transaction_core/`;
    baseUpdateStock =  `${this.baseUrl}update_stock/`;

    baseListBinnacles = `${this.baseUrl}list_binnacles/`;
    baseCreateBinnacle = `${this.baseUrl}create_binnacle/`;
    baseBinnacleCheckFrontUrl =  `${this.baseUrl}binnacle_check_status/`;
    baseListBinnaclesNumber = `${this.baseUrl}get_binnacle_number/`;
    BaseDataExportableTransaction = `${this.baseUrl}exportable_transaction/`;

    headers = new HttpHeaders({
        'Content-Type': 'application/json',
    });

    constructor(
        private httpClient: HttpClient,
        private cookieService: CookieService,
        private dialog: MatDialog,
    ) { }

    // Admin apis
    getMenus() {
        return this.httpClient.get(this.baseMenusUrl, { headers: this.getAuthHeaders() });
    }
    getUsers() {
        let userList: any;
        userList = this.httpClient.get(this.baseUsersUrl, { headers: this.getAuthHeaders() });
        return userList;
    }
    getGroupsList() {
        return this.httpClient.get(this.baseGropusUrl, { headers: this.getAuthHeaders() });
    }
    registerUser(authData: { username: any; password: string; first_name: any; last_name: any; email: any; is_active: string; group_id: any; store: string; type_user: number; }) {
        console.log(authData);
        const body = JSON.stringify(authData);
        return this.httpClient.post(`${this.baseUsersUrl}`, body, { headers: this.getAuthHeaders() });
    }


    UpdateUser(UserData: { group_id: any; first_name: any; last_name: any; is_active: any; email: any; }, id_user: any){
        const body = JSON.stringify(UserData);
        return this.httpClient.put(`${this.baseUpdateUserUrl}${id_user}/`, body, { headers: this.getAuthHeaders() });
    }

    loginUser(authData: { username: any; password: any; }) {
        const body = JSON.stringify(authData);
        return this.httpClient.post(`${this.baseAuthUrl}`, body, { headers: this.headers });
    }


    // Store transaction
    getAllTransactions() {
        return this.httpClient.get(this.baseGetAllTransactionsUrl, { headers: this.getAuthHeaders() });
    }


    // Locations Apis
    getDepartments() {
        let departmentsList: any;
        departmentsList = this.httpClient.get(this.baseDepartmentsUrl, { headers: this.getAuthHeaders() });
        return departmentsList;
    }

    getCitiesbyDepartments(id: number) {
        let citiesList: any;
        citiesList = this.httpClient.get(`${this.baseCitiesUrl}?id_departament=${id}`, { headers: this.getAuthHeaders() });
        return citiesList;
    }

    // Store apis


    getPercentagesSale() {
        let percentage_sale: any;
        percentage_sale = this.httpClient.get(this.basePercentageSaleUrl, { headers: this.getAuthHeaders() });
        return percentage_sale;
    }

    getPercentagesTax() {
        let percentage_sale: any;
        percentage_sale = this.httpClient.get(this.basePercentageTaxUrl, { headers: this.getAuthHeaders() });
        return percentage_sale;
    }

    getPercentagesPayment() {
        let percentage_payment: any;
        percentage_payment = this.httpClient.get(this.basePercentagePaymentUrl, { headers: this.getAuthHeaders() });
        return percentage_payment;
    }

    getCuc() {
        let cuc_data: any;
        cuc_data = this.httpClient.get(this.baseApiTransactionUrl, { headers: this.getAuthHeaders() });
        return cuc_data;
    }

    setMembershipRequest(requestData: { logo_store_up: string; name_store: any; name_legal: any; address: string; telephone: any; mobile: any; email: string; number_identifier: any; manager: string; state_store: string; city: any; description: string; postal_code: any; storecategories: any; societytype: any; }) {
        const body = JSON.stringify(requestData);
        return this.httpClient.post(`${this.baseRequestMembershipFrontUrl}`, body, { headers: this.getAuthHeaders() });
    }

    setLoadDocumentsStore(requestData: FormData) {
        return this.httpClient.post<any>(`${this.baseLoadDocumentsFrontUrl}`, requestData);
    }

    setBankAccountStore(requestData: FormData) {
        return this.httpClient.post<any>(`${this.baseBankAccountsFrontUrl}`, requestData);
    }

    getStore() {
        let storeList: any;
        storeList = this.httpClient.get(this.baseStoreUrl, { headers: this.getAuthHeaders() });
        return storeList;
    }

    getStoreCategories() {
        let categories: any;
        categories = this.httpClient.get(this.baseStoreCategoriesFrontUrl, { headers: this.getAuthHeaders() });
        return categories;
    }

    getSocietyType() {
        let categories: any;
        categories = this.httpClient.get(this.baseSocietyTypeUrl, { headers: this.getAuthHeaders() });
        return categories;
    }

    getStoreWithoutAuth() {
        let storeList: any;
        storeList = this.httpClient.get(this.baseStoreWithoutAutUrl, { headers: this.getAuthHeaders() });
        return storeList;
    }

    getStoreWithoutAuthbyId(id_store: any) {
        let store: any;
        // store = this.httpClient.get(`${this.baseStoreWithoutAutUrl}${id_store}`, { headers: this.getAuthHeaders() });
        store = this.httpClient.get(`${this.baseStoreWithoutAutUrl}?id_store=${id_store}`, { headers: this.getAuthHeaders() });
        return store;
    }

    getStoreWithoutAuthbyIdCategory(id_category: string | null) {
        let store: any;
        // store = this.httpClient.get(`${this.baseStoreWithoutAutUrl}${id_store}`, { headers: this.getAuthHeaders() });
        store = this.httpClient.get(`${this.baseStoreWithoutAutUrl}?id_category=${id_category}`, { headers: this.getAuthHeaders() });
        return store;
    }

    getStorebyCategory(id_category: any) {
        let store: any;
        store = this.httpClient.get(`${this.baseStoreByCategory}?storecategories_id=${id_category}`, { headers: this.getAuthHeaders() });
        return store;
    }

    setStore(storeData: { name_store: any; address: any; telephone: any; email: any; number_identifier: any; manager: any; state_store: string; city: any; logo_store: number; description: any; storecategories: any; }) {
        console.log(storeData);
        const body = JSON.stringify(storeData);
        return this.httpClient.post(`${this.baseStoreUrl}`, body, { headers: this.getAuthHeaders() });
    }

    updateStore(storeData: { address?: any; telephone?: any; email?: any; number_identifier?: any; manager?: any; city?: any; description?: any; logo_store?: any; storecategories?: any; name_store?: any; state_store?: string | number; }, id_store: any) {
        const body = JSON.stringify(storeData);
        return this.httpClient.put(`${this.baseUpdateStoreUrl}${id_store}/action_store/`, body, { headers: this.getAuthHeaders() });
    }


    updatePercentagesStore(storeData: { percentage_sale: any; percentage_payment: any; cuc: any; }, id_store: any) {
        const body = JSON.stringify(storeData);
        return this.httpClient.put(`${this.baseUpdatePercentageStoreUrl}${id_store}/`, body, { headers: this.getAuthHeaders() });
    }


    uploadIconStore(requestData: FormData) {
        return this.httpClient.post<any>(`${this.baseLoadLogoStoreUrl}`, requestData);
    }

    updateLogoFieldStore(name_logo: string, productId: number) {
        const body = JSON.stringify({ logo_store: name_logo });
        return this.httpClient.post(`${this.baseStoreUrl}${productId}/action_store/`, body, { headers: this.getAuthHeaders() });
    }

    getStoreData(id_store: any) {
        let store: any;
        store = this.httpClient.get(`${this.baseStoreDataUrl}?id_store=${id_store}`, { headers: this.getAuthHeaders() });
        return store;
    }

    getStoreDocuments(id_store: any) {
        let store_docs: any;
        store_docs = this.httpClient.get(`${this.baseStoreDocumentsUrl}?id_store=${id_store}`, { headers: this.getAuthHeaders() });
        return store_docs;
    }

    getStoreBankAccountData(id_store: any) {
        let store_docs: any;
        store_docs = this.httpClient.get(`${this.baseStoreBankAccountsUrl}?id_store=${id_store}`, { headers: this.getAuthHeaders() });
        return store_docs;
    }

    PopUpStoreViewValidate(data: any, docs_data: any) {
        let dialogRef: MatDialogRef<StoreDetailViewComponent>;
        dialogRef = this.dialog.open(StoreDetailViewComponent);
        dialogRef.componentInstance.data = data;
        dialogRef.componentInstance.docs_data = docs_data;
        return dialogRef.afterClosed();
    }


    // Products Apis

    DeleteProductImage(requestData: { image_id: any; }) {
        const body = JSON.stringify(requestData);
        return this.httpClient.post(`${this.baseDeleteProductImageUrl}`, body, { headers: this.getAuthHeaders() });
    }

    getImagesProducts(id_product: any) {
        let productsList: any;
        productsList = this.httpClient.get(`${this.baseImagesUrl}?id_product=${id_product}`, { headers: this.getAuthHeaders() });
        return productsList;
    }

    getLastImageProduct() {
        let LastImageId: any;
        LastImageId = this.httpClient.get(`${this.baseLastImageIdUrl}`, { headers: this.getAuthHeaders() });
        return LastImageId;
    }


    getCountImagesProducts(id_product: any) {
        let productImageCount: any;
        productImageCount = this.httpClient.get(`${this.baseCountImageIdUrl}?id_product=${id_product}`, { headers: this.getAuthHeaders() });
        return productImageCount;
    }

    getProductsbyStoreid(id_store: string | null) {
        let imageproductList: any;
        imageproductList = this.httpClient.get(`${this.baseProductsUrl}?id_store=${id_store}`, { headers: this.getAuthHeaders() });
        return imageproductList;
    }

    getProductsbyIdAdmin(id_product: any) {
        let productData: any;
        productData = this.httpClient.get(`${this.baseProductsUrl}${id_product}`, { headers: this.getAuthHeaders() });
        return productData;
    }

    getProductStoresbyStoreid(id_store: any) {
        let productstore: any;
        productstore = this.httpClient.get(`${this.baseProductStoreWithoutAutUrl}?id_store=${id_store}`, { headers: this.getAuthHeaders() });
        return productstore;
    }


    getProductsbyId(id_store: any) {
        let prod: any;
        prod = this.httpClient.get(`${this.baseViewProductWithoutAutUrl}${id_store}`, { headers: this.getAuthHeaders() });
        return prod;
    }

    getProductsWithoutAuth() {
        let prod: any;
        prod = this.httpClient.get(this.baseProductWithoutAutUrl,);
        return prod;
    }

    // getViewProductsWithoutAuth(){
    //     let prod: any;
    //     prod = this.httpClient.get(this.baseViewProductWithoutAutUrl,);
    //     return prod;
    // }
    setProduct(productData: { name_product: any; description_product: any; product_code: any; total_price: any; availability: any; stock: any; store: string | null; brand: any; subcategory_id: any; features: string; state: number; image: string; published: string; discount_price?: any; }) {
        console.log(productData);
        const body = JSON.stringify(productData);
        return this.httpClient.post(`${this.baseCreateProductFrontUrl}`, body, { headers: this.getAuthHeaders() });
    }

    getAdminProduct() {
        return this.httpClient.get(`${this.baseAdminProductsUrl}`, { headers: this.getAuthHeaders() });
    }

    getCategories() {
        let categoriesList: any;
        categoriesList = this.httpClient.get(this.baseCategoriesUrl, { headers: this.getAuthHeaders() });
        return categoriesList;
    }

    getCategoriesStore(id_store: number) {
        let categories_store: any;
        categories_store = this.httpClient.get(`${this.baseCategoriesStoreUrl}?id_store=${id_store}`, { headers: this.getAuthHeaders() });
        return categories_store;
    }

    getSubCategories(id: number) {
        let subcategories: any;
        subcategories = this.httpClient.get(`${this.baseSubCategoriesUrl}?id_category=${id}`, { headers: this.getAuthHeaders() });
        return subcategories;
    }

    FindCategoryBySubcategory(subcategory_id: number) {
        let category: any;
        category = this.httpClient.get(`${this.baseFindCategoryBySubcategoryUrl}?subcategory_id=${subcategory_id}`, { headers: this.getAuthHeaders() });
        return category;
    }

    setImage(imageData: any) {
        const body = JSON.stringify(imageData);
        return this.httpClient.post(`${this.baseImagesUrl}`, body, { headers: this.getAuthHeaders() });
    }

    updateImageProduc(img: string, store_id: number) {
        const body = JSON.stringify({ image: img });
        return this.httpClient.post(`${this.baseProductsUrl}${store_id}/action_product/`, body, { headers: this.getAuthHeaders() });
    }

    updateProduc(product_data: string, product_id: number) {
        const body = JSON.stringify(product_data);
        return this.httpClient.put(`${this.baseProductsUrl}${product_id}/action_product/`, body, { headers: this.getAuthHeaders() });
    }

    deleteProduct(id_prod: any) {
        return this.httpClient.delete(`${this.baseProductsUrl}${id_prod}/action_product/`, { headers: this.getAuthHeaders() });
    }

    updateStateProduct(state: number, id_prod: number) {
        const body = JSON.stringify({ state: state });
        return this.httpClient.put(`${this.baseProductsUrl}${id_prod}/action_product_state/`, body, { headers: this.getAuthHeaders() });
    }

    uploadFile(requestData: FormData) {
        return this.httpClient.post<any>(`${this.baseLoadImageProductFrontUrl}`, requestData);
    }


    // Admin product apis

    PopUpAdminProductsValidate(data: any) {
        let dialogRef: MatDialogRef<AdminProductValidComponent>;
        dialogRef = this.dialog.open(AdminProductValidComponent, {
            panelClass: 'custom-dialog-container-productadm',
            width: '95vw',
            maxWidth: '950px',
            maxHeight: '95vh',
            autoFocus: false,
            disableClose: false
        });
        dialogRef.componentInstance.data = data;
        return dialogRef.afterClosed();
    }

    getProductsConfirmbyId(id_store: any) {
        let prod: any;
        prod = this.httpClient.get(`${this.baseProducConfirmUrl}${id_store}`, { headers: this.getAuthHeaders() });
        return prod;
    }

    // Apis to front store

    FilterProducts(string_search: any) {
        let filter_produc: any;
        filter_produc = this.httpClient.get(`${this.baseFilterProductsUrl}?string_search=${string_search}`, { headers: this.getAuthFrontHeaders() });
        return filter_produc;
    }

    SetLocationClient(location: { city: any; neighborhood: any; via: any; number: any; sn: any; additional_data: any; phone: any; contact: any; latitude: number; longitude: number; user: string[] | (string | null)[]; predetermined?: boolean; }) {
        const body = JSON.stringify(location);
        return this.httpClient.post(`${this.baseLocationClientUrl}`, body, { headers: this.getAuthFrontHeaders() });
    }

    getDepartmentsFront() {
        let departmentsList: any;
        departmentsList = this.httpClient.get(this.baseDepartmentsFrontUrl, { headers: this.getAuthFrontHeaders() });
        return departmentsList;
    }

    getCitiesFrontbyDepartments(id: number) {
        let citiesList: any;
        citiesList = this.httpClient.get(`${this.baseCitiesFrontUrl}?id_departament=${id}`, { headers: this.getAuthFrontHeaders() });
        return citiesList;
    }

    getBanksFront() {
        let bankList: any;
        bankList = this.httpClient.get(this.baseBanksFrontUrl, { headers: this.getAuthFrontHeaders() });
        return bankList;
    }

    getTypeAccountFront() {
        let typeaccountList: any;
        typeaccountList = this.httpClient.get(this.baseTypeAccountsFrontUrl, { headers: this.getAuthFrontHeaders() });
        return typeaccountList;
    }

    getUserId(id_store: any) {
        let get_user_id: any;
        get_user_id = this.httpClient.get(`${this.baseGetUserId}?id_store=${id_store}`, { headers: this.getAuthHeaders() });
        return get_user_id;
    }

    setUpdateUserTypeFront(Data: { type: number; }, id_user: any) {
        const body = JSON.stringify(Data);
        return this.httpClient.put(`${this.baseUsersTypeUrl}${id_user}/users_action_update_type/`, body, { headers: this.getAuthHeaders() });
    }

    setUpdateUserGroup(Data: { group_id: number; }, id_user: any) {
        const body = JSON.stringify(Data);
        return this.httpClient.put(`${this.baseUsersGroupUrl}${id_user}/action_user_group/`, body, { headers: this.getAuthHeaders() });
    }

    registerUserFront(authData: { username: any; email: any; password: any; first_name: any; last_name: any; is_active: string; group_id: number; store: any; type_user: number; type_identifier: any; number_identifier: any; }) {
        console.log(authData);
        const body = JSON.stringify(authData);
        return this.httpClient.post(`${this.baseUsersFrontUrl}`, body, { headers: this.getAuthFrontHeaders() });
    }

    getUserById(id_user: any) {
        let locations: any;
        locations = this.httpClient.get(`${this.baseGetUserDataById}?id_user=${id_user}`, { headers: this.getAuthHeaders() });
        return locations;
    }

    sendEmailStoreCreationRequest(emailData: { username: any; email: any; password: any; first_name: any; last_name: any; is_active: string; group_id: number; store: any; type_user: number; type_identifier: any; number_identifier: any; }){
        const body = JSON.stringify(emailData);
        console.log(body);
        return this.httpClient.post(`${this.basesendEmailStoreCreationRequest}`, body, { headers: this.getAuthFrontHeaders() });
    }
    sendEmailCustomerRequest(emailData: any){
        const body = JSON.stringify(emailData);
        console.log(body);
        return this.httpClient.post(`${this.basesendCustomerStoreEmail}`, body, { headers: this.getAuthFrontHeaders() });
    }
    sendSellerStoreEmail(emailData: any){
        const body = JSON.stringify(emailData);
        return this.httpClient.post(`${this.basesendSellerStoreEmail}`, body, { headers: this.getAuthFrontHeaders() });
    }
    sendEmailRejectionTransactionCustomer(emailData: any) {
        const body = JSON.stringify(emailData);
        return this.httpClient.post(`${this.basesendEmailRejectionTransactionCustomer}`, body, { headers: this.getAuthFrontHeaders() });
    }
    sendEmailTransferRequest(emailData: { id_store: string | null; id_transfer: any; }) {
        const body = JSON.stringify(emailData);
        return this.httpClient.post(`${this.basesendEmailTransferRequest}`, body, { headers: this.getAuthFrontHeaders() });
    }
    sendEmailReplyTransfer(emailData: { reference: string; state: number; }) {
        const body = JSON.stringify(emailData);
        return this.httpClient.post(`${this.basesendEmailReplyTransfer}`, body, { headers: this.getAuthFrontHeaders() });
    }
    resetPasswordRequestUser(emailData: { email: any; }) {
        const body = JSON.stringify(emailData);
        return this.httpClient.post(`${this.baseUsersResetPassRequestFrontUrl}`, body, { headers: this.getAuthFrontHeaders() });
    }
    sendEmailWelcomeStore(emailData: { email: StoreAdmin; }){
        const body = JSON.stringify(emailData);
        return this.httpClient.post(`${this.baseSendEmailWelcomeStore}`, body, { headers: this.getAuthFrontHeaders() });
    }
    resetPasswordUser(resetData: { token: any; password: any; }) {
        const body = JSON.stringify(resetData);
        return this.httpClient.post(`${this.baseUsersResetPassFrontUrl}`, body, { headers: this.getAuthFrontHeaders() });
    }

    ValidateUserExist(username: any) {
        let store: any;
        store = this.httpClient.get(`${this.baseValidateUserExist}?username=${username}`, { headers: this.getAuthHeaders() });
        return store;
    }


    updateStoreUserFront(Data: { store: any; }, id_user: string | null) {
        const body = JSON.stringify(Data);
        return this.httpClient.put(`${this.baseUsersFrontUrl}${id_user}/users_action_update_store/`, body, { headers: this.getAuthHeaders() });
    }

    getUserProfileFront(id_user: string | null) {
        let user: any;
        user = this.httpClient.get(`${this.baseUsersUrl}${id_user}`, { headers: this.getAuthFrontHeaders() });
        return user;
    }

    FilterLocationsByIdUser(id_user_front: string | null) {
        let filter_locations: any;
        if (!id_user_front) {
            return new Observable(observer => {
                observer.next([]);
                observer.complete();
            });
        }
        filter_locations = this.httpClient.get(`${this.baseLocationByUser}?id_user_front=${id_user_front}`, { headers: this.getAuthFrontHeaders() });
        return filter_locations;
    }

    PredeterminateLocationsByIdUser(id_user_front: string | null) {
        let filter_locations: any;
        if (!id_user_front) {
            return new Observable(observer => {
                observer.next([]);
                observer.complete();
            });
        }
        filter_locations = this.httpClient.get(`${this.baseLocationPredeterByUser}?id_user_front=${id_user_front}`, { headers: this.getAuthFrontHeaders() });
        return filter_locations;
    }
    updateStock(stock_data: { newstock: number; },id_product: any){
        const body = JSON.stringify(stock_data);
        return this.httpClient.put(`${this.baseUpdateStock}${id_product}/`, body, { headers: this.getAuthFrontHeaders() });
    }
    getAutenticationGateway() {
        let filter_locations: any;
        filter_locations = this.httpClient.get(`${this.baseAutenticationGateway}`, { headers: this.getAuthFrontHeaders() });
        return filter_locations;
    }


    deleteLocationUserDialog(data: string) {
        let dialogRef: MatDialogRef<DeleteLocationUserComponent>;
        dialogRef = this.dialog.open(DeleteLocationUserComponent);
        dialogRef.componentInstance.data = data;
        return dialogRef.afterClosed();
    }

    FailTransactionDialog(data: string) {
        let dialogRef: MatDialogRef<FailTransactionGatewayComponent>;
        dialogRef = this.dialog.open(FailTransactionGatewayComponent);
        dialogRef.componentInstance.data = data;
        return dialogRef.afterClosed();
    }

    ErrorTransactionDialog(data: string) {
        let dialogRef: MatDialogRef<FailErrorTransactionGatewayComponent>;
        dialogRef = this.dialog.open(FailErrorTransactionGatewayComponent);
        dialogRef.componentInstance.data = data;
        return dialogRef.afterClosed();
    }

    deleteLocationAction(id_location: number) {
        return this.httpClient.delete(`${this.baseLocationClientUrl}${id_location}/action_location/`, { headers: this.getAuthFrontHeaders() });
    }

    updateInformationUserFront(data: string, id_user: number) {
        const body = data;
        return this.httpClient.put(`${this.baseUsersUrl}${id_user}/action_user/`, body, { headers: this.getAuthFrontHeaders() });
    }


    getLocationClientFront(id_location: any) {
        let locations: any;
        locations = this.httpClient.get(`${this.baseLocationById}?id_location=${id_location}`, { headers: this.getAuthFrontHeaders() });
        return locations;
    }

    updateLocationAction(body: string, id_location: number) {
        return this.httpClient.put(`${this.baseLocationClientUrl}${id_location}/action_location/`, body, { headers: this.getAuthFrontHeaders() });
    }

    updateLocationPredetermined(body: string, id_location: number) {
        return this.httpClient.put(`${this.baseLocationUpdatePredById}${id_location}/action_location/`, body, { headers: this.getAuthFrontHeaders() });
    }

    stablishPrederminedLocation(data: any) {
        let dialogRef_sta: MatDialogRef<LocationPredeterminedComponent>;
        dialogRef_sta = this.dialog.open(LocationPredeterminedComponent);
        dialogRef_sta.componentInstance.data = data;
        return dialogRef_sta.afterClosed();
    }
    stablishPopUpHome(){
        let dialogRef_sta: MatDialogRef<PopUpHomeComponent>;
        dialogRef_sta = this.dialog.open(PopUpHomeComponent, { panelClass: 'custom-dialog-container' } );
        return dialogRef_sta.afterClosed();
    }

    getProductsbyCategory(id_category: any) {
        let prods_category: any;
        prods_category = this.httpClient.get(`${this.baseLocationProdCategory}?id_category=${id_category}`, { headers: this.getAuthHeaders() });
        return prods_category;
    }

    getProductsbyCategorybyStore(id_category: string | null, id_store: any) {
        let prods_category: any;
        prods_category = this.httpClient.get(`${this.baseLocationProdCategory}?id_category=${id_category}&id_store=${id_store}`, { headers: this.getAuthHeaders() });
        return prods_category;
    }

    getProductsbySubcategory(id_subcategory: any) {
        let prods_subcategory: any;
        prods_subcategory = this.httpClient.get(`${this.baseLocationProdSubcategory}?subcategory_id=${id_subcategory}`, { headers: this.getAuthHeaders() });
        return prods_subcategory;
    }

    getProductsbySubcategorybyStore(id_subcategory: string | null, store_id: any) {
        let prods_subcategory: any;
        prods_subcategory = this.httpClient.get(`${this.baseLocationProdSubcategory}?subcategory_id=${id_subcategory}&id_store=${store_id}`, { headers: this.getAuthHeaders() });
        return prods_subcategory;
    }


    getTypreIdentifiersFront() {
        let identifiersList: any;
        identifiersList = this.httpClient.get(this.baseTypeIdentifiersFrontUrl, { headers: this.getAuthFrontHeaders() });
        return identifiersList;
    }


    // Apis to Payment Gateway
    AuthPaymentGateway(account_id_gateway: any, api_key_gateway: any ) {
        let JsonAuth = { account_id: account_id_gateway, api_key: api_key_gateway };
        const body = JsonAuth;
        return this.httpClient.post(`${this.baseAuthPaymentGateway}`, body, {});
    }


    SendTransactionDataToBackend(DataTransaction: { webProductsReference: any; txnid: any; typeIdentification: any; identificationNumber: any; total: any; typeTax: number; tax: number; address: any; department: number; id_city: any; city: any; email: any; phone: any; celphone: any; franquicia: any; productinfo: any; firstname: any; billingNames: any; billingLastNames: any; billingEmail: any; id_user_front?: string | null; products: string | null; }) {
        // Limpiar el objeto para eliminar valores undefined/null
        const cleanedData: any = {};
        for (const key in DataTransaction) {
            if (DataTransaction.hasOwnProperty(key)) {
                const value = (DataTransaction as any)[key];
                // Solo incluir valores que no sean null, undefined, o la cadena "undefined"
                if (value !== null && value !== undefined && value !== 'undefined' && value !== 'null') {
                    cleanedData[key] = value;
                }
            }
        }
        const body = cleanedData;
        return this.httpClient.post(`${this.TransactionFromBackendUrl}`, body, { headers: this.getAuthFrontHeaders() });
    }

    HashCardPaymentGateway(CardData: any) {
        const body = CardData;
        return this.httpClient.post(`${this.baseHashcardPaymentGateway}`, body, { headers: this.getPaymentGatewayHeaders() });
    }


    // Transfers

    setTransferRequest(requestData: { id_store: string | null; }) {
        const body = JSON.stringify(requestData);
        return this.httpClient.post(`${this.baseRequestTransferFrontUrl}`, body, { headers: this.getAuthFrontHeaders() });
    }

    GetTransfersByIdStore(id_store: string | null) {
        let invDetail: any;
        invDetail = this.httpClient.get(`${this.baseListTransfersByStoreFrontUrl}?id_store=${id_store}`, { headers: this.getAuthFrontHeaders() });
        return invDetail;
    }

    GetTransfersById(id: any) {
        let invDetail: any;
        invDetail = this.httpClient.get(`${this.baseListTransfersByIdFrontUrl}?id_transfe=${id}`, { headers: this.getAuthFrontHeaders() });
        return invDetail;
    }

    GetTransfersByIdPanelAdmin(id: any) {
        let invDetail: any;
        invDetail = this.httpClient.get(`${this.baseListTransfersByIdFrontUrl}?id_transfe=${id}`, { headers: this.getAuthHeaders() });
        return invDetail;
    }

    GetAllTransfers() {
        return this.httpClient.get(this.baseListTransfersByStoreFrontUrl, { headers: this.getAuthHeaders() });
    }


    PopUpAdminTransfers(data: any) {
        let dialogRef: MatDialogRef<TransferComponent>;
        dialogRef = this.dialog.open(TransferComponent, { panelClass: 'custom-dialog-container-transfer' });
        dialogRef.componentInstance.data = data;
        return dialogRef.afterClosed();
    }

    ChangeStateAprobe(id_transfer: any, jsonObjChange: { state: number; }) {
        const body = JSON.stringify(jsonObjChange);
        return this.httpClient.put(`${this.baseChangeStateTransferFrontUrl}${id_transfer}/`, body, { headers: this.getAuthHeaders() });
    }


    // Transactions

    PopUpTransactionDetail(data: any) {
        let dialogRef: MatDialogRef<TransactionDetailComponent>;
        dialogRef = this.dialog.open(TransactionDetailComponent, { panelClass: 'custom-dialog-container-transactiondetail' });
        dialogRef.componentInstance.data = data;
        return dialogRef.afterClosed();
    }


    PopUpAdminTransaction(data: any) {
        let dialogRef: MatDialogRef<TransactionComponent>;
        dialogRef = this.dialog.open(TransactionComponent, { panelClass: 'custom-dialog-container-transaction' });
        dialogRef.componentInstance.data = data;
        return dialogRef.afterClosed();
    }

    PopUpTransaccionCancelResponse(data: any) {
        let dialogRef: MatDialogRef<TransactionResponseComponent>;
        dialogRef = this.dialog.open(TransactionResponseComponent);
        dialogRef.componentInstance.data = data;
        return dialogRef.afterClosed();
    }

    setCancelTransaction(id_tx: any, jsonObjCancel: { id_tx: any; }) {
        const body = JSON.stringify(jsonObjCancel);
        return this.httpClient.put(`${this.baseCancelTransactionFrontUrl}${id_tx}/`, body, { headers: this.getAuthHeaders() });
    }

    setContraTransaction(id_tx: any, jsonObjCancel: { id_tx: any; }) {
        const body = JSON.stringify(jsonObjCancel);
        return this.httpClient.put(`${this.basesetContraTransactionFrontUrl}${id_tx}/`, body, { headers: this.getAuthHeaders() });
    }

    setAssistedSelling(requestData: { total_tx: number; tag_first_name: any; tag_last_name: any; tag_type_identification: any; tag_number_identification: any; tag_email: any; tag_cellphone: any; tag_desc_selling: any; tag_tax_iva: any; tag_store: string | null; brand: string; card_number: any; month: any; year: any; cvv: any; quot: any; id_user_front: string | null; selectedCity: any; address: any; }) {
        const body = JSON.stringify(requestData);
        return this.httpClient.post(`${this.baseAssistedSellingFrontUrl}`, body, { headers: this.getAuthHeaders() });
    }

    ListTransactionByStore(id_store: string | null) {
        let invDetail: any;
        invDetail = this.httpClient.get(`${this.baseListTransactionsByStoreFrontUrl}?id_store=${id_store}`, { headers: this.getAuthFrontHeaders() });
        return invDetail;
    }

    GetTransactionById(idTransaction: any) {
        let invDetail: any;
        invDetail = this.httpClient.get(`${this.baseListTransactionsByIdFrontUrl}?id=${idTransaction}`, { headers: this.getAuthFrontHeaders() });
        return invDetail;
    }

    // Ivoice Apis
    ListAllInvoices() {
        let identifiersList: any;
        identifiersList = this.httpClient.get(this.baseListInvoicesFrontUrl, { headers: this.getAuthHeaders() });
        return identifiersList;
    }

    ListInvoicesByStore(id_store: string | null) {
        let invDetail: any;
        invDetail = this.httpClient.get(`${this.baseListInvoicesByStoreFrontUrl}?id_store=${id_store}`, { headers: this.getAuthHeaders() });
        return invDetail;
    }


    GetBalanceAccount(id_store: string | null) {
        let BalanceStore: any;
        BalanceStore = this.httpClient.get(`${this.baseGetBalanceAccountFrontUrl}?id_store=${id_store}`, { headers: this.getAuthFrontHeaders() });
        return BalanceStore;
    }

    getBalanceDetail(id_store: string | null) {
        let balanceDetail: any;
        balanceDetail = this.httpClient.get(`${this.baseGetBalanceDetailAccountFrontUrl}?id_store=${id_store}`, { headers: this.getAuthHeaders() });
        return balanceDetail;
    }

    GetTransferData(id_transfe: string) {
        let TransfeData: any;
        TransfeData = this.httpClient.get(`${this.baseGetTransferDataFrontUrl}?id_transfe=${id_transfe}`, { headers: this.getAuthFrontHeaders() });
        return TransfeData;
    }

    ListInvoicesByUser(id_user: string | null) {
        let invDetail: any;
        invDetail = this.httpClient.get(`${this.baseListInvoicesByUserFrontUrl}?id_user=${id_user}`, { headers: this.getAuthFrontHeaders() });
        return invDetail;
    }

    ListInvoicesById(id_invoice: any) {
        let invDetail: any;
        invDetail = this.httpClient.get(`${this.baseListHeaderInvoiceFrontUrl}?invoice_id=${id_invoice}`, { headers: this.getAuthHeaders() });
        return invDetail;
    }

    getInvoiceDetail(id_invoice: any) {
        let invDetail: any;
        invDetail = this.httpClient.get(`${this.baseListDetailInvoicesFrontUrl}?id_invoice=${id_invoice}`, { headers: this.getAuthHeaders() });
        return invDetail;
    }
    getBinnacle(id: string | null, type: string){
        let listBinnacles: any;
        listBinnacles = this.httpClient.get(`${this.baseListBinnacles}?id=${id}&type=${type}`, { headers: this.getAuthHeaders() });
        return listBinnacles
    }
    createBinnacle(data: { observation: string; user_id: string | null; id_invoice_popup: string | null; type?: string; }){
        const body = JSON.stringify(data);
        return this.httpClient.post(`${this.baseCreateBinnacle}`,body, { headers: this.getAuthHeaders() });

    }

    getBinnacleNumber(id: any, type: any){
        let listBinnacles: any;
        listBinnacles = this.httpClient.get(`${this.baseListBinnaclesNumber}?id=${id}&type=${type}`, { headers: this.getAuthHeaders() });
        return listBinnacles
    }



    getInvoiceUserDetail(reference: any) {
        let invDetailUsr: any;
        invDetailUsr = this.httpClient.get(`${this.baseListDetailInvoicesUserFrontUrl}?reference=${reference}`, { headers: this.getAuthFrontHeaders() });
        return invDetailUsr;
    }

    PopUpInvoiceDetail(data: any) {
        let dialogRef: MatDialogRef<InvoiceDetailComponent>;
        dialogRef = this.dialog.open(InvoiceDetailComponent);
        dialogRef.componentInstance.data = data;
        return dialogRef.afterClosed();
    }

    PopUpBalanceDetail(data: any) {
        let dialogRef: MatDialogRef<InvoiceDetailComponent>;
        dialogRef = this.dialog.open(InvoiceDetailComponent);
        dialogRef.componentInstance.data = data;
        return dialogRef.afterClosed();
    }

    PopUpBinnacle(data: any) {
        let dialogRef: MatDialogRef<BinnacleComponent>;
        dialogRef = this.dialog.open(BinnacleComponent, { panelClass: 'custom-dialog-container-observation' });
        dialogRef.componentInstance.data = data;
        return dialogRef.afterClosed();
    }

    PopUpInvoiceDetailUsr(data: any) {
        let dialogRef: MatDialogRef<InvoiceDetailUsrComponent>;
        dialogRef = this.dialog.open(InvoiceDetailUsrComponent, {
            width: '90vw',
            maxWidth: '800px',
            maxHeight: '85vh',
            panelClass: 'invoice-detail-dialog',
            disableClose: false,
            autoFocus: false,
            restoreFocus: false,
            hasBackdrop: true,
            backdropClass: 'dialog-backdrop'
        });
        dialogRef.componentInstance.data = data;
        return dialogRef.afterClosed();
    }

    UpdateStatusInvoice(InvoiceData: { state: string; external_state?: string; }, id_invoice: any){
        const body = JSON.stringify(InvoiceData);
        return this.httpClient.put(`${this.baseUpdateInvoiceStatusFrontUrl}${id_invoice}/`, body, { headers: this.getAuthHeaders() });
    }

    UpdateCheckCallControllInvoice( InvoiceData: { check: boolean; }, id_invoice: any){
        const body = JSON.stringify(InvoiceData);
        return this.httpClient.put(`${this.baseUpdateCheckCallControllFrontUrl}${id_invoice}/`, body, { headers: this.getAuthHeaders() });
    }

    UpdateCheckRecordInvoice( InvoiceData: { check: boolean; }, id_invoice: any){
        const body = JSON.stringify(InvoiceData);
        return this.httpClient.put(`${this.baseUpdateCheckRecordFrontUrl}${id_invoice}/`, body, { headers: this.getAuthHeaders() });
    }

    UpdateCheckShipmentInvoice( InvoiceData: { check: boolean; }, id_invoice: any){
        const body = JSON.stringify(InvoiceData);
        return this.httpClient.put(`${this.baseUpdateCheckShipmentFrontUrl}${id_invoice}/`, body, { headers: this.getAuthHeaders() });
    }

    UpdateCheckFinalyInvoice( InvoiceData: { check: boolean; }, id_invoice: any){
        const body = JSON.stringify(InvoiceData);
        return this.httpClient.put(`${this.baseUpdateCheckFinalyFrontUrl}${id_invoice}/`, body, { headers: this.getAuthHeaders() });
    }

    getCheckValidation(id_invoice: any, checkToValidate: number) {
        let invDetail: any;
        invDetail = this.httpClient.get(`${this.baseCheckoutInvoiceFrontUrl}?id_invoice=${id_invoice}&check_validate=${checkToValidate}`, { headers: this.getAuthHeaders() });
        return invDetail;
    }

    UpdateShippingVoucherInvoice(requestData: FormData) {
        return this.httpClient.post<any>(`${this.baseUpdateShippingVoucherInvoiceFrontUrl}`, requestData, { headers: this.getAuthFrontHeadersFormData() });
    }

    UpdateLetterReceivedInvoice(requestData: FormData) {
        return this.httpClient.post<any>(`${this.baseUpdateLetterReceivedInvoiceFrontUrl}`, requestData, { headers: this.getAuthFrontHeadersFormData() });
    }

    getInvoiceInProcess(id_store: string | null) {
        let invDetail: any;
        invDetail = this.httpClient.get(`${this.baseInvoiceProcesFrontUrl}?id_store=${id_store}`, { headers: this.getAuthHeaders() });
        return invDetail;
    }

    getBinnaclesCheck(id_invoice: any){
        let binnacleDetail: any;
        binnacleDetail = this.httpClient.get(`${this.baseBinnacleCheckFrontUrl}?id_invoice=${id_invoice}`, { headers: this.getAuthHeaders() });
        return binnacleDetail;
    }
    // Headers to autentication Api Payment Gateway
    getPaymentGatewayHeaders() {
        const tokenPaymentGateway = localStorage.getItem('TokenPaymentGateway');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenPaymentGateway}`
        });
    }


    // Headers to autentication user front
    getAuthFrontHeaders() {
        const token = localStorage.getItem('mr-token-front');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`
        });
    }

    getAuthFrontHeadersFormData() {
        const token = localStorage.getItem('mr-token-front');
        return new HttpHeaders({
            // 'Content-Type': 'application/json',
            Authorization: `Token ${token}`
        });
    }

    // Headers to autentication
    getAuthHeaders() {
        const token = localStorage.getItem('mr-token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`
        });
    }

    // Headers to autentication
    getAuthHeadersToFormData() {
        const token = localStorage.getItem('mr-token');
        return new HttpHeaders({
            'Content-Type': 'multipart/form-data',
            Authorization: `Token ${token}`

        });
    }

    getDataExportableTransaction(data: { initial_date: any; finish_date: any; }){
        const body = JSON.stringify(data);
        return this.httpClient.post(`${this.BaseDataExportableTransaction}`, body,{ headers: this.getAuthHeaders() });
    }

    // Confirm external payment callback from payment gateway
    confirmExternalPayment(paymentData: any) {
        const body = JSON.stringify(paymentData);
        return this.httpClient.post(`${this.baseUrl}confirm_external_payment/`, body, { headers: this.getAuthFrontHeaders() });
    }
}

