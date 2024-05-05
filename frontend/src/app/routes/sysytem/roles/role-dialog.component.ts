import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Role } from 'app/model/role.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RoleService } from './role.service';

@Component({
    selector: 'role-dialog',
    templateUrl: 'role-dialog.component.html',
    styleUrls: ['role-dialog.component.scss']
})

export class RoleDialogComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { id?: string },
        private roleService: RoleService,
        private dialogRef: MatDialogRef<RoleDialogComponent>
    ) { }

    ngOnInit() {
        // update
        if(this.data && this.data.id){
            this.roleService.getRole(this.data.id).subscribe(res => {
                this.role = res;
                this.roleForm.setValue({
                    title: res.title,
                    code: res.code,                    
                    description: res.description,                    
                })
            }, (err) => {
                console.error(err);
                this.close("Lỗi lấy thông tin vai trò");
            })
        }
        // create
        else {
            this.title = "Thêm mới vai trò";
            this.role = {
                title: null,
                code: null,
                description: null
            }
        }
    }

    role: Partial<Role>;
    title: string = "Chỉnh sửa vai trò";
    roleForm: FormGroup = new FormGroup({
        title: new FormControl(null, Validators.required),
        code: new FormControl(null, Validators.required),
        description: new FormControl(null),
    });

    /**
     * close current dialog
     * @param msg string if having error; obj when successful
     */
    close(msg?: string | {msg: string}){
        this.dialogRef.close(msg);
    }

    getCurrentData(): Role {
        return this.roleForm.value;
    }

    save(){
        if(this.data && this.data.id){
            this.roleService.updateRole(this.getCurrentData())
            .subscribe(res => {
                console.log(res);
                this.close({msg: "Cập nhật vai trò thành công"})
            }, err => {
                console.error(err);
                this.close("Cập nhật vai trò thất bại");
            })
        }
        else {
            this.roleService.addRole(this.getCurrentData())
            .subscribe(res => {
                this.close({msg: "Thêm vai trò thành công"})
            }, err => {
                console.error(err);
                this.close("Thêm vai trò thất bại");
            })
        }
    }

    clearFormControl(name: string){
        this.roleForm.get(name).setValue(null);
    }
}