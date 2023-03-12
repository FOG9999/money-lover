import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminAuthGuardService, AuthGuardService } from '@shared';
import { MoneyCommonComponent } from './common/common.component';
import { UserCategoryComponent } from './user-category/user-category.component';
import { UserWalletComponent } from './user-wallet/user-wallet.component';

const routes: Routes = [
  {
    path: "admin",
    canActivate: [AdminAuthGuardService],
    children: [
      {
        path: 'common',
        component: MoneyCommonComponent,
        data: { title: 'Danh mục', titleI18n: 'common' },
      },
      {
        path: '**', redirectTo: 'common'
      }
    ]
  },
  {
    path: '',
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'user-category',
        component: UserCategoryComponent,
        data: { title: 'Chủng loại', titleI18n: 'user-category' },
      },
      {
        path: 'user-wallet',
        component: UserWalletComponent,
        data: { title: 'Ví tiền', titleI18n: 'user-wallet' },
      },
      {
        path: '**', redirectTo: 'user-category'
      }
    ]
  },
  {path: '**', redirectTo: 'auth'}  
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoneyLoverRoutingModule { }
