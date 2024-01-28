import {Box, Button, Checkbox, FormControlLabel, Link, Paper, TextField, Toolbar, Typography} from "@mui/material";
import Grid from '@mui/material/Grid';
import DarkModeSwitch from "../DarkModeSwitch/DarkModeSwitch.tsx";

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function LoginForm() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };
    return (
        <Grid container component="main" sx={{height: '100vh'}}>
            <Grid item xs={false} sm={4} md={7}
                  sx={{
                      backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                      backgroundRepeat: 'no-repeat',
                      backgroundColor: (t) =>
                          t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                  }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Toolbar sx={{justifyContent: 'flex-end'}}>
                    <DarkModeSwitch/>
                </Toolbar>
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
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                        <Copyright sx={{mt: 5}}/>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}