import {FC} from "react";
import {UseFormRegister} from "react-hook-form";

interface FormCheckboxProps {
    id: string;
    label: string;
    register: UseFormRegister<any>;
}

const FormCheckbox: FC<FormCheckboxProps> = ({id, label, register}) => {
    return (
        <div className="flex content-center">
            <input
                id={id}
                type="checkbox"
                className="w-4 h-4 mr-2 rounded accent-primary-600"
                {...register(id)}
            />
            <label htmlFor={id} className="text-sm">
                {label}
            </label>
        </div>
    )
}

export default FormCheckbox;