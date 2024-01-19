import { prisma } from "../database/prisma-client";

class WorkspaceModel {

    async create(data) {
        const workspace = await prisma.workspace.create({
            data: {
                kanbanId: data.kanbanId,
                userId: data.userId,
            }
        });
        return workspace;
    }

    async getAllWorkspaces() {
        const workspaces =  await prisma.workspace.findMany();
        return workspaces;
    }

    async getById(id: string) {
        const workspace = await prisma.workspace.findUnique({
            where: {
                id
            }
        });
        return workspace;
    }
    
    async getByUserId(userId: string) {
        const workspace = await prisma.workspace.findFirst({
            where: {
                user: {
                    id: userId
                }
            }
        });
        return workspace;
    }
}
 export default WorkspaceModel;