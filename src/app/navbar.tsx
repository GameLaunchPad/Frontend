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
      <AppBar 
        position='sticky' 
        elevation={0}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer - 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '400px',
            height: '100%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }
        }}
      >
        <Container maxWidth="xl">
          <Toolbar 
            disableGutters 
            sx={{ 
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 1,
              minHeight: '70px !important',
            }}
          >
            {/* Left side - Logo and Home button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Logo Section */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 45,
                    height: 45,
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}
                >
                  <GamepadIcon sx={{ fontSize: 28, color: 'white' }} />
                </Box>
                <Typography
                  variant="h5"
                  component="a"
                  href="/"
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    fontWeight: 700,
                    fontSize: '1.35rem',
                    color: 'white',
                    textDecoration: 'none',
                    letterSpacing: '-0.5px',
                    transition: 'opacity 0.2s ease',
                    '&:hover': {
                      opacity: 0.9,
                    }
                  }}
                >
                  GameLaunchPad
                </Typography>
              </Box>
              
              {/* Home Button */}
              <Button
                onClick={handleHomeClick}
                startIcon={<HomeIcon />}
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }
                }}
              >
                HOME
              </Button>
            </Box>
            
            {/* Right side - User Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isLoggedIn ? (
                <>
                  {/* User Info Display */}
                  <Box 
                    sx={{ 
                      display: { xs: 'none', sm: 'flex' }, 
                      alignItems: 'center',
                      gap: 1.5,
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      px: 2,
                      py: 0.75,
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                      }}
                    >
                      {userInfo?.username || 'User'}
                    </Typography>
                  </Box>
                  <Tooltip title="User Menu" arrow>
                    <IconButton 
                      onClick={handleOpenUserMenu} 
                      sx={{ 
                        p: 0.5,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        }
                      }}
                    >
                      <Avatar 
                        alt={userInfo?.username || 'User'} 
                        src={userInfo?.avatar}
                        sx={{ 
                          width: 42,
                          height: 42,
                          bgcolor: 'rgba(255, 255, 255, 0.3)',
                          color: '#667eea',
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          border: '2px solid rgba(255, 255, 255, 0.5)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        }}
                      >
                        {userInfo?.username?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button
                    variant="outlined"
                    startIcon={<LoginIcon />}
                    onClick={() => setLoginOpen(true)}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      borderWidth: '2px',
                      px: 2.5,
                      py: 0.75,
                      borderRadius: 2,
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'white',
                        borderWidth: '2px',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={() => setRegisterOpen(true)}
                    sx={{
                      bgcolor: 'white',
                      color: '#667eea',
                      px: 2.5,
                      py: 0.75,
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
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
          sx={{ 
            mt: '10px',
            '& .MuiPaper-root': {
              borderRadius: 3,
              minWidth: 200,
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.25)',
              border: '1px solid rgba(102, 126, 234, 0.1)',
              overflow: 'hidden',
            }
          }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          TransitionComponent={Fade}
        >
          <Box sx={{ 
            px: 2, 
            py: 1.5, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
              {userInfo?.username || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
              User Account
            </Typography>
          </Box>
          <MenuItem 
            onClick={() => { router.push('/profile'); handleCloseUserMenu(); }}
            sx={{
              py: 1.5,
              px: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(102, 126, 234, 0.08)',
                transform: 'translateX(4px)',
              }
            }}
          >
            <PersonIcon sx={{ mr: 1.5, color: '#667eea', fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Profile
            </Typography>
          </MenuItem>
          <MenuItem 
            onClick={() => { router.push('/games'); handleCloseUserMenu(); }}
            sx={{
              py: 1.5,
              px: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(102, 126, 234, 0.08)',
                transform: 'translateX(4px)',
              }
            }}
          >
            <GamepadIcon sx={{ mr: 1.5, color: '#667eea', fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              My Games
            </Typography>
          </MenuItem>
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 0.5, pt: 0.5 }}>
            <MenuItem 
              onClick={handleLogout}
              sx={{
                py: 1.5,
                px: 2,
                transition: 'all 0.2s ease',
                color: 'error.main',
                '&:hover': {
                  bgcolor: 'rgba(211, 47, 47, 0.08)',
                  transform: 'translateX(4px)',
                }
              }}
            >
              <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Logout
              </Typography>
            </MenuItem>
          </Box>
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