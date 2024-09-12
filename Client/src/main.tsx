import React from 'react'
import ReactDOM from 'react-dom/client'
import "./i18n/config.ts";
import './index.css'
import 'react-tooltip/dist/react-tooltip.css'
import {CustomThemeProvider} from "./ThemeContext.tsx";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import HomePage from "./components/HomePage.tsx";
import LoginPage from "./components/LoginPage/LoginPage.tsx";
import RegisterPage from "./components/RegisterPage/RegisterPage.tsx";
import WishlistsCreateForm from "./components/WishlistCreateForm/WishlistsCreateForm.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "react-hot-toast";
import WishlistView from "./components/WishlistView/WishlistView.tsx";
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import UserProfilePage from "./components/UserProfilePage/UserProfilePage.tsx";
import ForgotPasswordPage from "./components/ForgotPasswordPage/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./components/ResetPasswordPage/ResetPasswordPage.tsx";
import RecentPage from "./components/RecentPage/RecentPage.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage/>
    },
    {
        path: "/recent",
        element: <RecentPage/>
    },
    {
        path: '/login',
        element: <LoginPage/>
    },
    {
        path: '/register',
        element: <RegisterPage/>
    },
    {
        path: '/forgotPassword',
        element: <ForgotPasswordPage/>
    },
    {
        path: '/resetPassword',
        element: <ResetPasswordPage/>
    },
    {
        path: '/profile',
        element: <UserProfilePage/>
    },
    {
        path: '/wishlists/new',
        element: <WishlistsCreateForm/>
    },
    {
        path: '/wishlists/:guid',
        element: <WishlistView/>
    },
    {
        path: '*',
        element: <Navigate to="/" />
    }
]);

const queryClient = new QueryClient();

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId={googleClientId}>
        <React.StrictMode>
            <CustomThemeProvider>
                <div className="min-h-screen bg-background dark:bg-backgroundDark text-onBackground dark:text-onBackgroundDark transition-colors">
                    <QueryClientProvider client={queryClient}>
                        <RouterProvider router={router}/>
                        <ReactQueryDevtools initialIsOpen={false} buttonPosition={'top-left'}/>
                        <Toaster position="bottom-left" />
                    </QueryClientProvider>
                </div>
            </CustomThemeProvider>
        </React.StrictMode>
    </GoogleOAuthProvider>
);