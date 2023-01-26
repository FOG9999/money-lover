import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IconService } from '@shared';
import { ConfirmDeletionComponent } from '@shared/components/money-lover/confirm-deletion/confirm-deletion.component';
import { CONSTS } from 'app/consts';
import { Category, NewCategory } from 'app/model/category.model';
import { Icon } from 'app/model/icon.model';
import { ToastrService } from 'ngx-toastr';
import { CategoryDialogComponent } from './category/category-dialog.component';
import { CategoryComponent } from './category/category.component';
import { CommonService } from './common.service';
import { IconAddComponent } from './icon-mng/icon-add-dialog.component';

@Component({
    selector: 'common',
    templateUrl: 'common.component.html',
    providers: [CommonService]
})

export class MoneyCommonComponent implements OnInit {
    constructor(private commonService: CommonService, private iconService: IconService, private dialog: MatDialog, private toast: ToastrService) { }

    icons: Icon[] = [];
    searchCategoryKey: string = "";
    search: string = "";
    newCategoryDialog: MatDialogRef<CategoryDialogComponent>;
    confirmDeletionDialog: MatDialogRef<ConfirmDeletionComponent>;
    dialogAdd: MatDialogRef<IconAddComponent>;

    @ViewChild('categories') categories: ElementRef;
    @ViewChild('iconsMng') iconsMng: ElementRef;

    ngOnInit() {
        this.getListIcons();
    }

    getListIcons() {
        this.commonService.getListData("icon", {})
            .subscribe((res: Icon[]) => {
                this.icons = [...res];
            });
    }

    openAddCategoryDialog() {
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
                    this.toast.success(CONSTS.messages.insert_category_success);
                    // trigger reload list categories
                    this.searchCategoryKey = "";
                    this.searchCategories();
                }, error => {
                    this.toast.error(CONSTS.messages.insert_category_fail);
                })
            }, error => {
                this.toast.error(CONSTS.messages.icon_not_found)
            })
        })
    }

    openAddIconDialog() {
        this.dialogAdd = this.dialog.open(IconAddComponent, {
            width: '300px'
        });
        this.dialogAdd.afterClosed().subscribe((data: boolean | undefined) => {
            if (data) {
                this.getListIcons();
            }
        })
    }

    searchCategories() {
        this.search = this.searchCategoryKey;
    }

    deleteCategories() {
        let comp: any = this.categories;
        let catesToDelete = comp.listCategoriesSaved.filter((cate, ind) => {
            return comp.listChecked[ind];
        });
        this.confirmDeletionDialog = this.dialog.open(ConfirmDeletionComponent, {
            data: {
                title: "Xác nhận xóa chủng loại?",
                message: `Xóa ${catesToDelete.length} chủng loại?`
            }
        })
        this.confirmDeletionDialog.afterClosed().subscribe((isConfirmed: boolean | undefined) => {
            if (isConfirmed) {
                this.commonService.deleteCategories({ ids: catesToDelete.map((c: Category) => c._id) }).subscribe(res => {
                    this.toast.success(CONSTS.messages.delete_category_success);
                    // trigger reload list categories
                    this.searchCategoryKey = "";
                    this.searchCategories();
                }, err => {
                    console.error(err);
                    this.toast.error(CONSTS.messages.delete_category_fail);
                })
            }

        })
    }

    deleteIcon(){
        let comp: any = this.iconsMng;
        let iconsToDelete = this.icons.filter((i, ind) => {
            return comp.listChecked[ind];
        })
        this.confirmDeletionDialog = this.dialog.open(ConfirmDeletionComponent, {
            data: {
                title: "Xác nhận xóa icons?",
                message: `Xóa ${iconsToDelete.length} ${iconsToDelete.length > 1 ? 'icons' : 'icon'}?`
            }
        })
        this.confirmDeletionDialog.afterClosed().subscribe((isConfirmed: boolean | undefined) => {
            if (isConfirmed) {
                this.commonService.deleteIcon({ids: iconsToDelete.map(i => i._id), paths: iconsToDelete.map(i => i.path)}).subscribe(res => {
                    this.toast.success(CONSTS.messages.delete_icon_success);
                    this.getListIcons();
                    iconsToDelete.forEach(ic => {
                        sessionStorage.removeItem(ic.path);
                    })
                }, err => {
                    console.error(err);
                    this.toast.error(CONSTS.messages.delete_icon_fail);
                })
            }

        })
    }
}