import { prisma } from "../database/prisma-client";

async function findWorkspaceById(id: string) {
    const workspace = await prisma.workspace.findUnique({
        where: {
            id
        }
    });
    return workspace;
};

async function findWorkspaceByUserId(userId: string) {
    const workspace = await prisma.workspace.findFirst({
        where: {
            user: {
                id: userId
            }
        }
    });
    return workspace;
};

export { findWorkspaceById, findWorkspaceByUserId };