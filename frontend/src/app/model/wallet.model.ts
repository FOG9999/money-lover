import { Base } from "./base.model";
import { User } from "./user.model";
import { WalletType } from "./wallet-type.model";

export interface Wallet extends Base {
    amount: number,
    dateCreated: Date,
    isDelete: boolean,
    dateUpdated: Date,
    isDefault: number,
    user: User,
    includeInTotal: 0 | 1,
    walletType: WalletType
}

export interface WalletForm extends Base {
    amount: number,
    dateCreated: Date,
    isDelete: boolean,
    dateUpdated: Date,
    isDefault: number,
    user: string,
    includeInTotal: 0 | 1,
    walletType: string
}