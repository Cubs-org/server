import { Socket } from "socket.io";
import DatahubModel from "../models/DatahubModel";
import { Page, PageProperty } from "../types/pagesTypes";
import UserModel from "../models/UserModel";

const userModel = new UserModel();

class DatahubSocket extends DatahubModel {

    // Create Page in Datahub
    async createPage(socket: Socket) {
            try {
                socket.on('createPage', async (
                    req:{ datahubId: string, email: string }
                ) => {
                    const { datahubId, email } = req;
                    const user = await userModel.getByEmail(email);
                    
                    if (!user) throw new Error('User not found!');
                    else {
                        const newPage = await this.createPageInHub(datahubId, user.id);

                        socket.broadcast.emit('pageCreated', newPage);
                    }
                });
            } catch (error) {
                console.log(error);
            }
    }

    async createColumn(socket: Socket) {
        try {
            socket.on('createColumn', async (
                req: { datahubId: string, type: string }
            ) => {
                const { datahubId, type } = req;

                await this.createPropertyInHub(datahubId, type);

                const pages = (await this.getAllPagesFromHub(datahubId) as Page[])
                    .filter(page => !(page.properties ?? []).find(property => property.type === "calendar"));

                socket.broadcast.emit('items', pages);
            });
        } catch (error) {
            console.log(error);
        }
    }

    // Get Items from Datahub
    async getItems(socket: Socket) {

        try {
            socket.on('getItems', async (req) => {
                const { hubId } = req;
                const pages = (await this.getAllPagesFromHub(hubId) as Page[])
                    .filter(page => !(page.properties ?? []).find(property => property.type === "calendar"));

                socket.emit('items', pages);
            });
        } catch (error) {
            console.log(error);
        }
    }

    // Resize Column
    async resizeColumn(socket: Socket) {

        try {

            socket.on('resizeColumn', async (req) => {
                const { columnTitle, newWidth } = req;
                const datahubId = await this.setColumnWidth(columnTitle, newWidth);
                
                let pages = await this.getAllPagesFromHub(datahubId);

                pages.map(page => {
                    (page.properties ?? []).forEach((property: PageProperty) => {
                        if (property.title === columnTitle)
                            property.data.width = newWidth;
                    });
                });

                socket.broadcast.emit('columnResized', pages);
            });
        } catch (error) {
            console.log(error);
        }
    }

    // Move Column
    async moveColumn(socket: Socket) {

        try {
            socket.on('moveColumn', async (req) => {
                
                const { 
                    targetColumnTitle, targetColumnOrder,
                    draggedColumnTitle, draggedColumnOrder
                } = req;

                if (targetColumnOrder === draggedColumnOrder || 
                    !targetColumnTitle || !draggedColumnTitle
                    ) return;
                else if (targetColumnOrder < 0 || draggedColumnOrder < 0) return;

                const datahubId = await this.setColumnOrder(targetColumnTitle, draggedColumnTitle, targetColumnOrder, draggedColumnOrder);

                let pages = await this.getAllPagesFromHub(datahubId);

                pages.map(page => {
                    (page.properties ?? []).forEach((property: PageProperty) => {
                        if (property.title === targetColumnTitle)
                            property.data.loadOrder = draggedColumnOrder;
                        if (property.title === draggedColumnTitle)
                            property.data.loadOrder = targetColumnOrder;
                    });
                });


                socket.broadcast.emit('columnMoved', pages);

            });
        } catch (error) {
            console.log(error);
        }
    }
}

export default DatahubSocket;