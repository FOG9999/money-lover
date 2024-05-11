import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Module } from 'app/model/module.model';
import { CONSTS } from 'app/consts';
import { ConfirmDeletionComponent } from '@shared/components/confirm-deletion/confirm-deletion.component';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
import { ModuleDialogComponent } from './module-dialog.component';
import { ModuleService } from './module.service';

@Component({
    selector: 'modules',
    templateUrl: 'modules.component.html',
    styleUrls: ['modules.component.scss']
})

export class ModuleMngComponent implements OnInit {
    constructor(
        private moduleService: ModuleService,
        private dialogService: MatDialog,
        private toast: ToastrService
    ) { }

    ngOnInit() { 
        this.searchModules()
    }

    listModules: Partial<Module>[] = [];
    searchKey: string = "";
    displayedColumns: string[] = ['checkbox', 'Tên module', 'Mã module', 'Mô tả', 'Ngày tạo', 'Trạng thái', 'Thao tác'];
    columnProps: string[] = ['checkbox', 'title','code', 'description', 'dateCreated', 'status', 'actions'];
    loading: boolean = false;
    listChecked: boolean[] = [];
    total: number = 0;
    pageSize: number = CONSTS.page_size;
    page: number = 0;
    isAllChecked: boolean = false;
    pageSizeOptions: number[] = CONSTS.page_size_options;

    getListModules(){
        this.moduleService.getListModules(this.searchKey, this.page, this.pageSize).subscribe(res => {
            this.loading = false;
            this.listModules = res.results;
            this.total = res.total;
            this.resetListChecked();
        }, err => {
            this.loading = false;
        })
    }

    resetListChecked(){
        const listChecked: boolean[] = [];
        this.listModules.forEach(item => {
            listChecked.push(false);
        })
        this.listChecked = listChecked;
    }

    searchModules(){
        this.loading = true;
        this.getListModules()
    }

    open(module?: Partial<Module>, evt?: Event){
        this.dialogService.open(ModuleDialogComponent, {
            data: {
                id: module ? module._id: null
            },
            width: '400px'
        })
        .afterClosed().subscribe((res: string) => {
            if(res){
                this.searchModules();
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
                title: "Xác nhận xóa module?",
                message: `Xóa vĩnh viễn ${this.getNumOfSelected()} module?`
            }
        })
        .afterClosed().subscribe((isConfirmed: boolean | undefined) => {
            if (isConfirmed) {
                this.loading = true;
                this.moduleService.deleteModule(this.listModules.filter((_, ind) => this.listChecked[ind]).map(item => item._id))
                .subscribe(res => {
                    this.loading = false;
                    this.toast.success("Xóa vĩnh viễn module thành công");
                    this.searchModules();
                }, err => {
                    this.loading = false;
                    this.toast.error("Xóa vĩnh viễn module thất bại")
                })                
            }
        })
    }

    onChangePage(evt: PageEvent){
        this.page = evt.pageIndex;
        this.pageSize = evt.pageSize;
        this.searchModules();
    }

    isShowLockButton(){
        if(this.listChecked.length){
            const checkedItems = this.listModules.filter((_, ind) => this.listChecked[ind]);
            return checkedItems.length && checkedItems.map(u => u.status).find(s => s == 0) == null;
        }
        else return false;
    }

    isShowDeleteButton(){
        if(this.listChecked.length){
            const checkedItems = this.listModules.filter((_, ind) => this.listChecked[ind]);
            return checkedItems.length && checkedItems.map(u => u.is_delete).find(s => s) == null;
        }
        else return false;
    }

    isShowUnlockButton(){
        if(this.listChecked.length){
            const checkedItems = this.listModules.filter((_, ind) => this.listChecked[ind]);
            return checkedItems.length && checkedItems.map(u => u.status).find(s => s == 1) == null;
        }
        else return false;
    }

    updateCheckAll(){
        let isCheckedAll = true;
        for (let index = 0; index < this.listModules.length; index++) {
            if(!this.listChecked[index]){
                isCheckedAll = false;
                break;
            }
        }
        this.isAllChecked = isCheckedAll;
    }

    toggleCheckItem(val: boolean, id: string){
        const indexItem = this.listModules.findIndex(r => r._id == id);
        this.listChecked[indexItem] = val;
        this.updateCheckAll();
    }

    toggleCheckAllItems(val: boolean){
        let clone = [];
        this.listChecked.forEach(() => {clone.push(val)});
        this.listChecked = [...clone];
    }

    isChecked(id: string){
        const itemIndex = this.listModules.findIndex(r => r._id == id);
        return this.listChecked[itemIndex];
    }

    deleteSingle(module: Partial<Module>){
        this.dialogService.open(ConfirmDeletionComponent, {
            data: {
                title: `Xác nhận xóa module`,
                message: `Xóa module '${module.title}'?`
            }
        })
        .afterClosed().subscribe((isConfirmed?: boolean) => {
            if(isConfirmed){
                this.loading = true;
                this.moduleService.deleteModule([module._id]).subscribe(() => {
                    this.toast.success(`Xóa module thành công`);
                    this.loading = false;
                    this.searchModules();
                    this.resetListChecked();
                }, () => this.loading = false)
            }
        })
    }

    changeStatus(module: Partial<Module>){
        this.dialogService.open(ConfirmDeletionComponent, {
            data: {
                title: `Xác nhận ${module.status ? '': 'mở'} khóa module?`,
                message: `${module.status ? 'Khóa': 'Mở khóa'} module ${module.title}?`
            }
        })
        .afterClosed().subscribe((isConfirmed: boolean | undefined) => {
            if (isConfirmed) {
                this.loading = true;
                this.moduleService.changeStatusModule([module._id], module.status ? 0: 1)
                .subscribe(res => {
                    this.loading = false;
                    this.toast.success(`${module.status ? 'Khóa': 'Mở khóa'} module thành công`);
                    this.searchModules();
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
                title: `Xác nhận ${currStatus ? '': 'mở'} khóa module?`,
                message: `${currStatus ? 'Khóa': 'Mở khóa'} ${this.getNumOfSelected()} module?`
            }
        })
        .afterClosed().subscribe((isConfirmed: boolean | undefined) => {
            if (isConfirmed) {
                this.loading = true;
                this.moduleService.changeStatusModule(this.listModules.filter((_, i) => this.listChecked[i]).map(r => r._id), currStatus ? 0 : 1)
                .subscribe(res => {
                    this.loading = false;
                    this.toast.success(`${currStatus ? 'Khóa': 'Mở khóa'} module thành công`);
                    this.searchModules();
                    this.resetListChecked();
                }, err => {
                    this.loading = false;
                })                
            }
        })
    }
}