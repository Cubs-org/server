import { prisma } from "../database/prisma-client";

class PageModel {
    async getAllPages() {
        const pages =  await prisma.page.findMany();
        return pages;
    }
    
    async getPageById(id: string) {
        const page = await prisma.page.findFirst({
            where: {
                id: id
            }
        });
        return page;
    }
    
    async getPageByOwner(owner: string) {
        const page = await prisma.page.findFirst({
            where: {
                ownerId: owner
            }
        });
        return page;
    }
}

export default PageModel;