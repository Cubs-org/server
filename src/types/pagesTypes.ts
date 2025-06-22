import { JsonValue } from "@prisma/client/runtime/library";

export type PagePropertyType =
  | "text"
  | "number"
  | "date"
  | "datetime"
  | "formula"
  | "selection"
  | "multi_selection"
  | "relation"
  | "rollup"
  | "assign"
  | "checkbox"
  | "status"
  | "button"
  | "calendar";

type Tags = {
  name: string;
  color: string;
};

export type Data = {
  value?: string | number | boolean | null;
  loadOrder: number;
  icon?: string;
  width?: number;
  start?: string;
  end?: string;
  color?: string;
  items?: Tags[];
  tags?: Tags[];
} & JsonValue;

export type PageProperty = {
  id: string;
  pageId: string;
  title: string;
  type: PagePropertyType;
  data: Data;
  trash: boolean | null;
};

export type Page = {
  id: string;
  title: string;
  ownerId: string;
  trash: boolean | null;

  properties?: PageProperty[];
};
