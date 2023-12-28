import { Account } from "./accountTypes";

export type User = {
    name: string;
    password: string;
    email: string;
    icon: string;
}

export interface RegisterUser extends User, Account {};