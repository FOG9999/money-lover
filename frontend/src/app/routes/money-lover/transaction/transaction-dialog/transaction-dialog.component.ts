import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CONSTS, Mode } from 'app/consts';
import { NewTransaction, Transaction } from 'app/model/transaction.model';
import { Wallet } from 'app/model/wallet.model';
import { TransactionService } from '../transaction.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WalletSelectComponent } from '../../wallet-select/wallet-select.component';
import { CategorySelectComponent } from '../../category-select/category-select.component';

@Component({
    selector: 'transaction-dialog',
    templateUrl: 'transaction-dialog.component.html',
    styleUrls: ['../transaction.component.scss', 'transaction-dialog.component.scss']
})

export class TransactionDialogComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { id?: string },
        private transactionService: TransactionService,
        private dialogService: MatDialog,
        private dialogRef: MatDialogRef<TransactionDialogComponent>
    ) { }

    ngOnInit() {
        // update
        if(this.data && this.data.id){
            this.transactionService.getTransaction(this.data.id).subscribe(res => {
                this.transaction = res;
                this.transactionForm.setValue({
                    amount: res.amount,
                    note: res.note
                })
            }, (err) => {
                console.error(err);
                this.close("Lỗi lấy thông tin giao dịch");
            })
        }
        // create
        else {
            this.transaction = {
                category: {
                    icon: {
                        path: CONSTS.icon_not_selected
                    },
                    name: "Chọn chủng loại"
                },
                wallet: {
                    walletType: {
                        icon: {
                            path: CONSTS.icon_not_selected
                        },
                        name: "Chọn ví"
                    },
                    amount: 0                    
                }
            }
        }
    }

    transaction: Partial<Transaction>;
    title: string = "Chỉnh sửa giao dịch";
    transactionForm: FormGroup = new FormGroup({
        amount: new FormControl('0', Validators.required),
        note: new FormControl('')
    });

    close(msg?: string){
        this.dialogRef.close(msg);
    }

    getCurrentData(): NewTransaction{
        return {
            ...this.transaction,
            ...this.transactionForm.value,
        }
    }

    save(){
        console.log(this.getCurrentData())
    }

    isValid(){
        if(this.transaction){
            if(this.transaction.wallet.walletType.icon.path !== CONSTS.icon_not_selected && this.transaction.category.icon.path !== CONSTS.icon_not_selected && this.transactionForm.valid){
                return true;
            }
            else return false;
        }
        else return false;
    }

    openSelectWallet(){
        const ref = this.dialogService.open(WalletSelectComponent, {
            data: {
                walletId: this.transaction.wallet._id
            },
            width: '400px'
        })
        ref.afterClosed().subscribe(res => {
            if(res){
                this.transaction = {
                    ...this.transaction,
                    wallet: {
                        ...res
                    }
                }
            }
        })
    }

    openSelectCategory(){
        const ref = this.dialogService.open(CategorySelectComponent, {
            data: {
                categoryId: this.transaction.category._id
            },
            width: '400px'
        })
        ref.afterClosed().subscribe(res => {
            if(res){
                this.transaction = {
                    ...this.transaction,
                    category: {
                        ...res
                    }
                }
            }
        })
    }
}