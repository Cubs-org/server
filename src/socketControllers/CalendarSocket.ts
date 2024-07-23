import { Socket } from "socket.io";

import PageModel from "../models/PageModel";
import PagePropertyModel from "../models/PagePropertiesModel";
import UserModel from "../models/UserModel";

import { Page, PageProperty } from "../types/pagesTypes";
import CalendarModel from "../models/CalendarModel";

class CalendarSocket {

    private pageModel: PageModel;
    private pagePropertyModel: PagePropertyModel;
    private userModel: UserModel;
    private calendarModel: CalendarModel;

    constructor() {
        this.pageModel = new PageModel();
        this.pagePropertyModel = new PagePropertyModel();
        this.userModel = new UserModel();
        this.calendarModel = new CalendarModel();
    }

    async createNewItem(socket: Socket) {

        socket.on('createNewItem', async (req) => {
            
            const { title, owner, type, content, start, end, color } = req;

            try {
                const user = await this.userModel.getByEmail(owner);
                if (!user) throw new Error('User not found');
                
                const item = await this.calendarModel.create(user.id, title, type, color, content, start, end);
                    
                socket.emit('updatedCalendarItems', item);
                this.emitCalendarItems(socket, user.id);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                console.log("Message:", errorMessage);
            }
        });
    }

    async emitCalendarItems(socket: Socket, userId: string) {

        let _items:Page[];
        
        try {
            let items:Page[] = await this.calendarModel.getOwnerItems(userId) as Page[];

            for (const item of items) {
                item.properties = await this.pagePropertyModel.getPropertiesByPage(item.id) as PageProperty[];
            }

            if (!items || items.length == 0) throw new Error('Error getting items or no items found');

            _items = items.filter(item => item?.properties && item?.properties.find(prop => prop.type === "calendar"));

    
            socket.broadcast.emit('response:getCalendarItems', _items);
            socket.emit('response:getCalendarItems', _items);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            console.log("Message:", errorMessage);
        }
    }

    async getCalendarItems(socket: Socket) {
        socket.on('request:getCalendarItems', async (req) => {
            const { email } = req;
            const user = await this.userModel.getByEmail(email);
            if (user) {
                this.emitCalendarItems(socket, user.id);
            }
        });
    }

    async updateItem(socket: Socket) {
        socket.on('request:updateOnCalendarItem', async (req) => {
            const { id, title, content, start, end, color, completed } = req;
    
            try {
                const item = await this.pageModel.getPageById(id);
                if (!item) throw new Error('Item not found');
    
                // Atualiza o título, se fornecido
                if (title) {
                    await this.pageModel.update(id, title);
                }
    
                // Recupera propriedades associadas à página
                const properties: PageProperty[] = await this.pagePropertyModel.getPropertiesByPage(item.id) as PageProperty[];
    
                // Atualiza as propriedades conforme necessário
                const updates: Promise<any>[] = [];
                
                const updateIfChanged = async (prop: PageProperty, newValue: any, key: string) => {
                    const oldValue = prop?.data[key];
                    if (oldValue !== newValue) {
                        updates.push(this.pagePropertyModel.update(prop.id, { [key]: newValue }));
                    }
                };
    
                if (properties) {
                    const descData = properties.find(prop => prop.type === "text") as PageProperty;
                    const datetimeData = properties.find(prop => prop.type === "datetime") as PageProperty;
                    const calendarData = properties.find(prop => prop.type === "calendar") as PageProperty;
                    const statusData = properties.find(prop => prop.title === "status") as PageProperty;
    
                    if (content && descData) {
                        await updateIfChanged(descData, content, 'value');
                    }
    
                    if ((start || end) && datetimeData) {
                        const { start: oldStart, end: oldEnd } = datetimeData.data as { start: string, end: string };
                        if (start !== oldStart || end !== oldEnd) {
                            await updateIfChanged(datetimeData, { start, end }, 'data');
                        }
                    }
    
                    if (color && calendarData) {
                        await updateIfChanged(calendarData, color, 'color');
                    }
    
                    if (completed !== undefined && statusData) {
                        await updateIfChanged(statusData, completed, 'value');
                    }
                }
    
                // Executa todas as atualizações em paralelo
                await Promise.all(updates);
    
                this.emitCalendarItems(socket, item.ownerId);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                console.log("Message:", errorMessage);
            }
        });
    }
    

    async deleteItem(socket: Socket) {
        socket.on('request:deleteCalendarItem', async (req) => {
            const { id } = req;

            try {
                let item = await this.pageModel.getPageById(id);
                if (!item) throw new Error('Item not found');
                else {
                    const propertiesFromPage = await this.pagePropertyModel.getPropertiesByPage(item.id);
                    if (propertiesFromPage.length > 0) {
                        for (const prop of propertiesFromPage)
                            await this.pagePropertyModel.delete(prop.id);
                    }

                    if (item)
                        await this.pageModel.delete(item.id);
                }
                this.emitCalendarItems(socket, item.ownerId);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                console.log("Message:", errorMessage);
            }
        });
    }
}

export default CalendarSocket;
