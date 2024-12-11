/**
 * Converts a date to a string.
 * @returns Date as string in the following format: `dd.mm.yyyy`
 * @throws Error if no date is provided.
 */
export function dateToString(date: Date) {
    if (!date) {
        throw new Error("No date provided, cannot convert to string.");
    }
    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/**
 * Converts a string in the format `dd.mm.yyyy` to a date.
 * @throws Error if no date string is provided.
 */
export function stringToDate(dateString: string) {
    if (!dateString) {
        throw new Error("No date string provided, cannot convert to date.");
    }
    const parts = dateString.split('.');
    if (parts.length!==3) {
        throw new Error("Invalid date format. Use dateToString(date) to create the string in the first place.")
    }
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}Z`);
}