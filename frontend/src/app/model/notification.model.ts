import { Base } from "./base.model";

export interface Notification extends Base {
    user: string;
    type: "user" | "system";
    repeat: boolean;
    priority: number;
    title: string;
    isRead: boolean;
    description: string;
    link: string;
}