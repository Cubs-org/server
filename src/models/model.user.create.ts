import { prisma } from "../database/prisma-client";
import formatTitle from "../utils/formatTitle";

async function createUser(data) {
    const user = await prisma.user.create({
        data: {
            ...data,
            workspace: {
                create: {
                    database: {
                        create: {
                            title: formatTitle(data.name),
                        }
                    }
                }
            }
        }
    });

    return user;
}

export default createUser;