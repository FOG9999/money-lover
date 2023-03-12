import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Category } from 'app/model/category.model';
import { Wallet } from 'app/model/wallet.model';
import { Transaction } from 'app/model/transaction.model';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../common/common.service';
import { WalletDialogComponent } from './user-wallet-dialog.component';
import { WalletService } from './user-wallet.service';
import { AppState } from 'app/app.state';
import { Store } from '@ngrx/store';
import { CoreActions } from '@core/store/core.actions';
@Component({
    selector: 'ml-user-wallet',
    templateUrl: 'user-wallet.component.html',
    styleUrls: ['./user-wallet.component.scss']
})

export class UserWalletComponent implements OnInit {
    constructor(
        private commonService: CommonService,
        private walletService: WalletService,
        private toastService: ToastrService,
        private dialog: MatDialog,
        private store: Store<AppState>
    ) { }

    listWallets: Wallet[] = [];
    listChecked: boolean[] = [];
    search: string = "";
    listCategories: Category[] = [];
    loading: boolean;

    walletDialogRef: MatDialogRef<WalletDialogComponent>;

    ngOnInit() {
        this.getListWallets();
        this.getDataCategories();
    }

    getListWallets() {
        this.walletService.getListWallets({ search: this.search })
            .subscribe(res => {
                this.listWallets = [...res];
                setTimeout(() => {
                    this.renewListChecked();
                });
            })
    }

    openAddWallet() {
        this.walletDialogRef = this.dialog.open(WalletDialogComponent, {
            data: {
                wallet: {
                    walletType: '',
                    amount: 0,
                    includeInTotal: false
                }
            }
        })
    }

    renewListChecked() {
        let tempChecked: boolean[] = [];
        for (let i = 0; i < this.listWallets.length; i++) {
            tempChecked.push(false);
        }
        this.listChecked = [...tempChecked];
    }

    getDataCategories() {
        this.commonService.getListCategories({ search: this.search }).subscribe(res => {
            this.listCategories = [...res];
        })
    }

    editWallet(id: string){
        this.store.dispatch(new CoreActions({loading: true}));
        this.walletService.getWallet(id).subscribe((wallet: Wallet) => {
            this.store.dispatch(new CoreActions({loading: false}));
            this.walletDialogRef = this.dialog.open(WalletDialogComponent, {
                data: {
                    wallet
                }
            })
        });
    }
}