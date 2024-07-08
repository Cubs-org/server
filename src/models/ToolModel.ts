import { prisma } from "../database/prisma-client";
import { ToolType } from "../types/tools";
import setDefaultDataFromTool from "../utils/tools/setDefaultDataFromTool";
import PageModel from "./PageModel";

interface IToolData {
    create(type:ToolType, pageId: string): Promise<any>
    getToolsByPageId(pageId: string): Promise<any>
}

class ToolModel implements IToolData {

    private pgModel: PageModel;

    constructor () {
        this.pgModel = new PageModel();
    }

    async create(type:ToolType, pageId: string) {

        const page = await this.pgModel.getPageById(pageId);

        if (!page) throw new Error("Page not found");

        const tools = await this.getToolsByPageId(pageId);

        const tool = await prisma.tool.create({
            data: {
                type,
                data: JSON.stringify({
                    ...setDefaultDataFromTool(tools.length + 1),
                    ...(type === "text" && { text: "New Text" }),
                }) as string,
                page: {
                    connect: {
                        id: pageId
                    }
                }
            }
        });

        return tool;
    }

    async getToolsByPageId(pageId: string) {
    
        const tools = await prisma.tool.findMany({
            where: {
                pageId
            }
        });
    
        return tools;
    }
}

export default ToolModel;