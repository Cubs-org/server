import { prisma } from "../database/prisma-client";

class PageModel {

    async create(pageName: string, ownerId: string, dataHubId?: string) {

        let pageData;

        if (!dataHubId) {
            pageData = {
                title: pageName,
                ownerId: ownerId
            }
        } else {
            pageData = {
                title: pageName,
                ownerId: ownerId,
                datahubId: dataHubId
            }
        }

        const page = await prisma.page.create({
            data: pageData
        });
        return page;
    }

    async update(pageId: string, title?: string) {

        let pageData;

        if (title !== undefined) {
            pageData = {
                title: title
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

    async delete(id: string) {
        const page = await prisma.page.delete({
            where: {
                id: id
            }
        });
        return page;
    }
}

export default PageModel;