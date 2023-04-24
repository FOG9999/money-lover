import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Transaction } from 'app/model/transaction.model';
import { TransactionDialogComponent } from '../transaction-dialog/transaction-dialog.component';
import { TransactionService } from '../transaction.service';
import { formatNumber } from '@shared';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeletionComponent } from '@shared/components/money-lover/confirm-deletion/confirm-deletion.component';

@Component({
    selector: 'transaction-view',
    templateUrl: 'transaction-view.component.html'
})

export class TransactionViewComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { id?: string },
        private transactionService: TransactionService,
        private dialogService: MatDialog,
        private dialogRef: MatDialogRef<TransactionDialogComponent>,
        private toastService: ToastrService
    ) { }

    ngOnInit() { 
        if(this.data && this.data.id){
            this.getTransaction();
        }
    }

    transaction: Partial<Transaction>;
    title: string = "Xem chi tiết giao dịch";
    formatNumber = formatNumber;
    /**
     * check if this transaction editted or deleted or not to reload when close view dialog
     */
    isEditted: boolean = false;

    /**
     * close current dialog
     * @param msg string if having error; obj when successful
     */
    close(msg?: string){
        if(!this.isEditted){
            this.dialogRef.close(msg);
        }
        else {
            this.dialogRef.close({isEditted: this.isEditted})
        }
    }

    getTransaction(){
        this.transactionService.getTransaction(this.data.id).subscribe(res => {
            this.transaction = {
                ...res,
                dateCreated: new Date(res.dateCreated)
            };
        }, (err) => {
            console.error(err);
            this.isEditted = false;
            this.close("Lỗi lấy thông tin giao dịch");
        })
    }

    edit(){
        const ref = this.dialogService.open(TransactionDialogComponent, {
            data: {
                id: this.data.id
            },
            width: '400px'
        })
        ref.afterClosed().subscribe(res => {
            if(typeof res == 'string'){
                this.toastService.error(res);
            }
            else if(res && res.msg) {
                this.toastService.success(res.msg);
                this.getTransaction();
                this.isEditted = true;
            }
            else {
                console.log(res)
            }
        })
    }

    deleteTransaction(){
        const ref = this.dialogService.open(ConfirmDeletionComponent, {
            data: {
                message: "Xóa giao dịch này?",
                title: "Xác nhận xóa"
            }
        });
        ref.afterClosed().subscribe((isConfirmed: boolean | undefined) => {
            if(isConfirmed){
                this.transactionService.deleteTransaction(this.data.id).subscribe(res => {
                    this.isEditted = true;
                    this.toastService.success("Xóa giao dịch thành công");
                    this.close();
                }, (er) =>{
                    this.toastService.error("Xóa giao dịch thất bại");
                })
            }
        })
    }
}