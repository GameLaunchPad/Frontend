"use client";

import React, { useState, useEffect } from 'react';
import {
  AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography,
  Snackbar, Alert, CircularProgress, Fade, Backdrop
} from '@mui/material';
import GamepadIcon from '@mui/icons-material/Gamepad';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter, usePathname } from 'next/navigation';
import LoginDialog from './components/LoginDialog';

export default function NavBar(): React.JSX.Element {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<{ username: string; avatar?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  
  const router = useRouter();
  const pathname = usePathname();

  // Check login status on component mount
  useEffect(() => {
    const checkLoginStatus = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
          setIsLoggedIn(true);
          setUserInfo(JSON.parse(userData));
        } else {
          setIsLoggedIn(false);
          setUserInfo(null);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };

    checkLoginStatus();
  }, []);

  // Listen for storage changes (login/logout from other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
          setIsLoggedIn(true);
          setUserInfo(JSON.parse(userData));
        } else {
          setIsLoggedIn(false);
          setUserInfo(null);
        }
      } catch (error) {
        console.error('Error handling storage change:', error);
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen for custom auth events
  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
          setIsLoggedIn(true);
          setUserInfo(JSON.parse(userData));
        } else {
          setIsLoggedIn(false);
          setUserInfo(null);
        }
      } catch (error) {
        console.error('Error handling auth change:', error);
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };

    const handleOpenLoginDialog = () => {
      setLoginOpen(true);
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('openLoginDialog', handleOpenLoginDialog);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('openLoginDialog', handleOpenLoginDialog);
    };
  }, []);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleLoginSuccess = async (userData: { username: string; avatar?: string }) => {
    setIsLoggedIn(true);
    setUserInfo(userData);
    setLoginOpen(false);
    setAnchorElUser(null);
    
    // Show success message
    showSnackbar('Login successful! Redirecting...', 'success');
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('customAuthChange'));
    
    // Add loading delay for better UX
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/games');
    }, 1500);
  };

  const handleRegisterSuccess = async () => {
    setRegisterOpen(false);
    showSnackbar('Registration successful! Please login', 'success');
    
    // Add loading delay for better UX
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLoginOpen(true);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserInfo(null);
    setAnchorElUser(null);
    showSnackbar('Logged out successfully', 'info');
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('authChange'));
    
    router.push('/');
  };

  const handleHomeClick = () => {
    if (!isLoggedIn) {
      showSnackbar('Please login to access the games page', 'warning');
      setLoginOpen(true);
      return;
    }
    router.push('/games');
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <AppBar position='relative' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Left side - Logo and Home button */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GamepadIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 3,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                GameLaunchPad
              </Typography>
              
              {/* Home Button */}
              <Button
                onClick={handleHomeClick}
                sx={{ 
                  color: 'white', 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                <HomeIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  HOME
                </Typography>
              </Button>
            </Box>
            
            {/* Right side - User Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isLoggedIn ? (
                <Tooltip title="User Menu">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar 
                      alt={userInfo?.username || 'User'} 
                      src={userInfo?.avatar}
                      sx={{ bgcolor: 'secondary.main' }}
                    >
                      {userInfo?.username?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<LoginIcon />}
                    onClick={() => setLoginOpen(true)}
                    sx={{
                      color: 'white',
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<PersonAddIcon />}
                    onClick={() => setRegisterOpen(true)}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'grey.100'
                      }
                    }}
                  >
                    Register
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* User Menu */}
      {isLoggedIn && (
        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          TransitionComponent={Fade}
        >
          <MenuItem onClick={() => { router.push('/profile'); handleCloseUserMenu(); }}>
            <PersonIcon sx={{ mr: 1 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={() => { router.push('/dashboard'); handleCloseUserMenu(); }}>
            Dashboard
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      )}

      {/* Login/Register Dialogs */}
      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
        mode="login"
      />
      <LoginDialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
        mode="register"
      />

      {/* Loading Backdrop */}
      <Backdrop
        sx={{
          color: '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Fade}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}