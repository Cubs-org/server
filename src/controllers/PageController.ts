import { JsonValue } from "@prisma/client/runtime/library";
import PageModel from "../models/PageModel";
import { HTTP_STATUS } from "../lib/http_status";

const pageModel = new PageModel();

type PageProperty = {
    id: string;
    pageId: string;
    title: string;
    type: string;
    data: JsonValue;
    trash: boolean | null;
}

type Page = {
    id: string;
    title: string;
    ownerId: string;
    trash: boolean | null;
    
    properties?: PageProperty[];
}

class PageController {

    async create(req, reply) {

        const { title, ownerId } = req.body;

        const page = await pageModel.create(title, ownerId);

        reply.send({ page, status: HTTP_STATUS.OK });
    }

    async update(req, reply) {

        const { pageId } = req.params,
            { title } = req.body;

        const page = await pageModel.update(pageId, { title });

        reply.send({ page, status: HTTP_STATUS.OK });
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