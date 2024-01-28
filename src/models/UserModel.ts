import { prisma } from "../database/prisma-client";
import formatTitle from "../utils/formatTitle"

class UserModel {

    async create(data) {
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

    async getByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
    
        return user;
    }
    
    async getById(id: string) {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        });
    
        return user;
    }

    async update(data) {

        const key = data.id ? { id: data.id } : { email: data.email };

        const user = await prisma.user.update({
            where: key,
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                icon: data.icon
            }
        });
    
        return user;
    }

    async delete(id: string, trash: boolean) {

        const userDeleted = await prisma.workspace.update({
            where: {
                userId: id
            },
            data: {
                user: {
                    update: {
                        trash: trash
                    }
                },
                database: {
                    update: {
                        trash: trash
                    }
                }
            }
        });

        return userDeleted;
    }

    async deletePermanently(id: string) {

        const userDeleted = await prisma.user.delete({
            where: {
                id: id
            }
        });
    
        return userDeleted;
    }
}

export default UserModel;