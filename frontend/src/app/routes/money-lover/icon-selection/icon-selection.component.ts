import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Icon } from 'app/model/icon.model';

@Component({
    selector: 'icon-selection',
    templateUrl: 'icon-selection.component.html',
    styleUrls: ['./icon-selection.component.scss']
})

export class IconSelectionComponent implements OnInit {
    constructor(private dialogRef: MatDialogRef<IconSelectionComponent>, @Inject(MAT_DIALOG_DATA) public data: {icons: Icon[], currentPath: string}) { }

    selectedIconPath: string;

    ngOnInit() { 
        this.selectedIconPath = this.data.currentPath;
    }

    closeDialog(){
        this.dialogRef.close();
    }

    selectIcon(index: number){
        this.selectedIconPath = this.data.icons[index].path;
    }
}