import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Icon } from 'app/model/icon.model';
import { IconAddComponent } from './icon-add-dialog.component';
import { Subject, interval, takeUntil, timer } from 'rxjs';

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
    allIcons: Icon[] = [];

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.icons && this.startLoadAllIcons == true){
            this.renewListChecked();
        }
        if(changes.startLoadAllIcons){
            if(changes.startLoadAllIcons.currentValue){
                console.log('start loading all icons ...');
                this.allIcons = this.icons.map(i => ({...i, path: ''}));
                setTimeout(() => { // wait till tab's switching animation finished         
                    console.log('processing images ...');
                    this.processImages(this.icons);
                }, 2000);
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

    processImages(restIcons: Icon[]){
        if(!restIcons.length) return;
        let clone = [...this.allIcons];
        let index = this.currentRenderLength;
        for (; index < this.icons.length && index < this.currentRenderLength + 15; index++) {
            clone[index].path = this.icons[index].path;
        }
        this.currentRenderLength = index;
        this.allIcons = [...clone];
        console.log(`${Math.round(this.currentRenderLength / this.icons.length * 100)}%`)
        timer(1000).subscribe(() => {
            this.processImages(this.icons.filter((_, ind) => ind >= this.currentRenderLength));
        })
    }
}