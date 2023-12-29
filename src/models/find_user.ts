import { prisma } from "../lib/prisma";

async function findUser(email: string) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        return user;
    } catch (error) {
        console.error(error);
        return error;
    }
}

export default findUser;