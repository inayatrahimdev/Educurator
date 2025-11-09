import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navItems = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Courses', path: '/courses' },
        { label: 'Profile', path: '/profile' },
    ];

    return (
        <AppBar position="static" elevation={2}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            cursor: 'pointer',
                            fontWeight: 700,
                            mr: 4,
                        }}
                        onClick={() => navigate('/dashboard')}
                    >
                        Educurator
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.path}
                                color="inherit"
                                onClick={() => navigate(item.path)}
                                variant={location.pathname === item.path ? 'outlined' : 'text'}
                                sx={{
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                    '&:hover': {
                                        borderColor: 'rgba(255, 255, 255, 0.8)',
                                    },
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                        <Typography variant="body2" sx={{ mx: 2 }}>
                            {user?.name}
                        </Typography>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;

