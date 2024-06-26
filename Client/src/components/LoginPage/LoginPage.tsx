import AuthenticationPage from "../AuthenticationPage/AuthenticationPage.tsx";
import Copyright from "../Copyright/Copyright.tsx";
import {useMutation} from "@tanstack/react-query";
import {useLocation, useNavigate} from "react-router-dom";
import {UserLoginRequest} from "../../models/requests/user-login.model.ts";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {ObjectSchema} from "yup";
import toast from "react-hot-toast";
import {login, signInWithGoogle} from "../../services/auth.service.ts";
import FormInput from "../FormInput/FormInput.tsx";
import FormCheckbox from "../FormCheckbox/FormCheckbox.tsx";
import ButtonCallToAction from "../ButtonCallToAction/ButtonCallToAction.tsx";
import {GoogleLogin} from "@react-oauth/google";
import {useTranslation} from "react-i18next";

class LoginFormData {
    email: string = '';
    password: string = '';
    rememberMe: boolean = false;
}

const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation()
    const from = (location.state as { from: string })?.from || '/';

    const validationScheme: ObjectSchema<LoginFormData> = Yup.object({
        email: Yup.string()
            .email(t("validation_email"))
            .required(t("validation_email_required")),
        password: Yup.string()
            .required(t("validation_password_required")),
        rememberMe: Yup.boolean().defined()
    });

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<LoginFormData>({resolver: yupResolver(validationScheme), mode: 'onSubmit'});

    const mutation = useMutation({
        mutationFn: (data: UserLoginRequest) => login(data),
        onSuccess: async () => {
            toast.success(t("login_toast_success"));
            navigate(from);
        },
        onError: (_: any) => {
            toast.error(t("login_toast_error"));
        }
    });

    const onSubmit = (data: LoginFormData) => {
        const request: UserLoginRequest = {
            email: data.email,
            password: data.password,
            rememberMe: data.rememberMe
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
            <h2 className="text-2xl mb-6">{t("login_title")}</h2>
            <div className="flex flex-1 flex-col gap-y-2.5 w-full items-center">
                <GoogleLogin onSuccess={handleGoogleLoginSuccess} />
                <div className="inline-flex items-center justify-center w-full">
                    <hr className="absolute w-64 h-px bg-gray-200 border-0 dark:bg-gray-700"/>
                    <span className="px-3 font-medium text-gray-900 bg-background left-1/2 z-0">{t("login_separator")}</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
                    <div className="space-y-4">
                        <FormInput
                            required
                            autoFocus
                            id="email"
                            label={t("login_label_email")}
                            type="email"
                            register={register}
                            errorMessage={errors.email?.message}
                        />
                        <FormInput
                            required
                            id="password"
                            label={t("login_label_password")}
                            type="password"
                            register={register}
                            errorMessage={errors.password?.message}
                        />
                        <FormCheckbox id="rememberMe" label={t("login_label_remember")} register={register}/>
                    </div>
                    <div className="flex flex-col sm:flex-row text-sm mt-6">
                        <div className="flex flex-grow justify-end sm:justify-start">
                            <button type="button" className="underline" onClick={() => navigate("/forgotPassword")}>
                                {t("login_forgot_password")}
                            </button>
                        </div>
                        <div className="flex justify-end mt-1 sm:mt-0 gap-x-1">
                            {t("login_register")}
                            <button type="button" className="underline"
                                    onClick={() => navigate("/register", {state: {from}})}>
                                {t("login_register_link")}
                            </button>
                        </div>
                    </div>
                    <div className="w-full flex gap-y-4 justify-center mt-10">
                        <ButtonCallToAction size="lg" type="submit">
                            {t("login_submit")}
                        </ButtonCallToAction>
                    </div>
                </form>
            </div>
            <Copyright className="py-4"/>
        </AuthenticationPage>
    );
}

export default LoginPage;