import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CONSTS } from 'app/consts';
import { NewTransaction, Transaction } from 'app/model/transaction.model';
import { TransactionService } from '../transaction.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WalletSelectComponent } from '../../wallet-select/wallet-select.component';
import { CategorySelectComponent } from '../../category-select/category-select.component';
import { currencyToNumber } from '@shared';

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
                    note: res.note,
                    dateCreated: new Date(res.dateCreated)
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
        note: new FormControl(''),
        dateCreated: new FormControl(new Date(), Validators.required)
    });

    /**
     * close current dialog
     * @param msg string if having error; obj when successful
     */
    close(msg?: string | {msg: string}){
        this.dialogRef.close(msg);
    }

    getCurrentData(): NewTransaction{
        return {
            _id: this.transaction._id ? this.transaction._id: '',
            budget: null,
            dateCreated: new Date(this.transactionForm.get('dateCreated').value),
            amount: currencyToNumber(this.transactionForm.get('amount').value),
            note: this.transactionForm.get('note').value,
            category: this.transaction.category._id,
            wallet: this.transaction.wallet._id
        }
    }

    save(){
        console.log(this.getCurrentData())
        if(this.data && this.data.id){
            this.transactionService.updateTransaction(this.getCurrentData())
            .subscribe(res => {
                console.log(res);
                this.close({msg: "Cập nhật giao dịch thành công"})
            }, err => {
                console.error(err);
                this.close("Cập nhật giao dịch thất bại");
            })
        }
        else {
            this.transactionService.createTransaction(this.getCurrentData())
            .subscribe(res => {
                console.log(res);
                this.close({msg: "Thêm giao dịch thành công"})
            }, err => {
                console.error(err);
                this.close("Thêm giao dịch thất bại");
            })
        }
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

    clearFormControl(name: string){
        this.transactionForm.get(name).setValue(null);
    }
}