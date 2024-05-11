import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuardService } from '@shared';
import { UsersListComponent } from './users/users.component';
import { SecurityQuestionMngComponent } from './security-question-mng/security-question-mng.component';
import { RoleMngComponent } from './roles/roles.component';
import { ActionMngComponent } from './actions/actions.component';

export const routes: Routes = [
    {
        path: "user-list",
        canActivate: [AdminAuthGuardService],
        component: UsersListComponent,
        data: { title: 'Người dùng', titleI18n: 'user-list' },
    },
    {
        path: "security-question",
        canActivate: [AdminAuthGuardService],
        component: SecurityQuestionMngComponent,
        data: { title: 'Câu hỏi bảo mật', titleI18n: 'security-question' },
    },
    {
        path: "role",
        canActivate: [AdminAuthGuardService],
        component: RoleMngComponent,
        data: {title: "Vai trò hệ thống", titleI18n: "role"}
    },
    {
        path: "action",
        canActivate: [AdminAuthGuardService],
        component: ActionMngComponent,
        data: {title: "Hành động hệ thống", titleI18n: "action"}
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class SystemRoutingModule { }