import React, {FC} from "react";

interface ButtonCallToActionProps {
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
}

const ButtonCallToAction: FC<ButtonCallToActionProps> = ({className, children, onClick, type}) => {
    return (
        <button
            type={type || "button"}
            onClick={onClick}
            className={"items-center bg-gradient-to-br from-violet-500 to-fuchsia-500 border-0 rounded-md box-border flex justify-center px-8 py-3 shadow-btn text-xl text-white " + className}
        >
            {children}
        </button>
    );
}

export default ButtonCallToAction;