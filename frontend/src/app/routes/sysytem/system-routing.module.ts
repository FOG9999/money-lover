import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuardService } from '@shared';
import { UsersListComponent } from './users/users.component';

export const routes: Routes = [
    {
        path: "user-list",
        canActivate: [AdminAuthGuardService],
        component: UsersListComponent,
        data: { title: 'Người dùng', titleI18n: 'user-list' },
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class SystemRoutingModule { }