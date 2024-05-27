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

class ForgotPasswordFormData {
    email: string = '';
}

const validationScheme: ObjectSchema<ForgotPasswordFormData> = Yup.object({
    email: Yup.string().email().required(),
});

interface ForgotPasswordPageProps {}

const ForgotPasswordPage: FC<ForgotPasswordPageProps> = () => {
    const {
        register: forgotPasswordRegister,
        handleSubmit: forgotPasswordHandleSubmit,
        formState: {errors: forgotPasswordErrors}
    } = useForm<ForgotPasswordFormData>({resolver: yupResolver(validationScheme), mode: 'onChange'});
    
    const forgotPasswordMutation = useMutation({
        mutationFn: (data: ForgotPasswordFormData) => forgotPassword(data.email),
        onSuccess: async () => {
            toast.success('If the account exists, a password reset email has been sent', {duration: 10000});
        },
        onError: async () => {
            toast.error('An error occurred');
        }
    });

    const onSubmitForgot = (data: ForgotPasswordFormData) => {
        forgotPasswordMutation.mutate(data);
    }
    
    return (
        <Container>
            <h2 className="my-10 font-bold text-xl">Forgot your password ?</h2>
            <form onSubmit={forgotPasswordHandleSubmit(onSubmitForgot)} className="w-full max-w-xl px-5 flex-col flex-grow space-y-5">
                <div className="space-y-4">
                    <FormInput
                        required
                        id="email"
                        label="Enter your account's email address"
                        type="text"
                        register={forgotPasswordRegister}
                        errorMessage={forgotPasswordErrors.email?.message}
                    />
                </div>
                <div className="w-full flex justify-center mt-10">
                    <ButtonCallToAction size="md" type="submit" className="py-1.5">
                        Send mail with reset code
                    </ButtonCallToAction>
                </div>
            </form>
        </Container>
    );
};

export default ForgotPasswordPage;