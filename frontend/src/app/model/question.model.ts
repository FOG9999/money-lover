import { Base } from "./base.model";
import { User } from "./user.model";

export interface SecurityQuestion extends Base {
    question: string;
    creator: User;
    /**
     * num of users currently uses it
     */
    currentUsage: number;
}