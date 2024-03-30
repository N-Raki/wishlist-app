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
            className={"leading-6" + (pathname === route ? " font-bold" : " text-sm")}
            onClick={() => navigate(route)}
        >
            {label}
        </button>
    );
};