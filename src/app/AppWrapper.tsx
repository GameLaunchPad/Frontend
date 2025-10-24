"use client";

import React, { useState, useEffect } from 'react';
import { Box, Alert, Button } from '@mui/material';
import NavBar from "./navbar";
import GlobalSidebar from './components/GlobalSiderBar';
import { usePathname, useRouter } from 'next/navigation';
import { getAuthStatus } from '../utils/auth';

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const pathname = usePathname();
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const { isAuthenticated } = getAuthStatus();
      setIsAuthenticated(isAuthenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const handleAuthStateChange = (event: CustomEvent) => {
      const { isAuthenticated } = event.detail;
      setIsAuthenticated(isAuthenticated);
    };

    window.addEventListener('authStateChange', handleAuthStateChange as EventListener);
    
    return () => {
      window.removeEventListener('authStateChange', handleAuthStateChange as EventListener);
    };
  }, []);

  // Define protected routes (routes that require authentication)
  const protectedRoutes = ['/games', '/cp-info', '/cp-materials', '/profile', '/games'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Don't show sidebar on homepage
  const showSidebar = pathname !== '/';

  // If loading, show nothing
  if (isLoading) {
    return null;
  }

  // If user tries to access protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    return (
      <>
        <NavBar />
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: 'calc(100vh - 64px)',
          p: 3
        }}>
          <Alert 
            severity="warning" 
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => router.push('/')}
              >
                Go Home
              </Button>
            }
            sx={{ maxWidth: 500 }}
          >
            You need to be logged in to access this page. Please log in first.
          </Alert>
        </Box>
      </>
    );
  }

  return (
    <>
      <NavBar />
      
      <Box sx={{ display: 'flex' }}>
        {showSidebar && (
          <>
            <Box
              onMouseEnter={() => setSidebarOpen(true)}
              sx={{
                width: '20px', 
                height: 'calc(100vh - 64px)', 
                position: 'absolute',
                left: 0,
              }}
            />
            
            <GlobalSidebar 
              open={sidebarOpen}
              onMouseLeave={() => setSidebarOpen(false)}
            />
          </>
        )}
        
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            width: '100%',
            minHeight: 'calc(100vh - 64px)'
          }}
        >
          {children} 
        </Box>
      </Box>
    </>
  );
}
