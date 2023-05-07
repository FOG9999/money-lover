import { Component, OnDestroy, OnInit } from '@angular/core';
import { FileExtension, InvalidFile } from 'app/consts';
import { ToastrService } from 'ngx-toastr';
import { TransactionService } from '../transaction.service';
import { Category } from 'app/model/category.model';
import { TransactionImport } from 'app/model/transaction.model';
import { formatNumber, randomString } from '@shared';
import { CommonService } from '../../common/common.service';
import { Subject, takeUntil } from 'rxjs';

interface MonthTab {
    from: Date,
    to: Date,
    title: string,
    isActive?: boolean
}

@Component({
    selector: 'transaction-import',
    templateUrl: 'transaction-import.component.html',
    styleUrls: ['../transaction.component.scss']
})

export class TransactionImportComponent implements OnInit, OnDestroy {
    constructor(
        private toastService: ToastrService,
        private transactionService: TransactionService,
        private commonSv: CommonService,
    ) { }

    ngOnInit() { 
        this.getOtherDataList()
    }

    private onDestroy$: Subject<boolean> = new Subject<boolean>();

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    allowTypes: FileExtension[] = [
        "csv",
        "xls",
        "xlsx"
    ];
    fileInfos: [];
    loading: boolean = false;

    onUploadFiles(files: FileList){
        this.loading = true;
        this.transactionService.readImportFile(files.item(0)).subscribe(res => {
            this.rawTransactions = res.map((tran) => {
                if(tran.dateCreatedObj){
                    tran.dateCreatedObj = new Date(tran.dateCreatedObj);
                }
                return tran;
            });
            this.initMonthTabs();
            this.getListDisplay()
            this.loading = false;
        })
    }

    onInvalidFiles(errors: {err: InvalidFile, fileName: string}){
        this.toastService.error(`File ${errors.fileName} cần phải có ${errors.err}`)
    }

    //#region copy from transaction list 
    listCategories: Category[] = [];
    /**
     * displaying list
     */
    listTransactions: TransactionImport[] = [];
    /**
     * all transactions from Money Lover report
     */
    rawTransactions: TransactionImport[] = [];

    /**
     * check if current category has any transactions on current list
     */
    checkIfCategoryHasData(category: Category): boolean {
        return this.getListTransactionOfOneCategory(category)
            .filter(tran => tran.CATEGORY && tran.CATEGORY._id === category._id)
            .length > 0
    }

    getTotalValueInOneCategory(category: Category) {
        return formatNumber(
            this.getListTransactionOfOneCategory(category)
                .map(tran => ({ val: tran.AMOUNT, cateId: tran.CATEGORY._id }))
                .reduce((preTran, tran) => ({ val: tran.val + preTran.val, cateId: tran.cateId }), {val: 0})
                .val.toString()
        )
    }

    getListTransactionOfOneCategory(category: Category) {
        return this.listTransactions
            .filter(tran => tran.CATEGORY && tran.CATEGORY._id === category._id)
    }

    formatNumber(text: number) {
        return formatNumber(text.toString());
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
    }
    selectedIndex: number | null = 1;    
    
    changeTab(selectedTabIndex: number) {
        this.selectedMonthTab = this.listMonthTabs[selectedTabIndex];
        this.refreshMonthTabs();
        this.getListDisplay()
    }

    getListDisplay(){
        this.listTransactions = this.rawTransactions.filter(tran => tran.dateCreatedObj >= this.selectedMonthTab.from && tran.dateCreatedObj <= this.selectedMonthTab.to)
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
    selectedMonthTab: MonthTab;

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

    listMonthTabs: MonthTab[] = [];
    //#endregion
}