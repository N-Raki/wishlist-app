export function setLocalStorageItem<T>(key: string, item: T): void {
    localStorage.setItem(key, JSON.stringify(item));
}

export function getLocalStorageItem<T>(key: string): T | null {
    try {
        const item = localStorage.getItem(key);
        if (item) {
            return JSON.parse(item);
        }
        return null;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}