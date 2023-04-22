import { NgModule } from '@angular/core';
import { IconService } from '@shared';
import { SharedModule } from '@shared/shared.module';
import { CategoryDialogComponent } from './common/category/category-dialog.component';
import { CategoryComponent } from './common/category/category.component';
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
import { TransactionListComponent } from './transaction/transaction.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TransactionService } from './transaction/transaction.service';
import { CategorySelectComponent } from './category-select/category-select.component';
import { WalletSelectComponent } from './wallet-select/wallet-select.component';
import { TransactionDialogComponent } from './transaction/transaction-dialog/transaction-dialog.component';
import { IconSelectionComponent } from './icon-selection/icon-selection.component';

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
    WalletDialogComponent,
    TransactionListComponent,
    CategorySelectComponent,
    WalletSelectComponent,
    TransactionDialogComponent
];

@NgModule({
    imports: [SharedModule, MoneyLoverRoutingModule, NgApexchartsModule],
    declarations: [...COMPONENTS],
    providers: [IconService, CommonService, WalletService, TransactionService]
})
export class MoneyLoverModule { }
