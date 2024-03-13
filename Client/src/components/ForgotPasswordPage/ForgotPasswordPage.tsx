import {FC} from "react";
import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import ApplicationBar from "../ApplicationBar/ApplicationBar.tsx";
import Grid from "@mui/material/Grid";
import {useForm} from "react-hook-form";
import {ObjectSchema} from "yup";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useMutation} from "@tanstack/react-query";
import {forgotPassword} from "../../services/auth.service.ts";
import toast from "react-hot-toast";

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
        <Box>
            <ApplicationBar/>
            <Grid container display={'flex'} alignItems={'center'} justifyContent={'center'} textAlign={'center'} marginTop={2}>
                <Grid xs={12} item>
                    <Typography variant={'h1'}>Forgot your password ?</Typography>
                </Grid>
                <Grid xs={12} sm={6} md={4} item component={'form'} noValidate onSubmit={forgotPasswordHandleSubmit(onSubmitForgot)}>
                    <Stack spacing={2} sx={{p: 2}} alignItems={'stretch'} textAlign={'center'}>
                        <Typography variant={'h5'}>Enter your account's email address</Typography>
                        <TextField
                            required
                            defaultValue={''}
                            label="Email"
                            error={!!forgotPasswordErrors.email}
                            helperText={forgotPasswordErrors.email?.message}
                            {...forgotPasswordRegister('email')}
                        />
                        <Stack direction={'row'} spacing={2}>
                            <Button type={'submit'} variant={'contained'} sx={{mt:1}}>
                                Send mail with reset code
                            </Button>
                        </Stack>
                        
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ForgotPasswordPage;