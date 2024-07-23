import { HTTP_STATUS } from "../lib/http_status";
import PagePropertyModel from "../models/PagePropertiesModel";
import UserModel from "../models/UserModel";
import { PageProperty } from "../types/pagesTypes";
import { setDefaultValuesFromPageProperty } from "../utils/setDefaultValuesFromPageProperty";

class PagePropertyController {

    private userModel: UserModel;
    private pagePropModel: PagePropertyModel;

    constructor() {
        this.userModel = new UserModel();
        this.pagePropModel = new PagePropertyModel();
    }

    async create(req, reply) {

        const { type, data, pageId } = req.body;

        let { title } = setDefaultValuesFromPageProperty({ type, data } as PageProperty);

        try {

            let _data = {...data, loadOrder: 0};
            const getAllProperties = await this.pagePropModel.getPropertiesByPage(pageId);
            if (getAllProperties.length > 0) {
                _data.loadOrder = (getAllProperties.length + 1);
            }

            let pgPropAlreadyExiAlreadyExistsAlreadyExistsInPage = await this.pagePropModel.getPropertiesByPage(pageId),
                pageProperty =  {} as PageProperty;

            if (pgPropAlreadyExiAlreadyExistsAlreadyExistsInPage.filter(pgProp => pgProp.title === title).length > 0)
            {
                const newTitle = `${title} (${pgPropAlreadyExiAlreadyExistsAlreadyExistsInPage.length})`;
                pageProperty = await this.pagePropModel.create(newTitle, type, _data, pageId);
            } else {
                pageProperty = await this.pagePropModel.create(title, type, _data, pageId);
            }

            return reply.send({ pageProperty, status: HTTP_STATUS.OK });
        } catch (error) {
            console.error(error);
            return reply.send({ message: error, status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
        }
    }

    async addMember(req, reply) {

        const { email, isAdmin, pagePropertyId } = req.body;

        try {
            const user = await this.userModel.getByEmail(email);

            if (user) {
                const memberAlreadyExists = await this.pagePropModel.getMemberByUserId(user.id, pagePropertyId);
                
                if(memberAlreadyExists) throw new Error('Member already exists');
                else {
                    const member = await this.pagePropModel.addMember(user.id, isAdmin, pagePropertyId);

                    return reply.send({ member, status: HTTP_STATUS.OK });
                }
            } else throw new Error('User not found');
        } catch (error:any) {
            console.error(error);
            return reply.send({ message: error.message, status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
        }
    }

    async update(req, reply) {
            
        const { id, data, title } = req.body;
    
        try {
            let pageProperty:PageProperty;
            if (!title) pageProperty = await this.pagePropModel.update(id, data) as PageProperty;
            else pageProperty = await this.pagePropModel.update(id, data, title) as PageProperty;
    
            return reply.send({ pageProperty, status: HTTP_STATUS.OK });
        } catch (error) {
            console.error(error);
            return reply.send({ message: error, status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
        }
    }
}

export default PagePropertyController;