import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {CssBaseline} from "@mui/material";
import {CustomThemeProvider} from "./Theme.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from "./components/HomePage/HomePage.tsx";
import LoginForm from "./components/LoginForm/LoginForm.tsx";
import RegisterForm from "./components/RegisterForm/RegisterForm.tsx";
import UserProfile from "./components/UserProfile/UserProfile.tsx";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

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
        path: '/profile/wishlists',
        element: <div>Wishlists</div>
    },
    {
        path: '/profile/settings',
        element: <div>Settings</div>
    },
    {
        path: '/wishlists/:guid',
        element: <div>Wishlist</div>
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
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </CustomThemeProvider>
    </React.StrictMode>
);