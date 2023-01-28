import { Component, ElementRef, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CONSTS } from 'app/consts';
import { Category } from 'app/model/category.model';
import { Icon } from 'app/model/icon.model';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../common.service';
import { IconSelectionComponent } from './icon-selection.component';

@Component({
    selector: 'ml-category',
    templateUrl: 'category.component.html',
    styleUrls: ['./category.component.scss']
})

export class CategoryComponent implements OnInit, OnChanges {
    constructor(private iconSelectDialog: MatDialog, private commonService: CommonService, private toastService: ToastrService) { }

    listCategories: Category[] = [];
    listCategoriesSaved: Category[] = [];
    listChecked: boolean[] = [];
    indexEditting: number = -1;
    indexHovering: number = -1;
    nameEditting: string = "";
    pageSize: number = CONSTS.page_size;
    iconSelectionDialogRef: MatDialogRef<IconSelectionComponent>;

    @ViewChild("editInput") editInput: ElementRef;

    @Input() icons: Icon[];
    /**
     * receive search signal from parent
     */
    @Input() search: string;

    ngOnInit() {
        this.getDataCategories();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.search) {
            this.getDataCategories();
        }
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
        // set current category to the previous state
        let tempList = JSON.parse(JSON.stringify(this.listCategories));
        tempList[this.indexEditting] = this.listCategoriesSaved[this.indexEditting];
        this.listCategories = [...tempList];

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
        this.commonService.updateCategory({
            name: this.nameEditting,
            icon: this.listCategories[index].icon._id,
            id: this.listCategories[index]._id,
            transactionType: this.listCategories[index].transactionType
        }).subscribe(res => {
            this.getDataCategories();
            this.toastService.success(CONSTS.messages.update_category_success);
        }, error => {
            this.toastService.error(CONSTS.messages.update_category_fail);
            console.error(error);
        })
    }

    renewListChecked() {
        let tempChecked: boolean[] = [];
        for (let i = 0; i < this.listCategories.length; i++) {
            tempChecked.push(false);
        }
        this.listChecked = [...tempChecked];
    }

    getDataCategories() {
        this.commonService.getListCategories({ search: this.search }).subscribe(res => {
            this.listCategories = [...res];
            setTimeout(() => {
                this.renewListChecked();
                this.updatePreviousState();
            });            
        })
    }

    editCategoryIcon(index: number) {
        if (this.indexEditting == index) {
            let currentCategory = this.listCategories[index];
            this.iconSelectionDialogRef = this.iconSelectDialog.open(IconSelectionComponent, {
                data: {
                    icons: [...this.icons],
                    currentPath: currentCategory.icon.path
                }
            });
            this.iconSelectionDialogRef.afterClosed().subscribe((data: string) => {
                if (data) {
                    let tempList = JSON.parse(JSON.stringify(this.listCategories));                    
                    let icon = this.icons.filter(i => i.path === data)[0];
                    tempList[index].icon = icon;
                    this.listCategories = [...tempList];
                }
            });
        }
    }

    /**
     * call this function after saving data
     * store the state before the showing list is modified and restore after if needed
     */
    updatePreviousState() {
        let temp = JSON.parse(JSON.stringify(this.listCategories));
        this.listCategoriesSaved = [...temp];
    }
    /* #endregion */
}