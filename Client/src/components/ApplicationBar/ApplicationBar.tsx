import {
    AppBar,
    Avatar,
    Box,
    Container,
    IconButton, Link,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import {deepPurple} from "@mui/material/colors";
import PersonIcon from '@mui/icons-material/Person';
import {User} from "../../models/user.model.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import UserService from "../../services/user.service.ts";
import AuthService from "../../services/auth.service.ts";
import toast from "react-hot-toast";

const ApplicationBar = () => {
    const queryClient = useQueryClient();
    const {
        data: user,
        isSuccess
    } = useQuery<User>({queryKey: ['user'], queryFn: UserService.getCurrentUser, retry: false});
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logoutMutation = useMutation({
        mutationFn: AuthService.logout,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['user']});
            toast.success('Logged out successfully');
        }
    });

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
                    
                    {isSuccess ? (
                        <Box sx={{flexGrow: 0}}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                    <Avatar sx={{backgroundColor: deepPurple[500]}}>
                                        {user.displayName ? user.displayName[0] : <PersonIcon color={'action'}/>}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
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
                                <MenuItem onClick={handleCloseUserMenu}>
                                    <Link href={'/'} underline={'none'} color={'inherit'}>Home</Link>
                                </MenuItem>
                                <MenuItem onClick={() => logoutMutation.mutate()}>
                                    <Link underline={'none'} color={'inherit'}>Logout</Link>
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) : null}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default ApplicationBar;