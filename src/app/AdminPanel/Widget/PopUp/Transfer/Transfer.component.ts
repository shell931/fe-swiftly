import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { ApiService } from '../../../../Services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Transfer } from '../../../../Models/Transfer';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
    selector: 'app-transfer-dialog',
    templateUrl: './Transfer.component.html',
    styleUrls: ['./Transfer.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule
    ]
})

export class TransferComponent implements OnInit {

    alertOpt: SweetAlertOptions = {};
    data!: Transfer;
    adminprList: any[] = [];
    adminProductList: any[] = [];
    @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
    dataSource = new MatTableDataSource<any>(this.adminProductList);
    buttdisa = false;
    failcanceltx = false;
    msjcanceltx = '';
    failservercanceltx = false;
    transactionsRespo: any;
    timer = 0;


    constructor(
        private loader: LoadingBarService,
        private apiService: ApiService,
        private router: Router,
        private toastyService: ToastrService,
    ) { }

    ngOnInit() {
        
        
    }

    aprobe_transfer(id_transfe: any) {      
        let ref = this.data.reference;
        console.log(ref);
        this.buttdisa = !this.buttdisa;
        let jsonObjChangeState = {
            "state": 2
        }
        let jsonObjEmailReply ={
            "reference" : ref,
            "state": 2
        }
        this.apiService.sendEmailReplyTransfer(jsonObjEmailReply).subscribe();
        this.apiService.ChangeStateAprobe(id_transfe, jsonObjChangeState).subscribe(res => this.onClose(res));
        
    }

    reject_transfer(id_transfe: any){      
        let ref = this.data.reference;          
        this.buttdisa = !this.buttdisa;
        let jsonObjChangeState = {
            "state": 3
        }
        let jsonObjEmailReply ={
            "reference" : ref,
            "state": 3
        }
        this.apiService.sendEmailReplyTransfer(jsonObjEmailReply).subscribe();
        this.apiService.ChangeStateAprobe(id_transfe, jsonObjChangeState).subscribe(res => this.onClose(res));
    }

    onClose(response: any) {
        window.location.reload();
    }


}


