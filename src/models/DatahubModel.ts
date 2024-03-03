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

    async setColumnOrder(targetTitle: string, draggedtTitle: string, targetOrder:number, draggedOrder:number) {

        let datahubId;

        let targetCols = await prisma.pageProperties.findMany({
            where: {
                title: targetTitle
            }
        }) as PageProperty[];

        let draggedCols = await prisma.pageProperties.findMany({
            where: {
                title: draggedtTitle
            }
        }) as PageProperty[];

        // // if (!targetCol || !draggedCol) throw new Error("Columns not found");
        
        // let newTargetData = (targetCols[0].data as any);
        // newTargetData.loadOrder = draggedOrder;
        
        // let newDraggedData = (draggedCols[0].data as any);
        // newDraggedData.loadOrder = targetOrder;

        targetCols.forEach(async (targetCol) => {
            let newTargetData = (targetCol.data as any);
            newTargetData.loadOrder = draggedOrder;
            await prisma.pageProperties.update({
                where: {
                    title: targetTitle,
                    id: targetCol.id
                },
                data: {
                    data: newTargetData,
                }
            });
        });

        draggedCols.forEach(async (draggedCol) => {
            let newDraggedData = (draggedCol.data as any);
            newDraggedData.loadOrder = targetOrder;
            await prisma.pageProperties.update({
                where: {
                    title: draggedtTitle,
                    id: draggedCol.id
                },
                data: {
                    data: newDraggedData,
                }
            });
        });

        await prisma.page.findFirst({
            where: {
                id: targetCols[0].pageId
            }
        }).then((page) => {
            datahubId = page?.datahubId;
        });

        return datahubId;
    }
}

export default DatahubModel;