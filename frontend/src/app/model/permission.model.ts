import { Base } from "./base.model";
import { ModuleAction } from "./module-action";
import { Role } from "./role.model";
import { User } from "./user.model";

export interface Permission extends Base {
    title: string;
    role: Role;
    description: string;
    userCreated: User | string;
    is_delete: boolean;
    status: 0 | 1;
    code: string;
    allow: boolean;
    moduleAction: ModuleAction[];
}