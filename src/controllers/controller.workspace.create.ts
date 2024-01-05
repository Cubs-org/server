import { WorkspaceType } from "../types/workspaceTypes";
import createWorkspace from "../models/model.workspace.create";
import { KanbanType } from "../types/kanbanTypes";
import registerKanban from "./controller.kanban.create";

async function registerWorkspace(userId: string): Promise<WorkspaceType | { error: string }> {
    try {
        const kanban = await registerKanban({ type: "project", title: "Meu Kanban" }) as KanbanType;

        if (kanban && kanban.id) {
            const workspaceData = {
                kanbanId: kanban.id,
                userId,
            };

            const workspace = await createWorkspace(workspaceData);

            return workspace;
        } else {
            return { error: "Kanban not created" };
        }
    } catch (error) {
        return { error: "Internal server error" };
    }
}

export default registerWorkspace;
