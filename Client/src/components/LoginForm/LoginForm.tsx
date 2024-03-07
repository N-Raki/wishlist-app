import {Box, Button, Checkbox, FormControlLabel, Link, TextField, Typography} from "@mui/material";
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
import toast from "react-hot-toast";

class LoginFormData {
    email: string = '';
    password: string = '';
    rememberMe: boolean = false;
}

const validationScheme: ObjectSchema<LoginFormData> = Yup.object({
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email address'),
    password: Yup.string()
        .required('Password is required'),
    rememberMe: Yup.boolean().defined()
});

export default function LoginForm() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<LoginFormData>({resolver: yupResolver(validationScheme), mode: 'onChange'});

    const mutation = useMutation({
        mutationFn: (data: UserLoginRequest) => AuthService.login(data),
        onSuccess: async () => {
            toast.success('Logged in successfully');
            navigate('/');
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

    return (
        <AuthenticationForm>
            <Box sx={{my: 2, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Link href={'/'} underline={'none'} sx={{mb: '2rem', fontSize: '60px'}}>🎁</Link>
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
                        autoComplete={'off'}
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
                    <FormControlLabel
                        control={<Checkbox color="primary" {...register('rememberMe')}/>}
                        label="Remember me"
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
                            <Link href="#" variant="body2" color={'inherit'}>
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/register" variant="body2" color={'inherit'}>
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