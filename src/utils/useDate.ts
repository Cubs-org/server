export default function useDate(date?: Date | string, utcZero?: boolean): string {
    let newDate = date ? new Date(date) : new Date();
    if (utcZero) newDate.setHours(0, 0, 0, 0);
    
    return newDate.toISOString();
}