import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Notification } from 'app/model/notification.model';

@Component({
    selector: 'priority-dialog',
    templateUrl: 'priority-dialog.component.html',
    styleUrls: ['priority-dialog.component.scss']
})

export class PriorityDialogComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<PriorityDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Partial<Notification>,
    ) { 
        console.log(data)
    }

    ngOnInit() { }

    noRepeat(){

    }

}