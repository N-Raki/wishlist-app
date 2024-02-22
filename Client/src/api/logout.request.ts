import axios from "axios";
import {User} from "../models/user.model.ts";

const API_URL: string = import.meta.env.VITE_API_URL;

const logout = async (): Promise<void> => {
    try {
        await axios.post<User>(API_URL + '/logout', 
            {},
            {
                withCredentials: true
            });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default logout;