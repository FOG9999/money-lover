import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MoneyCommonComponent } from './common/common.component';
import { MoneyLoverRoutingModule } from './money-lover-routing.module';

const COMPONENTS = [MoneyCommonComponent];

@NgModule({
    imports: [SharedModule, MoneyLoverRoutingModule],
    declarations: [...COMPONENTS],
})
export class MoneyLoverModule { }
