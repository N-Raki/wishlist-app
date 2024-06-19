import {FC, useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {resetPassword} from "../../services/auth.service.ts";
import toast from "react-hot-toast";
import {AxiosError} from "axios";
import {AspNetValidationProblem} from "../../models/errors/AspNetValidationProblem.ts";
import {ObjectSchema} from "yup";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import FormInput from "../FormInput/FormInput.tsx";
import ButtonCallToAction from "../ButtonCallToAction/ButtonCallToAction.tsx";
import Container from "../Container/Container.tsx";
import {useTranslation} from "react-i18next";

class ResetPasswordFormData {
    newPassword: string = '';
    confirmNewPassword: string = '';
}

interface ResetPasswordPageProps {}

const ResetPasswordPage: FC<ResetPasswordPageProps> = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const email = searchParams.get('email');
    const resetCode = searchParams.get('resetCode');
    
    if (!email || !resetCode) {
        useEffect(() => {
            navigate('/login');
        }, [email, resetCode]);
        return null;
    }

    const validationScheme: ObjectSchema<ResetPasswordFormData> = Yup.object({
        newPassword: Yup.string()
            .required(t("validation_password_required"))
            .min(6, t("validation_password_min_length", { count: 6 })),
        confirmNewPassword: Yup.string()
            .required(t("validation_password_confirm_required"))
            .oneOf([Yup.ref('newPassword')], t("validation_password_confirm"))
    });
    
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<ResetPasswordFormData>({resolver: yupResolver(validationScheme), mode: 'onSubmit'});

    const resetPasswordMutation = useMutation({
        mutationFn: (data: ResetPasswordFormData) => resetPassword(email, resetCode, data.newPassword),
        onSuccess: async () => {
            toast.success(t("register_toast_success"));
            navigate('/login');
        },
        onError: async (error: AxiosError<AspNetValidationProblem>) => {
            let errors = error.response?.data.errors;
            if (errors) {
                for (let key in errors) {
                    let message = errors[key].join(' ');
                    toast.error(t("reset_password_toast_error", { message: message }), { duration: 10000 });
                }
            } else {
                toast.error(t("reset_password_toast_error", { message: error.message }), { duration: 10000 });
            }
        }
    });
    
    const onSubmit = (data: ResetPasswordFormData) => {
        resetPasswordMutation.mutate(data);
    }
    
    return (
        <Container>
            <h2 className="my-10 text-xl font-bold">{t("reset_password_title")}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl px-5 flex-col flex-grow space-y-5">
                <div className="space-y-4">
                    <FormInput
                        required
                        id="newPassword"
                        label={t("reset_password_label_new_password")}
                        type="password"
                        register={register}
                        errorMessage={errors.newPassword?.message}
                    />
                </div>
                <div className="space-y-4">
                    <FormInput
                        required
                        id="confirmNewPassword"
                        label={t("reset_password_label_new_password_confirm")}
                        type="password"
                        register={register}
                        errorMessage={errors.confirmNewPassword?.message}
                    />
                </div>
                <div className="w-full flex justify-center mt-10">
                    <ButtonCallToAction size="lg" type="submit" className="py-1.5">
                        {t("reset_password_submit")}
                    </ButtonCallToAction>
                </div>
            </form>
        </Container>
    );
}

export default ResetPasswordPage;