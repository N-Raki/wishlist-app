import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {CustomThemeProvider} from "./ThemeContext.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from "./components/HomePage/HomePage.tsx";
import LoginForm from "./components/LoginForm/LoginForm.tsx";
import RegisterForm from "./components/RegisterForm/RegisterForm.tsx";
import WishlistsCreateForm from "./components/WishlistCreateForm/WishlistsCreateForm.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "react-hot-toast";
import WishlistView from "./components/WishlistView/WishlistView.tsx";
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import UserProfilePage from "./components/UserProfilePage/UserProfilePage.tsx";
import ForgotPasswordPage from "./components/ForgotPasswordPage/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./components/ResetPasswordPage/ResetPasswordPage.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage/>
    },
    {
        path: '/login',
        element: <LoginForm/>
    },
    {
        path: '/register',
        element: <RegisterForm/>
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
        element: <div>Not Found</div>
    }
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <CustomThemeProvider>
            <div className="h-screen bg-background dark:bg-backgroundDark text-onBackground dark:text-onBackgroundDark transition-colors">
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router}/>
                    <ReactQueryDevtools initialIsOpen={false} buttonPosition={'bottom-left'}/>
                    <Toaster position="bottom-right" />
                </QueryClientProvider>
            </div>
        </CustomThemeProvider>
    </React.StrictMode>
);