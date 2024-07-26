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

        socket.on('request:createNewItem', async (req) => {
            const { title, owner, type, description, start, end, color } = req;

            try {
                const user = await this.userModel.getByEmail(owner);
                if (!user) throw new Error('User not found');

                const item = await this.calendarModel.createItem({
                    title,
                    description,
                    type,
                    start,
                    end,
                    color,
                    ownerId: user.id
                });

                if (!item) throw new Error('Error creating item');

                socket.emit('response:createNewItem', item);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                console.log("Message:", errorMessage);
            }
        });
    }

    async getOwnedItems(socket: Socket) {
        socket.on('request:getOwnedItems', async (req) => {
            const { email } = req;
            const user = await this.userModel.getByEmail(email);
            if (user) {
                let items: Page[] = await this.calendarModel.getOwnerItems(user.id);
                socket.emit('response:getOwnedItems', items);
            }
        });
    }

    async updateItem(socket: Socket) {
        socket.on('request:updateOnCalendarItem', async (req) => {
            const { id, title, description, start, end, color, completed } = req;

            try {
                let item = await this.calendarModel.updateItem({
                    id,
                    title,
                    description,
                    start,
                    end,
                    color,
                    status: completed
                });

                socket.emit('response:updateOnCalendarItem', item);
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

                const propertiesFromPage = await this.pagePropertyModel.getPropertiesByPage(item.id);
                if (propertiesFromPage.length > 0) {
                    for (const prop of propertiesFromPage) await this.pagePropertyModel.delete(prop.id);
                }

                if (item) await this.pageModel.delete(item.id);

                // socket.emit('response:deleteItem', { id });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                console.log("Message:", errorMessage);
            }
        });
    }
}

export default CalendarSocket;
