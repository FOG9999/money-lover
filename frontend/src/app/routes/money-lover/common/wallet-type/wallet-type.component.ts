import { Component, ElementRef, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CONSTS } from 'app/consts';
import { WalletType } from 'app/model/wallet-type.model';
import { Icon } from 'app/model/icon.model';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../common.service';
import { IconSelectionComponent } from '../../icon-selection/icon-selection.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'ml-wallet-type',
    templateUrl: 'wallet-type.component.html',
    styleUrls: ['./wallet-type.component.scss']
})

export class WalletTypeComponent implements OnInit, OnChanges {
    constructor(private iconSelectDialog: MatDialog, private commonService: CommonService, private toastService: ToastrService) { }

    listWalletTypes: WalletType[] = [];
    listWalletTypesSaved: WalletType[] = [];
    listChecked: boolean[] = [];
    indexEditting: number = -1;
    indexHovering: number = -1;
    nameEditting: string = "";
    page: number = 0;
    total: number = 0;
    pageSize: number = CONSTS.page_size;
    pageSizeOptions: number[] = CONSTS.page_size_options;
    iconSelectionDialogRef: MatDialogRef<IconSelectionComponent>;
    loading: boolean = false;

    @ViewChild("editInput") editInput: ElementRef;

    @Input() icons: Icon[];
    /**
     * receive search signal from parent
     */
    @Input() search: string;

    ngOnInit() {
        this.getDataWalletTypes();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.search) {
            this.getDataWalletTypes();
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
        // set current wallet-type to the previous state
        let tempList = JSON.parse(JSON.stringify(this.listWalletTypes));
        tempList[this.indexEditting] = this.listWalletTypesSaved[this.indexEditting];
        this.listWalletTypes = [...tempList];

        this.indexEditting = index;
        this.nameEditting = this.listWalletTypes[index].name;
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
        this.commonService.updateWalletType({
            name: this.nameEditting,
            icon: this.listWalletTypes[index].icon._id,
            id: this.listWalletTypes[index]._id
        }).subscribe(res => {
            this.getDataWalletTypes();
            this.toastService.success(CONSTS.messages.update_walettype_success);
        }, error => {
            this.toastService.error(CONSTS.messages.update_walettype_fail);
            console.error(error);
        })
    }

    renewListChecked() {
        let tempChecked: boolean[] = [];
        for (let i = 0; i < this.listWalletTypes.length; i++) {
            tempChecked.push(false);
        }
        this.listChecked = [...tempChecked];
    }

    getDataWalletTypes() {
        this.loading = true;
        this.commonService.getListWalletTypes({ search: this.search, page: this.page, size: this.pageSize }).subscribe(res => {
            this.loading = false;
            this.listWalletTypes = [...res.results];
            this.total = res.total;
            setTimeout(() => {
                this.renewListChecked();
                this.updatePreviousState();
            });            
        }, () => {
            this.loading = false;
            this.listWalletTypes = [];
        })
    }

    editWalletTypeIcon(index: number) {
        if (this.indexEditting == index) {
            let currentWalletType = this.listWalletTypes[index];
            this.iconSelectionDialogRef = this.iconSelectDialog.open(IconSelectionComponent, {
                data: {
                    icons: [...this.icons],
                    currentPath: currentWalletType.icon.path
                }
            });
            this.iconSelectionDialogRef.afterClosed().subscribe((data: string) => {
                if (data) {
                    let tempList = JSON.parse(JSON.stringify(this.listWalletTypes));                    
                    let icon = this.icons.filter(i => i.path === data)[0];
                    tempList[index].icon = icon;
                    this.listWalletTypes = [...tempList];
                }
            });
        }
    }

    onChangePage(evt: PageEvent){
        this.page = evt.pageIndex;
        this.pageSize = evt.pageSize;
        this.getDataWalletTypes();
    }

    /**
     * call this function after saving data
     * store the state before the showing list is modified and restore after if needed
     */
    updatePreviousState() {
        let temp = JSON.parse(JSON.stringify(this.listWalletTypes));
        this.listWalletTypesSaved = [...temp];
    }
    /* #endregion */
}