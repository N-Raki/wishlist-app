import axios, {AxiosResponse} from "axios";
import {User} from "../models/user.model.ts";

export async function getCurrentUser(): Promise<User> {
    try {
        const response: AxiosResponse<User> = await axios.get<User>('/api/users/me', {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getUserDisplayName(userId: string): Promise<string> {
    try {
        const response: AxiosResponse<string> = await axios.get<string>('/api/users/' + userId + '/displayname', {
            withCredentials: true
        });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function changeDisplayName(displayName: string): Promise<void> {
    try {
        await axios.put<void>('/api/users/me/displayname', { displayName }, {
            withCredentials: true
        });
    } catch (error) {
        throw error;
    }
}