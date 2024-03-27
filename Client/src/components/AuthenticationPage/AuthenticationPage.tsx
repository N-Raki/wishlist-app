import React, {FC} from 'react';
import './AuthenticationPage.css';
import DarkModeSwitch from "../DarkModeSwitch/DarkModeSwitch.tsx";
import {useNavigate} from "react-router-dom";

interface AuthenticationFormProps {
    children: React.ReactNode;
}

const AuthenticationPage: FC<AuthenticationFormProps> = ({children}) => {
    const navigate = useNavigate();
    
    return (
        <div className="h-screen flex">
            <div className="flex-grow bg-wallpaper bg-no-repeat bg-cover"></div>
            <div className="bg-background dark:bg-backgroundDark max-w-2xl w-full">
                <header className="flex p-5 justify-end">
                    <DarkModeSwitch/>
                </header>
                <div className="flex flex-col items-center">
                    <button type="button" className="text-6xl mb-5" onClick={() => navigate("/")}>✨</button>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AuthenticationPage;
