import {FC} from 'react';
import './HomePage.css';
import {Box, Button, Container, Link, Stack, Typography} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import {User} from "../../models/user.model.ts";
import UserService from "../../services/user.service.ts";
import WishlistsList from "../WishlistsList/WishlistsList.tsx";
import ApplicationBar from "../ApplicationBar/ApplicationBar.tsx";

interface HomePageProps {
}

const HomePage: FC<HomePageProps> = () => {
    const {
        data: user,
        isSuccess,
        isError
    } = useQuery<User>({queryKey: ['user'], queryFn: UserService.getCurrentUser, retry: false});
    
    return (
        <Box>
            <ApplicationBar />
            {
                isSuccess ?
                    <Container sx={{
                        mt: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Box sx={{my: '2rem'}}>
                            <Typography variant="h3" sx={{textAlign:'center'}}>
                                Hello {user?.displayName ? user.displayName + ' ' : null} !
                            </Typography>
                        </Box>
                        {user?.wishlists.length === 0 ?
                            <Typography variant="h5" sx={{textAlign:'center'}}>You don't have any wishlists yet.</Typography> :
                            <Typography variant="h5" sx={{textAlign:'center'}}>Here are your wishlists:</Typography>
                        }
                        <Stack spacing={2} sx={{my: '2rem', alignItems:'center', width:'100%'}}>
                            <WishlistsList wishlists={user?.wishlists}/>
                            <Button href="/wishlists/new" variant={'contained'} sx={{width:'fit-content'}}>Create a new wishlist</Button>
                        </Stack>
                    </Container> :
                    isError ?
                        <Container sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            mt: '4rem'
                        }}>
                            <Stack spacing={6} sx={{alignItems: 'center'}}>
                                <Typography variant={'h2'} sx={{textAlign:'center'}}>Create. Share. Give.</Typography>
                                <Button variant="contained" href="/register">
                                    Create your wishlist
                                </Button>
                                <Typography sx={{textAlign:'center'}}>You already have a wishlist ? <Link href="/login">Sign in</Link></Typography>
                            </Stack>
                        </Container> :
                        null
            }
        </Box>
    );
};

export default HomePage;
