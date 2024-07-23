import { Prisma } from "@prisma/client";
import { prisma } from "../database/prisma-client";
import { Page} from "../types/pagesTypes";
import { today } from "../utils/today";

type CalendarItemType = "task" | "event" | "reminder";

type CalendarItem = {
    title: string;
    type: CalendarItemType;
    color: string;
    description: string;
    ownerId: string;
    start: string | Date;
    end: string | Date;
};

interface CalendarModel {
    create(
        ownerId: string, 
        title?: string, 
        type?: CalendarItemType, 
        color?: string, 
        description?: string,
        start?: string | Date,
        end?: string | Date
    ): Promise<CalendarItem>;

    updateTitleItem(): Promise<CalendarItem>;

    delete(): void;
    pinned(): void;
    getOwnerItems(ownerId: string): Promise<Page[]>;
    getPinnedItems(): void;
};

class CalendarModel {

    async create(ownerId, title, type, color, description, start, end): Promise<CalendarItem> {

        const currentDate = today();
        start = start || currentDate;
        end = end || currentDate;

        const page = await prisma.page.create({
            data: {
                title: title || "",
                ownerId: ownerId,
                pageProperties: {
                    createMany: {
                        data: [
                            {
                                type: "calendar",
                                title: type || "task",
                                data: JSON.stringify({ color: "purple" })
                            },
                            {
                                type: "text",
                                title: "description",
                                data: JSON.stringify({ value: "" })
                            },
                            {
                                type: "datetime",
                                title: "datetime",
                                data: JSON.stringify({ start, end })
                            },
                            {
                                type: "checkbox",
                                title: "status",
                                data: JSON.stringify({ value: false })
                            }
                        ],
                        skipDuplicates: true
                    }
                }
            }
        });
        
        return {
            title: page.title,
            type: type || "task",
            color: color || "purple",
            description: description || "",
            ownerId: ownerId,
            start,
            end
        };
    }

    async delete() {}

    async pinned() {}

    async getOwnerItems(ownerId: string): Promise<Page[]> {
        const ownedCalendarPages: Page[] = await prisma.$queryRaw<Page[]>(Prisma.sql`
            SELECT 
                page.*
            FROM page
            INNER JOIN page_properties ON page_properties.page_id = page.id
            INNER JOIN user ON user.id = page.owner_id
            WHERE 
                page_properties.type = 'calendar' AND
                page.owner_id = ${ownerId}
            ORDER BY page.created_at DESC
        `);
    
        return ownedCalendarPages;
    }

    async getPinnedItems() {}
}

export default CalendarModel;