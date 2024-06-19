import {FC} from "react";
import {useForm} from "react-hook-form";
import {ObjectSchema} from "yup";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useMutation} from "@tanstack/react-query";
import {forgotPassword} from "../../services/auth.service.ts";
import toast from "react-hot-toast";
import Container from "../Container/Container.tsx";
import FormInput from "../FormInput/FormInput.tsx";
import ButtonCallToAction from "../ButtonCallToAction/ButtonCallToAction.tsx";
import {useTranslation} from "react-i18next";

class ForgotPasswordFormData {
    email: string = '';
}

interface ForgotPasswordPageProps {}

const ForgotPasswordPage: FC<ForgotPasswordPageProps> = () => {
    const { t } = useTranslation();

    const validationScheme: ObjectSchema<ForgotPasswordFormData> = Yup.object({
        email: Yup.string().email(t("validation_email")).required(t("validation_email_required")),
    });
    
    const {
        register: forgotPasswordRegister,
        handleSubmit: forgotPasswordHandleSubmit,
        formState: {errors: forgotPasswordErrors}
    } = useForm<ForgotPasswordFormData>({resolver: yupResolver(validationScheme), mode: 'onSubmit'});
    
    const forgotPasswordMutation = useMutation({
        mutationFn: (data: ForgotPasswordFormData) => forgotPassword(data.email),
        onSuccess: async () => {
            toast.success(t("forgot_password_toast_success"), {duration: 10000});
        },
        onError: async () => {
            toast.error(t("forgot_password_toast_error"));
        }
    });

    const onSubmitForgot = (data: ForgotPasswordFormData) => {
        forgotPasswordMutation.mutate(data);
    }
    
    return (
        <Container>
            <h2 className="my-10 font-bold text-xl">{t("forgot_password_title")}</h2>
            <form onSubmit={forgotPasswordHandleSubmit(onSubmitForgot)} className="w-full max-w-xl px-5 flex-col flex-grow space-y-5">
                <div className="space-y-4">
                    <FormInput
                        required
                        id="email"
                        label={t("forgot_password_label_email")}
                        type="text"
                        register={forgotPasswordRegister}
                        errorMessage={forgotPasswordErrors.email?.message}
                    />
                </div>
                <div className="w-full flex justify-center mt-10">
                    <ButtonCallToAction size="md" type="submit" className="py-1.5">
                        {t("forgot_password_submit")}
                    </ButtonCallToAction>
                </div>
            </form>
        </Container>
    );
};

export default ForgotPasswordPage;