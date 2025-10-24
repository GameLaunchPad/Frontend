"use client";

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
  ButtonGroup,
  Button,
  CardMedia,
  CardActions,
  Chip,
} from '@mui/material';
import GameHeading from './game-heading';

export default function GamePad() {
  return (
    // <Box sx={{ display: 'flex' }}>
    //   <EdgeDrawer />
      <GameDashboard />
    //</Box>
  );
}

export class PlatformSupport {
  android = false;
  ios = false;
  web = false;
}

class GameInfo {
  constructor(
    public gameName = "",
    public downloads = 0,
    public rating = 0.0,
    public version = "",
    public platforms = new PlatformSupport()
  ) { }
}

// function EdgeDrawer() {
//   const drawerWidth = 240;
//
//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
//       }}
//     >
//       <Toolbar />
//       <Box sx={{ overflow: 'auto' }}>
//         <List>
//           <ListItem key="My Games" disablePadding>
//             <ListItemButton>
//               <ListItemText primary="My Games" />
//             </ListItemButton>
//           </ListItem>
//           <ListItem key="New Game" disablePadding>
//             <ListItemButton href="/games/create">
//               <ListItemText primary="New Game" />
//             </ListItemButton>
//           </ListItem>
//           <ListItem key="Review Queue" disablePadding>
//             <ListItemButton>
//               <ListItemText primary="Review Queue" />
//             </ListItemButton>
//           </ListItem>
//         </List>
//         <Divider />
//         <List>
//           <ListItem disablePadding>
//             <ListItemButton>
//               <ListItemText primary="Provider Management" />
//             </ListItemButton>
//           </ListItem>
//           <ListItem disablePadding>
//             <ListItemButton href='/cp-info'>
//               <ListItemText primary="Provider Information" />
//             </ListItemButton>
//           </ListItem>
//           <ListItem disablePadding>
//             <ListItemButton>
//               <ListItemText primary="Certificate Management" />
//             </ListItemButton>
//           </ListItem>
//         </List>
//         <Divider />
//         <List>
//           {['Data Analysis', 'Download Statistics', 'User Feedbacks'].map((text) => (
//             <ListItem key={text} disablePadding>
//               <ListItemButton>
//                 <ListItemText primary={text} />
//               </ListItemButton>
//             </ListItem>
//           ))}
//         </List>
//       </Box>
//     </Drawer>
//   );
// }

function GameDashboard() {
  enum Layout { Card, List };
  const [layout, setLayout] = useState(Layout.Card);
  const games = [
    new GameInfo("Genshin Impact", 17348, 4.7, "6.1.0", { android: true, ios: true, web: false }),
    new GameInfo("Prince of Persia: The Lost Crown", 16253, 4.6, "1.1.0", { android: true, ios: true, web: false }),
    new GameInfo("Call of Duty", 3275, 4.4, "1.0.52", { android: true, ios: true, web: true }),
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <GameHeading
        heading="My Games" subheading="Game Management &gt; My Games"
        actions={["Batch Operation", "New Game"]}
      />
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
              <Button onClick={() => setLayout(Layout.Card)}>Card</Button>
              <Button onClick={() => setLayout(Layout.List)}>List</Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Box>
      <Box mt={4}>
        {layout == Layout.Card ? <CardLayout games={games} /> : <ListLayout games={games} />}
      </Box>
    </Box>
  );
}

interface LayoutProps {
  games: GameInfo[]
}

function CardLayout({ games }: LayoutProps) {
  return (
    <Grid container spacing={2}>
      {games.map((game) =>
        <Grid size={4}>
          <GameCard gameInfo={game} />
        </Grid>
      )}
    </Grid>
  );
}

function ListLayout({ games }: LayoutProps) {
  return (
    <List>
      {games.map(({ gameName, downloads, rating, version, platforms }) => (
        <ListItem>
          <ListItemText primary={gameName} secondary={`${downloads} Downloads, ${rating} Rating, Version ${version}`} />
          <Box>
            {platforms.android && <Chip label="Android" sx={{ marginRight: 1 }} />}
            {platforms.ios && <Chip label="iOS" sx={{ marginRight: 1 }} />}
            {platforms.web && <Chip label="Web" sx={{ marginRight: 1 }} />}
          </Box>
          <ButtonGroup variant="text">
            <Button>View</Button>
            <Button>Edit</Button>
            <Button>Statistics</Button>
          </ButtonGroup>
        </ListItem>))}
    </List>
  );
}

function GameCard({ gameInfo }: { gameInfo: GameInfo }) {
  return (
    <Card sx={{ minWidth: 400, paddingLeft: 2, paddingRight: 2 }}>
      <CardMedia sx={{ height: 140 }} />
      <Chip label="Released" color="success" sx={{ position: 'sticky', bottom: '90%', left: '100%', zIndex: '1' }} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {gameInfo.gameName}
        </Typography>
      </CardContent>
      {gameInfo.platforms.android && <Chip label="Android" sx={{ marginRight: 1 }} />}
      {gameInfo.platforms.ios && <Chip label="iOS" sx={{ marginRight: 1 }} />}
      {gameInfo.platforms.web && <Chip label="Web" sx={{ marginRight: 1 }} />}
      <Grid mt={2} container spacing={2} justifyContent="center">
        <Card sx={{ flex: 1.5 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {gameInfo.downloads}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Downloads
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1.5 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {gameInfo.rating}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Rating
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1.5 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {gameInfo.version}
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
