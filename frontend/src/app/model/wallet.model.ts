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
    includedInTotal: boolean,
    walletType: WalletType
}