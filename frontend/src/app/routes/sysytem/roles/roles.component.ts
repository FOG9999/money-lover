import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Role } from 'app/model/role.model';
import { CONSTS } from 'app/consts';
import { ConfirmDeletionComponent } from '@shared/components/confirm-deletion/confirm-deletion.component';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
import { RoleDialogComponent } from './role-dialog.component';
import { RoleService } from './role.service';

@Component({
    selector: 'roles',
    templateUrl: 'roles.component.html',
    styleUrls: ['roles.component.scss']
})

export class RoleMngComponent implements OnInit {
    constructor(
        private roleService: RoleService,
        private dialogService: MatDialog,
        private toast: ToastrService
    ) { }

    ngOnInit() { 
        this.searchRoles()
    }

    listRoles: Partial<Role>[] = [];
    searchKey: string = "";
    displayedColumns: string[] = ['checkbox', 'Tên vai trò', 'Mã vai trò', 'Ngày tạo', 'Trạng thái', 'Thao tác'];
    columnProps: string[] = ['checkbox', 'title','code', 'dateCreated', 'status', 'actions'];
    loading: boolean = false;
    listChecked: boolean[] = [];
    total: number = 0;
    pageSize: number = CONSTS.page_size;
    page: number = 0;
    isAllChecked: boolean = false;
    pageSizeOptions: number[] = CONSTS.page_size_options;

    getListRoles(){
        this.roleService.getListRoles(this.searchKey, this.page, this.pageSize).subscribe(res => {
            this.loading = false;
            this.listRoles = res.results;
            this.total = res.total;
            this.resetListChecked();
        }, err => {
            this.loading = false;
        })
    }

    resetListChecked(){
        const listChecked: boolean[] = [];
        this.listRoles.forEach(item => {
            listChecked.push(false);
        })
        this.listChecked = listChecked;
    }

    searchRoles(){
        this.loading = true;
        this.getListRoles()
    }

    open(role?: Partial<Role>, evt?: Event){
        this.dialogService.open(RoleDialogComponent, {
            data: {
                role: role ? role: {}
            },
            width: '400px'
        })
        .afterClosed().subscribe((res: undefined | Partial<Role>) => {
            if(res){
                this.searchRoles();
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
                title: "Xác nhận xóa vai trò?",
                message: `Xóa vĩnh viễn ${this.getNumOfSelected()} vai trò?`
            }
        })
        .afterClosed().subscribe((isConfirmed: boolean | undefined) => {
            if (isConfirmed) {
                this.loading = true;
                this.roleService.deleteRole(this.listRoles.filter((_, ind) => this.listChecked[ind]).map(item => item._id))
                .subscribe(res => {
                    this.loading = false;
                    this.toast.success("Xóa vĩnh viễn vai trò thành công");
                    this.searchRoles();
                }, err => {
                    this.loading = false;
                    this.toast.error("Xóa vĩnh viễn vai trò thất bại")
                })                
            }
        })
    }

    onChangePage(evt: PageEvent){
        this.page = evt.pageIndex;
        this.pageSize = evt.pageSize;
        this.searchRoles();
    }

    isShowLockButton(){
        if(this.listChecked.length){
            const checkedItems = this.listRoles.filter((_, ind) => this.listChecked[ind]);
            return checkedItems.length && checkedItems.map(u => u.status).find(s => s == 0) == null;
        }
        else return false;
    }

    isShowDeleteButton(){
        if(this.listChecked.length){
            const checkedItems = this.listRoles.filter((_, ind) => this.listChecked[ind]);
            return checkedItems.length && checkedItems.map(u => u.is_delete).find(s => s) == null;
        }
        else return false;
    }

    isShowUnlockButton(){
        if(this.listChecked.length){
            const checkedItems = this.listRoles.filter((_, ind) => this.listChecked[ind]);
            return checkedItems.length && checkedItems.map(u => u.status).find(s => s == 1) == null;
        }
        else return false;
    }

    updateCheckAll(){
        let isCheckedAll = true;
        for (let index = 0; index < this.listRoles.length; index++) {
            if(!this.listChecked[index]){
                isCheckedAll = false;
                break;
            }
        }
        this.isAllChecked = isCheckedAll;
    }

    toggleCheckItem(val: boolean, id: string){
        const indexItem = this.listRoles.findIndex(r => r._id == id);
        this.listChecked[indexItem] = val;
        this.updateCheckAll();
    }

    toggleCheckAllItems(val: boolean){
        this.listChecked.forEach(item => item = val);
    }

    isChecked(id: string){
        const itemIndex = this.listRoles.findIndex(r => r._id == id);
        return this.listChecked[itemIndex];
    }
}