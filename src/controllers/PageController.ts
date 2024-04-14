import WorkspaceModel from "../models/WorkspaceModel";
import PageModel from "../models/PageModel";

import { Page, PageProperty } from "../types/pagesTypes";

import { HTTP_STATUS } from "../lib/http_status";

class PageController {

    private pageModel: PageModel = new PageModel();
    private wkspModel: WorkspaceModel;

    constructor() {
        this.pageModel = new PageModel();
        this.wkspModel = new WorkspaceModel();
    }

    async create(req, reply) {

        const { title, ownerId, datahubId } = req.body;

        try {
            if (!title && !ownerId) throw new Error('Missing parameters');
            else {

                let page:Page;
                if (datahubId) page = await this.pageModel.create(title, ownerId, datahubId);
                else page = await this.pageModel.create(title, ownerId);

                return reply.send({ page, status: HTTP_STATUS.OK });
            }
        } catch (error:any) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            console.error("Message:", errorMessage);
            return reply.send({ message: errorMessage, status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
        }
    }

    async update(req, reply) {

        const { pageId } = req.params,
            { title } = req.body;

        try {
            if (!pageId) throw new Error('Missing pageId parameter');

            if (!title) throw new Error('Missing parameters');

            const page = await this.pageModel.update(pageId, title);

            return reply.send({ page, status: HTTP_STATUS.OK });
        } catch (error:any) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            console.error("Message:", errorMessage);
            return reply.send({ message: errorMessage, status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
        }
    }

    async getAllPagesFromUser(req, reply) {

        const { userId } = req.params;

        const pagesFromOwner:Page[] = await this.pageModel.getPagesByOwner(userId),
            pages:Page[] | null = [];

        if (pagesFromOwner.length > 0) {

            for (let page of pagesFromOwner) {

                const pageProperties: PageProperty[] = await this.pageModel.getPropertiesByPage(page.id) as PageProperty[];
                
                if (pageProperties.length > 0) {
                    pages.push({
                        ...page,
                        properties: pageProperties
                    });
                } else {
                    pages.push(page);
                }
            }
        }


        reply.send({ pages, status: HTTP_STATUS.OK });
    }

    async getPagesByMember(req, reply) {
            
            const { userId } = req.params;
    
            try {
                
                const pages = await this.wkspModel.getPagesByMemberId(userId);
    
                return reply.send({ pages, status: HTTP_STATUS.OK });
            } catch (error:any) {
                console.error("Message:", error.message);
            }
    }
}

export default PageController;