import { Base } from "./base.model";

export interface Role extends Base {
    title: string;
    description: string;
    code: string;
    status: 0 | 1;    
    is_delete: boolean;
}