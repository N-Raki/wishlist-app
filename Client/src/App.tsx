import './App.css'
import Grid from '@mui/material/Unstable_Grid2';
import {Box, Button, Container, Toolbar, Typography} from "@mui/material";
import DarkModeSwitch from "./components/DarkModeSwitch/DarkModeSwitch.tsx"; // Grid version 2

function App() {
    return (
        <Box>
            <Toolbar sx={{justifyContent: 'flex-end', mb: '2rem'}}>
                <DarkModeSwitch/>
            </Toolbar>
            <Typography variant="h1" sx={{
                textAlign: 'center',
                fontWeight: 700,
                fontSize: { xs: '1.8rem', sm: '2.8rem' }
            }}>
                Welcome to your favorite Wishlist app 🎁
            </Typography>
            <Container sx={{textAlign: 'center', py: '5em'}}>
                <Grid>
                    <Grid xs={12}>
                        <Button variant="contained" size="large" sx={{ mt: 2, mb: 3 }}>Create an account</Button>
                    </Grid>
                    <Grid xs={12}>
                        OR
                    </Grid>
                    <Grid xs={12}>
                        <Button variant="contained" sx={{ mt: 3, mb: 2 }}>Log in</Button>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default App
