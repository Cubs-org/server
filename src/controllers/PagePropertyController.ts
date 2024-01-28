import { HTTP_STATUS } from "../lib/http_status";
import PagePropertyModel from "../models/PagePropertiesModel";
import UserModel from "../models/UserModel";
import { PageProperty } from "../types/pagesTypes";
import { setDefaultValuesFromPageProperty } from "../utils/setDefaultValuesFromPageProperty";

const userModel = new UserModel();
const pagePropModel = new PagePropertyModel();

class PagePropertyController {

    async create(req, reply) {

        const { type, data, pageId } = req.body;

        let { title } = setDefaultValuesFromPageProperty({ type, data } as PageProperty);

        try {

            let pgPropAlreadyExiAlreadyExistsAlreadyExistsInPage = await pagePropModel.getPropertiesByPage(pageId),
                pageProperty =  {} as PageProperty;

            if (pgPropAlreadyExiAlreadyExistsAlreadyExistsInPage.filter(pgProp => pgProp.title === title).length > 0)
            {
                const newTitle = `${title} (${pgPropAlreadyExiAlreadyExistsAlreadyExistsInPage.length})`;
                pageProperty = await pagePropModel.create(newTitle, type, data, pageId);
            } else {
                pageProperty = await pagePropModel.create(title, type, data, pageId);
            }

            return reply.send({ pageProperty, status: HTTP_STATUS.OK });
        } catch (error) {
            console.log(error);
            return reply.send({ message: error, status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
        }
    }

    async addMember(req, reply) {

        const { userId, isAdmin, pagePropertyId } = req.body;

        try {
            const user = await userModel.getById(userId);

            if (user) {
                const memberAlreadyExists = await pagePropModel.getMemberByUserId(userId, pagePropertyId);
                
                if(memberAlreadyExists) throw new Error('Member already exists');
                else {
                    const member = await pagePropModel.addMember(userId, isAdmin, pagePropertyId);

                    return reply.send({ member, status: HTTP_STATUS.OK });
                }
            } else throw new Error('User not found');
        } catch (error:any) {
            console.log(error);
            return reply.send({ message: error.message, status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
        }
    }
}

export default PagePropertyController;