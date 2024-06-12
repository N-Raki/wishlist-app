import {FC} from "react";
import {UseFormRegister} from "react-hook-form";

interface FormInputProps {
    id: string;
    required?: boolean;
    autoFocus?: boolean;
    label: string;
    type?: "text" | "password" | "email" | "number";
    register: UseFormRegister<any>;
    errorMessage?: string;
}

const FormInput: FC<FormInputProps> = ({id, required, autoFocus, label, type, register, errorMessage}) => {
    return (
        <div className="space-y-1">
            <label htmlFor={id} className="text-sm text-onSurface dark:text-onSurfaceDark">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                autoFocus={autoFocus}
                id={id}
                type={type || "text"}
                className="w-full text-onSurface dark:text-onSurfaceDark bg-surface dark:bg-surfaceDark rounded-md px-3 py-1 leading-2 border-2 border-onBackground/20 dark:border-onBackgroundDark/20 focus:border-primary-700 dark:focus:border-primary-300 focus:outline-none transition-colors"
                autoComplete="off"
                {...register(id)}
            />
            <p className="text-red-500 text-xs italic">{errorMessage}</p>
        </div>
    )
}

export default FormInput;