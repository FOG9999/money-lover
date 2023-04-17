import { Base } from "./base.model";
import { Budget } from "./budget.model";
import { Category } from "./category.model";
import { User } from "./user.model";
import { Wallet } from "./wallet.model";

export interface Transaction extends Base {
    amount?: number,
    budget?: Budget,
    category?: Category,
    wallet?: Wallet,
    dateCreated?: Date,
    isDelete?: boolean,
    dateUpdated?: Date,
    user?: User,
    note?: string
}

// used for form create,update
export interface NewTransaction extends Base {
    amount: number;
    budget: string;
    category: string;
    wallet: string;
    note: string;
}