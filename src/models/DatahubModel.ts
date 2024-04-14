import { prisma } from "../database/prisma-client";
import { Data, Page, PageProperty } from "../types/pagesTypes";
import setnewDataFromPageProp from "../utils/setDataFromPageProp";
import { setDefaultValuesFromPageProperty } from "../utils/setDefaultValuesFromPageProperty";
import PagePropertiesModel from "./PagePropertiesModel";
import WorkspaceModel from "./WorkspaceModel";

const wkspModel = new WorkspaceModel();

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

    async setColumnWidth(columnTitle: string, newWidth: number) {

        let datahubId,
            columns = await prisma.pageProperties.findMany({
                where: {
                    title: columnTitle
                }
            }) as PageProperty[];

        columns.forEach(async (col) => {
            let newColData = (col.data as any);
            newColData.width = newWidth;
            await prisma.pageProperties.update({
                where: {
                    title: columnTitle,
                    id: col.id
                },
                data: {
                    data: newColData,
                }
            });
        });

        await prisma.page.findFirst({
            where: {
                id: columns[0]?.pageId
            }
        }).then((page) => {
            datahubId = page?.datahubId;
        });

        return datahubId;
    }

    async createPageInHub(
        datahubId: string, 
        ownerId: string
    ): Promise<Page> {

        let firstPageOfHub = await prisma.page.findFirst({
            where: {
                datahubId: datahubId
            }
        }) as Page;

        if (!firstPageOfHub) {
            firstPageOfHub = await prisma.page.create({
                data: {
                    datahubId: datahubId,
                    title: "",
                    ownerId: ownerId
                }
            });
        }

        firstPageOfHub.properties = await this.getPropertiesByPage(firstPageOfHub.id) as PageProperty[];

        let newPage = await prisma.page.create({
            data: {
                datahubId: datahubId,
                title: "",
                ownerId: ownerId,
                pageProperties: {
                    createMany: {
                        skipDuplicates: true,
                        data: firstPageOfHub.properties.map((property) => {
                            let newData = (property.data as Data);
                            newData = setnewDataFromPageProp(property.type, newData) as Data;
                            return {
                                title: property.title,
                                type: property.type,
                                data: newData
                            };
                        })
                    }
                }
            }
        }) as Page;

        newPage.properties = await this.getPropertiesByPage(newPage.id) as PageProperty[];
    
        return newPage;
    }

    async createPropertyInHub(hubId:string, type:string) {

        const pages = await this.getAllPagesFromHub(hubId);

        if (!pages) throw new Error("No pages found");

        let pdata = {} as PageProperty['data'];

        let { title, data } = setDefaultValuesFromPageProperty({ type:type, data:pdata }) as PageProperty;

        const pgPropAlreadyExistsInHub = await this.getPropertiesByPage(pages[0].id);
        data.loadOrder = await pgPropAlreadyExistsInHub.length + 1;

        if (pgPropAlreadyExistsInHub.filter(pgProp => pgProp.title === title).length > 0)
        {
            title = `${title} (${pgPropAlreadyExistsInHub.length})`;
        }
        
        const newProperties = await prisma.pageProperties.createMany({
            data: pages.map((page) => {
                return {
                    title: title,
                    type: type,
                    data: data,
                    pageId: page.id
                } as PageProperty;
            })
        });

        return newProperties;
    }
}

export default DatahubModel;