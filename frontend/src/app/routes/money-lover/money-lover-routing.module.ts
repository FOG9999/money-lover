import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MoneyCommonComponent } from './common/common.component';

const routes: Routes = [
    {
        path: 'common',
        component: MoneyCommonComponent,
        data: { title: 'Common', titleI18n: 'Common' },
      }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
export class MoneyLoverRoutingModule { }
