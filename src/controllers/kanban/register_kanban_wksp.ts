import createKanban from "../../models/kanban/create_kanban_wksp";
import { KanbanType } from "../../types/kanbanTypes";

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