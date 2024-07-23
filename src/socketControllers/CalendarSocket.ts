import { Socket } from "socket.io";
import PageModel from "../models/PageModel";
import PagePropertyModel from "../models/PagePropertiesModel";
import UserModel from "../models/UserModel";
import { Page, PageProperty } from "../types/pagesTypes";

const pageModel = new PageModel();
const pagePropertyModel = new PagePropertyModel();
const userModel = new UserModel();

class CalendarSocket {

    async createNewItem(socket: Socket) {

        socket.on('createNewItem', async (req) => {
            const { title, owner, type, content, start, end, color } = req;

            const currentDate = new Date();
            currentDate.setUTCHours(0, 0, 0, 0);
            currentDate.setUTCHours(0, 0, 0, 0);
            currentDate.setUTCHours(0, 0, 0, 0);

            const newItem = {
                owner,
                type: type || "task",
                title: title || "",
                description: content || "",
                start: start || currentDate,
                end: end || currentDate,
                color: color || "purple",
            };

            try {
                const user = await userModel.getByEmail(newItem.owner);
                if (!user) throw new Error('User not found');
                else {

                    let statusData = { value: false };
                    let calendarData = { color: newItem.color };
                    let descData = { value: newItem.description };
                    let datetimeData = { start: newItem.start, end: newItem.end };

                    let item: Page = await pageModel.create(newItem.title, user.id);

                    const desc = await pagePropertyModel.create("Descrição", "text", descData, item.id);
                    const datetime = await pagePropertyModel.create("Data", "datetime", datetimeData, item.id);
                    const calendar = await pagePropertyModel.create(type, "calendar", calendarData, item.id);
                    const status = await pagePropertyModel.create("status", "checkbox", statusData, item.id);

                    item = { ...item, properties: [desc, datetime, calendar, status] };

                    if (!item) throw new Error('Error creating new item');
                    
                    socket.emit('updatedCalendarItems', item);

                    // Após criar o novo item, emitir todos os itens do calendário vinculados a este usuário
                    this.emitCalendarItems(socket, user.id);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                console.log("Message:", errorMessage);
            }
        });
    }

    async emitCalendarItems(socket: Socket, userId: string) {

        let _items:Page[];
        
        try {
            let items:Page[] = await pageModel.getPagesByOwner(userId);
            for (const item of items) {
                item.properties = await pagePropertyModel.getPropertiesByPage(item.id) as PageProperty[];
            }

            if (!items) throw new Error('Error getting items');
            else if (items.length === 0) throw new Error('No items found');

            _items = items.filter(item => item?.properties && item?.properties.find(prop => prop.type === "calendar"));

    
            socket.broadcast.emit('updateItems', _items);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            console.log("Message:", errorMessage);
        }
    }

    async getCalendarItems(socket: Socket) {
        socket.on('getCalendarItems', async (req) => {
            const { email } = req;
            const user = await userModel.getByEmail(email);
            if (user) {
                this.emitCalendarItems(socket, user.id);
            }
        });
    }

    async updateItem(socket: Socket) {
        socket.on('updateItem', async (req) => {
            const { id, title, content, start, end, color, completed } = req;

            try {
                let item = await pageModel.getPageById(id);
                if (!item) throw new Error('Item not found');
                else {
                    if (title)
                        await pageModel.update(id, title); // Atualiza o título do item

                    let properties:PageProperty[] = await pagePropertyModel.getPropertiesByPage(item.id) as PageProperty[];

                    if (properties) {
                        let descData = properties?.find(prop => prop.title === "Descrição") as PageProperty;
                        let datetimeData = properties?.find(prop => prop.title === "Data") as PageProperty;
                        let calendarData = properties?.find(prop => prop.type === "calendar") as PageProperty;
                        let statusData = properties?.find(prop => prop.title === "status") as PageProperty;

                        if (content) {
                            let { value } = descData?.data as { value: string };
                            if (value !== content)
                                await pagePropertyModel.update(descData?.id, { value: content });
                        }
                        if (start && end) {
                            let { start: oldStart, end: oldEnd } = datetimeData?.data as { start: string, end: string };
                            if (oldStart !== start || oldEnd !== end)
                                await pagePropertyModel.update(datetimeData?.id, { start, end });
                        }
                        if (color) {
                            let { color: oldColor } = calendarData?.data as { color: string };
                            if (oldColor !== color)
                                await pagePropertyModel.update(calendarData?.id, { color });
                        }
                        if (completed !== undefined) {
                            let { value: oldCompleted } = statusData?.data as { value: boolean };
                            if (oldCompleted !== completed)
                                await pagePropertyModel.update(statusData?.id, { value: completed });
                        }                        
                    }
                }
                this.emitCalendarItems(socket, item.ownerId);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                console.log("Message:", errorMessage);
            }
        });
    }

    async deleteItem(socket: Socket) {
        socket.on('deleteItem', async (req) => {
            const { id } = req;

            try {
                let item = await pageModel.getPageById(id);
                if (!item) throw new Error('Item not found');
                else {
                    const propertiesFromPage = await pagePropertyModel.getPropertiesByPage(item.id);
                    if (propertiesFromPage.length > 0) {
                        for (const prop of propertiesFromPage)
                            await pagePropertyModel.delete(prop.id);
                    }

                    if (item)
                        await pageModel.delete(item.id);
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