import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './report.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {
        path: '',
        component: ReportComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class ReportRoutingModule { }