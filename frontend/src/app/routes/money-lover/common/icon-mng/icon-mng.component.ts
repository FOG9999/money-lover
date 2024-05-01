import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Icon } from 'app/model/icon.model';

@Component({
    selector: 'icon-mng',
    templateUrl: 'icon-mng.component.html',
    styleUrls: ['./icon-mng.component.scss']
})

export class IconManagementComponent implements OnInit, OnChanges {
    constructor() { }

    listChecked: boolean[] = [];

    @Input() startLoadAllIcons: boolean = false;
    @Input() icons: Icon[];

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.icons && this.startLoadAllIcons == true){
            this.renewListChecked();
        }
        if(changes.startLoadAllIcons){
            if(changes.startLoadAllIcons.currentValue){
                console.log('start loading all icons ...');
            }
        }
    }

    renewListChecked() {
        let tempChecked: boolean[] = [];
        for (let i = 0; i < this.icons.length; i++) {
            tempChecked.push(false);
        }
        this.listChecked = [...tempChecked];
    }

    currentRenderLength: number = 0;
}