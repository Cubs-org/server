import { Socket } from "socket.io";
import DatahubModel from "../models/DatahubModel";
import { PageProperty } from "../types/pagesTypes";

class DatahubSocket extends DatahubModel {

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
    async resizeColumn(socket: Socket) {}

    async moveColumn(socket: Socket) {

        try {
            socket.on('moveColumn', async (req) => {
                
                const { 
                    targetColumnId, targetColumnOrder,
                    draggedColumnId, draggedColumnOrder
                } = req;

                const targetColumn = await this.setColumnOrder(targetColumnId, draggedColumnOrder) as PageProperty;
                const draggedColumn = await this.setColumnOrder(draggedColumnId, targetColumnOrder) as PageProperty;


                if (!targetColumn) throw new Error("Target column not found");
                if (!draggedColumn) throw new Error("Dragged column not found");

                socket.emit('columnMoved', {
                    pageId: targetColumn.pageId,
                    id: targetColumn.id,
                    data: targetColumn.data
                });

            });
        } catch (error) {
            console.log(error);
        }
    }
}

export default DatahubSocket;