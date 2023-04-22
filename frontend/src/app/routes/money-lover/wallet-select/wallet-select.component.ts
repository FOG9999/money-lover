import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Wallet } from 'app/model/wallet.model';
import { WalletService } from '../user-wallet/user-wallet.service';

interface SelectedWallet {
    walletId: string
}

@Component({
    selector: 'wallet-select',
    templateUrl: 'wallet-select.component.html'
})

export class WalletSelectComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Partial<SelectedWallet>,
        private ref: MatDialogRef<WalletSelectComponent>,
        private walletService: WalletService
    ) { }

    ngOnInit() { 
        this.getDataWallets();
    }

    title: string = "Chọn chủng loại";
    search: string = "";
    wallets: Wallet[] = [];
    selectedWallet: Partial<Wallet>;
    loading: boolean = false;

    select(wallet: Wallet){
        this.selectedWallet = wallet;
    }

    save(){
        this.ref.close(this.selectedWallet);
    }

    close(){
        this.ref.close();
    }

    getDataWallets() {
        this.loading = true;
        this.walletService.getListWallets({ search: this.search }).subscribe(res => {
            this.wallets = [...res];
            if(this.data && this.data.walletId){
                this.selectedWallet = res.find(x => x._id == this.data.walletId) ? res.find(x => x._id == this.data.walletId): {_id: ''}
            }
            else {
                this.selectedWallet = {
                    _id: ''
                }
            }
            this.loading = false;
        }, (err) => {
            this.loading = false;
        })
    }
}