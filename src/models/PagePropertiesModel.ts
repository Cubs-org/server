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
        }) as PageProperty;
        return pageProperty;
    }
    
    async update(pagePropertyId: string, data: any, title?:string) {
        let dataToUpdate:{data:any, title?:string} = { data: data };
        if (title) {
            dataToUpdate = { ...dataToUpdate, title: title };
        }

        const pageProperty = await prisma.pageProperties.update({
            where: {
                id: pagePropertyId
            },
            data: dataToUpdate
        });
        return pageProperty;
    }

    async getPropertyById(pagePropertyId: string):Promise<PageProperty> {
        const pageProperty = await prisma.pageProperties.findFirst({
            where: {
                id: pagePropertyId
            }
        }) as PageProperty;
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

    async deleteAll(pageId: string) {
        const pageProperties = await prisma.pageProperties.deleteMany({
            where: {
                pageId: pageId
            }
        });
        return pageProperties;
    }
}

export default PagePropertyModel;