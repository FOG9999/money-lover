import { Icon } from "./icon.model";
import { User } from "./user.model";

export interface Budget{
    name: string,
    dateCreated: Date,
    isDelete: boolean,
    dateUpdated: Date,
    isDefault: number,
    creator: User,
    icon: Icon
}