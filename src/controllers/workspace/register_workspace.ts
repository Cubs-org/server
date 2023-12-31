import createWorkspace from "../../models/workspace/create_workspace";
import { KanbanType } from "../../types/kanbanTypes";
import registerKanban from "../kanban/register_kanban_wksp";

async function registerWorkspace(userId: string) {
    try {
        const kanban = await registerKanban({ type: "project", title: "Meu Kanban" }) as KanbanType;

        if (kanban && kanban.id) {
            const workspaceData = {
                kanbanId: kanban.id,
                userId: userId
            };

            const workspace = await createWorkspace(workspaceData);

            return workspace;
        }
    } catch (error) {
        return error;
    }
}

export default registerWorkspace;