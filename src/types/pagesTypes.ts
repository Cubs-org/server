import { JsonValue } from "@prisma/client/runtime/library";

export type PageProperty = {
    id: string;
    pageId: string;
    title: string | null;
    type: string;
    data: JsonValue;
    trash: boolean | null;
}

export type Page = {
    id: string;
    title: string;
    ownerId: string;
    trash: boolean | null;
    
    properties?: PageProperty[];
}