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
            <div className="flex flex-col bg-background dark:bg-backgroundDark max-w-3xl w-full h-full shadow-elevation transition-colors">
                <header className="flex p-5 mb-5 sm:mb-20">
                    <div className="flex-grow">
                        <button type="button" className="text-2xl" onClick={() => navigate("/")}>✨ Wish me</button>
                    </div>
                    <DarkModeSwitch/>
                </header>
                <div className="flex flex-col items-center w-full flex-1 px-7">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AuthenticationPage;
