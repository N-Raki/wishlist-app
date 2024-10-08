import {FC, useEffect} from "react";
import {useForm} from "react-hook-form";
import {ObjectSchema} from "yup";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useMutation, useQuery} from "@tanstack/react-query";
import {changePassword} from "../../services/auth.service.ts";
import toast from "react-hot-toast";
import {User} from "../../models/user.model.ts";
import {changeDisplayName, getCurrentUser} from "../../services/user.service.ts";
import {useNavigate} from "react-router-dom";
import {AxiosError} from "axios";
import {AspNetValidationProblem} from "../../models/errors/AspNetValidationProblem.ts";
import FormInput from "../FormInput/FormInput.tsx";
import ButtonCallToAction from "../ButtonCallToAction/ButtonCallToAction.tsx";
import Container from "../Container/Container.tsx";
import {useTranslation} from "react-i18next";

class ChangePasswordFormData {
    currentPassword: string = '';
    newPassword: string = '';
    confirmNewPassword: string = '';
}

class ChangeDisplayNameFormData {
    displayName: string = '';
}

interface UserProfilePageProps { }

const UserProfilePage: FC<UserProfilePageProps> = () => {
    const { t } = useTranslation();
    const userQuery = useQuery<User>({queryKey: ['user'], queryFn: getCurrentUser, retry: false});

    const changePasswordValidationScheme: ObjectSchema<ChangePasswordFormData> = Yup.object({
        currentPassword: Yup.string()
            .required(t("validation_password_current_required")),
        newPassword: Yup.string()
            .required(t("validation_password_new_required"))
            .min(6, t("validation_password_min_length", { count: 6 }))
            .notOneOf([Yup.ref('currentPassword')], t("validation_password_new_different")),
        confirmNewPassword: Yup.string()
            .required(t("validation_password_new_confirm_required"))
            .oneOf([Yup.ref('newPassword')], t("validation_password_confirm"))
    });
    
    const displayNameValidationScheme: ObjectSchema<ChangeDisplayNameFormData> = Yup.object({
        displayName: Yup.string()
            .required(t("validation_display_name_required"))
    });
    
    const {
        register: changePasswordRegister,
        handleSubmit: changePasswordHandleSubmit,
        formState: {errors: changePasswordErrors},
        reset: changePasswordReset
    } = useForm<ChangePasswordFormData>({resolver: yupResolver(changePasswordValidationScheme), mode: 'onSubmit'});
    
    const {
        register: changeDisplayNameRegister,
        handleSubmit: changeDisplayNameHandleSubmit,
        formState: {errors: changeDisplayNameErrors, isDirty: isDisplayNameDirty},
        reset: changeDisplayNameReset
    } = useForm<ChangeDisplayNameFormData>({resolver: yupResolver(displayNameValidationScheme), mode: 'onSubmit'});
    
    const changePasswordMutation = useMutation({
        mutationFn: (data: ChangePasswordFormData) => changePassword(data.currentPassword, data.newPassword),
        onSuccess: async () => {
            toast.success(t("profile_change_password_toast_success"));
            changePasswordReset(new ChangePasswordFormData());
        },
        onError: async (error: AxiosError<AspNetValidationProblem>) => {
            let errors = error.response?.data.errors;
            if (errors) {
                for (let key in errors) {
                    let message = errors[key].join(' ');
                    toast.error(t("profile_change_password_toast_error", { message: message }), { duration: 10000 });
                }
            } else {
                toast.error(t("profile_change_password_toast_error", { message: error.message }), { duration: 10000 });
            }
        }
    });
    
    const changeDisplayNameMutation = useMutation({
        mutationFn: (data: ChangeDisplayNameFormData) => changeDisplayName(data.displayName),
        onSuccess: async () => {
            toast.success(t("profile_change_display_name_toast_success"));
        },
        onError: async (error: AxiosError<AspNetValidationProblem>) => {
            let errors = error.response?.data.errors;
            if (errors) {
                for (let key in errors) {
                    let message = errors[key].join(' ');
                    toast.error(t("profile_change_display_name_toast_error", { message: message }), { duration: 10000 });
                }
            } else {
                toast.error(t("profile_change_display_name_toast_error", { message: error.message }), { duration: 10000 });
            }
        }
    });

    const onChangePasswordSubmit = (data: ChangePasswordFormData) => {
        changePasswordMutation.mutate(data);
    }
    
    const onChangeDisplayNameSubmit = (data: ChangeDisplayNameFormData) => {
        if (isDisplayNameDirty) changeDisplayNameMutation.mutate(data);
    }
    
    const navigate = useNavigate();

    useEffect(() => {
        if (userQuery.isError) {
            navigate("/");
        }
    }, [userQuery, navigate]);

    useEffect(() => {
        if (userQuery.isSuccess) {
            changeDisplayNameReset({
                displayName: userQuery.data.displayName ?? ''
            });
        }
    }, [userQuery.isSuccess, changeDisplayNameReset]);


    if (userQuery.isSuccess) {
        return (
            <Container>
                <div className="flex flex-col md:flex-row items-center md:items-start w-full md:w-auto gap-y-2 md:gap-x-8">
                    <div className="flex flex-col items-center w-full">
                        <h2 className="my-10 text-xl font-bold text-center">{t("profile_change_display_name_title")}</h2>
                        <form onSubmit={changeDisplayNameHandleSubmit(onChangeDisplayNameSubmit)}
                            className="w-full max-w-xl px-5 flex-col flex-grow space-y-5">
                            <div className="space-y-4">
                                <FormInput
                                    required
                                    autoFocus
                                    id="displayName"
                                    label={t("profile_change_display_name_label")}
                                    type="text"
                                    register={changeDisplayNameRegister}
                                    errorMessage={changeDisplayNameErrors.displayName?.message}
                                />
                            </div>
                            <div className="w-full flex justify-center mt-10">
                                <ButtonCallToAction size="lg" type="submit" className="py-1.5">
                                    {t("profile_change_display_name_submit")}
                                </ButtonCallToAction>
                            </div>
                        </form>
                    </div>
                    <div className="flex flex-col items-center w-full">
                        <h2 className="my-10 text-xl font-bold text-center">{t("profile_change_password_title")}</h2>
                        <form onSubmit={changePasswordHandleSubmit(onChangePasswordSubmit)}
                              className="w-full max-w-xl px-5 flex-col flex-grow space-y-5">
                            <div className="space-y-4">
                                <FormInput
                                    required
                                    id="currentPassword"
                                    label={t("profile_change_password_label_current_password")}
                                    type="password"
                                    register={changePasswordRegister}
                                    errorMessage={changePasswordErrors.currentPassword?.message}
                                />
                            </div>
                            <div className="space-y-4">
                                <FormInput
                                    required
                                    id="newPassword"
                                    label={t("profile_change_password_label_new_password")}
                                    type="password"
                                    register={changePasswordRegister}
                                    errorMessage={changePasswordErrors.newPassword?.message}
                                />
                            </div>
                            <div className="space-y-4">
                                <FormInput
                                    required
                                    id="confirmNewPassword"
                                    label={t("profile_change_password_label_new_password_confirm")}
                                    type="password"
                                    register={changePasswordRegister}
                                    errorMessage={changePasswordErrors.confirmNewPassword?.message}
                                />
                            </div>
                            <div className="w-full flex justify-center mt-10">
                                <ButtonCallToAction size="lg" type="submit" className="py-1.5">
                                    {t("profile_change_password_submit")}
                                </ButtonCallToAction>
                            </div>
                        </form>
                    </div>
                </div>
            </Container>
        );
    }
};

export default UserProfilePage;