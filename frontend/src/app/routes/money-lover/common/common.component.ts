import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IconService } from '@shared';
import { Category, NewCategory } from 'app/model/category.model';
import { Icon } from 'app/model/icon.model';
import { CategoryDialogComponent } from './category/category-dialog.component';
import { CommonService } from './common.service';

@Component({
    selector: 'common',
    templateUrl: 'common.component.html',
    providers: [CommonService]
})

export class MoneyCommonComponent implements OnInit {
    constructor(private commonService: CommonService, private iconService: IconService, private dialog: MatDialog) { }

    icons: Icon[] = [];
    searchCategoryKey: string = "";
    search: string = "";
    newCategoryDialog: MatDialogRef<CategoryDialogComponent>;

    ngOnInit() { 
        this.commonService.getListData("icon", {})
        .subscribe((res: Icon[]) => {
            this.icons = [...res];            
        });
        this.commonService.getListCategories({}).subscribe((res: Category[]) => {
            console.log(res);
        })
    }

    openAddCategoryDialog(){
        this.newCategoryDialog = this.dialog.open(CategoryDialogComponent, {
            data: {
                icons: [...this.icons]
            },
            maxWidth: 600
        });
        this.newCategoryDialog.afterClosed().subscribe((data: NewCategory) => {
            this.iconService.getIconByPath(data.selectedIcon).subscribe((icon: Icon) => {
                console.log({
                    name: data.categoryName,
                    icon: icon._id
                });
                this.commonService.insertCategory({
                    name: data.categoryName,
                    icon: icon._id
                }).subscribe(res => {
                    console.log(res);                    
                })
            })
        })
    }

    searchCategories(){
        this.search = this.searchCategoryKey;
    }
}