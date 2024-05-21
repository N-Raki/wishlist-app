import React, {FC} from "react";

interface ButtonCallToActionProps {
    className?: string;
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    size?: "sm" | "md" | "lg";
    type?: "button" | "submit" | "reset";
}

const ButtonCallToAction: FC<ButtonCallToActionProps> = ({className, children, disabled = false, onClick, size, type}) => {
    return (
        <>
            <button
                disabled={disabled}
                type={type || "button"}
                onClick={onClick}
                className={`items-center border-0 rounded-md box-border flex justify-center 
                ${disabled ? "bg-black/20 text-black/20" : "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white"}
                ${
                    size === "sm"
                        ? "px-3 py-1 text-sm"
                        : size === "md"
                            ? "px-4 py-2 text-md"
                            : size === "lg"
                                ? "px-6 py-2.5 text-xl"
                                : null
                } shadow-btn ${className}`}
            >
                {children}
            </button>
        </>
    );
}

export default ButtonCallToAction;