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
            const { title, owner, type, description, start, end, color } = req;

            const currentDate = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }).replace(', ', ' ').concat(".000");

            const newItem = {
                owner,
                type: type || "task",
                title: title || "",
                description: description || "",
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
                    
                    socket.emit('get', item);

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
        try {
            let items:Page[] = await pageModel.getPagesByOwner(userId);
            for (const item of items) {
                item.properties = await pagePropertyModel.getPropertiesByPage(item.id);
                // console.log("Item:", item);
            }
    
            // console.log("Items:", items);
    
            socket.emit('getCalendarItems', items);
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
}

export default CalendarSocket;
