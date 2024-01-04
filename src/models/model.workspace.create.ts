import { prisma } from "../database/prisma-client";

async function createWorkspace(data) {
    const workspace = await prisma.workspace.create({
        data: {
            kanbanId: data.kanbanId,
            userId: data.userId,
        }
    });
    return workspace;
}

export default createWorkspace;