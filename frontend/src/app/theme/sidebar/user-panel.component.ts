import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@shared';
import { User } from 'app/model/user.model';

@Component({
  selector: 'app-user-panel',
  template: `
    <div class="matero-user-panel" fxLayout="column" fxLayoutAlign="center center">
      <img
        class="matero-user-panel-avatar"
        src="assets/images/avatar.jpg"
        alt="avatar"
        width="64"
      />
      <h4 class="matero-user-panel-name">{{ user.firstname + ' ' + user.lastname }}</h4>
      <h5 class="matero-user-panel-email">{{ user.email }}</h5>
      <div class="matero-user-panel-icons">
        <a routerLink="/profile/overview" mat-icon-button>
          <mat-icon>account_circle</mat-icon>
        </a>
        <a routerLink="/profile/settings" mat-icon-button>
          <mat-icon>settings</mat-icon>
        </a>
        <a routerLink="/auth/login?reload=true" mat-icon-button>
          <mat-icon>exit_to_app</mat-icon>
        </a>
      </div>
    </div>
  `,
})
export class UserPanelComponent implements OnInit {
  constructor(private localStorageSv: LocalStorageService){}

  user: Partial<User> = {};

  ngOnInit(): void {
      this.user = this.localStorageSv.get('user');
  }
}
