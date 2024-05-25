import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Permission } from 'app/model/permission.model';
import { CONSTS } from 'app/consts';
import { ConfirmDeletionComponent } from '@shared/components/confirm-deletion/confirm-deletion.component';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
// import { PermissionDialogComponent } from './permission-dialog.component';
import { PermissionService } from './permission.service';
import { ModuleAction } from 'app/model/module-action';
import { PermissionDialogComponent } from './permission-dialog.component';
import { Module } from 'app/model/module.model';
import { Action } from 'app/model/action.model';

@Component({
    selector: 'permissions',
    templateUrl: 'permissions.component.html',
    styleUrls: ['permissions.component.scss']
})

export class PermissionMngComponent implements OnInit {
    constructor(
        private permissionService: PermissionService,
        private dialogService: MatDialog,
        private toast: ToastrService
    ) { }

    ngOnInit() { 
        this.searchPermissions()
    }

    listPermissions: Partial<Permission>[] = [];
    searchKey: string = "";
    loading: boolean = false;
    listChecked: boolean[] = [];
    total: number = 0;
    pageSize: number = CONSTS.page_size;
    page: number = 0;
    isAllChecked: boolean = false;
    pageSizeOptions: number[] = CONSTS.page_size_options;
    mapOfExpandedPermission: Map<string, {loading: boolean, data?: Permission}> = new Map<string, {loading: boolean, data?: Permission}>();
    mapOfModuleActions: Map<string, {page: number, size: number, list?: ModuleAction[], loading: boolean, total?: number, displayList?: ModuleAction[]}> = new Map<string, {page: number, size: number, list?: ModuleAction[], loading: boolean, total?: number, displayList?: ModuleAction[]}>();
    /**
     * permission._id + '.' + module._id is the key
     */
    mapOfActions: Map<string, { list: Action[], page: number, size: number, total: number, module: Module, displayList: Action[] }> = new Map<string, { list: Action[], page: number, size: number, total: number, module: Module, displayList: Action[] }>();
    
    displayedColumns: string[] = ['Tên hành động', 'Mã hành động', 'Trạng thái'];
    columnProps: string[] = ['title','code', 'status'];

    getListPermissions(){
        this.permissionService.getListPermissions(this.searchKey, this.page, this.pageSize).subscribe(res => {
            this.loading = false;
            this.listPermissions = res.results;
            this.total = res.total;
            this.resetListChecked();
            if(!this.listPermissions.length) this.isAllChecked = false;
        }, err => {
            this.loading = false;
        })
    }

    setMapOfActions(permissionId: string, moduleActions: Partial<ModuleAction>[]){
        moduleActions.forEach(ma => {
            this.mapOfActions.set(permissionId + '.' + ma.module._id, {
                page: 0,
                size: CONSTS.page_size,
                list: ma.actions,
                total: ma.actions.length,
                module: ma.module,
                displayList: ma.actions.filter((act, ind) => ind >= 0 && ind < CONSTS.page_size)
            })
        })
    }

    onChangePageActions(key: string, evt: PageEvent){
        const curr = this.mapOfActions.get(key);
        this.mapOfActions.set(key, {...curr, page: evt.pageIndex, displayList: curr.list.filter((_, ind) => ind >= evt.pageIndex*curr.size && ind < (evt.pageIndex+1)*curr.size)});
    }

    onChangePageModuleActions(key: string, evt: PageEvent){
        const curr = this.mapOfModuleActions.get(key);
        this.mapOfModuleActions.set(key, {...curr, page: evt.pageIndex, displayList: curr.list.filter((_, ind) => ind >= evt.pageIndex*curr.size && ind < (evt.pageIndex+1)*curr.size)})
    }

    resetListChecked(){
        const listChecked: boolean[] = [];
        this.listPermissions.forEach(item => {
            listChecked.push(false);
        })
        this.listChecked = listChecked;
    }

    searchPermissions(){
        this.loading = true;
        this.getListPermissions()
    }

    open(permission?: Partial<Permission>, evt?: Event){
        this.dialogService.open(PermissionDialogComponent, {
            data: {
                id: permission ? permission._id: null
            }
        })
        .afterClosed().subscribe((res: string) => {
            if(res){
                this.searchPermissions();
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
                title: "Xác nhận xóa quyền?",
                message: `Xóa vĩnh viễn ${this.getNumOfSelected()} quyền?`
            }
        })
        .afterClosed().subscribe((isConfirmed: boolean | undefined) => {
            if (isConfirmed) {
                this.loading = true;
                this.permissionService.deletePermission(this.listPermissions.filter((_, ind) => this.listChecked[ind]).map(item => item._id))
                .subscribe(res => {
                    this.loading = false;
                    this.toast.success("Xóa vĩnh viễn quyền thành công");
                    this.searchPermissions();
                }, err => {
                    this.loading = false;
                    this.toast.error("Xóa vĩnh viễn quyền thất bại")
                })                
            }
        })
    }

    onChangePage(evt: PageEvent){
        this.page = evt.pageIndex;
        this.pageSize = evt.pageSize;
        this.searchPermissions();
    }

    isShowLockButton(){
        if(this.listChecked.length){
            const checkedItems = this.listPermissions.filter((_, ind) => this.listChecked[ind]);
            return checkedItems.length && checkedItems.map(u => u.status).find(s => s == 0) == null;
        }
        else return false;
    }

