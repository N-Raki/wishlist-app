import {Item} from "./item.model.ts";

export class Wishlist {
    id: string = '';
    userId: string = '';
    ownerName: string = "";
    name: string = '';
    items: Item[] = [];
    isOwner: boolean = false;
}