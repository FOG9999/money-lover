import { Base } from "./base.model";
import { User } from "./user.model";

export interface Icon extends Base {
    code?: string,
    dateCreated?: Date,
    isDelete?: boolean,
    dateUpdated?: Date,
    isDefault?: number,
    creator?: User,
    path: string
}