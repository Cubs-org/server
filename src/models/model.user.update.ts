import { prisma } from "../database/prisma-client";

async function updateUserById(data) {

    const user = await prisma.user.update({
        where: {
            id: data.id
        },
        data: {
            name: data.name,
            email: data.email,
            password: data.password,
            icon: data.icon
        }
    });

    return user;
}

async function updateUserByEmail(data) {

    const user = await prisma.user.update({
        where: {
            email: data.email
        },
        data: {
            name: data.name,
            email: data.email,
            password: data.password,
            icon: data.icon
        }
    });

    return user;
}

export { updateUserById, updateUserByEmail };