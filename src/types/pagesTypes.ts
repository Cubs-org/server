import { JsonValue } from "@prisma/client/runtime/library";

type Data = {
    value: string | number | boolean | null;
    loadOrder: number;
    icon?: string;
    width?: number;
    start?: string;
    end?: string;
    color?: string;
} & JsonValue;

export type PageProperty = {
    id: string;
    pageId: string;
    title: string | null;
    type: string;
    data: Data;
    trash: boolean | null;
}

export type Page = {
    id: string;
    title: string;
    ownerId: string;
    trash: boolean | null;
    
    properties?: PageProperty[];
}