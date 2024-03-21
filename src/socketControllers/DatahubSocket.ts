import { Socket } from "socket.io";
import DatahubModel from "../models/DatahubModel";
import { PageProperty } from "../types/pagesTypes";

class DatahubSocket extends DatahubModel {

    async createPage(socket: Socket) {
            try {
                socket.on('createPage', async (
                    req:{ datahubId: string, ownerId: string }
                ) => {
                    const { datahubId, ownerId } = req;
                    const newPage = await this.createPageInHub(datahubId, ownerId);
                    socket.broadcast.emit('pageCreated', newPage);
                });
            } catch (error) {
                console.log(error);
            }
    }

    /* TableView - SocketControllers */
    // Get Items from Datahub
    async getItems(socket: Socket) {

        try {
            socket.on('getItems', async (req) => {
                const { hubId } = req;
                const pages = await this.getAllPagesFromHub(hubId);
                socket.emit('items', pages);
            });
        } catch (error) {
            console.log(error);
        }
    }

    /* TableView - SocketControllers */
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