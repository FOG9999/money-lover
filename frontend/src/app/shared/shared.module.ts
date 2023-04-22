import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material.module';
import { MaterialExtensionsModule } from '../material-extensions.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { NgProgressRouterModule } from 'ngx-progressbar/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { ErrorCodeComponent } from './components/error-code/error-code.component';
import { MLIconComponent } from './components/money-lover/icon/icon.component';
import { ConfirmDeletionComponent } from './components/money-lover/confirm-deletion/confirm-deletion.component';
import { NumberFormatDirective } from './directives/number-foramat.directive';
import { AppLoadingComponent } from './components/money-lover/app-loading/app-loading.component';

const THIRD_MODULES = [
  MaterialModule,
  MaterialExtensionsModule,
  FlexLayoutModule,
  NgProgressModule,
  NgProgressRouterModule,
  NgProgressHttpModule,
  NgSelectModule,
  FormlyModule,
  FormlyMaterialModule,
  ToastrModule,
  TranslateModule,
];
const COMPONENTS = [BreadcrumbComponent, PageHeaderComponent, ErrorCodeComponent, MLIconComponent, ConfirmDeletionComponent, AppLoadingComponent];
const COMPONENTS_DYNAMIC = [];
const DIRECTIVES = [NumberFormatDirective];
const PIPES = [];

@NgModule({
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC, ...DIRECTIVES, ...PIPES],
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule, ...THIRD_MODULES],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    ...THIRD_MODULES,
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class SharedModule {}
