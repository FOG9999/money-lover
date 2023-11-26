import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
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

  @ViewChild('menu') menuNotify: MatMenu;

  ngOnInit(): void {
    this.getListNotify();
    this.notifyService.notificationsChange$.pipe(takeUntil(this.destroy$)).subscribe(newNotification => {
      this.count = this.count + 1;
      if(this.isMenuOpened){
        this.messages = [newNotification, ...this.messages];
      }
      this.cdr.detectChanges();
    })
  }

  onClickHeader(e: Event){
    e.stopPropagation();
  }

  messages: Partial<Notification>[] = [];
  count: number = 0;
  isMenuOpened: boolean = false;

  getListNotify(){
    this.notifyService.getListNotification({size: 5}).subscribe(res => {
      this.messages = res.results;
      this.count = res.totalUnread;
      this.notifyService.setNotificationCount(res.totalUnread);
      this.cdr.detectChanges()
    })
  }

  onOpenMenu(){
    this.isMenuOpened = true;
    this.getListNotify();
  }

  onCloseMenu(){
    this.isMenuOpened = false;
    this.markAllRead();
  }

  markAllRead(){
    let readMessages = this.messages.filter(m => !m.isRead).map(m => m._id);
    if(readMessages.length){
      this.notifyService.markRead(readMessages).subscribe(() => {
        this.messages = this.messages.map(m => ({...m, isRead: true}))
        this.cdr.detectChanges()
      })
    }
  }

  openDetailNotification(message: Partial<Notification>){
    this.notifyService.openNotifyDetail(message);
  }
}
