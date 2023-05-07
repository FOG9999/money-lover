import { Base } from "./base.model";
import { Budget } from "./budget.model";
import { Category } from "./category.model";
import { User } from "./user.model";
import { Wallet } from "./wallet.model";

export interface Transaction extends Base {
    amount?: number,
    budget?: Partial<Budget>,
    category?: Partial<Category>,
    wallet?: Partial<Wallet>,
    dateCreatedObj?: Date,
    isDelete?: boolean,
    dateUpdatedObj?: Date,
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
    dateCreated: Date
}

// used to import transactions from Money Lover
export interface TransactionImport {
    CATEGORY: Category;
    AMOUNT: number;
    NOTE: string;
    WALLET: Wallet;
    notIncludeInReport: boolean;
    DATE: string;
    dateCreatedObj: Date;    
}