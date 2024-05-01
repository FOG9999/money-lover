import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'calendar-range',
    templateUrl: 'calendar-range.component.html',
    styleUrls: ['calendar-range.component.scss']
})

export class CalendarRangeComponent {
    constructor(
        private dialogRef: MatDialogRef<CalendarRangeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string, timeFrom: Date, timeTo: Date, okText?: string }
    ) { 
        if(this.data){
            this.timeFrom = this.data.timeFrom;
            this.timeTo = this.data.timeTo;
            if(this.data.okText) this.okText = this.data.okText;
        }
    }
    
    timeFrom: Date;
    timeTo: Date;
    okText: string = "Chọn";

    close(){
        this.dialogRef.close();
    }
}