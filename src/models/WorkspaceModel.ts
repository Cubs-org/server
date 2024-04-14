import { JsonValue } from "@prisma/client/runtime/library";
import { prisma } from "../database/prisma-client";
import { Data } from "../types/pagesTypes";

type pagesByMember = {
    data: Data;
    title: string;
    updated_at: string;
    email: string;
    is_admin: boolean;
};

class WorkspaceModel {

    async getAllWorkspaces() {
        const workspaces =  await prisma.workspace.findMany();
        return workspaces;
    }

    async getPagesByMemberId(userId: string): Promise<{pages: pagesByMember[]}> {
        const pages = await prisma.$queryRaw<{pages: pagesByMember[]}>`
            SELECT
                page.data,
                page.title,
                page.updated_at,
                user.email,
                member.is_admin
            FROM 
                member 
            JOIN 
                user ON user.id = member.user_id
            JOIN
                page_properties ON member.page_properties_id = page_properties.id
            JOIN 
                page ON page_properties.page_id = page.id
            WHERE 
                member.user_id = 'd5db2b7b-1573-45a7-a0ad-73cea311d369';
        `;

        return pages;
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