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
        @Inject(MAT_DIALOG_DATA) public selected: Partial<SelectedWallet>,
        private ref: MatDialogRef<WalletSelectComponent>,
        private walletService: WalletService
    ) { }

    ngOnInit() { 
        this.getDataWallets();
    }

    title: string = "Chọn chủng loại";
    search: string = "";
    wallets: Wallet[] = [];

    select(wallet: Wallet){
        this.ref.close(wallet);
    }

    getDataWallets() {
        this.walletService.getListWallets({ search: this.search }).subscribe(res => {
            this.wallets = [...res];
        })
    }
}