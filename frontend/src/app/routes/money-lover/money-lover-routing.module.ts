import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MoneyCommonComponent } from './common/common.component';
import { UserCategoryComponent } from './user-category/user-category.component';

const routes: Routes = [
  {
    path: 'common',
    component: MoneyCommonComponent,
    data: { title: 'Danh mục', titleI18n: 'common' },
  },
  {
    path: 'user-category',
    component: UserCategoryComponent,
    data: { title: 'Chủng loại', titleI18n: 'user-category' },
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoneyLoverRoutingModule { }
