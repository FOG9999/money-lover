import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '@env/environment';
import { PriorityDialogComponent } from '@theme/notification/priority-dialog.component';
import { BaseSearch } from 'app/model/base.model';
import { Notification } from 'app/model/notification.model';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class NotificationService {
    constructor(private dialogService: MatDialog, private http: HttpClient) { }

    private notificationCount: number = 0;
    notificationsChange$ = new Subject<number>();
    
    warningLogin(notification: Partial<Notification>){
        this.dialogService.open(PriorityDialogComponent, {
            width: '300px',
            data: {...notification}
        })
    }

    setNotificationCount(count: number){
        this.notificationCount = count;
        this.notificationsChange$.next(count);
    }

    getNotificationCount(){
        return this.notificationCount;
    }

    getListNotification(params: Partial<Notification & BaseSearch>){
        const api_name: string = "api.v1.notification.list";
        return this.http.post<{results: Partial<Notification>[], total: number}>(environment.SERVER_URL, { api_name, ...params }, { observe: "body" });
    }
}