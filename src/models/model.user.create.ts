import { prisma } from "../database/prisma-client";
import { UserDB } from "../types/userTypes";

async function createUser(data) {
    const user = await prisma.user.create({
        data: {
            ...data
        }
    });

    return user;
}

export default createUser;