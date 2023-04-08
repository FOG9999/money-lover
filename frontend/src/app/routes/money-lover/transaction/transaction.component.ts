import { Component, OnDestroy, OnInit } from '@angular/core';
import { Category } from 'app/model/category.model';
import { Wallet } from 'app/model/wallet.model';
import { CommonService } from '../common/common.service';
import { WalletService } from '../user-wallet/user-wallet.service';
import { takeUntil, Subject, timer } from 'rxjs';
import { Transaction } from 'app/model/transaction.model';
import { formatNumber, randomString } from '@shared';

interface MonthTab {
    from: Date,
    to: Date,
    title: string,
    isActive?: boolean
}

@Component({
    selector: 'transaction-list',
    templateUrl: 'transaction.component.html',
    styleUrls: ['transaction.component.scss']
})

export class TransactionListComponent implements OnInit, OnDestroy {
    constructor(
        private commonSv: CommonService,
        private walletSv: WalletService
    ) { }

    private onDestroy$: Subject<boolean> = new Subject<boolean>();

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    ngOnInit() {
        this.initMonthTabs();
        this.getOtherDataList();
        timer(2000).subscribe(() => {
            this.generateData();
        })
    }

    listMonthTabs: MonthTab[] = [];
    selectedMonthTab: MonthTab;
    selectedIndex: number | null = 1;
    listCategories: Category[] = [];
    listWallets: Wallet[] = [];
    listTransactions: Transaction[] = [];

    /**
     * create month tabs based on current time
     */
    initMonthTabs() {
        let currentTime = new Date();
        let thisMonth: MonthTab = {
            from: new Date(currentTime.getFullYear(), currentTime.getMonth(), 1),
            to: new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0),
            title: "Tháng này",
            isActive: true
        }
        this.selectedMonthTab = {
            ...thisMonth
        };
        this.refreshMonthTabs();
    }

    /**
     * reset 2 tab beside of selected month tab
     */
    refreshMonthTabs() {
        let selectedMonth = this.selectedMonthTab.from.getMonth();
        let selectedYear = this.selectedMonthTab.from.getFullYear();
        let currentMonth = new Date().getMonth();
        let from = new Date(selectedYear, selectedMonth - 1, 1);
        let to = new Date(selectedYear, selectedMonth + 1, 0);
        let previousMonth: MonthTab = {
            from,
            to,
            title: selectedMonth == currentMonth ? "Tháng trước" : `${from.toLocaleDateString('vi-VN')} - ${to.toLocaleDateString('vi-VN')}`
        }
        let nextFrom = new Date(selectedYear, selectedMonth + 1, 1);
        let nextTo = new Date(selectedYear, selectedMonth + 2, 0);
        let nextMonth: MonthTab = {
            from: nextFrom,
            to: nextTo,
            title: selectedMonth == currentMonth ? "Tháng sau" : `${nextFrom.toLocaleDateString('vi-VN')} - ${nextTo.toLocaleDateString('vi-VN')}`
        }
        this.listMonthTabs = [
            previousMonth,
            this.selectedMonthTab,
            nextMonth
        ]
    }

    /**
     * get list other data
     */
    getOtherDataList() {
        this.commonSv.getListCategories({ search: "" })
            .pipe(
                takeUntil(this.onDestroy$)
            ).subscribe(data => {
                this.listCategories = [...data];
            });
        this.walletSv.getListWallets({}).pipe(
            takeUntil(this.onDestroy$)
        ).subscribe(res => {
            this.listWallets = [...res];
        })
    }

    /**
     * check if current category has any transactions on current list
     */
    checkIfCategoryHasData(category: Category): boolean {
        return this.getListTransactionOfOneCategory(category)
            .filter(tran => tran.category._id === category._id)
            .length > 0
    }

    getTotalValueInOneCategory(category: Category) {
        return formatNumber(
                this.getListTransactionOfOneCategory(category)
                .map(tran => ({val: tran.amount, cateId: tran.category._id}))
                .reduce((preTran, tran) => ({ val: tran.val + preTran.val, cateId: tran.cateId }))
                .val.toString()
            )
    }

    getListTransactionOfOneCategory(category: Category) {
        return this.listTransactions
            .filter(tran => tran.category._id === category._id && tran.dateCreated >= this.selectedMonthTab.from && tran.dateCreated <= this.selectedMonthTab.to)
    }

    formatNumber(text: number){
        return formatNumber(text.toString());
    }

    changeTab(selectedTabIndex: number){
        this.selectedMonthTab = this.listMonthTabs[selectedTabIndex];
        this.refreshMonthTabs();
    }

    generateData() {
        let randomDate = () => new Date((Math.round(Math.random() * (new Date().getTime() - new Date(2023, 2, 1).getTime())) + new Date(2023, 2, 1).getTime()));
        let tempList = [];
        for (let i = 0; i < 100; i++) {
            let transaction: Transaction = {
                _id: Math.round(Math.random() * 100000).toString(),
                amount: Math.round(Math.random() * 1000) * 1000,
                wallet: this.listWallets[Math.round(Math.random())],
                budget: null,
                category: this.listCategories[Math.round(Math.random() * (this.listCategories.length - 1))],
                dateCreated: randomDate(),
                note: randomString()
            }
            tempList.push(transaction);
        }
        this.listTransactions = [...tempList];
        console.log(tempList);
    }
}