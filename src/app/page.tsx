"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  Chip,
  Paper,
  Stack
} from '@mui/material';
import GamepadIcon from '@mui/icons-material/Gamepad';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import StarIcon from '@mui/icons-material/Star';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on component mount
  useEffect(() => {
    const checkLoginStatus = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('authStateChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('authStateChange', handleAuthChange);
    };
  }, []);

  // Handle button click logic
  const handleButtonClick = () => {
    if (isLoggedIn) {
      router.push('/games');
    } else {
      window.dispatchEvent(new CustomEvent('openLoginDialog'));
    }
  };

  const sections = [
    {
      id: 1,
      title: "Game Analytics Dashboard(Building)",
      subtitle: "Track Your Success",
      description: "Get comprehensive insights into your game performance with our advanced analytics dashboard. Monitor player engagement, revenue metrics, and growth trends in real-time.",
      features: ["Real-time Metrics", "Player Analytics", "Revenue Tracking", "Growth Insights"],
      image: "/images/The-Importance-of-Game-Analytics-in-Your-Published-Games.jpg",
      reverse: false
    },
    {
      id: 2,
      title: "Community Management(Building)",
      subtitle: "Build Your Community",
      description: "Create and manage dedicated communities around your games. Engage with players, gather feedback, and build lasting relationships with your audience.",
      features: ["Player Engagement", "Feedback Collection", "Community Building", "Social Integration"],
      image: "/images/community-the-game-7n377kxpq52g6nz2.jpg",
      reverse: true
    },
    {
      id: 3,
      title: "Marketing Solutions(Building)",
      subtitle: "Promote Your Games",
      description: "Launch targeted marketing campaigns to reach your ideal audience. Our platform provides tools for user acquisition, retention, and monetization.",
      features: ["User Acquisition", "Retention Campaigns", "Monetization Tools", "A/B Testing"],
      image: "/images/OIP.webp",
      reverse: false
    }
  ];

  const featuredGames = [
    {
      id: 1,
      title: "Genshin Impact",
      description: "Open-world action RPG with stunning visuals",
      image: "/images/genshin_popular.webp",
      rating: "4.9",
      players: "50M+"
    },
    {
      id: 2,
      title: "WuWa",
      description: "Next-generation martial arts adventure",
      image: "/images/wuwa_popular.webp",
      rating: "4.8",
      players: "10M+"
    },
    {
      id: 3,
      title: "Honkai: Star Rail",
      description: "Space fantasy RPG with rich storytelling",
      image: "/images/rail_popular.webp",
      rating: "4.7",
      players: "30M+"
    },
    {
      id: 4,
      title: "Eggy Party",
      description: "Fun multiplayer party game for all ages",
      image: "/images/egg_popular.webp",
      rating: "4.6",
      players: "20M+"
    }
  ];

  const stats = [
    { label: 'Active Publishers', value: '99,999+' },
    { label: 'Games Published', value: '99,999+' },
    { label: 'Monthly Users', value: '99,999+' },
    { label: 'Revenue Generated', value: '$0' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 8, md: 12 }
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          zIndex: 0
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography variant="h2" component="h1" sx={{
              fontWeight: 800,
              mb: 4,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              GameLaunchPad
            </Typography>
            
            <Typography variant="h3" sx={{
              fontWeight: 600,
              mb: 4,
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              fontSize: { xs: '2rem', md: '3rem' }
            }}>
              The Ultimate Platform for Game Publishers
            </Typography>
            
            <Typography variant="h6" sx={{
              maxWidth: '800px',
              mx: 'auto',
              mb: 6,
              opacity: 0.9,
              fontWeight: 400
            }}>
              Transform your game publishing journey with our comprehensive suite of tools. 
              From analytics to community management, we provide everything you need to succeed.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleButtonClick}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100'
                  }
                }}
              >
                Get Started
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 4
          }}>
            {stats.map((stat, index) => (
              <Paper key={index} sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Feature Sections with Left-Right Layout */}
      {sections.map((section) => (
        <Box key={section.id} sx={{ py: 12 }}>
          <Container maxWidth="lg">
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: section.reverse ? 'row-reverse' : 'row' },
              gap: 6,
              alignItems: 'center'
            }}>
              {/* Content */}
              <Box sx={{ 
                flex: 1,
                pr: { md: 4 }
              }}>
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600, mb: 1 }}>
                  {section.subtitle}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
                  {section.title}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                  {section.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {section.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Box>
              </Box>
              
              {/* Image */}
              <Box sx={{ 
                flex: 1,
                position: 'relative',
                width: '100%',
                height: { xs: 300, md: 400 },
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
              }}>
                <Image
                  src={section.image}
                  alt={section.title}
                  fill={true}
                  style={{ objectFit: 'cover' }}
                />
              </Box>
            </Box>
          </Container>
        </Box>
      ))}

      {/* Featured Games Section */}
      <Box sx={{ py: 12, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Featured Games
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
              Discover amazing games from our talented publishers and join millions of players worldwide.
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3
          }}>
            {featuredGames.map((game) => (
              <Card key={game.id} sx={{
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)'
                }
              }}>
                <Box sx={{ position: 'relative', width: '100%', height: 120 }}>
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill={true}
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {game.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {game.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                      {game.rating}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      • {game.players}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        py: 12,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          zIndex: 0
        }} />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
              Ready to Launch Your Game?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of game publishers who trust GameLaunchPad to grow their communities.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleButtonClick}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 600,
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
            >
              Start Your Journey
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, bgcolor: 'grey.100' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <GamepadIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                GameLaunchPad
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              © 2024 GameLaunchPad. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}