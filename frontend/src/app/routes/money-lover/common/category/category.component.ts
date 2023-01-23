import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CONSTS } from 'app/consts';
import { Category } from 'app/model/category.model';
import { Icon } from 'app/model/icon.model';

@Component({
    selector: 'ml-category',
    templateUrl: 'category.component.html',
    styleUrls: ['./category.component.scss']
})

export class CategoryComponent implements OnInit {
    constructor() { }

    listCategories: Category[] = [];
    listChecked: boolean[] = [];
    indexEditting: number = -1;
    indexHovering: number = -1;
    nameEditting: string = "";
    pageSize: number = CONSTS.page_size;
    pageSizeOptions: number[] = [...CONSTS.page_size_options];

    @ViewChild("editInput") editInput: ElementRef;

    ngOnInit() {
        this.generateFakeData();
    }

    /* #region UI handler */
    onMouseEnterEdit(index: number) {
        this.indexHovering = index;
    }

    onMouseLeaveEdit() {
        this.indexHovering = -1;
    }
    /* #endregion */

    /* #region Logic handler */
    editName(index: number) {
        this.indexEditting = index;
        this.nameEditting = this.listCategories[index].name;
        this.indexHovering = -1;
        setTimeout(() => {
            this.editInput.nativeElement.focus();
        })
    }

    cancelExitEditName() {
        this.indexEditting = -1;
    }

    finishEditName(index: number) {
        this.indexEditting = -1;
        let tempList = [...this.listCategories];
        tempList[index].name = this.nameEditting;
        this.listCategories = [...tempList];
    }

    generateFakeData() {
        let temp: Category[] = [];
        let icon: Icon = {
            code: '0ef3cdd7-d90a-4fa3-86f6-5139bad3691b',
            path: '0ef3cdd7-d90a-4fa3-86f6-5139bad3691b.png'
        };
        let tempChecked: boolean[] = [];
        for (let i = 0; i < 30; i++) {
            let name = `Chủng loại ${i}`;
            temp.push({
                name,
                icon
            });
            tempChecked.push(false);
        }
        this.listCategories = [...temp];
        this.listChecked = [...tempChecked];
    }
    /* #endregion */
}