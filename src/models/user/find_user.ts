import { prisma } from "../../lib/prisma";

async function findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    return user;
}

async function findUserById(id: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });

    return user;
}

export { findUserById, findUserByEmail };