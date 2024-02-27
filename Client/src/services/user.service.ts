import axios, {AxiosResponse} from "axios";
import {User} from "../models/user.model.ts";

const API_URL: string = import.meta.env.VITE_API_URL;

const getCurrentUser = async (): Promise<User> => {
    try {
        const response: AxiosResponse<User> = await axios.get<User>(API_URL + '/api/users/me', {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const UserService = {
    getCurrentUser,
}

export default UserService;