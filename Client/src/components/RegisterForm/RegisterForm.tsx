import React, {FC} from 'react';
import './RegisterForm.css';
import AuthenticationForm from "../AuthenticationForm/AuthenticationForm.tsx";
import Copyright from "../Copyright/Copyright.tsx";
import {Box, Button, Link, TextField, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";

interface RegisterFormProps {}

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get('password') !== data.get('confirmPassword')) {
        alert('Passwords do not match');
        return;
    }
    fetch('https://localhost:7200/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: data.get('email'),
            password: data.get('password')
        })
    })
        .then(response => response.text())
        .then(data => {
            console.log(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

const RegisterForm: FC<RegisterFormProps> = () => (
    <AuthenticationForm>
        <Box sx={{my: 4, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{marginBottom: '2rem', fontSize: '60px'}}>🎁</div>
            <Typography component="h1" variant="h5">
                Sign up
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
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
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
                    <Grid item xs />
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

export default RegisterForm;
