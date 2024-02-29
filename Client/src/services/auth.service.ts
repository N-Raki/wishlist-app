import axios, {AxiosResponse} from "axios";
import {UserRegisterRequest} from "../models/requests/user-register.model.ts";
import {UserLoginRequest} from "../models/requests/user-login.model.ts";

const API_URL: string = import.meta.env.VITE_API_URL;

const login = async (data: UserLoginRequest): Promise<void> => {
    try {
        await axios.post<void, AxiosResponse<void>, UserLoginRequest>(API_URL + '/api/auth/login',
            {
                email: data.email,
                password: data.password,
                rememberMe: data.rememberMe
            },
            {
                withCredentials: true
            });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const logout = async (): Promise<void> => {
    try {
        await axios.post(API_URL + '/api/auth/logout', 
            null,
            {
                withCredentials: true
            });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const register = async (data: UserRegisterRequest): Promise<void> => {
    try {
        await axios.post<void, AxiosResponse<void>, UserRegisterRequest>(API_URL + '/api/auth/register', {
            email: data.email,
            password: data.password
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const AuthService = {
    login,
    logout,
    register
}

export default AuthService;