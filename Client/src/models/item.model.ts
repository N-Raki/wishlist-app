export class Item {
    id: string = '';
    wishlistId: string = '';
    name: string = '';
    url?: string | null;
    price?: number | null;
    buyerIds: string[] = [];
}