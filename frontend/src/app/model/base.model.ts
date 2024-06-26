import { User } from "./user.model";

export interface Base {
    _id?: string,
    dateCreated?: Date,
    isDelete?: boolean,
    dateUpdated?: Date,
}

export interface BaseSearch {
    search: string;
    page: number;
    size: number;
}