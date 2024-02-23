import axios from "axios";
import {User} from "../models/user.model.ts";

const API_URL: string = import.meta.env.VITE_API_URL;

const login = async (email: string, password: string): Promise<void> => {
    try {
        await axios.post<User>(API_URL + '/login?useCookies=true',
            {
                email: email,
                password: password
            },
            {
                withCredentials: true
            });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default login;