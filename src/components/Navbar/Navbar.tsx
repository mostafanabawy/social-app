'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import { ListItemIcon } from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAppDispatch, useAppSelector } from '@/hooks/store.hooks';
import LoginIcon from '@mui/icons-material/Login';
import { logout } from '@/store/features/user.slice';
import { useState, useEffect } from 'react';






function Navbar() {
    const currentPath = usePathname();
    const { token } = useAppSelector((store) => store.userReducer);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    useEffect(() => {
        setIsMounted(true);  // Set to true once the component is mounted
    }, []);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };


    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const dispatch = useAppDispatch();
    const menuId = 'primary-search-account-menu';
    const renderMenu = token && isMounted ? (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={() => { handleMenuClose(); }}>
                <Link href={'/profile'}>
                    <ListItemIcon>
                        <AccountCircle />
                    </ListItemIcon>
                    Profile
                </Link>
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); dispatch(logout()); router.push("/login") }}>
                <ListItemIcon>
                    <LogoutIcon />
                </ListItemIcon>
                Logout
            </MenuItem>
        </Menu>
    ) : (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                    <AccountCircle />
                </ListItemIcon>
                Signup
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                    <LoginIcon />
                </ListItemIcon>
                Login
            </MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >

            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    return (
        <Box sx={{ flexGrow: 1 , zIndex: 999, position: 'fixed', top:0, left:0, right:0}}>
            <AppBar position="static">
                <Toolbar>
                    
                    <Link href={'/'} className={currentPath === '/' ? 'active' : ''}>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                            MUI
                        </Typography>
                    </Link>
                    <Box sx={{ flexGrow: 1 }} />
                    {/* return here later for handling login conditions */}
                    {token && isMounted ?
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            
                            
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                        </Box> :
                        <Box sx={{ display: { xs: 'none', md: 'flex', alignItems: 'center' } }}>
                            <Link href={'/login'} className={`mx-1 text-lg ${currentPath === '/login' ? 'active' : ''}`}>
                                Login
                            </Link>
                            <Link href={'/signup'} className={`mx-1 text-lg ${currentPath === '/signup' ? 'active' : ''}`}>
                                Signup
                            </Link>
                        </Box>}
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}

export default Navbar
