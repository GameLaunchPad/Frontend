"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
  ButtonGroup,
  Button,
  CardMedia,
  CardActions,
  Chip,
  Paper,
  Stack,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { 
  Gamepad, 
  Add, 
  ViewModule, 
  ViewList, 
  Search,
  TrendingUp,
  CheckCircle,
  Edit,
  Description,
  Star,
  GetApp,
  Android,
  Apple,
  Language as WebIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { getAllGames, PublishedGame } from '@/utils/gameLocalStorage';

export default function GamePad() {
  return (
      <GameDashboard />
  );
}

export class PlatformSupport {
  android = false;
  ios = false;
  web = false;
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
  const [allGames, setAllGames] = useState<PublishedGame[]>([]);
  const [filterKeyword, setFilterKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [mounted, setMounted] = useState(false);

  // 确保组件在客户端挂载
  useEffect(() => {
    setMounted(true);
  }, []);

  // 从 localStorage 加载游戏数据
  useEffect(() => {
    // 只在客户端挂载后执行
    if (!mounted) return;

    const loadGames = () => {
      console.log('🔍 开始加载游戏（包括草稿）...');
      const games = getAllGames();
      console.log('📦 加载结果:', games);
      setAllGames(games);
    };

    loadGames();

    // 监听 storage 事件以支持跨标签页更新（包括草稿变化）
    const handleStorageChange = (e: StorageEvent) => {
      // 监听 published_games 和 game_form_data 的变化
      if (e.key === 'published_games' || e.key === 'game_form_data' || e.key === null) {
        console.log('📡 Storage changed:', e.key, '- reloading games...');
        loadGames();
      }
    };

    // 监听页面可见性变化，当页面重新可见时刷新数据
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Page visible, reloading games...');
        loadGames();
      }
    };

    // 监听自定义刷新事件
    const handleCustomRefresh = () => {
      console.log('🔄 Custom refresh triggered, reloading games...');
      loadGames();
    };
    
    // 定期刷新（每3秒检查一次草稿变化）
    const intervalId = setInterval(() => {
      const currentGamesCount = allGames.length;
      const newGames = getAllGames();
      if (newGames.length !== currentGamesCount) {
        console.log('🔄 检测到游戏数量变化，自动刷新...');
        setAllGames(newGames);
      }
    }, 3000);

    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('gamesListRefresh', handleCustomRefresh);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('gamesListRefresh', handleCustomRefresh);
      clearInterval(intervalId); // 清理定时器
    };
  }, [mounted, allGames.length]);

  // 过滤游戏
  const filteredGames = allGames.filter(game => {
    // 关键词搜索
    const matchesKeyword = !filterKeyword || 
      game.gameName.toLowerCase().includes(filterKeyword.toLowerCase()) ||
      game.gameIntro.toLowerCase().includes(filterKeyword.toLowerCase()) ||
      game.gameType.toLowerCase().includes(filterKeyword.toLowerCase());

    // 状态过滤
    const matchesStatus = statusFilter === 'all' || game.status === statusFilter;

    // 平台过滤
    const matchesPlatform = platformFilter === 'all' || 
      (platformFilter === 'android' && game.platforms.android) ||
      (platformFilter === 'ios' && game.platforms.ios) ||
      (platformFilter === 'web' && game.platforms.web);

    return matchesKeyword && matchesStatus && matchesPlatform;
  });

  // 统计数据
  const stats = {
    total: allGames.length,
    published: allGames.filter(g => g.status === 'published').length,
    reviewing: allGames.filter(g => g.status === 'reviewing').length,
    rejected: allGames.filter(g => g.status === 'rejected').length,
    drafts: allGames.filter(g => g.status === 'draft').length
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Box sx={{ maxWidth: 'xl', mx: 'auto' }}>
        {/* Beautiful Title Card */}
        <Box sx={{ mb: 4 }}>
          <Card 
            elevation={0}
            sx={{ 
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              color: 'white',
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                transform: 'translate(30%, -30%)',
              }
            }}
          >
            <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: 3,
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Gamepad sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="h5" 
                      component="h1" 
                      sx={{ 
                        fontWeight: 700,
                        mb: 1,
                        letterSpacing: '-0.5px'
                      }}
                    >
                      My Games
              </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.95,
                        fontWeight: 400 
                      }}
                    >
                      Game Management &gt; My Games
              </Typography>
                  </Box>
                </Box>
                {/* Action Buttons */}
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      // 快速添加测试游戏
                      const testGame = {
                        id: `game_${Date.now()}_test`,
                        gameName: `测试游戏 ${new Date().toLocaleTimeString()}`,
                        gameIntro: "这是一个测试游戏",
                        gameType: "Action",
                        avatarSrc: "",
                        headerImage: "",
                        platforms: { android: true, ios: true, web: false },
                        platformConfigs: {},
                        screenshots: [],
                        publishedAt: Date.now(),
                        status: "published",
                        downloads: 0,
                        rating: 0,
                        version: "1.0.0",
                        savedAt: Date.now()
                      };
                      
                      let games = [];
                      try {
                        const existing = localStorage.getItem('published_games');
                        if (existing) games = JSON.parse(existing);
                      } catch (e) {
                        console.error('Parse error:', e);
                      }
                      
                      games.push(testGame);
                      localStorage.setItem('published_games', JSON.stringify(games));
                      console.log('✅ Test game added, reloading...');
                      
                      // 强制重新加载
                      const newGames = getAllGames();
                      setAllGames(newGames);
                    }}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      borderRadius: 2,
                      px: 2.5,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    + Test Game
                  </Button>
                  <Link href="/games/create" passHref style={{ textDecoration: 'none' }}>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      sx={{
                        bgcolor: 'white',
                        color: 'primary.main',
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 700,
                        boxShadow: 3,
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          boxShadow: 6,
                        }
                      }}
                    >
                      New Game
                    </Button>
                  </Link>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Statistics Cards */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            <Grid size={2.4}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h4" component="div" fontWeight={700}>
                    {stats.total}
                  </Typography>
                  <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48 }}>
                    <Gamepad />
                  </Avatar>
                </Box>
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                  Total Games
                </Typography>
              </Paper>
            </Grid>
            <Grid size={2.4}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h4" component="div" fontWeight={700}>
                    {stats.published}
              </Typography>
                  <Avatar sx={{ bgcolor: 'success.light', width: 48, height: 48 }}>
                    <CheckCircle />
                  </Avatar>
                </Box>
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                Published
              </Typography>
              </Paper>
            </Grid>
            <Grid size={2.4}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h4" component="div" fontWeight={700}>
                    {stats.reviewing}
              </Typography>
                  <Avatar sx={{ bgcolor: 'warning.light', width: 48, height: 48 }}>
                    <TrendingUp />
                  </Avatar>
                </Box>
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                Reviewing
              </Typography>
              </Paper>
            </Grid>
            <Grid size={2.4}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h4" component="div" fontWeight={700}>
                    {stats.rejected}
              </Typography>
                  <Avatar sx={{ bgcolor: 'error.light', width: 48, height: 48 }}>
                    <Description />
                  </Avatar>
                </Box>
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                Rejected
              </Typography>
              </Paper>
            </Grid>
            <Grid size={2.4}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h4" component="div" fontWeight={700}>
                    {stats.drafts}
              </Typography>
                  <Avatar sx={{ bgcolor: 'info.light', width: 48, height: 48 }}>
                    <Description />
                  </Avatar>
                </Box>
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                Drafts
              </Typography>
              </Paper>
            </Grid>
        </Grid>
      </Box>
        {/* Filter and Search Section */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 4,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid size="grow">
              <Stack direction="row" spacing={2}>
                <TextField 
                  label="Search a game" 
                  value={filterKeyword} 
                  onChange={(e) => setFilterKeyword(e.target.value)}
                  sx={{
                    minWidth: '300px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
                <TextField 
                  select 
                  label="Status" 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ 
                    minWidth: '180px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="reviewing">Reviewing</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="draft">Drafts</MenuItem>
            </TextField>
                <TextField 
                  select 
                  label="Platform" 
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  sx={{ 
                    minWidth: '180px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                >
                  <MenuItem value="all">All Platforms</MenuItem>
                  <MenuItem value="android">Android</MenuItem>
                  <MenuItem value="ios">iOS</MenuItem>
                  <MenuItem value="web">Web</MenuItem>
            </TextField>
              </Stack>
          </Grid>
            <Grid size="auto">
              <ButtonGroup 
                variant="outlined"
                size="large"
                sx={{
                  '& .MuiButton-root': {
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2.5
                  }
                }}
              >
                <Button 
                  onClick={() => setLayout(Layout.Card)}
                  variant={layout === Layout.Card ? "contained" : "outlined"}
                  startIcon={<ViewModule />}
                >
                  Card
                </Button>
                <Button 
                  onClick={() => setLayout(Layout.List)}
                  variant={layout === Layout.List ? "contained" : "outlined"}
                  startIcon={<ViewList />}
                >
                  List
                </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
        </Paper>

        {/* Games Display */}
        <Box>
          {!mounted ? (
            // 服务端渲染或客户端初始化中
            <Paper 
              elevation={2} 
              sx={{ 
                p: 6, 
                textAlign: 'center',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Loading games...
              </Typography>
            </Paper>
          ) : filteredGames.length === 0 ? (
            <Paper 
              elevation={2} 
              sx={{ 
                p: 6, 
                textAlign: 'center',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              <Gamepad sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No games found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {allGames.length === 0 
                  ? "You haven't created any games yet. Start by creating a new game!"
                  : "Try adjusting your search filters to find what you're looking for."}
              </Typography>
              {allGames.length === 0 && (
                <Link href="/games/create" passHref style={{ textDecoration: 'none' }}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.2,
                      textTransform: 'none',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
                    }}
                  >
                    Create Your First Game
                  </Button>
                </Link>
              )}
            </Paper>
          ) : (
            <>
              {layout == Layout.Card
                ? <CardLayout games={filteredGames} />
                : <ListLayout games={filteredGames} />}
            </>
          )}
      </Box>
      </Box>
    </Box>
  );
}

interface LayoutProps {
  games: PublishedGame[];
}

function CardLayout({ games }: LayoutProps) {
  return (
    <Grid container spacing={2}>
      {games.map((game) =>
        <Grid key={game.id} size={4} sx={{ display: 'flex' }}>
          <GameCard gameInfo={game} />
        </Grid>
      )}
    </Grid>
  );
}

function ListLayout({ games }: LayoutProps) {
  const getStatusColor = (status: string): 'success' | 'warning' | 'info' | 'error' | 'default' => {
    switch(status) {
      case 'published': return 'success';
      case 'reviewing': return 'warning';
      case 'rejected': return 'error';
      case 'draft': return 'info';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'published': return 'Published';
      case 'reviewing': return 'Reviewing';
      case 'rejected': return 'Rejected';
      case 'draft': return 'Draft';
      default: return status;
    }
  };

  return (
    <Stack spacing={2}>
      {games.map((game) => {
        const editLink = game.id === 'draft_current' 
          ? `/games/create` 
          : `/games/create?id=${game.id}`;
        
        return (
          <Link key={game.id} href={editLink} passHref style={{ textDecoration: 'none' }}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 3,
                borderRadius: 3,
                border: '2px solid',
                borderColor: game.status === 'rejected' ? 'error.main' : 'grey.200',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                bgcolor: game.status === 'rejected' ? 'error.50' : 'white',
                '&:hover': {
                  boxShadow: 6,
                  borderColor: game.status === 'rejected' ? 'error.dark' : 'primary.main',
                }
              }}
            >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {/* Game Icon */}
            <Avatar 
              variant="rounded"
              src={game.avatarSrc || undefined}
              sx={{ 
                width: 80, 
                height: 80,
                background: game.avatarSrc ? 'transparent' : 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
              }}
            >
              {!game.avatarSrc && <Gamepad sx={{ fontSize: 40 }} />}
            </Avatar>

            {/* Game Info */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" fontWeight={700}>
                  {game.gameName}
                </Typography>
                <Chip 
                  label={getStatusLabel(game.status)} 
                  color={getStatusColor(game.status)}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </Box>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Chip 
                  icon={<GetApp />}
                  label={`${game.downloads} Downloads`} 
                  size="small" 
                  variant="outlined"
                />
                <Chip 
                  icon={<Star />}
                  label={`${game.rating} Rating`} 
                  size="small" 
                  variant="outlined"
                  color="warning"
                />
                <Chip 
                  label={`v${game.version}`} 
                  size="small" 
                  variant="outlined"
                />
                <Chip 
                  label={game.gameType} 
                  size="small" 
                  color="primary"
                  variant="outlined"
                />
              </Stack>
            </Box>

            {/* Platforms */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {game.platforms.android && <Chip icon={<Android />} label="Android" size="small" color="success" />}
              {game.platforms.ios && <Chip icon={<Apple />} label="iOS" size="small" color="primary" />}
              {game.platforms.web && <Chip icon={<WebIcon />} label="Web" size="small" color="info" />}
            </Box>

            {/* Actions */}
            <Stack direction="row" spacing={1}>
              <Button 
                variant="outlined" 
                size="small"
                startIcon={<Edit />}
                onClick={(e) => {
                  e.stopPropagation();
                  // 整个行已经可以点击编辑了，这里保留按钮UI
                }}
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 600,
                  borderRadius: 1.5,
                  px: 2
                }}
              >
                Edit
              </Button>
              <Button 
                variant="outlined"
                size="small"
                startIcon={<TrendingUp />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Statistics 功能可以在这里实现
                }}
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 600,
                  borderRadius: 1.5,
                  px: 2
                }}
              >
                Statistics
              </Button>
            </Stack>
          </Box>
        </Paper>
          </Link>
        );
      })}
    </Stack>
  );
}

