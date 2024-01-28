import { prisma } from "../database/prisma-client";
import {  PageProperty } from "../types/pagesTypes";

class PagePropertyModel {

    async create(title: string, type: any, data: any, pageId: string): Promise<PageProperty> {
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

    async getPropertiesByPage(pageId: string) {
        const pageProperties = await prisma.pageProperties.findMany({
            where: {
                pageId: pageId
            }
        });
        return pageProperties;
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

    async getMemberByUserId(userId: string, pagePropertyId: string) {
        const member = await prisma.member.findFirst({
            where: {
                userId: userId,
                pagePropertiesId: pagePropertyId
            }
        });
        return member;
    }

    async getMembersByPagePropertyId(pagePropertyId: string) {
        const members = await prisma.member.findMany({
            where: {
                pagePropertiesId: pagePropertyId
            }
        });
        return members;
    }
}

export default PagePropertyModel;