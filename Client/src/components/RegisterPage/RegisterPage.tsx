import AuthenticationPage from "../AuthenticationPage/AuthenticationPage.tsx";
import Copyright from "../Copyright/Copyright.tsx";
import {Box, Button, Link, TextField, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import {useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import * as Yup from 'yup';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {UserRegisterRequest} from "../../models/requests/user-register.model.ts";
import {ObjectSchema} from "yup";
import toast from "react-hot-toast";
import {AxiosError} from "axios";
import {AspNetValidationProblem} from "../../models/errors/AspNetValidationProblem.ts";
import {register} from "../../services/auth.service.ts";

class RegisterFormData {
    displayName: string = '';
    email: string = '';
    password: string = '';
    confirmPassword: string = '';
}

const validationScheme: ObjectSchema<RegisterFormData> = Yup.object({
    displayName: Yup.string()
        .required('Display name is required'),
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email address'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('password')], 'Passwords do not match')
});

const RegisterPage = () => {
    const navigate = useNavigate();
    
    const {
        register: registerForm,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormData>({resolver: yupResolver(validationScheme), mode: 'onChange'});
    
    const mutation = useMutation({
        mutationFn: (data: UserRegisterRequest) => register(data),
        onSuccess: async () => {
            toast.success('User registered successfully');
            navigate('/');
        },
        onError: (error: AxiosError<AspNetValidationProblem>) => {
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

    const onSubmit = (data: RegisterFormData) => {
        const request: UserRegisterRequest = {
            displayName: data.displayName,
            email: data.email,
            password: data.password
        }
        mutation.mutate(request);
    };
    
    return (
        <AuthenticationPage>
            <div className="flex flex-col items-center w-full">
                <h2 className="text-2xl mb-6">Registration</h2>
                <form className="w-full px-24 space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col items-start">
                        <label htmlFor="displayName" className="flex text-sm leading-6 justify-center font-semibold">
                            Display Name
                        </label>
                        <input {...registerForm('displayName')} id="displayName" name="displayName" type="text" placeholder="Display Name" required className="flex w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"/>
                    </div>
                </form>
            </div>
        </AuthenticationPage>
    );

    return (
        <AuthenticationPage>
            <Box sx={{my: 2, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{mt: 1}}>
                    <TextField
                        required
                        error={!!errors.displayName}
                        helperText={errors.displayName?.message}
                        margin="normal"
                        fullWidth
                        label="Display name"
                        {...registerForm('displayName')}
                    />
                    <TextField
                        required
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        margin="normal"
                        fullWidth
                        label="Email Address"
                        {...registerForm('email')}
                    />
                    <TextField
                        required
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        margin="normal"
                        fullWidth
                        label="Password"
                        {...registerForm('password')}
                        type="password"
                    />
                    <TextField
                        required
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        margin="normal"
                        fullWidth
                        label="Confirm Password"
                        {...registerForm('confirmPassword')}
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
                    <Grid container>
                        <Grid item xs/>
                        <Grid item>
                            <Link href="/login" variant="body2" color={'inherit'}>
                                {"Already have an account? Sign In"}
                            </Link>
                        </Grid>
                    </Grid>
                    <Copyright sx={{mt: 5}}/>
                </Box>
            </Box>
        </AuthenticationPage>
    );
}

export default RegisterPage;