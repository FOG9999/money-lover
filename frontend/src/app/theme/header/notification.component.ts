import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '@shared';
import { ComponentDestroy } from '@shared/components/component-destroy/component-destroy';
import { Notification } from 'app/model/notification.model';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: 'notification.component.html',
  styleUrls: ['notification.component.scss']
})
export class NotificationComponent extends ComponentDestroy implements OnInit, OnDestroy {

  constructor(private notifyService: NotificationService, private cdr: ChangeDetectorRef){
    super();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  ngOnInit(): void {
    this.getListNotify();
    this.notifyService.notificationsChange$.pipe(takeUntil(this.destroy$)).subscribe(newNotification => {
      this.count = this.count + 1;
      this.cdr.detectChanges();
    })
  }

  messages: Partial<Notification>[] = [];
  count: number = 0;

  getListNotify(){
    this.notifyService.getListNotification({isRead: false, size: 5}).subscribe(res => {
      this.messages = res.results;
      this.count = res.total;
      this.notifyService.setNotificationCount(res.total);
      this.cdr.detectChanges()
    })
  }

  onOpenMenu(){
    this.getListNotify();
  }
}
