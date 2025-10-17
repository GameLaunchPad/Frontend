import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
  ButtonGroup,
  Button,
  CardMedia,
  CardActions,
  Chip,
} from '@mui/material';

export default function GamePad() {
  return (
    <Box sx={{ display: 'flex' }}>
      <EdgeDrawer />
      <GameDashboard />
    </Box>
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
          {['My Games', 'New Game', 'Review Queue'].map((text) => (
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
          {['Data Analysis', 'Download Statistics', 'User Feedbacks'].map((text) => (
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

function GameDashboard() {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Games
      </Typography>
      <Typography variant="h6" gutterBottom>
        Game Management &gt; My Games
      </Typography>
      <Divider />
      <Box mt={4}>
        <Grid container spacing={2} justifyContent="center">
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                N/A
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Total
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                N/A
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Published
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                N/A
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Reviewing
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                N/A
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Drafts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Box>
      <Box mt={4}>
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          <Grid container size="grow">
            <TextField label="Search a game" />
            <TextField select label="Status" sx={{ width: '20ch' }}>
              <MenuItem>
                All Status
              </MenuItem>
            </TextField>
            <TextField select label="Platform" sx={{ width: '20ch' }}>
              <MenuItem>
                All Platforms
              </MenuItem>
            </TextField>
          </Grid>
          <Grid container size={2}>
          </Grid>
          <Grid container size={2} sx={{ justifyContent: 'end' }}>
            <ButtonGroup size="large">
              <Button>Card</Button>
              <Button>List</Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Box>
      <Box mt={4}>
        <Grid container spacing={2} columns={3}>
          <GameCard />
        </Grid>
      </Box>
    </Box>
  );
}

function GameCard() {
  return (
    <Card sx={{ minWidth: 400, paddingLeft: 2, paddingRight: 2 }}>
      <CardMedia sx={{ height: 140 }} />
      <Chip label="Released" color="success" sx={{ position: 'sticky', bottom: '90%', left: '100%', zIndex: '1' }} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Game Name
        </Typography>
      </CardContent>
      <Chip label="Android" />
      <Grid mt={2} container spacing={2} justifyContent="center">
        <Card sx={{ flex: 1.5 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              N/A
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Downloads
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1.5 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              N/A
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Rating
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1.5 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              N/A
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Version
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button>View</Button>
        <Button>Edit</Button>
        <Button>Statistics</Button>
      </CardActions>
    </Card>
  );
}