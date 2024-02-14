import React, { FC } from 'react';
import './AuthenticationForm.css';
import Grid from "@mui/material/Grid";
import {Paper, Toolbar} from "@mui/material";
import DarkModeSwitch from "../DarkModeSwitch/DarkModeSwitch.tsx";

interface AuthenticationFormProps {
    children: React.ReactNode;
}

const AuthenticationForm: FC<AuthenticationFormProps> = ({children}) => (
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
            {children}
        </Grid>
    </Grid>
);

export default AuthenticationForm;
