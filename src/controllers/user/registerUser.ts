import { prisma } from "../../lib/prisma";
import { Account } from "../../types/accountTypes";
import { User } from "../../types/userTypes";

interface RegisterUser extends User, Account {};

export default async function registerUser({
    name,
    password,
    email,
    icon
}:User) {

    const data = {
        name,
        email,
        icon,
        password: password ? password : '',
        status: 'active',
        accountType: 'free',
        planType: 'perMonth',
        paymentType: 'creditCard'
    } as RegisterUser;

    let user;

    try {
        const userAlreadyExists = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!userAlreadyExists) {
            user = await prisma.user.create({
                data: {
                    ...data as RegisterUser
                }
            });
        }
    } catch (error) {
        console.error(error);
    }

    return user;
}