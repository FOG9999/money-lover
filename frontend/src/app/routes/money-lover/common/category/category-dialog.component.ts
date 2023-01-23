import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewCategory } from 'app/model/category.model';
import { Icon } from 'app/model/icon.model';

@Component({
    selector: 'category-dialog',
    templateUrl: 'category-dialog.component.html',
    styleUrls: ['./category-dialog.component.scss']
})

export class CategoryDialogComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {icons: Icon[]},
        public dialogRef: MatDialogRef<CategoryDialogComponent>
    ) { }

    category: NewCategory = {
        categoryName: "Tên chủng loại 1",
        selectedIcon: "0ef3cdd7-d90a-4fa3-86f6-5139bad3691b.png"
    }
    selectedIndexIcon: number = -1;
    isValid: boolean = false;

    ngOnInit() { }

    /* #region Logic handler */
    checkValid() {
        if(!!this.category.categoryName){
            if(!this.category.categoryName.trim()){
                this.isValid = false;
                return;
            }
            this.isValid = true;
            return;
        }
        else if(!this.category.categoryName){
            this.isValid = false;
            return;
        }
        this.isValid = true;
        return;
    }

    selectIcon(index: number){
        this.selectedIndexIcon = index;
        let clone = {...this.category};
        clone.selectedIcon = this.data.icons[index].path;
        this.category = {...clone};
        this.checkValid();
    }

    closeDialog(){
        this.dialogRef.close();
    }
    /* #endregion */
}