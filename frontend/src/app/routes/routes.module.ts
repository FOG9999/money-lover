import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RoutesRoutingModule } from './routes-routing.module';
import { LoginComponent } from './sessions/login/login.component';
import { RegisterComponent } from './sessions/register/register.component';
import { TwoFactorAuthenComponent } from './sessions/two-factor-authen/two-factor-authen.component';
import { SentEmailChangePassComponent } from './sessions/change-password/sent-email-change-pass.component';

const COMPONENTS = [LoginComponent, RegisterComponent, TwoFactorAuthenComponent, SentEmailChangePassComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [SharedModule, RoutesRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class RoutesModule {}
