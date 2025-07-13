import React, { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

interface LayoutProps {
    children: ReactNode;
    title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'E-Commerce App' }) => {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {title}
            </Typography>
            {user && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography variant="body1">
                    {user.name} ({user.role})
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                    Logout
                </Button>
                </Box>
            )}
            </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {children}
        </Container>
        </Box>
    );
    };

    export default Layout;