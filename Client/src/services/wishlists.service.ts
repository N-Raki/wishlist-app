import axios, {AxiosResponse} from "axios";
import {Wishlist} from "../models/wishlist.model.ts";
import {WishlistCreateRequest} from "../models/requests/wishlist-create.model.ts";

export async function getWishlist(guid: string) {
    try {
        const response: AxiosResponse<Wishlist> = await axios.get<Wishlist>('/api/wishlists/' + guid, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getRecentWishlists() {
    try {
        const response: AxiosResponse<Wishlist[]> = await axios.get<Wishlist[]>('/api/wishlists/recent', {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function createWishlist(wishlistCreateRequest: WishlistCreateRequest) {
    try {
        const response: AxiosResponse<Wishlist> = await axios.post('/api/wishlists', wishlistCreateRequest, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteWishlist(guid: string) {
    try {
        const response: AxiosResponse<void> = await axios.delete('/api/wishlists/' + guid, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}