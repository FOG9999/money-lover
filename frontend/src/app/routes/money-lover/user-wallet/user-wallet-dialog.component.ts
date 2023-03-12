import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreActions } from '@core/store/core.actions';
import { Store } from '@ngrx/store';
import { currencyToNumber, numberToCurrency } from '@shared';
import { validators } from '@shared/utils/validators';
import { AppState } from 'app/app.state';
import { WalletType } from 'app/model/wallet-type.model';
import { Wallet } from 'app/model/wallet.model';
import { CommonService } from '../common/common.service';
import { WalletService } from './user-wallet.service';

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
        private commonService: CommonService,
        private walletService: WalletService,
        private store: Store<AppState>
    ) { 
        this.walletForm = this.fb.group({
            includeInTotal: [true],
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
            ...this.wallet,
            ...this.walletForm.value,
            isDefault: 0,
            amount: currencyToNumber(this.walletForm.get('amount').value)
        }        
        this.store.dispatch(new CoreActions({loading: true}))
        this.walletService.saveWallet(this.wallet).subscribe((res: Wallet) => {
            console.log(res);
            this.store.dispatch(new CoreActions({loading: false}));
        }, (err) => {
            this.store.dispatch(new CoreActions({loading: false}));
        })
    }
}