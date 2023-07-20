import { NgModule } from '@angular/core';
import { UsersListComponent } from './users/users.component';
import { UsersService } from './users/users.service';
import { SharedModule } from '@shared';
import { SystemRoutingModule } from './system-routing.module';

@NgModule({
    imports: [SharedModule, SystemRoutingModule],
    exports: [],
    declarations: [
        UsersListComponent
    ],
    providers: [
        UsersService
    ],
})
export class SystemModule { }
