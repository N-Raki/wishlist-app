import {FC} from 'react';
import './UserProfile.css';
import {useMutation, useQuery} from "@tanstack/react-query";
import AuthService from "../../services/auth.service.ts";
import UserService from "../../services/user.service.ts";
import {Navigate, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {User} from "../../models/user.model.ts";
import WishlistsList from "../WishlistsList/WishlistsList.tsx";
import {Box, Button, Container, Stack, Typography} from "@mui/material";

interface UserProfileProps {}

const UserProfile: FC<UserProfileProps> = () => {
    const navigate = useNavigate();
    const query = useQuery<User>({queryKey: ['user'], queryFn: UserService.getCurrentUser, retry: false});
    
    const mutation = useMutation({
        mutationFn: AuthService.logout,
        onSuccess: async () => {
            toast.success('Logged out successfully');
            navigate('/login');
        }
    });
    
    if (query.isError) {
        return <Navigate to="/login" />
    }
    
    if (query.isSuccess)
    {
        const user = query.data;
        return (
            <Box>
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
                    <Button variant={'outlined'} onClick={() => mutation.mutate()} sx={{my:'2rem'}}>Log Out</Button>
                </Container>
            </Box>
        );
    }
};

export default UserProfile;
