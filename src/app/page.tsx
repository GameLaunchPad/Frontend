"use client";

import Image from 'next/image';
import React from 'react';
import { Box, Card, CardContent, Grid, Stack, Typography, Container } from '@mui/material';

export default function HomePage() {
  const featuredGameImageUrl = "/images/genshin_main.jpg";

  const gameImageUrls = [
        "/images/genshin_impact.webp",
        "/images/wuwa.webp",
        "/images/rail.webp",
        "/images/egg.webp",
  ];
  
  const popularGameImageUrls = [
      "/images/genshin_popular.webp",
      "/images/wuwa_popular.webp",
      "/images/rail_popular.webp",
      "/images/egg_popular.webp",
  ];

  const gameNames = ["YuanShen", "MingChao", "Honkai: Star Rail", "Eggy Party"];

  const popularGames = [
    { title: "YuanShen", rating: "10.0", category: "ARPG", imageUrl: popularGameImageUrls[0]},
    { title: "MingChao", rating: "10.0", category: "ARPG", imageUrl: popularGameImageUrls[1]},
    { title: "Honkai: Star Rail", rating: "10.0", category: "turn-based", imageUrl: popularGameImageUrls[2]},
    { title: "Eggy Party", rating: "10.0", category: "multiplayer cooperative", imageUrl: popularGameImageUrls[3]},
  ];

  const spacing = 3;

  return (
        <Container maxWidth="xl" sx={{ p: 3 }}>
            
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                m: theme => theme.spacing(-spacing / 2),
                mb: 4, 
              }}
            >
                 <Box
                    sx={{
                      p: theme => theme.spacing(spacing / 2),
                      boxSizing: 'border-box',
                      width: { xs: '100%', md: '66.67%' },
                    }}
                 >
                    <Card sx={{ height: '100%' }}>
                         <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                            <Image
                                src={featuredGameImageUrl}
                                alt="featured game"
                                fill={true}
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                        </Box>
                        <CardContent>
                            <Typography variant="h5" component="div">YuanShen</Typography>
                            <Typography variant="body2" color="text.secondary">On the continent of "Teyvat", where seven elements converge, everyone can become a god...</Typography>
                        </CardContent>
                    </Card>
                </Box>
                
                <Box
                    sx={{
                      p: theme => theme.spacing(spacing / 2),
                      boxSizing: 'border-box',
                      width: { xs: '100%', md: '33.33%' },
                    }}
                 >
                    <Stack 
                      spacing={3} 
                      sx={{ 
                        height: '100%', 
                        justifyContent: 'space-between' 
                      }}
                    >
                        {gameNames.map((name, index) => (
                            <GameCard
                                key={name}
                                variant="horizontal"
                                title={name}
                                rating={popularGames[index].rating}
                                category={popularGames[index].category}
                                imageUrl={gameImageUrls[index % gameImageUrls.length]}
                            />
                        ))}
                    </Stack>
                </Box>
            </Box>
            
            <Typography variant="h5" sx={{ mb: 3 }}>popular games</Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                m: theme => theme.spacing(-spacing / 2),
              }}
            >
                {popularGames.map(game => (
                     <Box 
                        key={game.title}
                        sx={{
                          p: theme => theme.spacing(spacing / 2),
                          boxSizing: 'border-box',
                          width: { xs: '100%', sm: '50%', md: '33.33%', lg: '25%' },
                        }}
                     >
                        <GameCard
                            title={game.title}
                            rating={game.rating}
                            category={game.category}
                            imageUrl={game.imageUrl}
                        />
                    </Box>
                ))}
            </Box>
        </Container>
    );
}

interface GameCardProps {
    variant?: "regular" | "horizontal";
    title: string;
    rating: string;
    category: string;
    imageUrl: string;
}

function GameCard({ variant, title, rating, category, imageUrl }: GameCardProps ) {
  const imageContainerSx = variant === "horizontal"
      ? { position: 'relative', width: 100, height: 100, flexShrink: 0 }
      : { position: 'relative', width: '100%', height: 140 };

  return (
    <Card sx={
        variant === 'horizontal'
            ? { display: 'flex', alignItems: 'center', width: '100%' }
            : { height: '100%', display: 'flex', flexDirection: 'column' } 
    }>
      <Box sx={imageContainerSx}>
          <Image
              src={imageUrl}
              alt={title}
              fill={true}
              style={{ objectFit: 'cover' }}
              sizes={variant === 'horizontal' 
                ? "100px" 
                : "(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 25vw"}
          />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, width: '100%', overflow: 'hidden' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography component="div" variant="h6" noWrap title={title}>
                  {title}
              </Typography>
              <Typography variant="body2" color="text.secondary" component="div">
                  rating: {rating} | {category}
              </Typography>
          </CardContent>
      </Box>
    </Card>
  );
}