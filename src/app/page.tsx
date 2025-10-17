"use client";
import React from 'react';
import GameCard from './components/GameCard/GameCard'; // 引入GameCard组件
import styles from './home.module.css'; // 主页面的样式
import { Box, Card, CardContent, CardMedia, Grid, Skeleton, Stack, Typography } from '@mui/material';

export default function HomePage() {
  const gameNames = ["Game 1", "Game 2", "Game 3", "Game 4"];

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>

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
                  return <HorizontalGameCard key={name} name={name} rating="5.0" category="Category"/>
                })}
              </Stack>
            </Grid>
          </Grid>

        <section className={styles.popularSection}>
          <h2>热门游戏与话题</h2>
          <div className={styles.popularGrid}>
            {/* 使用GameCard组件 */}
            <GameCard title="游戏标题 1" rating="9.2" type="类型A" />
            <GameCard title="游戏标题 2" rating="8.9" type="类型B" />
            <GameCard title="游戏标题 3" rating="9.5" type="类型C" />
            <GameCard title="游戏标题 4" rating="8.5" type="类型D" />
          </div>
        </section>

      </main>
    </div>
  );
}

function HorizontalGameCard({name, rating, category}: {name: string, rating: string, category: string}) {
  return (
    <Card sx={{ display: 'flex' }}>
      <CardMedia>
        <Skeleton variant="rectangular" width={100} height={100} />
      </CardMedia>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography variant="subtitle1">{name}</Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>{rating} {category}</Typography>
        </CardContent>
      </Box>
    </Card>
  );
}
