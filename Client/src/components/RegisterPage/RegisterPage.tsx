import AuthenticationPage from "../AuthenticationPage/AuthenticationPage.tsx";
import Copyright from "../Copyright/Copyright.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import * as Yup from 'yup';
import {ObjectSchema} from 'yup';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {UserRegisterRequest} from "../../models/requests/user-register.model.ts";
import toast from "react-hot-toast";
import {AxiosError} from "axios";
import {AspNetValidationProblem} from "../../models/errors/AspNetValidationProblem.ts";
import {register, signInWithGoogle} from "../../services/auth.service.ts";
import ButtonCallToAction from "../ButtonCallToAction/ButtonCallToAction.tsx";
import FormInput from "../FormInput/FormInput.tsx";
import {GoogleLogin} from "@react-oauth/google";
import {useTranslation} from "react-i18next";

class RegisterFormData {
    displayName: string = '';
    email: string = '';
    password: string = '';
    confirmPassword: string = '';
}

const RegisterPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from: string })?.from || '/';

    const validationScheme: ObjectSchema<RegisterFormData> = Yup.object({
        displayName: Yup.string()
            .required(t("validation_display_name_required")),
        email: Yup.string()
            .required(t("validation_email_required"))
            .email(t("validation_email")),
        password: Yup.string()
            .required(t("validation_password_required"))
            .min(6, t("validation_password_min_length", { count: 6 })),
        confirmPassword: Yup.string()
            .required(t("validation_password_confirm_required"))
            .oneOf([Yup.ref('password')], t("validation_password_confirm"))
    });

    const {
        register: registerForm,
        handleSubmit,
        formState: {errors}
    } = useForm<RegisterFormData>({resolver: yupResolver(validationScheme), mode: 'onSubmit'});

    const mutation = useMutation({
        mutationFn: (data: UserRegisterRequest) => register(data),
        onSuccess: async () => {
            toast.success(t("register_toast_success"));
            navigate(from);
        },
        onError: (error: AxiosError<AspNetValidationProblem>) => {
            let errors = error.response?.data.errors;
            if (errors) {
                for (let key in errors) {
                    let message = errors[key].join(' ');
                    toast.error(t("register_toast_error", { message: message }), {duration: 10000});
                }
            } else {
                toast.error(t("register_toast_error", { message: error.message }), {duration: 10000});
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

    const handleGoogleLoginSuccess = async (response: any) => {
        if (response.credential) {
            const { credential } = response;
            await signInWithGoogle(credential);
            toast.success(t("login_toast_success"));
            navigate(from);
        }
    };

    return (
        <AuthenticationPage>
            <h2 className="text-2xl mb-6">{t("register_title")}</h2>
            <div className="flex flex-1 flex-col gap-y-2.5 w-full items-center">
                <GoogleLogin onSuccess={handleGoogleLoginSuccess} />
                <div className="inline-flex items-center justify-center w-full">
                    <hr className="absolute w-64 h-px bg-gray-200 border-0 dark:bg-gray-700"/>
                    <span className="px-3 font-medium text-gray-900 bg-background left-1/2 z-0">{t("login_separator")}</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
                    <div className="space-y-2">
                        <FormInput
                            required
                            autoFocus
                            id="displayName"
                            label={t("register_label_display_name")}
                            register={registerForm}
                            errorMessage={errors.displayName?.message}
                        />
                        <FormInput
                            required
                            id="email"
                            label={t("register_label_email")}
                            type="email"
                            register={registerForm}
                            errorMessage={errors.email?.message}
                        />
                        <div className="grid grid-cols-2 gap-2">

                            <FormInput
                                required
                                id="password"
                                label={t("register_label_password")}
                                type="password"
                                register={registerForm}
                                errorMessage={errors.password?.message}
                            />
                            <FormInput
                                required
                                id="confirmPassword"
                                label={t("register_label_password_confirm")}
                                type="password"
                                register={registerForm}
                                errorMessage={errors.confirmPassword?.message}
                            />
                        </div>
                    </div>


                    <div className="mt-3 flex justify-end text-sm gap-x-1">
                        {t("register_login")}
                        <button type="button" className="underline" onClick={() => navigate("/login", {state: {from}})}>
                            {t("register_login_link")}
                        </button>
                    </div>

                    <div className="w-full flex justify-center mt-10">
                        <ButtonCallToAction size="lg" type="submit">
                            {t("register_submit")}
                        </ButtonCallToAction>
                    </div>
                </form>
            </div>
            <Copyright className="py-4"/>
        </AuthenticationPage>
    );
}

export default RegisterPage;