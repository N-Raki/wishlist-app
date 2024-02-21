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
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <CustomThemeProvider>
            <CssBaseline/>
            <RouterProvider router={router} />
        </CustomThemeProvider>
    </React.StrictMode>
)