function GameCard({ gameInfo }: { gameInfo: PublishedGame }) {
  const getStatusColor = (status: string): 'success' | 'warning' | 'info' | 'error' | 'default' | 'primary' | 'secondary' => {
    switch(status) {
      case 'published': return 'success';
      case 'reviewing': return 'warning';
      case 'rejected': return 'error';
      case 'draft': return 'info';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'published': return 'Published';
      case 'reviewing': return 'Reviewing';
      case 'rejected': return 'Rejected';
      case 'draft': return 'Draft';
      default: return status;
    }
  };

  const editLink = gameInfo.id === 'draft_current' 
    ? `/games/create` 
    : `/games/create?id=${gameInfo.id}`;

  return (
    <Link href={editLink} passHref style={{ textDecoration: 'none', display: 'flex', width: '100%', height: '100%' }}>
      <Card 
        elevation={2}
        sx={{ 
          borderRadius: 3,
          border: '2px solid',
          borderColor: gameInfo.status === 'rejected' ? 'error.main' : 'grey.200',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          cursor: 'pointer',
          bgcolor: gameInfo.status === 'rejected' ? 'error.50' : 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            boxShadow: 6,
            transform: 'translateY(-8px)',
            borderColor: gameInfo.status === 'rejected' ? 'error.dark' : 'primary.main',
          }
        }}
      >
      {/* Header Image */}
      <Box sx={{ position: 'relative' }}>
        {gameInfo.headerImage ? (
          <CardMedia 
            component="img"
            image={gameInfo.headerImage}
            alt={gameInfo.gameName}
            sx={{ 
              height: 160,
              objectFit: 'cover',
              filter: gameInfo.status === 'rejected' ? 'brightness(0.8)' : 'none'
            }} 
          />
        ) : (
          <CardMedia 
            sx={{ 
              height: 160,
              bgcolor: gameInfo.status === 'rejected' 
                ? 'error.main'
                : 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              background: gameInfo.status === 'rejected'
                ? 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)'
                : 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
            }} 
          />
        )}
        <Chip 
          label={getStatusLabel(gameInfo.status)} 
          color={getStatusColor(gameInfo.status)}
          size="small"
          sx={{ 
            position: 'absolute', 
            top: 12, 
            right: 12,
            fontWeight: 700,
            boxShadow: 2
          }} 
        />
        {/* Game Icon Avatar */}
        {gameInfo.avatarSrc && (
          <Avatar
            src={gameInfo.avatarSrc}
            variant="rounded"
            sx={{
              position: 'absolute',
              bottom: -25,
              left: 16,
              width: 60,
              height: 60,
              border: '3px solid white',
              boxShadow: 3
            }}
          />
        )}
      </Box>

      {/* Game Info */}
      <CardContent sx={{ pb: 2, pt: gameInfo.avatarSrc ? 4 : 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom variant="h6" component="div" fontWeight={700} sx={{ minHeight: '32px', display: 'flex', alignItems: 'center' }}>
          {gameInfo.gameName}
        </Typography>
        
        {/* Game Type & Platform Chips */}
        <Box sx={{ mb: 2, display: 'flex', gap: 0.5, flexWrap: 'wrap', minHeight: '32px', alignItems: 'flex-start' }}>
          <Chip label={gameInfo.gameType} size="small" color="primary" />
          {gameInfo.platforms.android && <Chip icon={<Android />} label="Android" size="small" color="success" variant="outlined" />}
          {gameInfo.platforms.ios && <Chip icon={<Apple />} label="iOS" size="small" color="primary" variant="outlined" />}
          {gameInfo.platforms.web && <Chip icon={<WebIcon />} label="Web" size="small" color="info" variant="outlined" />}
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={1.5} sx={{ mt: 'auto' }}>
          <Grid size={4}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 1.5, 
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: 'grey.50',
                height: '100%',
                minHeight: 64
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5, height: 24 }}>
                <GetApp sx={{ fontSize: 16, mr: 0.5, color: 'primary.main' }} />
                <Typography variant="h6" component="div" fontWeight={700} sx={{ fontSize: '1.1rem', lineHeight: 1 }}>
                  {gameInfo.downloads}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Downloads
              </Typography>
            </Paper>
          </Grid>
          <Grid size={4}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 1.5, 
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: 'grey.50',
                height: '100%',
                minHeight: 64
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5, height: 24 }}>
                <Star sx={{ fontSize: 16, mr: 0.5, color: 'warning.main' }} />
                <Typography variant="h6" component="div" fontWeight={700} sx={{ fontSize: '1.1rem', lineHeight: 1 }}>
                  {gameInfo.rating || 'N/A'}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Rating
              </Typography>
            </Paper>
          </Grid>
          <Grid size={4}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 1.5, 
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: 'grey.50',
                height: '100%',
                minHeight: 64
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5, height: 24 }}>
                <Typography variant="h6" component="div" fontWeight={700} sx={{ fontSize: '1.1rem', lineHeight: 1 }}>
                  {gameInfo.version}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Version
              </Typography>
            </Paper>
          </Grid>
        </Grid>
          </CardContent>

      {/* Actions */}
      <Divider />
      <CardActions sx={{ justifyContent: 'center', py: 1.5 }}>
        <Button 
          size="small" 
          startIcon={<Edit />}
          onClick={(e) => {
            e.stopPropagation();
            // 整个卡片已经可以点击编辑了，这里保留按钮UI
          }}
          sx={{ 
            textTransform: 'none', 
            fontWeight: 600,
            borderRadius: 1.5,
            px: 2
          }}
        >
          Edit
        </Button>
        <Button 
          size="small"
          startIcon={<TrendingUp />}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Statistics 功能可以在这里实现
          }}
          sx={{ 
            textTransform: 'none', 
            fontWeight: 600,
            borderRadius: 1.5,
            px: 2
          }}
        >
          Statistics
        </Button>
      </CardActions>
    </Card>
    </Link>
  );
}
