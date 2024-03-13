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
import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import ApplicationBar from "../ApplicationBar/ApplicationBar.tsx";
import Grid from "@mui/material/Grid";

class ResetPasswordFormData {
    newPassword: string = '';
    confirmNewPassword: string = '';
}

const validationScheme: ObjectSchema<ResetPasswordFormData> = Yup.object({
    newPassword: Yup.string().min(6).required(),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Passwords must match').required()
});

interface ResetPasswordPageProps {}

const ResetPasswordPage: FC<ResetPasswordPageProps> = () => {
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
    
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<ResetPasswordFormData>({resolver: yupResolver(validationScheme), mode: 'onChange'});

    const resetPasswordMutation = useMutation({
        mutationFn: (data: ResetPasswordFormData) => resetPassword(email, resetCode, data.newPassword),
        onSuccess: async () => {
            toast.success('Password reset successfully');
            navigate('/login');
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

    return (
        <Box>
            <ApplicationBar/>
            <Grid container display={'flex'} alignItems={'center'} justifyContent={'center'} textAlign={'center'} marginTop={2}>
                <Grid xs={12} item>
                    <Typography variant={'h1'}>Reset your password</Typography>
                </Grid>
                <Grid xs={12} sm={6} md={4} item component={'form'} noValidate onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2} sx={{p: 2}} alignItems={'stretch'} textAlign={'center'}>
                        <TextField
                            required
                            label={'New password'}
                            type={'password'}
                            error={!!errors.newPassword}
                            helperText={errors.newPassword?.message}
                            {...register('newPassword')}
                        />
                        <TextField
                            required
                            label={'Confirm new password'}
                            type={'password'}
                            error={!!errors.confirmNewPassword}
                            helperText={errors.confirmNewPassword?.message}
                            {...register('confirmNewPassword')}
                        />
                        <Button type={'submit'} variant={'contained'}>Reset password</Button>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
    
}

export default ResetPasswordPage;