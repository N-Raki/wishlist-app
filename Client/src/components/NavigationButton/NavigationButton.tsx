import {FC} from "react";
import {useLocation, useNavigate} from "react-router-dom";

interface NavigationButtonProps {
    label: string;
    route: string;
}

export const NavigationButton: FC<NavigationButtonProps> = ({label, route}) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    
    return (
        <button
            type="button"
            className={pathname === route ? "font-semibold leading-6" : "leading-6"}
            onClick={() => navigate(route)}
        >
            {label}
        </button>
    );
};