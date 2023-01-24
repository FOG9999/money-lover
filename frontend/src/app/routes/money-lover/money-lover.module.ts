import { NgModule } from '@angular/core';
import { IconService } from '@shared';
import { SharedModule } from '@shared/shared.module';
import { CategoryDialogComponent } from './common/category/category-dialog.component';
import { CategoryComponent } from './common/category/category.component';
import { IconSelectionComponent } from './common/category/icon-selection.component';
import { MoneyCommonComponent } from './common/common.component';
import { MoneyLoverRoutingModule } from './money-lover-routing.module';

const COMPONENTS = [MoneyCommonComponent, CategoryComponent, CategoryDialogComponent, IconSelectionComponent];

@NgModule({
    imports: [SharedModule, MoneyLoverRoutingModule],
    declarations: [...COMPONENTS],
    providers: [IconService]
})
export class MoneyLoverModule { }
