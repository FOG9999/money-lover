import { Base } from "./base.model";
import { Icon } from "./icon.model";
import { User } from "./user.model";

export interface Category extends Base {
    name: string,
    dateCreated?: Date,
    isDelete?: boolean,
    dateUpdated?: Date,
    isDefault?: number,
    creator?: User,
    icon: Icon,
    /**
     * 0 - outcome; 1 - income
     */
    transactionType: 0 | 1 
}

export interface NewCategory {
    categoryName?: string,
    selectedIcon?: string,
    transactionType: number,
    isDefault?: number
}