import { prisma } from "../database/prisma-client";

async function createKanban(data) {
    const kanban = await prisma.kanban.create({
        data: {
            ...data
        }
    });
    return kanban;
}

export default createKanban;