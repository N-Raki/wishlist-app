import axios, {AxiosResponse} from "axios";
import toast from "react-hot-toast";
import {ItemCreateRequest} from "../models/requests/item-create.model.ts";

const API_URL: string = import.meta.env.VITE_API_URL;

const createItem = async (wishlistId: string, itemCreateRequest: ItemCreateRequest) => {
    try {
        const response: AxiosResponse = await axios.post(API_URL + '/api/wishlists/' + wishlistId + '/items', itemCreateRequest, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                toast.error('You are not logged in');
            }
        }
        throw error;
    }
};

const ItemsService = {
    createItem
}

export default ItemsService;