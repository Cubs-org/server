export type CalendarPageOwned = {
    id: string;
    title: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
    trash: boolean;
};

export type CalendarOwnedItems = {
    id: string;
    title: string;
    type: string;
    color: string;
    description: string;
    ownerId: string;
    start: string;
    end: string;
    status: boolean;
};