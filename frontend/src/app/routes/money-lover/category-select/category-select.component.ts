import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from 'app/model/category.model';
import { CommonService } from '../common/common.service';

interface SelectedCategory {
    categoryId: string
}

@Component({
    selector: 'category-select',
    templateUrl: 'category-select.component.html'
})

export class CategorySelectComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public selected: Partial<SelectedCategory>,
        private ref: MatDialogRef<CategorySelectComponent>,
        private commonService: CommonService
    ) { }

    ngOnInit() { 
        this.getDataCategories();
    }

    title: string = "Chọn chủng loại";
    search: string = "";
    categories: Category[] = [];

    select(category: Category){
        this.ref.close(category);
    }

    getDataCategories() {
        this.commonService.getListCategories({ search: this.search }).subscribe(res => {
            this.categories = [...res];
        })
    }
}