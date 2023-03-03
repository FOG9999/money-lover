import { NgModule } from '@angular/core';
import { IconService } from '@shared';
import { SharedModule } from '@shared/shared.module';
import { CategoryDialogComponent } from './common/category/category-dialog.component';
import { CategoryComponent } from './common/category/category.component';
import { IconSelectionComponent } from './common/category/icon-selection.component';
import { MoneyCommonComponent } from './common/common.component';
import { CommonService } from './common/common.service';
import { IconAddComponent } from './common/icon-mng/icon-add-dialog.component';
import { IconManagementComponent } from './common/icon-mng/icon-mng.component';
import { WalletTypeDialogComponent } from './common/wallet-type/wallet-type-dialog.component';
import { WalletTypeComponent } from './common/wallet-type/wallet-type.component';
import { MoneyLoverRoutingModule } from './money-lover-routing.module';
import { UserCategoryComponent } from './user-category/user-category.component';
import { WalletDialogComponent } from './user-wallet/user-wallet-dialog.component';
import { UserWalletComponent } from './user-wallet/user-wallet.component';
import { WalletService } from './user-wallet/user-wallet.service';

const COMPONENTS = [
    MoneyCommonComponent,
    CategoryComponent,
    CategoryDialogComponent,
    IconSelectionComponent,
    IconManagementComponent,
    IconAddComponent,
    WalletTypeComponent,
    WalletTypeDialogComponent,
    UserCategoryComponent,
    UserWalletComponent,
    WalletDialogComponent
];

@NgModule({
    imports: [SharedModule, MoneyLoverRoutingModule],
    declarations: [...COMPONENTS],
    providers: [IconService, CommonService, WalletService]
})
export class MoneyLoverModule { }
