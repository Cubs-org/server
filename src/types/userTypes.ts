import { Account } from "./accountTypes";

export type User = {
    name: string;
    password?: string | null;
    email: string;
    icon: string;
}

export type  UserDB = User & Account | null;