import { Prisma } from "@prisma/client";
import { prisma } from "../database/prisma-client";
import { Page, PageProperty } from "../types/pagesTypes";
import useDate from "../utils/useDate";
import PageModel from "./PageModel";
import PagePropertyModel from "./PagePropertiesModel";
import { CalendarItemType } from "../types/calendarTypes";

type CalendarItem = {
    id: string;
    title: string;
    description: string;
    type: CalendarItemType;
    start: string | Date;
    end: string | Date;
    color: string;
    status: false | PageProperty;
};

interface ICalendarModel {
    createItem(props: Partial<CalendarItem> & {ownerId: string}): Promise<Page>;
    updateItem(props: Partial<Omit<CalendarItem, 'id'>> & { id: string }): Promise<Page>;
    getOwnerItems(ownerId: string): Promise<Page[]>;
};

class CalendarModel implements ICalendarModel {

    private pageModel: PageModel;
    private pagePropertyModel: PagePropertyModel;

    constructor() {
        this.pageModel = new PageModel();
        this.pagePropertyModel = new PagePropertyModel();
    }

    async createItem({
        title,
        description,
        type,
        start,
        end,
        color,
        status,
        ownerId
    }: Partial<CalendarItem> & {ownerId: string}): Promise<Page> {
        title = title || "";
        description = description || "";
        start = start || useDate(start, true);
        end = end || useDate(end, true);
        color = color || "purple";
        status = status || false;

        let item: Page = await this.pageModel.create(title, ownerId);

        const desc = await this.pagePropertyModel.create("Descrição", "text", description, item.id);
        const datetime = await this.pagePropertyModel.create("Data", "datetime", { start, end }, item.id);
        const calendar = await this.pagePropertyModel.create(type || "task", "calendar", { color }, item.id);
        status = await this.pagePropertyModel.create("status", "checkbox", { value: status }, item.id);

        item = { ...item, properties: [desc, datetime, calendar, status] };

        return item;
    }

    async updateItem({
        id,
        title,
        description,
        start,
        end,
        color,
        status
    }: Partial<Omit<CalendarItem, 'id'>> & { id: string }): Promise<Page> {

        let item = await this.pageModel.getPageById(id);

        if (!item) throw new Error('Item not found');
        if (title) await this.pageModel.update(id, title);

        let properties: PageProperty[] = await this.pagePropertyModel.getPropertiesByPage(item.id) as PageProperty[];

        if (properties) {
            let descData = properties?.find(prop => prop.type === "text") as PageProperty;
            let datetimeData = properties?.find(prop => prop.type === "datetime") as PageProperty;
            let calendarData = properties?.find(prop => prop.type === "calendar") as PageProperty;
            let statusData = properties?.find(prop => prop.type === "checkbox") as PageProperty;

            if (description) {
                let { value } = descData?.data as { value: string };
                if (value !== description)
                    await this.pagePropertyModel.update(descData?.id, { value: description || "" });
            }
            if (start && end) {
                let { start: oldStart, end: oldEnd } = datetimeData?.data as { start: string, end: string };
                if (oldStart !== start || oldEnd !== end)
                    await this.pagePropertyModel.update(datetimeData?.id, { start, end });
            }
            if (color) {
                let { color: oldColor } = calendarData?.data as { color: string };
                if (oldColor !== color)
                    await this.pagePropertyModel.update(calendarData?.id, { color });
            }
            if (status !== undefined) {
                let { value: oldCompleted } = statusData?.data as { value: boolean };
                if (oldCompleted !== status)
                    await this.pagePropertyModel.update(statusData?.id, { value: status });
            }
        }

        return {...item, properties};
    }

    async getOwnerItems(ownerId: string): Promise<Page[]> {
        let items: Page[] = await prisma.$queryRaw(Prisma.sql`
            SELECT 
                page.*
            FROM 
                page
            JOIN 
                page_properties ON page_properties.page_id = page.id
            WHERE 
                page_properties.type = "calendar" AND
                page.owner_id = ${ownerId} AND
                page.trash IS FALSE
            ORDER BY 
                page.created_at DESC
        `);

        for (const item of items) {
            item.properties = await this.pagePropertyModel.getPropertiesByPage(item.id) as PageProperty[];
        }

        if (!items || items.length == 0) throw new Error('Error to getting items or items not found');

        return items;
    }
}

export default CalendarModel;