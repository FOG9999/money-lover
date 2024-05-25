import { Action } from "./action.model";
import { Module } from "./module.model";
import { User } from "./user.model";

export interface ModuleAction {
    module: Module;
    actions: Action[];
    userCreated: User | string;
    dateCreated: Date;
}