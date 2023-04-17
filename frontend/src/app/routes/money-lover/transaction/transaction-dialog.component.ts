import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Mode } from 'app/consts';
import { NewTransaction, Transaction } from 'app/model/transaction.model';
import { Wallet } from 'app/model/wallet.model';

@Component({
    selector: 'transaction-dialog',
    templateUrl: 'transaction-dialog.component.html'
})

export class TransactionDialogComponent implements OnInit, OnChanges {
    constructor() { }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges): void {
        
    }

    model: Partial<NewTransaction> = {};
    transaction: Partial<Transaction> = {};
    wallet: Partial<Wallet> = {}
    @Input() mode: Mode = "create";
    id: string = "";
}