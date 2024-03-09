import axios, {AxiosResponse} from "axios";
import {User} from "../models/user.model.ts";

const API_URL: string = import.meta.env.VITE_API_URL;

export async function getCurrentUser(): Promise<User> {
    try {
        const response: AxiosResponse<User> = await axios.get<User>(API_URL + '/api/users/me', {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getUserDisplayName(userId: string): Promise<string> {
    try {
        const response: AxiosResponse<string> = await axios.get<string>(API_URL + '/api/users/' + userId + '/displayname', {
            withCredentials: true
        });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}