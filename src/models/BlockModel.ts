import { prisma } from "../database/prisma-client";
import { ToolType } from "../types/tools";
import PageModel from "./PageModel";

interface IBlockData {
    create(type:ToolType, pageId: string): Promise<any>
    getToolsByPageId(pageId: string): Promise<any>
}

class BlockModel implements IBlockData {

    private pgModel: PageModel;

    constructor () {
        this.pgModel = new PageModel();
    }

    async getNextIndex(pageId: string): Promise<number> {
        const sequence = await prisma.block.findMany({
            where: {
                pageId
            },
            orderBy: {
                orderY: "desc"
            },
            take: 1
        });

        return sequence.length ? sequence[0].orderY + 1 : 1;
    }

    async create(type:ToolType, pageId: string) {

        const page = await this.pgModel.getPageById(pageId);

        if (!page) throw new Error("Page not found");

        const nextIndex = await this.getNextIndex(pageId);

        const tool = await prisma.block.create({
            data: {
                type,
                orderY: nextIndex,
                orderX: 1,
                data: JSON.stringify({
                    ...(type === "text" && { text: "Some new Text" }),
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
    
        const tools = await prisma.block.findMany({
            where: {
                pageId
            }
        });
    
        return tools;
    }
}

export default BlockModel;