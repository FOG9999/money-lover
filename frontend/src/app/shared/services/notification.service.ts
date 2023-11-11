import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PriorityDialogComponent } from '@theme/notification/priority-dialog.component';

@Injectable({providedIn: 'root'})
export class NotificationService {
    constructor(private dialogService: MatDialog) { }
    
    warningLogin(notification: Partial<Notification>){
        this.dialogService.open(PriorityDialogComponent, {
            width: '300px',
            data: {...notification}
        })
    }
}