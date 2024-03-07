import {FC} from 'react';
import './HomePage.css';
import {Box, Button, Container, Link, Stack, Typography} from "@mui/material";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {User} from "../../models/user.model.ts";
import UserService from "../../services/user.service.ts";
import WishlistsList from "../WishlistsList/WishlistsList.tsx";
import AuthService from "../../services/auth.service.ts";
import toast from "react-hot-toast";
import ApplicationBar from "../ApplicationBar/ApplicationBar.tsx";

interface HomePageProps {
}

const HomePage: FC<HomePageProps> = () => {
    const queryClient = useQueryClient();
    const query = useQuery<User>({queryKey: ['user'], queryFn: UserService.getCurrentUser, retry: false});

    const logoutMutation = useMutation({
        mutationFn: AuthService.logout,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['user']});
            toast.success('Logged out successfully');
        }
    });
    
    if (query.isSuccess) {
        const user = query.data;
        return (
            <Box>
                <ApplicationBar />
                <Container sx={{
                    mt: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>

                    <Box sx={{my: '2rem'}}>
                        <Typography variant="h3">
                            Hello {user?.displayName ? user?.displayName + ' ' : null}!
                        </Typography>
                    </Box>
                    {user?.wishlists.length === 0 ?
                        <Typography variant="h5">You don't have any wishlists yet.</Typography> :
                        <Typography variant="h5">Here are your wishlists:</Typography>
                    }
                    <Stack spacing={2} sx={{my: '2rem'}}>
                        <WishlistsList wishlists={user?.wishlists}/>
                    </Stack>
                    <Button href="/wishlists/new" variant={'contained'}>Create a new wishlist</Button>
                    <Button variant={'outlined'} onClick={() => logoutMutation.mutate()} sx={{my:'2rem'}}>Log Out</Button>
                </Container>
            </Box>
        );
    }
    else if (query.isError) {
        return (
            <Box>
                <ApplicationBar />
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
};

export default HomePage;
