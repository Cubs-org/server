import { prisma } from "../database/prisma-client";
import { RegisterUser } from "../types/userTypes";

async function createUser(data: RegisterUser) {
    const user = await prisma.user.create({
        data: {
            ...data as RegisterUser
        }
    });

    return user;
}

export default createUser;