import { Account } from "./accountTypes";

export type User = {
    name: string;
    password?: string | null;
    email: string;
    icon: string;
    accessToken: string;
}

export interface RegisterUser extends User, Account {};