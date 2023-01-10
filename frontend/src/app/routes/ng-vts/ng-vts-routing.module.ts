import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VTSButtonComponent } from './button/vts-button.component';

export const routes: Routes = [
    {
        path: 'vts-button',
        component: VTSButtonComponent
    }
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class NgVTSRoutingModule {}
  