import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Category } from 'app/model/category.model';
import { Wallet } from 'app/model/wallet.model';
import { Transaction } from 'app/model/transaction.model';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../common/common.service';
import { WalletDialogComponent } from './user-wallet-dialog.component';
import { WalletService } from './user-wallet.service';
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
        private dialog: MatDialog
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
            setTimeout(() => {
                this.generateFakeData();
            })
        })
    }

    generateFakeData() {
        let listTransactions: Transaction[] = [];
        for (let i = 0; i < 100; i++) {
            let categoryIndex = Math.floor(Math.random() * this.listCategories.length);
            let amount = Math.round(Math.random() * 1000) * 1000;
            let firstDayLastMonth = Date.now() - 2 * 30 * 24 * 60 * 60 * 1000;
            let dateCreated = this.generateFakeDate(firstDayLastMonth, Date.now());
            listTransactions.push({
                amount,
                dateCreated,
                category: this.listCategories[categoryIndex]
            })
        }
        console.log(listTransactions);        
    }

    generateFakeDate(fromDateTime: number, toDateTime: number): Date {
        let toDateTimeRandom = Math.round(Math.random() * (toDateTime - fromDateTime)) + fromDateTime;
        return new Date(toDateTimeRandom);
    }
}