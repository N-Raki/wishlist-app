import {FC, useEffect} from "react";
import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import ApplicationBar from "../ApplicationBar/ApplicationBar.tsx";
import Grid from "@mui/material/Grid";
import {useForm} from "react-hook-form";
import {ObjectSchema} from "yup";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useMutation, useQuery} from "@tanstack/react-query";
import {resetPassword} from "../../services/auth.service.ts";
import toast from "react-hot-toast";
import {User} from "../../models/user.model.ts";
import {getCurrentUser} from "../../services/user.service.ts";
import {useNavigate} from "react-router-dom";

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
        reset: resetPasswordReset,
        watch: resetPasswordWatch
    } = useForm<ResetPasswordFormData>({resolver: yupResolver(validationScheme), mode: 'onChange'});
    
    const resetPasswordMutation = useMutation({
        mutationFn: (data: ResetPasswordFormData) => resetPassword(data.currentPassword, data.newPassword),
        onSuccess: async () => {
            toast.success('Password reset successfully');
            resetPasswordReset(new ResetPasswordFormData());
        },
    });

    const onSubmit = (data: ResetPasswordFormData) => {
        resetPasswordMutation.mutate(data);
    }
    
    const navigate = useNavigate();

    useEffect(() => {
        if (userQuery.isError) {
            toast.error('You are not logged in');
            navigate("/");
        }
    }, [userQuery, navigate]);

    if (userQuery.isSuccess)
    {

        return (
            <Box>
                <ApplicationBar/>
                <Grid container display={'flex'} alignItems={'center'} justifyContent={'center'} textAlign={'center'} marginTop={2}>
                    <Grid xs={12} item>
                        <Typography variant={'h1'}>User Profile</Typography>
                    </Grid>
                    <Grid xs={12} sm={6} md={4} item component={'form'} noValidate onSubmit={resetPasswordHandleSubmit(onSubmit)}>
                        <Stack spacing={2} sx={{p: 2}} alignItems={'stretch'} textAlign={'center'}>
                            <Typography variant={'h5'}>Reset password</Typography>
                            <TextField
                                required
                                defaultValue={''}
                                label="Password"
                                type="password"
                                InputLabelProps={{ shrink: !!resetPasswordWatch('currentPassword') }}
                                error={!!resetPasswordErrors.currentPassword}
                                helperText={resetPasswordErrors.currentPassword?.message}
                                {...resetPasswordRegister('currentPassword')}
                            />
                            <TextField
                                required
                                defaultValue={''}
                                label="New password"
                                type="password"
                                InputLabelProps={{ shrink: !!resetPasswordWatch('newPassword') }}
                                error={!!resetPasswordErrors.newPassword}
                                helperText={resetPasswordErrors.newPassword?.message}
                                {...resetPasswordRegister('newPassword')}
                            />
                            <TextField
                                required
                                defaultValue={''}
                                label="Confirm new password"
                                type="password"
                                InputLabelProps={{ shrink: !!resetPasswordWatch('confirmNewPassword') }}
                                error={!!resetPasswordErrors.confirmNewPassword}
                                helperText={resetPasswordErrors.confirmNewPassword?.message}
                                {...resetPasswordRegister('confirmNewPassword')}
                            />
                            <Button type={'submit'} variant={'contained'} sx={{mt:1}}>
                                Reset password
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        );
    } else {
        return <Box>Loading...</Box>
    }
};

export default UserProfilePage;