import {
    AppBar,
    Avatar,
    Box,
    Container,
    IconButton,
    Menu,
    MenuItem, Stack,
    Toolbar,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import {User} from "../../models/user.model.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { stringToColor } from "../../helpers/avatarHelper.ts";
import {getCurrentUser} from "../../services/user.service.ts";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import DarkModeSwitch from "../DarkModeSwitch/DarkModeSwitch.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {logout} from "../../services/auth.service.ts";

const ApplicationBar = () => {
    const queryClient = useQueryClient();
    const {
        data: user,
        isSuccess
    } = useQuery<User>({queryKey: ['user'], queryFn: getCurrentUser, retry: false, staleTime: 1000 * 60 * 5});
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['user']});
            toast.success('Logged out successfully');
        }
    });

    const navigate = useNavigate();
    const location = useLocation();
    const handleLoginRedirect = () => {
        navigate('/login', {state: {from: location}});
    }

    return (
        <AppBar position={'static'}>
            <Container maxWidth={'xl'}>
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: {xs: 'none', md: 'flex'},
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        🎁 Wishlists
                    </Typography>

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}></Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: {xs: 'flex', md: 'none'},
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        🎁 Wishlists
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}></Box>

                    <Box sx={{flexGrow: 0}}>
                        <Stack direction={'row'} spacing={2}>
                            {
                                isSuccess
                                    ? <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                        <Avatar sx={{
                                            width: 32,
                                            height: 32,
                                            fontSize: 18,
                                            boxShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px',
                                            backgroundColor: stringToColor(user.displayName)
                                        }}>
                                            {user.displayName ? user.displayName[0] : <PersonIcon color={'action'}/>}
                                        </Avatar>
                                    </IconButton>
                                    : <IconButton onClick={handleLoginRedirect}>
                                        <LoginIcon/>
                                    </IconButton>
                            }
                            <DarkModeSwitch />
                        </Stack>
                        
                        <Menu
                            sx={{mt: '45px'}}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={() => {
                                handleCloseUserMenu();
                                navigate('/profile');
                            }}>
                                <Stack direction={'row'} spacing={2}>
                                    <PersonIcon />
                                    <Typography>Profile</Typography>
                                </Stack>
                            </MenuItem>
                            <MenuItem onClick={() => {
                                handleCloseUserMenu();
                                logoutMutation.mutate();
                            }}>
                                <Stack direction={'row'} spacing={2}>
                                    <LogoutIcon />
                                    <Typography>Logout</Typography>
                                </Stack>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default ApplicationBar;