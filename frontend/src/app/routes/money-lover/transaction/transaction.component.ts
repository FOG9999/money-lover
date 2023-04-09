import { Component, OnDestroy, OnInit } from '@angular/core';
import { Category } from 'app/model/category.model';
import { Wallet } from 'app/model/wallet.model';
import { CommonService } from '../common/common.service';
import { WalletService } from '../user-wallet/user-wallet.service';
import { takeUntil, Subject, timer } from 'rxjs';
import { Transaction } from 'app/model/transaction.model';
import { formatNumber, randomString } from '@shared';
import { ChartComponent } from 'ng-apexcharts';
import { ChartOptions } from 'app/model/chart-option';

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
            this.getInOutcomeChartData();
            this.getOutcomeChartData();
            this.getIncomeChartData();
        })
    }

    listMonthTabs: MonthTab[] = [];
    selectedMonthTab: MonthTab;
    selectedIndex: number | null = 1;
    listCategories: Category[] = [];
    listWallets: Wallet[] = [];
    listTransactions: Transaction[] = [];
    inOutcomeChartOptions: Partial<ChartOptions> = {
        labels: ["Thu nhập", "Tiêu thụ"],
        chart: {
            type: "pie"
        }
    };
    outcomeChartOptions: Partial<ChartOptions> = {
        chart: {
            type: "pie"
        }
    }
    incomeChartOptions: Partial<ChartOptions> = {
        chart: {
            type: "pie"
        }
    }

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
                .map(tran => ({ val: tran.amount, cateId: tran.category._id }))
                .reduce((preTran, tran) => ({ val: tran.val + preTran.val, cateId: tran.cateId }))
                .val.toString()
        )
    }

    getListTransactionOfOneCategory(category: Category) {
        return this.listTransactions
            .filter(tran => tran.category._id === category._id && tran.dateCreated >= this.selectedMonthTab.from && tran.dateCreated <= this.selectedMonthTab.to)
    }

    formatNumber(text: number) {
        return formatNumber(text.toString());
    }

    changeTab(selectedTabIndex: number) {
        this.selectedMonthTab = this.listMonthTabs[selectedTabIndex];
        this.refreshMonthTabs();
        this.getInOutcomeChartData();
        this.getOutcomeChartData();
        this.getIncomeChartData();
    }

    getInOutcomeChartData() {
        let income =
            this.listTransactions
                .filter(tran =>
                    tran.dateCreated >= this.selectedMonthTab.from && tran.dateCreated <= this.selectedMonthTab.to && tran.category.transactionType == 1
                ).reduce((pre, curr) => ({ amount: curr.amount + pre.amount })).amount;
        let outcome =
            this.listTransactions
                .filter(tran =>
                    tran.dateCreated >= this.selectedMonthTab.from && tran.dateCreated <= this.selectedMonthTab.to && tran.category.transactionType == 0
                ).reduce((pre, curr) => ({ amount: curr.amount + pre.amount })).amount;
        this.inOutcomeChartOptions = {
            ...this.inOutcomeChartOptions,
            series: [income, outcome]
        }
    }

    getOutcomeChartData() {
        let outcomeArr =
            this.listTransactions
                .filter(tran =>
                    tran.dateCreated >= this.selectedMonthTab.from && tran.dateCreated <= this.selectedMonthTab.to && tran.category.transactionType == 0
                );
        let totalOutcome = outcomeArr.reduce((pre, curr) => ({
            amount: curr.amount + pre.amount
        })).amount;
        let labels = [];
        outcomeArr.forEach((tran) => {
            if(labels.indexOf(tran.category.name) < 0){
                labels.push(tran.category.name);
            }
        })
        let series = [];
        labels.forEach((label, ind) => {
            let amount = outcomeArr.filter(tran => tran.category.name == label).reduce((pre, curr) => ({amount: curr.amount + pre.amount})).amount;
            series.push(parseFloat((amount/totalOutcome*100).toFixed(2)));
        });
        this.outcomeChartOptions = {
            ...this.outcomeChartOptions,
            labels,
            series
        }
    }

    getIncomeChartData(){
        let incomeArr =
            this.listTransactions
                .filter(tran =>
                    tran.dateCreated >= this.selectedMonthTab.from && tran.dateCreated <= this.selectedMonthTab.to && tran.category.transactionType == 1
                );
        let totalIncome = incomeArr.reduce((pre, curr) => ({
            amount: curr.amount + pre.amount
        })).amount;
        let labels = [];
        incomeArr.forEach((tran) => {
            if(labels.indexOf(tran.category.name) < 0){
                labels.push(tran.category.name);
            }
        })
        let series = [];
        labels.forEach((label, ind) => {
            let amount = incomeArr.filter(tran => tran.category.name == label).reduce((pre, curr) => ({amount: curr.amount + pre.amount})).amount;
            series.push(parseFloat((amount/totalIncome*100).toFixed(2)));
        });
        this.incomeChartOptions = {
            ...this.outcomeChartOptions,
            labels,
            series
        }
    }

    generateData() {
        let randomDate = () => new Date((Math.round(Math.random() * (new Date().getTime() - new Date(2023, 2, 1).getTime())) + new Date(2023, 2, 1).getTime()));
        let tempList = [];
        let lessCategories = this.listCategories.slice(0, 10);
        for (let i = 0; i < 100; i++) {
            let transaction: Transaction = {
                _id: Math.round(Math.random() * 100000).toString(),
                amount: Math.round(Math.random() * 1000) * 1000,
                wallet: this.listWallets[Math.round(Math.random())],
                budget: null,
                category: lessCategories[Math.round(Math.random() * (lessCategories.length - 1))],
                dateCreated: randomDate(),
                note: randomString()
            }
            tempList.push(transaction);
        }
        this.listTransactions = [...tempList];
    }
}