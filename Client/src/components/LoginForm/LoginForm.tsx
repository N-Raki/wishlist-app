import {Box, Button, Link, TextField, Typography} from "@mui/material";
import Grid from '@mui/material/Grid';
import AuthenticationForm from "../AuthenticationForm/AuthenticationForm.tsx";
import Copyright from "../Copyright/Copyright.tsx";
import {useMutation} from "@tanstack/react-query";
import AuthService from "../../services/auth.service.ts";
import {useNavigate} from "react-router-dom";
import {UserLoginRequest} from "../../models/requests/user-login.model.ts";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {ObjectSchema} from "yup";

class LoginFormData {
    email: string = '';
    password: string = '';
}

const validationScheme: ObjectSchema<LoginFormData> = Yup.object({
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email address'),
    password: Yup.string()
        .required('Password is required')
});

export default function LoginForm() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<LoginFormData>({resolver: yupResolver(validationScheme), mode: 'onBlur'});

    const mutation = useMutation({
        mutationFn: (data: UserLoginRequest) => AuthService.login(data),
        onSuccess: async () => {
            navigate('/profile');
            window.location.reload();
        }
    });

    const onSubmit = (data: LoginFormData) => {
        const request: UserLoginRequest = {
            email: data.email,
            password: data.password
        }
        mutation.mutate(request);
    };

    return (
        <AuthenticationForm>
            <Box sx={{my: 4, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{marginBottom: '2rem', fontSize: '60px'}}>🎁</div>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{mt: 1}}>
                    <TextField
                        required
                        autoFocus
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        margin="normal"
                        fullWidth
                        label="Email Address"
                        {...register('email')}
                    />
                    <TextField
                        required
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        margin="normal"
                        fullWidth
                        label="Password"
                        type="password"
                        {...register('password')}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        disabled={mutation.isPending}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                    <Copyright sx={{mt: 5}}/>
                </Box>
            </Box>
        </AuthenticationForm>
    )
}