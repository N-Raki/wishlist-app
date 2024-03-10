import axios, {AxiosResponse} from "axios";
import {ItemCreateRequest} from "../models/requests/item-create.model.ts";

export async function createItem(wishlistId: string, itemCreateRequest: ItemCreateRequest) {
    try {
        const response: AxiosResponse = await axios.post('/api/wishlists/' + wishlistId + '/items', itemCreateRequest, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateItem (wishlistId: string, itemId: string, itemCreateRequest: ItemCreateRequest) {
    try {
        const response: AxiosResponse = await axios.put('/api/wishlists/' + wishlistId + '/items/' + itemId, itemCreateRequest, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteItem(wishlistId: string, itemId: string) {
    try {
        const response: AxiosResponse<void> = await axios.delete('/api/wishlists/' + wishlistId + '/items/' + itemId, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function pickItem(wishlistId: string, itemId: string) {
    try {
        const response: AxiosResponse<void> = await axios.post('/api/wishlists/' + wishlistId + '/items/' + itemId + '/pick', null, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function unpickItem(wishlistId: string, itemId: string) {
    try {
        const response: AxiosResponse<void> = await axios.post('/api/wishlists/' + wishlistId + '/items/' + itemId + '/unpick', null, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}