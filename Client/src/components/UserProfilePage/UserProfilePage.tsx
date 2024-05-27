import {FC, useEffect} from "react";
import {useForm} from "react-hook-form";
import {ObjectSchema} from "yup";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useMutation, useQuery} from "@tanstack/react-query";
import {changePassword} from "../../services/auth.service.ts";
import toast from "react-hot-toast";
import {User} from "../../models/user.model.ts";
import {getCurrentUser} from "../../services/user.service.ts";
import {useNavigate} from "react-router-dom";
import {AxiosError} from "axios";
import {AspNetValidationProblem} from "../../models/errors/AspNetValidationProblem.ts";
import FormInput from "../FormInput/FormInput.tsx";
import ButtonCallToAction from "../ButtonCallToAction/ButtonCallToAction.tsx";
import Container from "../Container/Container.tsx";

class ResetPasswordFormData {
    currentPassword: string = '';
    newPassword: string = '';
    confirmNewPassword: string = '';
}

const validationScheme: ObjectSchema<ResetPasswordFormData> = Yup.object({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
        .required('New password is required')
        .min(6, 'Password must be at least 6 characters').notOneOf([Yup.ref('currentPassword')], 'New password must be different from current password'),
    confirmNewPassword: Yup.string()
        .required('New password confirmation is required')
        .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
});

interface UserProfilePageProps {
}

const UserProfilePage: FC<UserProfilePageProps> = () => {
    
    const userQuery = useQuery<User>({queryKey: ['user'], queryFn: getCurrentUser, retry: false});

    const {
        register: resetPasswordRegister,
        handleSubmit: resetPasswordHandleSubmit,
        formState: {errors: resetPasswordErrors},
        reset: resetPasswordReset
    } = useForm<ResetPasswordFormData>({resolver: yupResolver(validationScheme), mode: 'onSubmit'});
    
    const resetPasswordMutation = useMutation({
        mutationFn: (data: ResetPasswordFormData) => changePassword(data.currentPassword, data.newPassword),
        onSuccess: async () => {
            toast.success('Password reset successfully');
            resetPasswordReset(new ResetPasswordFormData());
        },
        onError: async (error: AxiosError<AspNetValidationProblem>) => {
        let errors = error.response?.data.errors;
        if (errors) {
            for (let key in errors) {
                let message = errors[key].join(' ');
                toast.error(message, { duration: 10000 });
            }
        } else {
            toast.error('An error occurred while registering the user. ' + error.message, { duration: 10000 });
        }
    }
    });

    const onSubmit = (data: ResetPasswordFormData) => {
        resetPasswordMutation.mutate(data);
    }
    
    const navigate = useNavigate();

    useEffect(() => {
        if (userQuery.isError) {
            navigate("/");
        }
    }, [userQuery, navigate]);
    
    if (userQuery.isSuccess) {
        return (
            <Container>
                <h2 className="my-10 text-xl font-bold">Change your password</h2>
                <form onSubmit={resetPasswordHandleSubmit(onSubmit)} className="w-full max-w-xl px-5 flex-col flex-grow space-y-5">
                    <div className="space-y-4">
                        <FormInput
                            required
                            autoFocus
                            id="currentPassword"
                            label="Password"
                            type="password"
                            register={resetPasswordRegister}
                            errorMessage={resetPasswordErrors.currentPassword?.message}
                        />
                    </div>
                    <div className="space-y-4">
                        <FormInput
                            required
                            id="newPassword"
                            label="New password"
                            type="password"
                            register={resetPasswordRegister}
                            errorMessage={resetPasswordErrors.newPassword?.message}
                        />
                    </div>
                    <div className="space-y-4">
                        <FormInput
                            required
                            id="confirmNewPassword"
                            label="Confirm new password"
                            type="password"
                            register={resetPasswordRegister}
                            errorMessage={resetPasswordErrors.confirmNewPassword?.message}
                        />
                    </div>
                    <div className="w-full flex justify-center mt-10">
                        <ButtonCallToAction size="lg" type="submit" className="py-1.5">
                            Change password
                        </ButtonCallToAction>
                    </div>
                </form>
            </Container>
        );
    }
};

export default UserProfilePage;