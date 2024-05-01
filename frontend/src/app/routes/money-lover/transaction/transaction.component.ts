import { Component, OnDestroy, OnInit } from '@angular/core';
import { Category } from 'app/model/category.model';
import { Wallet } from 'app/model/wallet.model';
import { CommonService } from '../common/common.service';
import { WalletService } from '../user-wallet/user-wallet.service';
import { takeUntil, Subject } from 'rxjs';
import { Transaction } from 'app/model/transaction.model';
import { formatNumber } from '@shared';
import { ChartOptions, NoDataChart } from 'app/model/chart-option';
import { TransactionService } from './transaction.service';
import { MatDialog } from '@angular/material/dialog';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { TransactionViewComponent } from './transaction-view/transaction-view.component';
import { INCOME_COLOR, OUTCOME_COLOR } from 'app/my-ml-consts';
import * as moment from "moment";
import { CalendarRangeComponent } from '@shared/components/calendar-range/calendar-range.component';

type FilterChartType = "inoutcome" | "income" | "outcome";
type FilterChartDateOption = "this-week" | "this-month" | "this-year" | "custom" | "last-month";

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
            type: "pie",
            height: 400
        },
        colors: [INCOME_COLOR, OUTCOME_COLOR],
        tooltip: {
            y: {
                formatter: (val) => {
                    return formatNumber(val.toString())
                }
            }
        },
        noData: {
            ...NoDataChart
        },
        legend: {
            show: true,            
            position: 'bottom',
        }
    };
    totalOutcome: number = 0;
    outcomeChartOptions: Partial<ChartOptions> = {
        chart: {
            type: "pie",
            height: 400
        },
        noData: {
            ...NoDataChart
        },
        legend: {
            show: true,            
            position: 'bottom',
        }
    }
    totalIncome: number = 0;
    incomeChartOptions: Partial<ChartOptions> = {
        chart: {
            type: "pie",
            height: 400
        },
        noData: {
            ...NoDataChart
        },
        legend: {
            show: true,            
            position: 'bottom',
        }
    }
    timeFromInoutcome: Date = moment().startOf("month").toDate();
    timeToInoutcome: Date = moment().endOf("month").toDate();
    timeFromIncome: Date = moment().startOf("month").toDate();
    timeToIncome: Date = moment().endOf("month").toDate();
    timeFromOutcome: Date = moment().startOf("month").toDate();
    timeToOutcome: Date = moment().endOf("month").toDate();
    selectedFilterOptionInoutcome = "this-month";
    selectedFilterOptionOutcome = "this-month";
    selectedFilterOptionIncome = "this-month";
    selectedChart: FilterChartType = 'inoutcome';
    noDataInoutcome: boolean = false;
    noDataOutcome: boolean = false;
    noDataIncome: boolean = false;

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
        const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));
        listMonthTabs.forEach(tab => {
            if(tab.from.getMonth() == currentMonth && tab.from.getFullYear() == currentYear){
                tab.title = "Tháng này"
            }
            else if(moment(tab.from).diff(startOfToday, "months") == -1){                
                tab.title = "Tháng trước";
            } 
            else if(moment(tab.to).diff(startOfToday, "months") == 1){
                tab.title = "Tháng sau";
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
        this.commonSv.getListCategories("").subscribe(data => {
                this.listCategories = [...data.results];
            });
        this.walletSv.getListWallets({}).subscribe(res => {
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

    private getInOutcomeChartData(listData: Partial<Transaction>[]) {
        this.noDataInoutcome = !listData.length;
        if(!listData.length){
            return;
        }
        let income =
            listData
                .filter(tran =>
                    tran.category.transactionType == 1
                ).reduce((pre, curr) => ({ amount: curr.amount + pre.amount }), {amount: 0}).amount;
        let outcome =
            listData
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
            series,
            tooltip: {
                y: {
                    formatter: (val, { series, seriesIndex, dataPointIndex, w }) => {
                        return `${formatNumber(val.toString())}đ (${(val/(income+outcome)*100).toFixed(2) + '%'})`
                    }
                }
            }
        }
    }

    private getOutcomeChartData(listData: Partial<Transaction>[]) {
        this.noDataOutcome = !listData.length;
        if(!listData.length){
            return;
        }
        let outcomeArr =
            listData
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
                        return `${formatNumber(val.toString())}đ (${(val/totalOutcome*100).toFixed(2) + '%'})`
                    }
                }
            }
        }
    }

    private getIncomeChartData(listData: Partial<Transaction>[]){
        this.noDataIncome = !listData.length;
        if(!listData.length){
            return;
        }
        let incomeArr =
            listData
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
            series.push(amount);
        });
        this.totalIncome = totalIncome;
        this.incomeChartOptions = {
            ...this.outcomeChartOptions,
            labels,
            series,
            tooltip: {
                y: {
                    formatter: (val, { series, seriesIndex, dataPointIndex, w }) => {
                        return `${formatNumber(val.toString())}đ (${(val/totalIncome*100).toFixed(2) + '%'})`
                    }
                }
            }
        }
    }

    private getListTransaction(){
        this.loading = true;
        this.transactionService.getListData({
            from: this.selectedMonthTab.from,
            to: new Date(new Date(this.selectedMonthTab.to).setHours(23, 59, 59, 999))
        }).subscribe(list => {
            this.listTransactions = this.transformListTransaction(list);
            this.reloadAllChartsWithCurrentParams();
            this.loading = false;
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
            if(res && res.isEditted){
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

    transformListTransaction(list: Partial<Transaction>[]){
        return list.map((tran) => {
            if(tran.dateCreated){
                tran.dateCreatedObj = new Date(tran.dateCreated);
            }
            if(tran.dateUpdated){
                tran.dateUpdatedObj = new Date(tran.dateUpdated);
            }
            return tran;
        });
    }

    reloadAllChartsWithCurrentParams(){
        this.reloadChartWithCurrentParams('inoutcome', this.timeFromInoutcome, this.timeToInoutcome);
        this.reloadChartWithCurrentParams('outcome', this.timeFromOutcome, this.timeToOutcome);
        this.reloadChartWithCurrentParams('income', this.timeFromIncome, this.timeToIncome);
    }

    reloadChartWithCurrentParams(chartType: FilterChartType, from: Date, to: Date){
        this.transactionService.getListData({ from , to }).subscribe(list => {
            list = this.transformListTransaction(list);
            switch (chartType) {
                case 'inoutcome':
                    this.getInOutcomeChartData(list);
                    break;
                case 'income':
                    this.getIncomeChartData(list);
                    break;
                case 'outcome':
                    this.getOutcomeChartData(list);
                    break;
                default:
                    break;
            }
        })
    }

    filterChart(chartType: FilterChartType, dateType: FilterChartDateOption){
        let from: Date, to: Date;
        const momentDateNow = moment(new Date());
        const doSearch = () => {
            this.transactionService.getListData({ from , to }).subscribe(list => {
                list = list.map((tran) => {
                    if(tran.dateCreated){
                        tran.dateCreatedObj = new Date(tran.dateCreated);
                    }
                    if(tran.dateUpdated){
                        tran.dateUpdatedObj = new Date(tran.dateUpdated);
                    }
                    return tran;
                });
                switch (chartType) {
                    case 'inoutcome':
                        this.timeFromInoutcome = from;
                        this.timeToInoutcome = to;
                        this.selectedFilterOptionInoutcome = dateType;
                        this.getInOutcomeChartData(list);
                        break;
                    case 'income':
                        this.timeFromIncome = from;
                        this.timeToIncome = to;
                        this.selectedFilterOptionIncome = dateType;
                        this.getIncomeChartData(list);
                        break;
                    case 'outcome':
                        this.timeFromOutcome = from;
                        this.timeToOutcome = to;
                        this.selectedFilterOptionOutcome = dateType;
                        this.getOutcomeChartData(list);
                        break;
                    default:
                        break;
                }
            })
        }
        switch (dateType) {
            case 'this-month':
                from = momentDateNow.startOf("month").toDate();
                to = momentDateNow.endOf('month').toDate();
                doSearch();
                break;
            case 'last-month':
                from = moment().subtract(1, "month").startOf("month").toDate();
                to = moment().subtract(1, "month").endOf('month').toDate();
                doSearch();
                break;
            case 'this-week':
                from = momentDateNow.startOf("week").toDate();
                to = momentDateNow.endOf('week').toDate();
                doSearch();
                break;
            case 'this-year':
                from = momentDateNow.startOf("year").toDate();
                to = momentDateNow.endOf('year').toDate();
                doSearch();
                break;
            default: // custom
                this.dialogService.open(CalendarRangeComponent, {
                    data: {
                        title: "Lựa chọn khoảng thời gian tìm kiếm",
                        timeFrom: chartType == 'inoutcome' ? this.timeFromInoutcome: (chartType == 'outcome' ? this.timeFromOutcome: this.timeFromIncome),
                        timeTo: chartType == 'inoutcome' ? this.timeToInoutcome: (chartType == 'outcome' ? this.timeToOutcome: this.timeToIncome),
                    }
                }).afterClosed().subscribe((filterObj?: { timeFrom: Date, timeTo: Date }) => {
                    if(filterObj){
                        from = filterObj.timeFrom;
                        to = filterObj.timeTo;
                        doSearch();
                    }
                })
                break;
        }
    }
}