    isShowDeleteButton(){
        if(this.listChecked.length){
            const checkedItems = this.listPermissions.filter((_, ind) => this.listChecked[ind]);
            return checkedItems.length && checkedItems.map(u => u.is_delete).find(s => s) == null;
        }
        else return false;
    }

    isShowUnlockButton(){
        if(this.listChecked.length){
            const checkedItems = this.listPermissions.filter((_, ind) => this.listChecked[ind]);
            return checkedItems.length && checkedItems.map(u => u.status).find(s => s == 1) == null;
        }
        else return false;
    }

    updateCheckAll(){
        let isCheckedAll = true;
        for (let index = 0; index < this.listPermissions.length; index++) {
            if(!this.listChecked[index]){
                isCheckedAll = false;
                break;
            }
        }
        this.isAllChecked = isCheckedAll;
    }

    toggleCheckItem(val: boolean, id: string){
        const indexItem = this.listPermissions.findIndex(r => r._id == id);
        this.listChecked[indexItem] = val;
        this.updateCheckAll();
    }

    toggleCheckAllItems(val: boolean){
        let clone = [];
        this.listChecked.forEach(() => {clone.push(val)});
        this.listChecked = [...clone];
    }

    isChecked(id: string){
        const itemIndex = this.listPermissions.findIndex(r => r._id == id);
        return this.listChecked[itemIndex];
    }

    deleteSingle(permission: Partial<Permission>){
        this.dialogService.open(ConfirmDeletionComponent, {
            data: {
                title: `Xác nhận xóa quyền`,
                message: `Xóa quyền '${permission.title}'?`
            }
        })
        .afterClosed().subscribe((isConfirmed?: boolean) => {
            if(isConfirmed){
                this.loading = true;
                this.permissionService.deletePermission([permission._id]).subscribe(() => {
                    this.toast.success(`Xóa quyền thành công`);
                    this.loading = false;
                    this.searchPermissions();
                    this.resetListChecked();
                }, () => this.loading = false)
            }
        })
    }

    changeStatus(permission: Partial<Permission>){
        this.dialogService.open(ConfirmDeletionComponent, {
            data: {
                title: `Xác nhận ${permission.status ? '': 'mở'} khóa quyền?`,
                message: `${permission.status ? 'Khóa': 'Mở khóa'} quyền ${permission.title}?`
            }
        })
        .afterClosed().subscribe((isConfirmed: boolean | undefined) => {
            if (isConfirmed) {
                this.loading = true;
                this.permissionService.changeStatusPermission([permission._id], permission.status ? 0: 1)
                .subscribe(res => {
                    this.loading = false;
                    this.toast.success(`${permission.status ? 'Khóa': 'Mở khóa'} quyền thành công`);
                    this.searchPermissions();
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
                title: `Xác nhận ${currStatus ? '': 'mở'} khóa quyền?`,
                message: `${currStatus ? 'Khóa': 'Mở khóa'} ${this.getNumOfSelected()} quyền?`
            }
        })
        .afterClosed().subscribe((isConfirmed: boolean | undefined) => {
            if (isConfirmed) {
                this.loading = true;
                this.permissionService.changeStatusPermission(this.listPermissions.filter((_, i) => this.listChecked[i]).map(r => r._id), currStatus ? 0 : 1)
                .subscribe(res => {
                    this.loading = false;
                    this.toast.success(`${currStatus ? 'Khóa': 'Mở khóa'} quyền thành công`);
                    this.searchPermissions();
                    this.resetListChecked();
                }, err => {
                    this.loading = false;
                })                
            }
        })
    }

    expandPermission(permission: Partial<Permission>){
        this.mapOfExpandedPermission.set(permission._id, {loading: true});
        this.permissionService.getPermission(permission._id!).subscribe(per => {
            this.mapOfExpandedPermission.set(permission._id, {data: per, loading: false});
            this.mapOfModuleActions.set(permission._id, {loading: true, page: 0, size: CONSTS.page_size});
            this.getListModuleActions(permission._id)
        }, () => {
            this.mapOfExpandedPermission.set(permission._id, {loading: false});
        })
    }
    
    getListModuleActions(id: string, page: number = 0, size: number = CONSTS.page_size){
        const curr = this.mapOfModuleActions.get(id);
        this.permissionService.getModuleActionsPermission(id, page, size).subscribe(data => {
            this.mapOfModuleActions.set(id, {loading: false, page: 0, size: CONSTS.page_size, total: data.total, list: data.results, displayList: data.results.filter((_, ind) => ind >= 0 && ind < CONSTS.page_size)});
            this.setMapOfActions(id, data.results);
        }, () => {
            this.mapOfModuleActions.set(id, {...curr, loading: false}); // only set loading, keep current data
        })        
    }

    collapsePermission(permission: Partial<Permission>){
        this.mapOfExpandedPermission.delete(permission._id);
        this.mapOfModuleActions.delete(permission._id);
        const permissionKeys = Array.from(this.mapOfActions.keys()).filter(key => key.includes(permission._id));
        this.mapOfActions.forEach((val, key) => {
            if(permissionKeys.includes(key)){
                this.mapOfActions.delete(key);
            }
        })
    }
}