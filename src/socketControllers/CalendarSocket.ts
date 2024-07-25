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
                
                const item = await this.calendarModel.createItem({
                    title,
                    description: content,
                    type,
                    start,
                    end,
                    color,
                    ownerId: user.id
                });

                if (!item) throw new Error('Error creating item');

                console.log("Item created:", item);
                
                this.emitCalendarItems(socket, user.id);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                console.log("Message:", errorMessage);
            }
        });
    }

    async emitCalendarItems(socket: Socket, userId: string) {
        try {
            let items:Page[] = await this.calendarModel.getOwnerItems(userId);

            console.log("Items:", items);
    
            socket.broadcast.emit('response:getCalendarItems', items);
            socket.emit('response:getCalendarItems', items);
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
                let item = await this.calendarModel.updateItem({
                    id,
                    title,
                    description: content,
                    start,
                    end,
                    color,
                    status: completed
                });
                console.log("Item updated:", item);
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
