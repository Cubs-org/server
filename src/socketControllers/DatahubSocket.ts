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
                    targetColumnTitle, targetColumnOrder,
                    draggedColumnTitle, draggedColumnOrder
                } = req;

                if (targetColumnOrder === draggedColumnOrder || 
                    !targetColumnTitle || !draggedColumnTitle
                    ) return;
                else if (targetColumnOrder < 0 || draggedColumnOrder < 0) return;

                const datahubId = await this.setColumnOrder(targetColumnTitle, draggedColumnTitle, targetColumnOrder, draggedColumnOrder);

                const pages = await this.getAllPagesFromHub(datahubId);

                socket.emit('columnMoved', pages);

            });
        } catch (error) {
            console.log(error);
        }
    }
}

export default DatahubSocket;