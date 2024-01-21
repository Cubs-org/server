import { HTTP_STATUS } from "../lib/http_status";
import PagePropertyModel from "../models/PageProperties";
import UserModel from "../models/UserModel";

const userModel = new UserModel();
const pagePropModel = new PagePropertyModel();

class PagePropertyController {

    async create(req, reply) {

        const { title, type, data, pageId } = req.body;

        try {
            const pageProperty = await pagePropModel.create(title, type, data, pageId);

            return reply.send({ pageProperty, status: HTTP_STATUS.OK });
        } catch (error) {
            console.log(error);
            return reply.send({ status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
        }
    }

    async addMember(req, reply) {

        const { userId, isAdmin, pagePropertyId } = req.body;

        try {
            const user = await userModel.getById(userId);

            if (user) {
                const member = await pagePropModel.addMember(userId, isAdmin, pagePropertyId);

                return reply.send({ member, status: HTTP_STATUS.OK });
            } else throw new Error('User not found');
        } catch (error) {
            console.log(error);
            return reply.send({ status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
        }
    }
}

export default PagePropertyController;