"use client";
import React from 'react';
import { Drawer, Box, List, ListItem, ListItemButton, ListItemText, Divider, ListSubheader, Toolbar } from '@mui/material';
import Link from 'next/link';

function SidebarContent() {
  return (
    <>
      <Toolbar />
      <Box sx={{ overflow: 'auto', width: 240 }}>
        <List
          component="nav"
          subheader={
            <ListSubheader component="div">
              Game Management
            </ListSubheader>
          }
        >
          <ListItem key="My Games" disablePadding>
            <ListItemButton href="/games">
              <ListItemText primary="My Games" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List
          component="nav"
          subheader={
            <ListSubheader component="div">
              Provider Management
            </ListSubheader>
          }
        >
          <ListItem disablePadding>
            <ListItemButton component={Link} href='/cp-info'>
              <ListItemText primary="Provider Information" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} href='/cp-materials'>
              <ListItemText primary="Certificate Management" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
      </Box>
    </>
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
        sx: { borderRight: 'none' }
      }}
    >
      <SidebarContent />
    </Drawer>
  );
}