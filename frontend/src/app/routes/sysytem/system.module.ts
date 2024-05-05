import { NgModule } from '@angular/core';
import { UsersListComponent } from './users/users.component';
import { SharedModule } from '@shared';
import { SystemRoutingModule } from './system-routing.module';
import { SecurityQuestionMngComponent } from './security-question-mng/security-question-mng.component';
import { SecurityQuestionDetailComponent } from './security-question-mng/security-question-detail/security-question-detail.component';
import { RoleMngComponent } from './roles/roles.component';
import { RoleDialogComponent } from './roles/role-dialog.component';

@NgModule({
    imports: [SharedModule, SystemRoutingModule],
    exports: [],
    declarations: [
        UsersListComponent,
        SecurityQuestionMngComponent,
        SecurityQuestionDetailComponent,
        RoleMngComponent,
        RoleDialogComponent
    ]
})
export class SystemModule { }
