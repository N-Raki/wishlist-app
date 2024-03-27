import {FC} from 'react';
import './HomePage.css';
import {Box, Button, Stack, Typography} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import {User} from "../../models/user.model.ts";
import WishlistsList from "../WishlistsList/WishlistsList.tsx";
import NavigationBar from "../NavigationBar/NavigationBar.tsx";
import {Wishlist} from "../../models/wishlist.model.ts";
import {getRecentWishlists} from "../../services/wishlists.service.ts";
import Grid from "@mui/material/Grid";
import {getCurrentUser} from "../../services/user.service.ts";
import {useNavigate} from "react-router-dom";
import ButtonCallToAction from "../ButtonCallToAction/ButtonCallToAction.tsx";

interface HomePageProps {
}

const HomePage: FC<HomePageProps> = () => {
    const {
        data: user,
        isSuccess,
        isError,
        isLoading
    } = useQuery<User>({queryKey: ['user'], queryFn: getCurrentUser, retry: false});
    
    const {
        data: recentWishlists
    } = useQuery<Wishlist[]>({queryKey: ['recentWishlists'], queryFn: getRecentWishlists, retry: false, enabled: isSuccess});
    
    const navigate = useNavigate();
    
    if (isLoading) {
        return (
            <div>
                <NavigationBar />
            </div>
        )
    }
    
    if (isError) {
        return (
            <div className="h-screen bg-gifts bg-cover bg-right lg:bg-top">
                <NavigationBar />
                <div className="flex flex-col items-center pt-20">
                    <h1 className="text-3xl lg:text-6xl lg:max-w-xl text-center font-bold mx-5 mb-4">Share your wishlist with your friends</h1>
                    <h2 className="lg:text-xl">Create. Share. Receive.</h2>

                    <ButtonCallToAction className="my-20" onClick={() => navigate('/register')}>
                        Create your wishlist
                    </ButtonCallToAction>
                    
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <Box>
                <NavigationBar/>
                <Grid container spacing={2} sx={{mt: '2rem', px: '2rem'}}>
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
