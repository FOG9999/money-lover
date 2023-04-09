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
            this.updateCharts();
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
        },
        colors: ["#039be5", "#e51c23"],
        tooltip: {
            y: {
                formatter: (val) => {
                    return formatNumber(val.toString())
                }
            }
        }
    };
    outcomeChartOptions: Partial<ChartOptions> = {
        chart: {
            type: "pie"
        },
        tooltip: {
            y: {
                formatter: (val) => {
                    return val + '%'
                }
            }
        }
    }
    incomeChartOptions: Partial<ChartOptions> = {
        chart: {
            type: "pie"
        },
        tooltip: {
            y: {
                formatter: (val) => {
                    return val + '%'
                }
            }
        }
    }

    /**
     * create month tabs based on current time
     */
    private initMonthTabs() {
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
     * reset tab list
     */
    private refreshMonthTabs() {
        let selectedMonth = this.selectedMonthTab.from.getMonth();
        let selectedYear = this.selectedMonthTab.from.getFullYear();
        let from = new Date(selectedYear, selectedMonth - 1, 1);
        let to = new Date(selectedYear, selectedMonth, 0);
        let previousMonth: MonthTab = {
            from,
            to,
            title: `${from.toLocaleDateString('vi-VN')} - ${to.toLocaleDateString('vi-VN')}`
        }
        let nextFrom = new Date(selectedYear, selectedMonth + 1, 1);
        let nextTo = new Date(selectedYear, selectedMonth + 2, 0);
        let nextMonth: MonthTab = {
            from: nextFrom,
            to: nextTo,
            title: `${nextFrom.toLocaleDateString('vi-VN')} - ${nextTo.toLocaleDateString('vi-VN')}`
        }
        let listMonthTabs = [
            previousMonth,
            this.selectedMonthTab,
            nextMonth
        ]
        this.updateTabTitles(listMonthTabs);
    }

    /**
     * reset title to vietnamese if it's current month, next month or previous month
     */
    private updateTabTitles(listMonthTabs: MonthTab[]){
        let currentMonth = new Date().getMonth();
        let currentYear = new Date().getFullYear();
        listMonthTabs.forEach(tab => {
            if(tab.from.getMonth() == currentMonth && tab.from.getFullYear() == currentYear){
                tab.title = "Tháng này"
            }
            else if(
                (tab.from.getMonth() == currentMonth - 1 && tab.from.getFullYear() == currentYear)  || 
                (tab.from.getMonth() == 11 && tab.from.getFullYear() == currentYear-1)
            ){
                tab.title = "Tháng trước"
            }
            else if(
                (tab.from.getMonth() == currentMonth + 1 && tab.from.getFullYear() == currentYear)  || 
                (tab.from.getMonth() == 0 && tab.from.getFullYear() == currentYear+1)
            ){
                tab.title = "Tháng sau"
            }
        });
        this.listMonthTabs = [
            ...listMonthTabs
        ]
    }

    /**
     * get list other data
     */
    private getOtherDataList() {
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
                .reduce((preTran, tran) => ({ val: tran.val + preTran.val, cateId: tran.cateId }), {val: 0})
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
        this.updateCharts();        
    }

    private getInOutcomeChartData() {
        let income =
            this.listTransactions
                .filter(tran =>
                    tran.dateCreated >= this.selectedMonthTab.from && tran.dateCreated <= this.selectedMonthTab.to && tran.category.transactionType == 1
                ).reduce((pre, curr) => ({ amount: curr.amount + pre.amount }), {amount: 0}).amount;
        let outcome =
            this.listTransactions
                .filter(tran =>
                    tran.dateCreated >= this.selectedMonthTab.from && tran.dateCreated <= this.selectedMonthTab.to && tran.category.transactionType == 0
                ).reduce((pre, curr) => ({ amount: curr.amount + pre.amount }), {amount: 0}).amount;
        this.inOutcomeChartOptions = {
            ...this.inOutcomeChartOptions,
            series: [income, outcome]
        }
    }

    private getOutcomeChartData() {
        let outcomeArr =
            this.listTransactions
                .filter(tran =>
                    tran.dateCreated >= this.selectedMonthTab.from && tran.dateCreated <= this.selectedMonthTab.to && tran.category.transactionType == 0
                );
        let totalOutcome = outcomeArr.reduce((pre, curr) => ({
            amount: curr.amount + pre.amount
        }), {amount: 0}).amount;
        let labels = [];
        outcomeArr.forEach((tran) => {
            if(labels.indexOf(tran.category.name) < 0){
                labels.push(tran.category.name);
            }
        })
        let series = [];
        labels.forEach((label, ind) => {
            let amount = outcomeArr.filter(tran => tran.category.name == label).reduce((pre, curr) => ({amount: curr.amount + pre.amount}), {amount: 0}).amount;
            series.push(parseFloat((amount/totalOutcome*100).toFixed(2)));
        });
        this.outcomeChartOptions = {
            ...this.outcomeChartOptions,
            labels,
            series
        }
    }

    private getIncomeChartData(){
        let incomeArr =
            this.listTransactions
                .filter(tran =>
                    tran.dateCreated >= this.selectedMonthTab.from && tran.dateCreated <= this.selectedMonthTab.to && tran.category.transactionType == 1
                );
        let totalIncome = incomeArr.reduce((pre, curr) => ({
            amount: curr.amount + pre.amount
        }), {amount: 0}).amount;
        let labels = [];
        incomeArr.forEach((tran) => {
            if(labels.indexOf(tran.category.name) < 0){
                labels.push(tran.category.name);
            }
        })
        let series = [];
        labels.forEach((label, ind) => {
            let amount = incomeArr.filter(tran => tran.category.name == label).reduce((pre, curr) => ({amount: curr.amount + pre.amount}), {amount: 0}).amount;
            series.push(parseFloat((amount/totalIncome*100).toFixed(2)));
        });
        this.incomeChartOptions = {
            ...this.outcomeChartOptions,
            labels,
            series
        }
    }

    private updateCharts(){
        this.getInOutcomeChartData();
        this.getOutcomeChartData();
        this.getIncomeChartData();
    }

    generateData() {
        let randomDate = () => new Date((Math.round(Math.random() * (new Date().getTime() - new Date(2023, 0, 1).getTime())) + new Date(2023, 0, 1).getTime()));
        let tempList = [];
        let lessCategories = this.listCategories.slice(0, 10);
        for (let i = 0; i < 50; i++) {
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