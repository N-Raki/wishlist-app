import React, {FC} from 'react';
import DarkModeSwitch from "../DarkModeSwitch/DarkModeSwitch.tsx";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

interface AuthenticationFormProps {
    children: React.ReactNode;
}

const AuthenticationPage: FC<AuthenticationFormProps> = ({children}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen flex">
            <div className="flex-grow bg-gifts bg-no-repeat bg-cover"></div>
            <div className="flex flex-col bg-background dark:bg-backgroundDark max-w-3xl w-full shadow-elevation transition-colors">
                <header className="flex p-5 mb-5 sm:mb-20">
                    <div className="flex-grow">
                        <button type="button" className="text-2xl" onClick={() => navigate("/")}>{t("title_with_sparkles")}</button>
                    </div>
                    <DarkModeSwitch/>
                </header>
                <div className="flex flex-col items-center w-full flex-1 px-4">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AuthenticationPage;
