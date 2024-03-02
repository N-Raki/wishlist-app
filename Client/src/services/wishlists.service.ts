import axios, {AxiosResponse} from "axios";
import toast from "react-hot-toast";
import {Wishlist} from "../models/wishlist.model.ts";

const API_URL: string = import.meta.env.VITE_API_URL;

const getWishlist = async (guid: string) => {
    try {
        const response: AxiosResponse<Wishlist> = await axios.get<Wishlist>(API_URL + '/api/wishlists/' + guid, {
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
}

const WishlistsService = {
    getWishlist
}

export default WishlistsService;