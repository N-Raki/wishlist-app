import AuthenticationPage from "../AuthenticationPage/AuthenticationPage.tsx";
import Copyright from "../Copyright/Copyright.tsx";
import {useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import * as Yup from 'yup';
import {ObjectSchema} from 'yup';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {UserRegisterRequest} from "../../models/requests/user-register.model.ts";
import toast from "react-hot-toast";
import {AxiosError} from "axios";
import {AspNetValidationProblem} from "../../models/errors/AspNetValidationProblem.ts";
import {register} from "../../services/auth.service.ts";
import ButtonCallToAction from "../ButtonCallToAction/ButtonCallToAction.tsx";
import FormInput from "../FormInput/FormInput.tsx";

class RegisterFormData {
    displayName: string = '';
    email: string = '';
    password: string = '';
    confirmPassword: string = '';
}

const validationScheme: ObjectSchema<RegisterFormData> = Yup.object({
    displayName: Yup.string()
        .required('Display name is required'),
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email address'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('password')], 'Passwords do not match')
});

const RegisterPage = () => {
    const navigate = useNavigate();

    const {
        register: registerForm,
        handleSubmit,
        formState: {errors}
    } = useForm<RegisterFormData>({resolver: yupResolver(validationScheme), mode: 'onBlur'});

    const mutation = useMutation({
        mutationFn: (data: UserRegisterRequest) => register(data),
        onSuccess: async () => {
            toast.success('User registered successfully');
            navigate('/');
        },
        onError: (error: AxiosError<AspNetValidationProblem>) => {
            let errors = error.response?.data.errors;
            if (errors) {
                for (let key in errors) {
                    let message = errors[key].join(' ');
                    toast.error(message, {duration: 10000});
                }
            } else {
                toast.error('An error occurred while registering the user. ' + error.message, {duration: 10000});
            }
        }
    });

    const onSubmit = (data: RegisterFormData) => {
        const request: UserRegisterRequest = {
            displayName: data.displayName,
            email: data.email,
            password: data.password
        }
        mutation.mutate(request);
    };

    return (
        <AuthenticationPage>
            <h2 className="text-2xl mb-6">Registration</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl flex-grow">
                <div className="space-y-3">
                    <FormInput
                        required
                        autoFocus
                        id="displayName"
                        label="Display Name"
                        register={registerForm}
                        errorMessage={errors.displayName?.message}
                    />
                    <FormInput
                        required
                        id="email"
                        label="Email Address"
                        type="email"
                        register={registerForm}
                        errorMessage={errors.email?.message}
                    />
                    <FormInput
                        required
                        id="password"
                        label="Password"
                        type="password"
                        register={registerForm}
                        errorMessage={errors.password?.message}
                    />
                    <FormInput
                        required
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        register={registerForm}
                        errorMessage={errors.confirmPassword?.message}
                    />
                </div>

                <div className="mt-3 flex justify-end underline text-sm">
                    <button type="button" onClick={() => navigate("/login")}>
                        Already have an account? Sign in
                    </button>
                </div>

                <div className="w-full flex justify-center mt-8">
                    <ButtonCallToAction type="submit">
                        Register
                    </ButtonCallToAction>
                </div>
            </form>
            <Copyright className="py-4"/>
        </AuthenticationPage>
    );
}

export default RegisterPage;