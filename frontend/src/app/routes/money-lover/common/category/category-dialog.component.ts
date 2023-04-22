import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@shared';
import { CONSTS } from 'app/consts';
import { NewCategory } from 'app/model/category.model';
import { Icon } from 'app/model/icon.model';
import { User } from 'app/model/user.model';

@Component({
    selector: 'category-dialog',
    templateUrl: 'category-dialog.component.html',
    styleUrls: ['./category-dialog.component.scss']
})

export class CategoryDialogComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { icons: Icon[] },
        public dialogRef: MatDialogRef<CategoryDialogComponent>,
        private localStorage: LocalStorageService
    ) { }

    category: NewCategory = {
        categoryName: "Tên chủng loại 1",
        selectedIcon: CONSTS.icon_not_selected,
        transactionType: 0
    }
    selectedIndexIcon: number = -1;
    isValid: boolean = false;
    listTransactionTypes: { value: number, label: string }[] = [
        { value: 1, label: CONSTS.transactionType.INCOME },
        { value: 0, label: CONSTS.transactionType.OUTCOME }
    ]

    ngOnInit() { }

    /* #region Logic handler */
    checkValid() {
        if (!!this.category.categoryName) {
            if (!this.category.categoryName.trim()) {
                this.isValid = false;
                return;
            }
            this.isValid = true;
            return;
        }
        else if (!this.category.categoryName) {
            this.isValid = false;
            return;
        }
        this.isValid = true;
        return;
    }

    selectIcon(index: number) {
        this.selectedIndexIcon = index;
        let clone = { ...this.category };
        clone.selectedIcon = this.data.icons[index].path;
        this.category = { ...clone };
        let user = <User>this.localStorage.get('user');
        if(user.level == CONSTS.auth.USER){
            this.category.isDefault = 0
        }
        this.checkValid();
    }

    closeDialog() {
        this.dialogRef.close();
    }


    /* #endregion */
}