import { prisma } from "../../lib/prisma";
import { User } from "../../types/userTypes";

export default async function registerUser({
    name,
    password,
    email,
    icon,
    planId
}:User) {
    const user = await prisma.user.create({
        data: {
            name,
            password,
            email,
            icon,
            planId
        }
    });

    return user;
}