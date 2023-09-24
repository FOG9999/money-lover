import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RoutesRoutingModule } from './routes-routing.module';
import { LoginComponent } from './sessions/login/login.component';
import { RegisterComponent } from './sessions/register/register.component';
import { TwoFactorAuthenComponent } from './sessions/two-factor-authen/two-factor-authen.component';

const COMPONENTS = [LoginComponent, RegisterComponent, TwoFactorAuthenComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [SharedModule, RoutesRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class RoutesModule {}
