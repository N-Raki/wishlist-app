import axios, {AxiosResponse} from "axios";
import {UserRegisterRequest} from "../models/requests/user-register.model.ts";
import {UserLoginRequest} from "../models/requests/user-login.model.ts";
import {UserChangePasswordRequest} from "../models/requests/user-change-password.model.ts";
import {UserForgotPasswordRequest} from "../models/requests/user-forgot-password.model.ts";
import {UserResetPasswordRequest} from "../models/requests/user-reset-password.model.ts";

export async function login(data: UserLoginRequest): Promise<void> {
    try {
        await axios.post<void, AxiosResponse<void>, UserLoginRequest>('/api/auth/login',
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

export async function signInWithGoogle(token: string): Promise<void> {
    try {
        await axios.post('/api/auth/signin-google', { token }, { withCredentials: true });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function logout(): Promise<void> {
    try {
        await axios.post('/api/auth/logout',
            null,
            {
                withCredentials: true
            });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function register(data: UserRegisterRequest): Promise<void> {
    try {
        await axios.post<void, AxiosResponse<void>, UserRegisterRequest>('/api/auth/register', {
                displayName: data.displayName,
                email: data.email,
                password: data.password
            },
            {
                withCredentials: true

            });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
        await axios.post<void, AxiosResponse<void>, UserChangePasswordRequest>('/api/auth/changePassword', {
                currentPassword: currentPassword,
                newPassword: newPassword
            },
            {
                withCredentials: true
            });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function forgotPassword(email: string): Promise<void> {
    try {
        await axios.post<void, AxiosResponse<void>, UserForgotPasswordRequest>('/api/auth/forgotPassword', {
                email: email
            },
            {
                withCredentials: true
            });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function resetPassword(email: string, resetCode: string, newPassword: string): Promise<void> {
    try {
        await axios.post<void, AxiosResponse<void>, UserResetPasswordRequest>('/api/auth/resetPassword', {
                email: email,
                resetCode: resetCode,
                newPassword: newPassword
            },
            {
                withCredentials: true
            });
    } catch (error) {
        console.error(error);
        throw error;
    }
}
