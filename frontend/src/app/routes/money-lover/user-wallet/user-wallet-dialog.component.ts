import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { currencyToNumber, numberToCurrency } from '@shared';
import { validators } from '@shared/utils/validators';
import { WalletType } from 'app/model/wallet-type.model';
import { Wallet } from 'app/model/wallet.model';
import { CommonService } from '../common/common.service';

@Component({
    selector: 'ml-wallet-dialog',
    templateUrl: 'user-wallet-dialog.component.html',
    styleUrls: ['./user-wallet.component.scss']
})

export class WalletDialogComponent implements OnInit {
    
    walletForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: { wallet: Wallet },
        public dialogRef: MatDialogRef<WalletDialogComponent>,
        private commonService: CommonService
    ) { 
        this.walletForm = this.fb.group({
            includeInTotal: [false],
            amount: [0, validators.validateCurrency]
        })
    }

    wallet: Wallet;
    listWalletTypes: WalletType[] = [];

    ngOnInit() { 
        this.getDataWalletTypes();
        this.wallet = JSON.parse(JSON.stringify(this.data.wallet));
    }

    getDataWalletTypes() {
        this.commonService.getListWalletTypes({ search: '' }).subscribe(res => {
            this.listWalletTypes = [...res];
        })
    }

    closeDialog(){
        this.dialogRef.close();
    }

    saveWallet(){
        this.wallet = {
            ...this.walletForm.value,
            isDefault: 0,
            amount: currencyToNumber(this.walletForm.get('amount').value)
        }
        console.log(this.wallet);        
    }
}