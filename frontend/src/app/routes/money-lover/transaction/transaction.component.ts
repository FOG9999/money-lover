import { Component, OnDestroy, OnInit } from '@angular/core';
import { Category } from 'app/model/category.model';
import { Wallet } from 'app/model/wallet.model';
import { CommonService } from '../common/common.service';
import { WalletService } from '../user-wallet/user-wallet.service';
import { takeUntil, Subject, timer } from 'rxjs';
import { Transaction } from 'app/model/transaction.model';
import { formatNumber, randomString } from '@shared';
import { ChartComponent } from 'ng-apexcharts';
import { ChartOptions, NoDataChart } from 'app/model/chart-option';
import { TransactionService } from './transaction.service';
import { MatDialog } from '@angular/material/dialog';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { TransactionViewComponent } from './transaction-view/transaction-view.component';

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
        private walletSv: WalletService,
        private transactionService: TransactionService,
        private dialogService: MatDialog,
        private toastService: ToastrService
    ) { }

    private onDestroy$: Subject<boolean> = new Subject<boolean>();

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    ngOnInit() {
        this.initMonthTabs();
        this.getOtherDataList();
        this.getListTransaction();
    }

    listMonthTabs: MonthTab[] = [];
    selectedMonthTab: MonthTab;
    selectedIndex: number | null = 1;
    listCategories: Category[] = [];
    listWallets: Wallet[] = [];
    listTransactions: Transaction[] = [];
    loading: boolean = false;
    inOutcomeChartLabels: string[] = ["Thu nhập", "Tiêu thụ"]
    inOutcomeChartOptions: Partial<ChartOptions> = {
        labels: [],
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
        },
        noData: {
            ...NoDataChart
        }
    };
    totalOutcome: number = 0;
    outcomeChartOptions: Partial<ChartOptions> = {
        chart: {
            type: "pie"
        },
        noData: {
            ...NoDataChart
        }
    }
    totalIncome: number = 0;
    incomeChartOptions: Partial<ChartOptions> = {
        chart: {
            type: "pie"
        },
        noData: {
            ...NoDataChart
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
        this.commonSv.getListCategories("")
            .pipe(
                takeUntil(this.onDestroy$)
            ).subscribe(data => {
                this.listCategories = [...data.results];
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
            .filter(tran => tran.category._id === category._id)
    }

    formatNumber(text: number) {
        return formatNumber(text.toString());
    }

    changeTab(selectedTabIndex: number) {
        this.selectedMonthTab = this.listMonthTabs[selectedTabIndex];
        this.refreshMonthTabs();
        this.getListTransaction();        
    }

    private getInOutcomeChartData() {
        let income =
            this.listTransactions
                .filter(tran =>
                    tran.category.transactionType == 1
                ).reduce((pre, curr) => ({ amount: curr.amount + pre.amount }), {amount: 0}).amount;
        let outcome =
            this.listTransactions
                .filter(tran =>
                    tran.category.transactionType == 0
                ).reduce((pre, curr) => ({ amount: curr.amount + pre.amount }), {amount: 0}).amount;
        let series = [], labels = [];
        if(income != 0 || outcome != 0){
            series = [income, outcome];
            labels = [...this.inOutcomeChartLabels]
        }
        this.inOutcomeChartOptions = {
            ...this.inOutcomeChartOptions,
            labels,
            series
        }
    }

    private getOutcomeChartData() {
        let outcomeArr =
            this.listTransactions
                .filter(tran =>
                    tran.category.transactionType == 0
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
            series.push(amount);
        });
        this.outcomeChartOptions = {
            ...this.outcomeChartOptions,
            labels,
            series,
            tooltip: {
                y: {
                    formatter: (val, { series, seriesIndex, dataPointIndex, w }) => {
                        return `${formatNumber(val.toString())} (${(val/totalOutcome*100).toFixed(2) + '%'})`
                    }
                }
            }
        }
    }

    private getIncomeChartData(){
        let incomeArr =
            this.listTransactions
                .filter(tran =>
                    tran.category.transactionType == 1
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
        this.totalIncome = totalIncome;
        this.incomeChartOptions = {
            ...this.outcomeChartOptions,
            labels,
            series,
            tooltip: {
                y: {
                    formatter: (val, { series, seriesIndex, dataPointIndex, w }) => {
                        return `${formatNumber(val.toString())} (${(val/totalIncome*100).toFixed(2) + '%'})`
                    }
                }
            }
        }
    }

    private updateCharts(){
        this.getInOutcomeChartData();
        this.getOutcomeChartData();
        this.getIncomeChartData();
    }

    private getListTransaction(){
        this.loading = true;
        this.transactionService.getListData({
            from: this.selectedMonthTab.from,
            to: this.selectedMonthTab.to
        }).subscribe(list => {
            this.listTransactions = list.map((tran) => {
                if(tran.dateCreated){
                    tran.dateCreatedObj = new Date(tran.dateCreated);
                }
                if(tran.dateUpdated){
                    tran.dateUpdatedObj = new Date(tran.dateUpdated);
                }
                return tran;
            });
            this.loading = false;
            this.updateCharts();
        }, (err) => {
            this.loading = false;
        })
    }

    /**
     * open view transaction dialog
     */
    viewTransaction(id: string){
        const ref = this.dialogService.open(TransactionViewComponent, {
            data: {
                id
            },
            width: '400px'
        });
        ref.afterClosed().subscribe(res => {
            if(typeof res == 'string'){
                this.toastService.error(res);
            }
            if(res.isEditted){
                this.getListTransaction();
            }
        })
    }

    /**
     * create transaction
     */
    createTransaction(){
        const ref = this.dialogService.open(TransactionDialogComponent, {
            width: '400px'
        });
        ref.afterClosed().subscribe(res => {
            if(typeof res == 'string'){
                this.toastService.error(res);
            }
            else if(res && res.msg) {
                this.toastService.success(res.msg);
                this.getListTransaction();
            }
            else {
                console.log(res)
            }
        })
    }
}