import { prisma } from "../database/prisma-client";

class KanbanModel {

    async create(data) {
        const kanban = await prisma.kanban.create({
            data: {
                ...data
            }
        });
        return kanban;
    }

    async getAll() {
        const kanbans =  await prisma.kanban.findMany();
        return kanbans;
    }
    
    async getById(id: string) {
        const kanban = await prisma.kanban.findFirst({
            where: {
                id: id
            }
        });
        return kanban;
    }
}

export default KanbanModel;