import axios, {AxiosResponse} from "axios";
import {User} from "../models/user.model.ts";
import toast from "react-hot-toast";

const API_URL: string = import.meta.env.VITE_API_URL;

const getCurrentUser = async (): Promise<User> => {
    try {
        const response: AxiosResponse<User> = await axios.get<User>(API_URL + '/api/users/me', {
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

const UserService = {
    getCurrentUser,
}

export default UserService;