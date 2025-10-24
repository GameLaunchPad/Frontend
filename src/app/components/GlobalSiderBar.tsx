"use client";
import React from 'react';
import { 
  Drawer, 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  ListItemIcon,
  Divider, 
  Typography,
  Avatar,
  Stack
} from '@mui/material';
import { 
  Gamepad, 
  Add, 
  Business, 
  Description, 
  RateReview 
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function SidebarContent() {
  const pathname = usePathname();

  // 菜单项配置
  const gameMenuItems = [
    { text: 'My Games', icon: <Gamepad />, href: '/games' },
    { text: 'New Game', icon: <Add />, href: '/games/create' },
  ];

  const providerMenuItems = [
    { text: 'Provider Information', icon: <Business />, href: '/cp-info' },
    { text: 'Certificate Management', icon: <Description />, href: '/cp-materials' },
  ];

  const otherMenuItems = [
    { text: 'Review Management', icon: <RateReview />, href: '/review_tool/review.html', external: true },
  ];

  // 判断是否为当前路由
  const isActive = (href: string) => pathname === href;

  return (
    <Box 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
      }}
    >
      {/* 顶部 Logo 区域 */}
      <Box 
        sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          }
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Avatar 
            sx={{ 
              width: 45, 
              height: 45,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Gamepad sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
              GameLaunchPad
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
              Management Console
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* 菜单内容区域 */}
      <Box sx={{ overflow: 'auto', flex: 1, p: 2 }}>
        {/* Game Management */}
        <Typography 
          variant="caption" 
          sx={{ 
            px: 2, 
            py: 1, 
            display: 'block',
            color: 'text.secondary',
            fontWeight: 700,
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          Game Management
        </Typography>
        <List component="nav" sx={{ py: 0 }}>
          {gameMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton 
                component={Link} 
                href={item.href}
                selected={isActive(item.href)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(25, 118, 210, 0.08)',
                    transform: 'translateX(4px)',
                  },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(25, 118, 210, 0.12)',
                    borderLeft: '3px solid #1976d2',
                    '&:hover': {
                      bgcolor: 'rgba(25, 118, 210, 0.16)',
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive(item.href) ? '#1976d2' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive(item.href) ? 600 : 400,
                    color: isActive(item.href) ? '#1976d2' : 'text.primary'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2, mx: 2 }} />

        {/* Provider Management */}
        <Typography 
          variant="caption" 
          sx={{ 
            px: 2, 
            py: 1, 
            display: 'block',
            color: 'text.secondary',
            fontWeight: 700,
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          Provider Management
        </Typography>
        <List component="nav" sx={{ py: 0 }}>
          {providerMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton 
                component={Link} 
                href={item.href}
                selected={isActive(item.href)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(25, 118, 210, 0.08)',
                    transform: 'translateX(4px)',
                  },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(25, 118, 210, 0.12)',
                    borderLeft: '3px solid #1976d2',
                    '&:hover': {
                      bgcolor: 'rgba(25, 118, 210, 0.16)',
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive(item.href) ? '#1976d2' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive(item.href) ? 600 : 400,
                    color: isActive(item.href) ? '#1976d2' : 'text.primary'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2, mx: 2 }} />

        {/* Other Tools */}
        <Typography 
          variant="caption" 
          sx={{ 
            px: 2, 
            py: 1, 
            display: 'block',
            color: 'text.secondary',
            fontWeight: 700,
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          Tools & Analytics
        </Typography>
        <List component="nav" sx={{ py: 0 }}>
          {otherMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              {item.external ? (
                <ListItemButton 
                  component="a"
                  href={item.href}
                  target="_blank"
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(102, 126, 234, 0.08)',
                      transform: 'translateX(4px)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: 400,
                    }}
                  />
                </ListItemButton>
              ) : (
                <ListItemButton 
                  component={Link} 
                  href={item.href}
                  selected={isActive(item.href)}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(102, 126, 234, 0.08)',
                      transform: 'translateX(4px)',
                    },
                    '&.Mui-selected': {
                      bgcolor: 'rgba(102, 126, 234, 0.12)',
                      borderLeft: '3px solid #667eea',
                      '&:hover': {
                        bgcolor: 'rgba(102, 126, 234, 0.16)',
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: isActive(item.href) ? '#667eea' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: isActive(item.href) ? 600 : 400,
                      color: isActive(item.href) ? '#667eea' : 'text.primary'
                    }}
                  />
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </List>
      </Box>

      {/* 底部版本信息 */}
      <Box 
        sx={{ 
          p: 2, 
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            textAlign: 'center', 
            color: 'text.secondary',
            fontSize: '0.7rem'
          }}
        >
          Version 1.0.0
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            textAlign: 'center', 
            color: 'text.secondary',
            fontSize: '0.65rem',
            mt: 0.5
          }}
        >
          © 2025 GameLaunchPad
        </Typography>
      </Box>
    </Box>
  );
}


interface GlobalSidebarProps {
  open: boolean;
  onMouseLeave: () => void;
}

export default function GlobalSidebar({ open, onMouseLeave }: GlobalSidebarProps) {
  return (
    <Drawer
      variant="temporary"
      open={open}
      PaperProps={{
        onMouseLeave: onMouseLeave,
        sx: { 
          borderRight: 'none',
          width: 280,
          boxShadow: '4px 0 20px rgba(0,0,0,0.08)'
        }
      }}
    >
      <SidebarContent />
    </Drawer>
  );
}