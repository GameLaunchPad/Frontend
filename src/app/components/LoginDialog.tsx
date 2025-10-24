"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Backdrop
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { setAuthToken } from '../../utils/auth';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (userData: { username: string; avatar?: string }) => void;
  onRegisterSuccess?: () => void;
  mode: 'login' | 'register';
}

export default function LoginDialog({ open, onClose, onLoginSuccess, onRegisterSuccess, mode }: LoginDialogProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          setError('Passwords do not match!');
          return;
        }
        
        // Simulate registration
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Call register success callback
        if (onRegisterSuccess) {
          onRegisterSuccess();
        }
        
        // Reset form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        
      } else {
        // Login logic
        const validAccounts = [
          { user: 'user@u.nus.edu', pass: 'admin123' },
          { user: 'admin', pass: 'admin123' }
        ];
        
        const foundAccount = validAccounts.find(
          (acc) => acc.user === username && acc.pass === password
        );

        if (foundAccount) {
          const userData = {
            username: foundAccount.user,
            avatar: undefined,
            role: foundAccount.user === 'admin' ? 'admin' as const : 'user' as const
          };
          
          setAuthToken('demo-token', userData);
          
          onLoginSuccess(userData);
          
          // Reset form
          setUsername('');
          setPassword('');
        } else {
          setError('Incorrect username or password.');
        }
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRememberMe(false);
      onClose();
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {mode === 'login' ? 'Sign In' : 'Create Account'}
          <IconButton
            aria-label="close"
            onClick={handleClose}
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
          <Typography gutterBottom color="text.secondary" sx={{ mb: 3 }}>
            {mode === 'login' 
              ? 'Please enter your account information' 
              : 'Enter your details to register'
            }
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {mode === 'register' && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
            
            {mode === 'login' && (
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
            )}
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            {mode === 'register' && (
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
            )}
            
            {mode === 'login' && (
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
              </Box>
            )}
            
            {error && (
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
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
    </>
  );
}
