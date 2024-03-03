import { prisma } from "../database/prisma-client";
import { PageProperty } from "../types/pagesTypes";
import PagePropertiesModel from "./PagePropertiesModel";

class DatahubModel extends PagePropertiesModel {

    async createNewHub(title:string) {
        const datahub = await prisma.dataHub.create({
            data: {
                title: title ? title : "Sem título"
            }
        });

        return datahub;
    }

    async getDatahub(hubId: string) {
        const datahub = await prisma.page.findFirst({
            where: {
                datahubId: hubId
            }
        });

        return datahub;
    }

    async getAllPagesFromHub(hubId: string) {

        const pages = await prisma.page.findMany({
            where: {
                datahubId: hubId
            }
        });

        if (!pages) throw new Error("No pages found");

        const pagesWithProperties = await Promise.all(pages.map(async (page) => {
            const properties = await this.getPropertiesByPage(page.id);
            return {
                ...page,
                properties
            }
        }));

        return pagesWithProperties;
    }

    async setColumnOrder(columnId: string, newIndex: number) {
        const property: PageProperty = await this.getPropertyById(columnId);
        if (!property) throw new Error("Column not found");

        let data = property.data;
        data.loadOrder = newIndex;

        const updatedProperty = await this.update(columnId, data);
        return updatedProperty;
    }
}

export default DatahubModel;