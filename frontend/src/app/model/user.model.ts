import { Base } from "./base.model";

export interface User extends Base {
    username: string,
    avatar: string,
    firstname: string,
    lastname: string,
    address: string,
    email: string,
    mobile: string,
    status: number,
    level: string,
    dateCreated: Date,
    is_delete: boolean,
    dateUpdated: Date,
    token: string
}