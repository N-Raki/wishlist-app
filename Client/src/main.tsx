import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {CssBaseline} from "@mui/material";
import {CustomThemeProvider} from "./ThemeContext.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from "./components/HomePage/HomePage.tsx";
import LoginForm from "./components/LoginForm/LoginForm.tsx";
import RegisterForm from "./components/RegisterForm/RegisterForm.tsx";
import UserProfile from "./components/UserProfile/UserProfile.tsx";
import WishlistsCreateForm from "./components/WishlistCreateForm/WishlistsCreateForm.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "react-hot-toast";
import WishlistView from "./components/WishlistView/WishlistView.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />
    },
    {
        path: '/login',
        element: <LoginForm />
    },
    {
        path: '/register',
        element: <RegisterForm />
    },
    {
        path: '/profile',
        element: <UserProfile />
    },
    {
        path: '/profile/settings',
        element: <div>Settings</div>
    },
    {
        path: '/wishlists/new',
        element: <WishlistsCreateForm />
    },
    {
        path: '/wishlists/:guid',
        element: <WishlistView />
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
            <CssBaseline/>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
                <Toaster position="bottom-right" />
            </QueryClientProvider>
        </CustomThemeProvider>
    </React.StrictMode>
);