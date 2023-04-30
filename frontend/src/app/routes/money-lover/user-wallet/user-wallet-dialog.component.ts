import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreActions } from '@core/store/core.actions';
import { Store } from '@ngrx/store';
import { currencyToNumber } from '@shared';
import { validators } from '@shared/utils/validators';
import { AppState } from 'app/app.state';
import { WalletType } from 'app/model/wallet-type.model';
import { Wallet, WalletForm } from 'app/model/wallet.model';
import { CommonService } from '../common/common.service';
import { WalletService } from './user-wallet.service';
import { ToastrService } from 'ngx-toastr';

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
        private store: Store<AppState>,
        private toastService: ToastrService
    ) { }

    wallet: WalletForm;
    listWalletTypes: WalletType[] = [];
    selectedWalletType: string;

    ngOnInit() { 
        this.getDataWalletTypes();
        this.wallet = JSON.parse(JSON.stringify(this.data.wallet));
        this.wallet.walletType = this.data.wallet.walletType._id;
        this.formInit();
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
        this.store.dispatch(new CoreActions({loading: true}))
        if(this.data.wallet._id){
            this.walletService.updateWallet({
                _id: this.data.wallet._id,
                walletType: this.wallet.walletType,
                amount: currencyToNumber(this.walletForm.get('amount').value)  ,
                includeInTotal: this.walletForm.get('includeInTotal')?.value
            }).subscribe(() => {
                this.toastService.success("Cập nhật ví thành công");
                this.dialogRef.close({
                    isEditted: true
                });
                this.store.dispatch(new CoreActions({loading: false}));
            }, (err) => {
                this.store.dispatch(new CoreActions({loading: false}));
            })    
        }
        else {
            this.wallet = {
                ...this.wallet,
                ...this.walletForm.value,
                isDefault: 0,
                amount: currencyToNumber(this.walletForm.get('amount').value)
            }        
            this.walletService.saveWallet(this.wallet).subscribe((res: Wallet) => {
                this.toastService.success("Thêm ví thành công");
                this.dialogRef.close({
                    isEditted: true
                });
                this.store.dispatch(new CoreActions({loading: false}));
            }, (err) => {
                this.store.dispatch(new CoreActions({loading: false}));
            })
        }
    }

    formInit(){
        this.walletForm = this.fb.group({
            includeInTotal: [this.wallet.includeInTotal == 1],
            amount: [this.wallet.amount, validators.validateCurrency]
        })
    }
}