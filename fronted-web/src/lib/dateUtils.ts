import dayjs from 'dayjs';

/**
 * Converts a date string in "YYYY-MM-DD" format to an ISO 8601 string.
 * For example, "2025-03-15" becomes "2025-03-15T00:00:00.000Z".
 */
export function formatDateForAPI(dateStr: string): string {
    return dayjs(dateStr).toISOString();
}

/**
 * Formats a date string into a user-friendly format.
 * @param dateStr - The date string (ISO format expected).
 * @param format - The desired format. Default is 'MMM D, YYYY' (e.g., "Mar 15, 2025").
 * @returns The formatted date string, or an empty string if input is invalid.
 */
export function formatDate(
    dateStr: string,
    format: string = 'DD/MM/YYYY',
): string {
    if (!dateStr) return '';
    return dayjs(dateStr).format(format);
}

/**
 * Formats a date string to a full date and time representation.
 * @param dateStr - The date string.
 * @param format - Optional custom format. Default is 'MMMM D, YYYY h:mm A' (e.g., "March 15, 2025 3:30 PM").
 * @returns The formatted date and time string.
 */
export function formatDateTime(
    dateStr: string,
    format: string = 'MMMM D, YYYY h:mm A',
): string {
    if (!dateStr) return '';
    return dayjs(dateStr).format(format);
}
