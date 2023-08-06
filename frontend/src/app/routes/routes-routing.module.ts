import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';

import { AdminLayoutComponent } from '../theme/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from '../theme/auth-layout/auth-layout.component';
import { LoginComponent } from './sessions/login/login.component';
import { RegisterComponent } from './sessions/register/register.component';
import { RedirectComponent } from './sysytem/redirect/redirect.component';
import { SecurityQuestionComponent } from './sessions/security-question/security-question.component';

const routes: Routes = [
  {
    path: "money-lover",
    component: AdminLayoutComponent,
    loadChildren: () => import('./money-lover/money-lover.module').then(m => m.MoneyLoverModule),
    data: { title: 'Money Lover', titleI18n: 'money-lover' },
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent, data: { title: 'Login', titleI18n: 'login' } },
      {
        path: 'register',
        component: RegisterComponent,
        data: { title: 'Register', titleI18n: 'register' },
      },
      { path: '**', redirectTo: 'login' }
    ],
  },
  {
    path: 'redirect',
    component: RedirectComponent
  },
  { path: '**', redirectTo: 'auth' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
    }),
  ],
  exports: [RouterModule],
})
export class RoutesRoutingModule {}
