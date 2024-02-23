import {Box, Button, Checkbox, FormControlLabel, Link, TextField, Typography} from "@mui/material";
import Grid from '@mui/material/Grid';
import AuthenticationForm from "../AuthenticationForm/AuthenticationForm.tsx";
import React, {useState} from "react";
import Copyright from "../Copyright/Copyright.tsx";
import {useMutation} from "@tanstack/react-query";
import login from "../../api/login.request.ts";

class FormData {
    email: string = '';
    password: string = '';
}

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const mutation = useMutation({
        mutationFn: (data: FormData) => login(data.email, data.password),
        onSuccess: async () => {
            window.location.href = '/profile';
        }
    });
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        mutation.mutate({ email, password });
    };
    
    return (
        <AuthenticationForm>
            <Box sx={{my: 4, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{marginBottom: '2rem', fontSize: '60px'}}>🎁</div>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary"/>}
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
                    {
                        mutation.isPending
                            ? (<div>Logging in...</div>)
                            : null
                    }
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