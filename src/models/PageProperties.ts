import { prisma } from "../database/prisma-client";

class PagePropertyModel {

    async create(title: string, type: any, data: any, pageId: string) {
        const pageProperty = await prisma.pageProperties.create({
            data: {
                title: title,
                type: type,
                data: data,
                pageId: pageId
            }
        });
        return pageProperty;
    }

    async addMember(userId: string, isAdmin: boolean, pagePropertyId: string) {
        const member = await prisma.member.create({
            data: {
                isAdmin: isAdmin,
                userId: userId,
                pagePropertiesId: pagePropertyId
            }
        });
        return member;
    }
}

export default PagePropertyModel;