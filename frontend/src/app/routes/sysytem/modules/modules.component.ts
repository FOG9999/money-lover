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
    listChecked: Map<string, Partial<Module>> = new Map<string, Partial<Module>>();
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
            this.updateCheckAll();
            if(!this.listModules.length) this.isAllChecked = false;
        }, err => {
            this.loading = false;
        })
    }

    resetListChecked(){
        this.listChecked.clear();
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
        return this.listChecked.size;
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
                this.moduleService.deleteModule(Array.from(this.listChecked.keys()))
                .subscribe(res => {
                    this.loading = false;
                    this.resetListChecked();
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
        if(this.listChecked.size){
            const checkedItems = Array.from(this.listChecked.values());
            return checkedItems.length && checkedItems.map(u => u.status).find(s => s == 0) == null;
        }
        else return false;
    }

    isShowDeleteButton(){
        if(this.listChecked.size){
            const checkedItems = Array.from(this.listChecked.values());
            return checkedItems.length && checkedItems.map(u => u.is_delete).find(s => s) == null;
        }
        else return false;
    }

    isShowUnlockButton(){
        if(this.listChecked.size){
            const checkedItems = Array.from(this.listChecked.values());
            return checkedItems.length && checkedItems.map(u => u.status).find(s => s == 1) == null;
        }
        else return false;
    }

    updateCheckAll(){
        this.isAllChecked = this.listChecked.size == this.total;
    }

    toggleCheckItem(val: boolean, id: string){
        if(val) this.listChecked.set(id, this.listModules.find(r => r._id == id));
        else this.listChecked.delete(id);
        this.updateCheckAll();
    }

    toggleCheckAllItems(val: boolean){
        if(val){
            this.moduleService.getListModules('', 0, CONSTS.page_size_get_all).subscribe(res => {
                res.results.forEach(role => {
                    if(!this.listChecked.has(role._id)) this.listChecked.set(role._id, role);
                })
            })
        } else this.resetListChecked();
    }

    isChecked(id: string){
        return this.listChecked.has(id);
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
                    if(this.listChecked.has(module._id)) this.listChecked.delete(module._id);
                }, () => this.loading = false)
            }
        })
    }

    updateListCheckedAfterStatusChanged(ids: string[], status: 0 | 1){
        ids.forEach(id => {
            if(this.listChecked.has(id)){
                this.listChecked.set(id, {
                    ...this.listChecked.get(id),
                    status
                })
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
                const newStatus = module.status ? 0: 1;
                this.moduleService.changeStatusModule([module._id], newStatus)
                .subscribe(res => {
                    this.loading = false;
                    this.toast.success(`${module.status ? 'Khóa': 'Mở khóa'} module thành công`);
                    this.searchModules();
                    this.updateListCheckedAfterStatusChanged([module._id], newStatus)
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
                const newStatus = currStatus ? 0: 1;
                this.moduleService.changeStatusModule(Array.from(this.listChecked.keys()), newStatus)
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