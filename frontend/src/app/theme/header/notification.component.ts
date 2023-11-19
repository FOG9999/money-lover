import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '@shared';
import { ComponentDestroy } from '@shared/components/component-destroy/component-destroy';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-notification',
  template: `
    <button mat-icon-button class="matero-toolbar-button" [matMenuTriggerFor]="menu">
      <mat-icon>notifications</mat-icon>
      <span class="badge bg-red-500">{{count}}</span>
    </button>

    <mat-menu #menu="matMenu" (menuOpened)=onOpenMenu($event)>
      <mat-nav-list>
        <mat-list-item *ngFor="let message of messages">
          <a matLine href="#">{{ message.title }}</a>
          <button mat-icon-button>
            <mat-icon>info</mat-icon>
          </button>
        </mat-list-item>
      </mat-nav-list>
    </mat-menu>
  `,
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
    this.notifyService.notificationsChange$.pipe(takeUntil(this.destroy$)).subscribe(notiCount => {
      this.count = notiCount;
    })
  }

  messages: Partial<Notification>[] = [];
  count: number = 0;

  getListNotify(){
    this.notifyService.getListNotification({isRead: false, size: 1000}).subscribe(res => {
      this.messages = res.results;
      this.count = res.total;
      this.cdr.detectChanges()
    })
  }

  onOpenMenu(evt: Event){
    console.log(evt);
    this.getListNotify();
  }
}
