import { prisma } from "../../lib/prisma";

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