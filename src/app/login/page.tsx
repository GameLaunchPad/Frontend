"use client";

import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';

import {
    Box,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Snackbar,
    Alert,
    CircularProgress,
    Backdrop,
    Link as MuiLink // Rename Link to avoid conflict if using Next Link later
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);
    // const router = useRouter();

    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

    const router = useRouter();

    const handleLoginOpen = () => setLoginOpen(true);
    const handleLoginClose = () => setLoginOpen(false);
    const handleRegisterOpen = () => setRegisterOpen(true);
    const handleRegisterClose = () => {
        setRegisterOpen(false);
        setRegEmail('');
        setRegPassword('');
        setConfirmPassword('');
    };

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginError(null);
        const validAccounts = [
            { user: 'user', pass: 'user123' },
            { user: 'admin', pass: 'admin123' }
        ];
        const foundAccount = validAccounts.find(
            (acc) => acc.user === username && acc.pass === password
        );

        if (foundAccount) {
            console.log('Login successful for:', username);
            handleLoginClose();

            setSnackbarMessage('Login successful!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            setTimeout(() => {
                router.push('/');
            }, 1500);
        } else {
            console.log('Login failed for:', username);
            setSnackbarMessage('Incorrect username or password.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginError(null);
        if (regPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log('注册成功，信息:', { email: regEmail, password: regPassword });

        handleRegisterClose();

        setSnackbarMessage('Registration successful! Please log in.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            handleLoginOpen();
        }, 1000);
    };

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{
            display: 'flex',
            minHeight: 'calc(100vh - 64px)',
            backgroundColor: '#f5f5f5',
            color: 'rgba(0, 0, 0, 0.87)'
        }}>
            <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                pr: { xs: 0, md: 0 }, // Reduce right padding
                pl: { xs: 4, md: '8%' }, // Left padding
                pt: 5, pb: 5, // Top and bottom padding
                textAlign: 'left'
            }}>
                <Typography variant="h3" component="h1" sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    mb: 2, // margin-bottom
                    maxWidth: 500,
                    lineHeight: 1.2
                }}>
                    The All-in-One Marketing Solution for Game Publishers
                </Typography>
                <Typography variant="h6" component="p" sx={{
                    color: 'text.secondary',
                    mb: 5, // margin-bottom
                    maxWidth: 450
                }}>
                    Tailored for game publishers, helping build dedicated game communities.
                </Typography>


                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" size="large" onClick={handleLoginOpen}>
                        Login
                    </Button>
                    <Button variant="outlined" size="large" onClick={handleRegisterOpen}>
                        Register
                    </Button>
                </Box>
            </Box>

            {/* 右侧视觉元素区 (使用 Box 或 Grid item) */}
            <Box sx={{
                flex: 1.2,
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
                alignItems: 'center',
                pl: { md: 2 }, // Reduce left padding
                pr: { md: '8%' }, // Right padding
                pt: 5, pb: 5,
                overflow: 'hidden',
                position: 'relative', // 父容器需要 relative 定位
            }}>
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '800px',
                    borderRadius: '16px',
                    aspectRatio: '1/1',
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                }}>
                    <Image
                        src="/images/pokemon-legends-z-a.avif"
                        alt="Pokemon Legends Z-A promotional image"
                        fill={true}
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                </Box>
            </Box>

            <Dialog open={loginOpen} onClose={handleLoginClose} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    Welcome Back
                    <IconButton
                        aria-label="close"
                        onClick={handleLoginClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom color="text.secondary">
                        Please enter your account information
                    </Typography>
                    <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username or Email"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 2 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value="remember"
                                        color="primary"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                }
                                label="Remember me"
                            />
                            <MuiLink href="#" variant="body2">
                                Forgot password?
                            </MuiLink>
                        </Box>
                        {loginError && (
                            <Typography color="error" variant="body2" sx={{ mt: 1, mb: 1, textAlign: 'center' }}>
                                {loginError}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Login
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            <Dialog open={registerOpen} onClose={handleRegisterClose} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    Create Account
                    <IconButton
                        aria-label="close"
                        onClick={handleRegisterClose}
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom color="text.secondary">
                        Enter your details to register
                    </Typography>
                    <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="reg-email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="reg-password"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Register
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
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
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LoginPage;