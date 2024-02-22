import {Wishlist} from "./wishlist.model.ts";

export class User {
    id: string = '';
    username: string = '';
    email: string = '';
    wishlists: Wishlist[] = [];
}