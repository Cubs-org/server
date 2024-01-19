import createKanban from "../models/KanbanModel";
import { KanbanType } from "../types/kanbanTypes";

const model = new createKanban();

class KanbanController {

    async create({ title, type }:KanbanType) {

        const data = {
            title: title ? title : "Quadro Kanban",
            type: type
        };
    
        try {
            const kanban = await model.create(data);
            
            return kanban;
        } catch (error) {
            return error;
        }
    }
}

export default KanbanController;