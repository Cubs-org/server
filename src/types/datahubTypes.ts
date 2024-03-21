import { JsonValue } from "@prisma/client/runtime/library";
import { PagePropertyType } from "./pagesTypes";

type PGPData = {
    loadOrder: number;
} & JsonValue;

export type rowPage = {
    loadOrder: number;
    ownerId: string;
    properties: {
        title: string;
        type: PagePropertyType;
        data: PGPData
    }[];
};