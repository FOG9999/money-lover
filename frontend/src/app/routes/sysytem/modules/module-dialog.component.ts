import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Module } from 'app/model/module.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModuleService } from './module.service';
import { ToastrService } from 'ngx-toastr';
import { trim } from '@shared';

@Component({
    selector: 'module-dialog',
    templateUrl: 'module-dialog.component.html',
    styleUrls: ['module-dialog.component.scss']
})

export class ModuleDialogComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { id?: string },
        private moduleService: ModuleService,
        private toast: ToastrService,
        private dialogRef: MatDialogRef<ModuleDialogComponent>
    ) { }

    ngOnInit() {
        // update
        if(this.data && this.data.id){
            this.moduleService.getModule(this.data.id).subscribe(res => {
                this.module = res;
                this.moduleForm.setValue({
                    title: res.title,
                    code: res.code,                    
                    description: res.description,                    
                })
            }, (err) => {
                console.error(err);
            })
        }
        // create
        else {
            this.title = "Thêm mới module";
            this.module = {
                title: null,
                code: null,
                description: null
            }
        }
    }

    module: Partial<Module>;
    title: string = "Chỉnh sửa module";
    moduleForm: FormGroup = new FormGroup({
        title: new FormControl(null, Validators.required),
        code: new FormControl(null, Validators.required),
        description: new FormControl(null),
    });
    trim = trim;

    close(msg?: Partial<Module>){
        this.dialogRef.close(msg);
    }

    getCurrentData(): Module {
        return {
            ...this.module,
            ...this.moduleForm.value
        }
    }

    save(){
        if(this.data && this.data.id){
            this.moduleService.updateModule(this.getCurrentData())
            .subscribe(res => {
                this.toast.success("Cập nhật module thành công");
                this.close(res);
            })
        }
        else {
            this.moduleService.addModule(this.getCurrentData())
            .subscribe(res => {
                this.toast.success("Thêm module thành công");
                this.close(res);
            })
        }
    }

    clearFormControl(name: string){
        this.moduleForm.get(name).setValue(null);
    }
}