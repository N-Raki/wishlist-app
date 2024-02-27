import {Wishlist} from "./wishlist.model.ts";

export class User {
    id: string = '';
    displayName: string = '';
    email: string = '';
    wishlists: Wishlist[] = [];
}