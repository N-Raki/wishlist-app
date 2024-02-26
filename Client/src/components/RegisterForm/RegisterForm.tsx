import './RegisterForm.css';
import AuthenticationForm from "../AuthenticationForm/AuthenticationForm.tsx";
import Copyright from "../Copyright/Copyright.tsx";
import {Box, Button, Link, TextField, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import {useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import AuthService from "../../services/auth.service.ts";
import * as Yup from 'yup';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {UserRegisterRequest} from "../../models/requests/user-register.model.ts";

class FormData {
    displayName: string = '';
    email: string = '';
    password: string = '';
    confirmPassword: string = '';
}

const validationScheme = Yup.object().shape({
    displayName: Yup.string().required('Display name is required'),
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('password')], 'Passwords do not match')
});

export default function RegisterForm() {
    const navigate = useNavigate();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        
    } = useForm<FormData>({resolver: yupResolver(validationScheme), mode: 'onBlur'});
    
    const mutation = useMutation({
        mutationFn: (data: UserRegisterRequest) => AuthService.register(data),
        onSuccess: async () => {
            navigate('/profile');
            window.location.reload();
        }
    });

    const onSubmit = (data: UserRegisterRequest) => {
        mutation.mutate(data);
    };

    return (
        <AuthenticationForm>
            <Box sx={{my: 4, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{marginBottom: '2rem', fontSize: '60px'}}>🎁</div>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{mt: 1}}>
                    <TextField
                        required
                        error={!!errors.displayName}
                        helperText={errors.displayName?.message}
                        margin="normal"
                        fullWidth
                        label="Display Name"
                        {...register('displayName')}
                    />
                    <TextField
                        required
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
                        {...register('password')}
                        type="password"
                    />
                    <TextField
                        required
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        margin="normal"
                        fullWidth
                        label="Confirm Password"
                        {...register('confirmPassword')}
                        type="password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Sign Up
                    </Button>
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        onClick={() => {
                            console.log(errors);
                        }}
                    >
                        Test
                    </Button>
                    <Grid container>
                        <Grid item xs/>
                        <Grid item>
                            <Link href="/login" variant="body2">
                                {"Already have an account? Sign In"}
                            </Link>
                        </Grid>
                    </Grid>
                    <Copyright sx={{mt: 5}}/>
                </Box>
            </Box>
        </AuthenticationForm>
    );
}
