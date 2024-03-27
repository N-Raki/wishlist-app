import {FC} from 'react';
import './HomePage.css';
import {Box, Button, Container, Link, Stack, Typography} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import {User} from "../../models/user.model.ts";
import WishlistsList from "../WishlistsList/WishlistsList.tsx";
import NavigationBar from "../NavigationBar/NavigationBar.tsx";
import {Wishlist} from "../../models/wishlist.model.ts";
import {getRecentWishlists} from "../../services/wishlists.service.ts";
import Grid from "@mui/material/Grid";
import {getCurrentUser} from "../../services/user.service.ts";

interface HomePageProps {
}

const HomePage: FC<HomePageProps> = () => {
    const {
        data: user,
        isSuccess,
        isError,
        isLoading
    } = useQuery<User>({queryKey: ['user'], queryFn: getCurrentUser, retry: false});
    
    const { data: recentWishlists } = useQuery<Wishlist[]>({queryKey: ['recentWishlists'], queryFn: getRecentWishlists, retry: false, enabled: isSuccess});
    
    if (isLoading) {
        return (
            <Box>
                <NavigationBar />
            </Box>
        )
    }
    else if (isError) {
        return (
            <Box>
                <NavigationBar />
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
            </Container>
            </Box>
        );
    }
    else if (isSuccess) {
        return (
            <Box>
                <NavigationBar />
                <Grid container spacing={2} sx={{mt: '2rem', px:'2rem'}}>
                    <Grid xs={12} sx={{mb:'2rem'}} item>
                        <h3 className="text-center">
                            Hello {user.displayName} !
                        </h3>
                    </Grid>
                    <Grid xs={12} md={recentWishlists && recentWishlists.length > 0 ? 6 : 12} item>
                        {user?.wishlists.length === 0
                            ? <Typography variant="h5" sx={{textAlign:'center'}}>You don't have any wishlists yet.</Typography>
                            : <Typography variant="h5" sx={{textAlign:'center'}}>Here are your wishlists:</Typography>
                        }
                        <Stack spacing={2} sx={{my: '2rem', alignItems:'center', width:'100%'}}>
                            {user?.wishlists.length === 0 ? null : <WishlistsList wishlists={user?.wishlists} showOwner={false} /> }
                            <Button href="/wishlists/new" variant={'contained'} sx={{width:'fit-content'}}>Create a new wishlist</Button>
                        </Stack>
                    </Grid>
                    {
                        recentWishlists && recentWishlists.length > 0
                            ? <Grid xs={12} md={6} item>
                                <Typography variant="h5" sx={{textAlign:'center'}}>Recent wishlists:</Typography>
                                <Stack spacing={2} sx={{my: '2rem', alignItems:'center', width:'100%'}}>
                                    <WishlistsList wishlists={recentWishlists} showOwner={true}/>
                                </Stack>
                            </Grid>
                            : null
                    }
                    
                </Grid>
            </Box>
        );
    }
};

export default HomePage;
