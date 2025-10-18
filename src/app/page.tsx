"use client";

import React from 'react';
import { Box, Card, CardContent, CardMedia, Grid, Skeleton, Stack, Typography } from '@mui/material';

export default function HomePage() {
  const gameNames = ["Game 1", "Game 2", "Game 3", "Game 4"];

  return (
    <Box p={3}>
      <Grid container spacing={3} marginBottom={3}>
        <Grid size="grow">
          <Card>
            <CardMedia>
              <Skeleton variant="rectangular" height={360} />
            </CardMedia>
            <CardContent>
              <Typography variant="subtitle1">Game Name</Typography>
              <Typography variant="subtitle2">Game Introduction</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
          <Stack spacing={2}>
            {gameNames.map(name => {
              return <GameCard key={name} variant="horizontal" title={name} rating="5.0" category="Category" />
            })}
          </Stack>
        </Grid>
      </Grid>
      <Typography variant="h5">Popular Games and Topics</Typography>
      <Stack direction="row" spacing={3} mt={3}>
        <GameCard title="Game 1" rating="9.2" category="Category A" />
        <GameCard title="Game 2" rating="8.9" category="Category B" />
        <GameCard title="Game 3" rating="9.5" category="Category C" />
        <GameCard title="Game 4" rating="8.5" category="Category D" />
      </Stack>
    </Box>
  );
}

function GameCard({ variant, title, rating, category }: { variant?: "regular" | "horizontal", title: string, rating: string, category: string }) {
  const MediaContent = () => variant == "horizontal"
    ? <Skeleton variant="rectangular" width={100} height={100} />
    : <Skeleton variant="rectangular" height={200} />;

  return (
    <Card sx={variant == 'horizontal' ? { display: 'flex' } : { flex: 1 }}>
      <CardMedia>
        <MediaContent />
      </CardMedia>
      <Box>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>{rating} {category}</Typography>
        </CardContent>
      </Box>
    </Card>
  );
}