import { User } from "./user.model";

export interface Icon {
    code: string,
    dateCreated: Date,
    isDelete: boolean,
    dateUpdated: Date,
    isDefault: number,
    creator: User,
    path: string
}