import { prisma } from "../database/prisma-client";

class PageModel {

    async create(pageName: string, ownerId: string) {
        const page = await prisma.page.create({
            data: {
                title: pageName,
                ownerId: ownerId
            }
        });
        return page;
    }

    async update(pageId: string, title?: string, description?: string) {

        let pageData;

        if (title !== undefined) {
            pageData = {
                title: title
            }
        }

        if (description !== undefined) {
            pageData = {
                ...pageData,
                description
            }
        }

        const page = await prisma.page.update({
            where: {
                id: pageId
            },
            data: {
                ...pageData
            }
        });
        return page;
    }

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
    
    async getPagesByOwner(owner: string) {
        const page = await prisma.page.findMany({
            where: {
                ownerId: owner
            }
        });
        return page;
    }

    async getPropertiesByPage(pageId: string) {
        const properties = await prisma.pageProperties.findMany({
            where: {
                pageId: pageId
            }
        });
        return properties;
    }
}

export default PageModel;