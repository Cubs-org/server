import { prisma } from "../database/prisma-client";

class WorkspaceModel {

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

    async delete(userId: string) {
        const workspaceDeleted = await prisma.workspace.delete({
            where: {
                userId,
            }
        });

        await prisma.dataHub.delete({
            where: {
                id: workspaceDeleted.databaseId
            }
        });

        return workspaceDeleted;
    }

    async getDatabaseId(workspaceId: string) {
        const workspace = await prisma.workspace.findUnique({
            where: {
                id: workspaceId
            }
        });

        if (!workspace) throw new Error("Workspace not found");

        return workspace.databaseId;
    }
}
 export default WorkspaceModel;