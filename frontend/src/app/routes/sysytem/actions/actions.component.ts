import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Action } from 'app/model/action.model';
import { CONSTS } from 'app/consts';
import { ConfirmDeletionComponent } from '@shared/components/confirm-deletion/confirm-deletion.component';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
import { ActionDialogComponent } from './action-dialog.component';
import { ActionService } from './action.service';

@Component({
    selector: 'actions',
    templateUrl: 'actions.component.html',
    styleUrls: ['actions.component.scss']
})

export class ActionMngComponent implements OnInit {
    constructor(
        private actionService: ActionService,
        private dialogService: MatDialog,
        private toast: ToastrService
    ) { }

    ngOnInit() { 
        this.searchActions()
    }

    listActions: Partial<Action>[] = [];
    searchKey: string = "";
    displayedColumns: string[] = ['checkbox', 'Tên hành động', 'Mã hành động', 'Mô tả', 'Ngày tạo', 'Trạng thái', 'Thao tác'];
    columnProps: string[] = ['checkbox', 'title','code', 'description', 'dateCreated', 'status', 'actions'];
    loading: boolean = false;
    listChecked: boolean[] = [];
    total: number = 0;
    pageSize: number = CONSTS.page_size;
    page: number = 0;
    isAllChecked: boolean = false;
    pageSizeOptions: number[] = CONSTS.page_size_options;

    getListActions(){
        this.actionService.getListActions(this.searchKey, this.page, this.pageSize).subscribe(res => {
            this.loading = false;
            this.listActions = res.results;
            this.total = res.total;
            this.resetListChecked();
            if(!this.listActions.length) this.isAllChecked = false;
        }, err => {
            this.loading = false;
        })
    }

    resetListChecked(){
        const listChecked: boolean[] = [];
        this.listActions.forEach(item => {
            listChecked.push(false);
        })
        this.listChecked = listChecked;
    }

    searchActions(){
        this.loading = true;
        this.getListActions()
    }

    open(action?: Partial<Action>, evt?: Event){
        this.dialogService.open(ActionDialogComponent, {
            data: {
                id: action ? action._id: null
            },
            width: '400px'
        })
        .afterClosed().subscribe((res: string) => {
            if(res){
                this.searchActions();
            }
        })
        if(evt){
            evt.stopPropagation()
        }
    }

    getNumOfSelected(){
        return this.listChecked.filter(item => item).length;
    }

    delete(){   
        this.dialogService.open(ConfirmDeletionComponent, {
            data: {
                title: "Xác nhận xóa hành động?",
                message: `Xóa vĩnh viễn ${this.getNumOfSelected()} hành động?`
            }
        })
        .afterClosed().subscribe((isConfirmed: boolean | undefined) => {
            if (isConfirmed) {
                this.loading = true;
                this.actionService.deleteAction(this.listActions.filter((_, ind) => this.listChecked[ind]).map(item => item._id))
                .subscribe(res => {
                    this.loading = false;
                    this.toast.success("Xóa vĩnh viễn hành động thành công");
                    this.searchActions();
                }, err => {
                    this.loading = false;
                    this.toast.error("Xóa vĩnh viễn hành động thất bại")
                })                
            }
        })
    }

    onChangePage(evt: PageEvent){
        this.page = evt.pageIndex;
        this.pageSize = evt.pageSize;
        this.searchActions();
    }

    isShowLockButton(){
        if(this.listChecked.length){
            const checkedItems = this.listActions.filter((_, ind) => this.listChecked[ind]);
            return checkedItems.length && checkedItems.map(u => u.status).find(s => s == 0) == null;
        }
        else return false;
    }

    isShowDeleteButton(){
        if(this.listChecked.length){
            const checkedItems = this.listActions.filter((_, ind) => this.listChecked[ind]);
            return checkedItems.length && checkedItems.map(u => u.is_delete).find(s => s) == null;
        }
        else return false;
    }

    isShowUnlockButton(){
        if(this.listChecked.length){
            const checkedItems = this.listActions.filter((_, ind) => this.listChecked[ind]);
            return checkedItems.length && checkedItems.map(u => u.status).find(s => s == 1) == null;
        }
        else return false;
    }

    updateCheckAll(){
        let isCheckedAll = true;
        for (let index = 0; index < this.listActions.length; index++) {
            if(!this.listChecked[index]){
                isCheckedAll = false;
                break;
            }
        }
        this.isAllChecked = isCheckedAll;
    }

    toggleCheckItem(val: boolean, id: string){
        const indexItem = this.listActions.findIndex(r => r._id == id);
        this.listChecked[indexItem] = val;
        this.updateCheckAll();
    }

    toggleCheckAllItems(val: boolean){
        let clone = [];
        this.listChecked.forEach(() => {clone.push(val)});
        this.listChecked = [...clone];
    }

    isChecked(id: string){
        const itemIndex = this.listActions.findIndex(r => r._id == id);
        return this.listChecked[itemIndex];
    }

    deleteSingle(action: Partial<Action>){
        this.dialogService.open(ConfirmDeletionComponent, {
            data: {
                title: `Xác nhận xóa hành động`,
                message: `Xóa hành động '${action.title}'?`
            }
        })
        .afterClosed().subscribe((isConfirmed?: boolean) => {
            if(isConfirmed){
                this.loading = true;
                this.actionService.deleteAction([action._id]).subscribe(() => {
                    this.toast.success(`Xóa hành động thành công`);
                    this.loading = false;
                    this.searchActions();
                    this.resetListChecked();
                }, () => this.loading = false)
            }
        })
    }

    changeStatus(action: Partial<Action>){
        this.dialogService.open(ConfirmDeletionComponent, {
            data: {
                title: `Xác nhận ${action.status ? '': 'mở'} khóa hành động?`,
                message: `${action.status ? 'Khóa': 'Mở khóa'} hành động ${action.title}?`
            }
        })
        .afterClosed().subscribe((isConfirmed: boolean | undefined) => {
            if (isConfirmed) {
                this.loading = true;
                this.actionService.changeStatusAction([action._id], action.status ? 0: 1)
                .subscribe(res => {
                    this.loading = false;
                    this.toast.success(`${action.status ? 'Khóa': 'Mở khóa'} hành động thành công`);
                    this.searchActions();
                    this.resetListChecked();
                }, err => {
                    this.loading = false;
                })                
            }
        })
    }

    changeStatusSelected(currStatus: 0 | 1){
        this.dialogService.open(ConfirmDeletionComponent, {
            data: {
                title: `Xác nhận ${currStatus ? '': 'mở'} khóa hành động?`,
                message: `${currStatus ? 'Khóa': 'Mở khóa'} ${this.getNumOfSelected()} hành động?`
            }
        })
        .afterClosed().subscribe((isConfirmed: boolean | undefined) => {
            if (isConfirmed) {
                this.loading = true;
                this.actionService.changeStatusAction(this.listActions.filter((_, i) => this.listChecked[i]).map(r => r._id), currStatus ? 0 : 1)
                .subscribe(res => {
                    this.loading = false;
                    this.toast.success(`${currStatus ? 'Khóa': 'Mở khóa'} hành động thành công`);
                    this.searchActions();
                    this.resetListChecked();
                }, err => {
                    this.loading = false;
                })                
            }
        })
    }
}