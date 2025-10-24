"use client";

import React, { useState } from 'react';
import { Box } from '@mui/material';
import NavBar from "./navbar";
import GlobalSidebar from './components/GlobalSiderBar';
import { usePathname } from 'next/navigation';

export default function AppWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pathname = usePathname();

  const showSidebar = !pathname.startsWith('/login');

  return (
    <>
      <NavBar/>
      
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
          }}
        >
          {children} 
        </Box>
      </Box>
    </>
  );
}