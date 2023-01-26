import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewWalletType } from 'app/model/wallet-type.model';
import { Icon } from 'app/model/icon.model';

@Component({
    selector: 'wallet-type-dialog',
    templateUrl: 'wallet-type-dialog.component.html',
    styleUrls: ['./wallet-type-dialog.component.scss']
})

export class WalletTypeDialogComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {icons: Icon[]},
        public dialogRef: MatDialogRef<WalletTypeDialogComponent>
    ) { }

    walletType: NewWalletType = {
        walletTypeName: "Tên loại ví 1",
        selectedIcon: "0ef3cdd7-d90a-4fa3-86f6-5139bad3691b.png"
    }
    selectedIndexIcon: number = -1;
    isValid: boolean = false;

    ngOnInit() { }

    /* #region Logic handler */
    checkValid() {
        if(!!this.walletType.walletTypeName){
            if(!this.walletType.walletTypeName.trim()){
                this.isValid = false;
                return;
            }
            this.isValid = true;
            return;
        }
        else if(!this.walletType.walletTypeName){
            this.isValid = false;
            return;
        }
        this.isValid = true;
        return;
    }

    selectIcon(index: number){
        this.selectedIndexIcon = index;
        let clone = {...this.walletType};
        clone.selectedIcon = this.data.icons[index].path;
        this.walletType = {...clone};
        this.checkValid();
    }

    closeDialog(){
        this.dialogRef.close();
    }
    /* #endregion */
}