import { prisma } from "../database/prisma-client";

async function createKanban(data) {
    const kanban = await prisma.kanban.create({
        data: {
            title: data.title,
            type: data.type
        }
    });
    return kanban;
}

export default createKanban;