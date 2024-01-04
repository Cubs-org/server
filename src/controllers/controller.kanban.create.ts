import createKanban from "../models/model.kanban.create";
import { KanbanType } from "../types/kanbanTypes";

async function registerKanban({ title, type }:KanbanType) {

    const data = {
        title: title ? title : "Quadro Kanban",
        type: type
    };

    try {
        const kanban = await createKanban(data);
        
        return kanban;
    } catch (error) {
        return error;
    }
}

export default registerKanban;