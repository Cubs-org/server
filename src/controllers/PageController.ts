import PageModel from "../models/PageModel";
import { HTTP_STATUS } from "../lib/http_status";
import { Page, PageProperty } from "../types/pagesTypes";

const pageModel = new PageModel();

class PageController {

    async create(req, reply) {

        const { title, ownerId } = req.body;

        try {
            if (!title && !ownerId) throw new Error('Missing parameters');
            else {

                const page = await pageModel.create(title, ownerId);

                return reply.send({ page, status: HTTP_STATUS.OK });
            }
        } catch (error:any) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            console.log("Message:", errorMessage);
            return reply.send({ message: errorMessage, status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
        }
    }

    async update(req, reply) {

        const { pageId } = req.params,
            { title, description } = req.body;

        try {
            if (!pageId) throw new Error('Missing pageId parameter');

            if (!title && !description) throw new Error('Missing parameters');

            const page = await pageModel.update(pageId, title, description);

            return reply.send({ page, status: HTTP_STATUS.OK });
        } catch (error:any) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            console.log("Message:", errorMessage);
            return reply.send({ message: errorMessage, status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
        }
    }

    async getAllPagesFromUser(req, reply) {

        const { userId } = req.params;

        const pagesFromOwner:Page[] = await pageModel.getPagesByOwner(userId),
            pages:Page[] | null = [];

        if (pagesFromOwner.length > 0) {

            for (let page of pagesFromOwner) {

                const pageProperties: PageProperty[] = await pageModel.getPropertiesByPage(page.id);
                
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
}

export default PageController;