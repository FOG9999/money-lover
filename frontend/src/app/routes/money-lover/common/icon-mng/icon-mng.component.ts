import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Icon } from 'app/model/icon.model';
import { IconAddComponent } from './icon-add-dialog.component';

@Component({
    selector: 'icon-mng',
    templateUrl: 'icon-mng.component.html',
    styleUrls: ['./icon-mng.component.scss']
})

export class IconManagementComponent implements OnInit, OnChanges {
    constructor() { }

    listChecked: boolean[] = [];

    @Input() icons: Icon[];

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.icons){
            this.renewListChecked();
        }
    }

    renewListChecked() {
        let tempChecked: boolean[] = [];
        for (let i = 0; i < this.icons.length; i++) {
            tempChecked.push(false);
        }
        this.listChecked = [...tempChecked];
    }
}