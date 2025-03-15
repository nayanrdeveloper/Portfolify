export function mapToSelectableItems<T>(
    items: T[],
    idField: keyof T,
    nameField: keyof T,
): { id: string; name: string }[] {
    return items.map((item) => ({
        id: String(item[idField]),
        name: String(item[nameField]),
    }));
}
