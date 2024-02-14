import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {CssBaseline} from "@mui/material";
import {CustomThemeProvider} from "./Theme.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from "./components/HomePage/HomePage.tsx";
import LoginForm from "./components/LoginForm/LoginForm.tsx";
import RegisterForm from "./components/RegisterForm/RegisterForm.tsx";

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
