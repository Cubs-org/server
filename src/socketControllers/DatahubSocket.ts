import { Server, Socket } from "socket.io";
import DatahubModel from "../models/DatahubModel";
import { Page, PageProperty, PagePropertyType } from "../types/pagesTypes";
import UserModel from "../models/UserModel";

const userModel = new UserModel();

class DatahubSocket extends DatahubModel {

    private io: Server;

    constructor(io: Server) {
        super();
        this.io = io;
    }

    // Join a room
    joinRoom(socket: Socket, room: string) {
        socket.join(room);
    }

    // Leave a room
    leaveRoom(socket: Socket, room: string) {
        socket.leave(room);
    }

    // Create Page in Datahub
    async createPage(socket: Socket) {
        try {
            socket.on('request:createHubPage', async (
                req: { datahubId: string, email: string }
            ) => {
                const { datahubId, email } = req;
                const user = await userModel.getByEmail(email);

                if (!user) throw new Error('User not found!');
                if (!datahubId) throw new Error('DatahubId not found!');

                const newPage = await this.createPageInHub(datahubId, user.id);

                    const response = {
                        page: newPage
                    };

                    // Emit to the specific socket that requested the action
                    socket.emit('response:createHubPage', response);

                    // Broadcast to all other sockets in the same 'room' or namespace
                    socket.broadcast.to(datahubId).emit('response:createHubPage', response);
            });
        } catch (error) {
            console.log(error);
        }
    }

    async createColumn(socket: Socket) {
        try {
            socket.on('request:createHubNewProperty', async (
                req: { datahubId: string, type: PagePropertyType }
            ) => {
                const { datahubId, type } = req;

                if (!datahubId) {
                    socket.emit('response:getPagesFromHub', { error: 'DatahubId not found!' });
                    return;
                }

                await this.createPropertyInHub(datahubId, type);

                const pages = await this.getAllPagesFromHub(datahubId);
                
                const response = {
                    pages
                };

                socket.emit('response:getPagesFromHub', response);
                socket.broadcast.to(datahubId).emit('response:getPagesFromHub', response);
            });
        } catch (error) {
            console.log(error);
        }
    }

    // Get Pages from Hub
    async getPagesFromHub(socket: Socket) {
        try {
            socket.on('request:getPagesFromHub', async (req) => {
                const { hubId } = req;
                
                if (!hubId) {
                    socket.emit('response:getPagesFromHub', { error: 'HubId not found!' });
                    return;
                }
    
                try {
                    const pages = (await this.getAllPagesFromHub(hubId) as Page[])
                        .filter(page => !(page.properties ?? []).find(property => property.type === "calendar"));
                    
                    socket.emit('response:getPagesFromHub', { pages });
                } catch (error: any) {
                    socket.emit('response:getPagesFromHub', { error: error.message });
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    // Resize Column
    async resizeColumn(socket: Socket) {
        try {
            socket.on('resizeColumn', async (req) => {
                const { columnTitle, newWidth, hubId } = req;
    
                if (!columnTitle || !newWidth || !hubId) return;
    
                // Aguardar a conclusão da função setColumnWidth
                await this.setColumnWidth(hubId, columnTitle, newWidth);
    
                // Atualizar propriedades das páginas (se necessário)
                let pages = await this.getAllPagesFromHub(hubId);
                pages.forEach((page) => {
                    (page.properties ?? []).forEach((property: PageProperty) => {
                        if (property.title === columnTitle) {
                            property.data.width = newWidth;
                        }
                    });
                });
    
                // Enviar evento columnResized para todos os sockets, se houver páginas
                if (pages.length > 0) {
                    socket.broadcast.emit('columnResized', pages);
                }
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