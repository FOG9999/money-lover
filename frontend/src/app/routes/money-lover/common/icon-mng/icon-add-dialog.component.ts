import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CONSTS } from 'app/consts';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../common.service';

@Component({
    selector: 'icon-add-dialog',
    templateUrl: 'icon-add-dialog.component.html',
    styleUrls: ['./icon-mng.component.scss'],
    providers: [CommonService]
})

export class IconAddComponent implements OnInit {
    constructor(private dialogRef: MatDialogRef<IconAddComponent>, private toast: ToastrService, private commonService: CommonService) { }

    imgSrc: string = CONSTS.icon_not_selected;
    file: any = "";

    ngOnInit() { }

    clear() {
        this.file = "";
        this.imgSrc = CONSTS.icon_not_selected;
    }

    closeDialog() {
        this.dialogRef.close();
    }

    onChangeFile(evt: any) {
        let file = evt.target.files[0];
        if (this.isValidImage(file)) {
            this.file = file;
            this.imgSrc = CONSTS.icon_not_selected;
            let reader = new FileReader();
            reader.onload = () => {
                this.imgSrc = reader.result.toString();
            }
            reader.readAsDataURL(this.file);
        }
        else {
            this.toast.error(CONSTS.image_invalid);
        }
    }

    saveIcon() {
        this.commonService.saveIconData({file: this.imgSrc})
        .subscribe(res => {
            this.toast.success(CONSTS.messages.upload_icon_success);
            this.dialogRef.close(true);
        },
        error => {
            this.toast.error(CONSTS.messages.upload_icon_fail);
            console.error(error);                
        })
    }

    isValidImage(file) {
        let isValid = false;
        try {
            if (CONSTS.icon_allow_types.indexOf(file.type.split('/')[1]) >= 0) {
                isValid = true;
            }
        } catch (error) {
            console.error(error);
            isValid = false;
        }
        return isValid;
    }
}