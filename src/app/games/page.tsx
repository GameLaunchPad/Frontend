import React from 'react';
import {
  Box, Drawer, Toolbar, List, ListItem, ListItemText, Divider, ListItemButton
} from '@mui/material';

export default function GamePad() {
  return (
    <div>
      <EdgeDrawer/>
    </div>
  );
}

function EdgeDrawer() {
    const drawerWidth = 240;

    return (
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {['My Games', 'New Game', 'Review Queue'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="Provider Management" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton href='/cp-info'>
                <ListItemText primary="Provider Information" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="Certificate Management" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            {['Data Analysis', 'Download Statistics', 'User Feedbacks'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    );
}