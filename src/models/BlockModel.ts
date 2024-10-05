import { prisma } from "../database/prisma-client";
import { BlockType } from "../types/blockTypes";
import PageModel from "./PageModel";

interface IBlockData {
    create(type:BlockType, pageId: string): Promise<any>
    getToolsByPageId(pageId: string): Promise<any>
}

class BlockModel implements IBlockData {

    private pgModel: PageModel;

    constructor () {
        this.pgModel = new PageModel();
    }

    // async getNextIndex(pageId: string): Promise<number> {}

    async create(type:BlockType, pageId: string) {}

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