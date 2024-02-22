import axios from "axios";
import {User} from "../models/user.model.ts";

const API_URL: string = import.meta.env.VITE_API_URL;

const getUser = async (): Promise<User | undefined> => {
    try {
        return await axios.get<User>(API_URL + '/api/users/me',
            {
                withCredentials: true
            })
            .then(res => res.data as User);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                window.location.href = '/login';
            }
        } else {
            throw error;
        }
    }
}

export default getUser;