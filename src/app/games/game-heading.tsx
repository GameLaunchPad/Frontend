import { Button, Typography, Box, Stack, Card, CardContent } from "@mui/material";
import { Gamepad, Add, Refresh, Settings } from '@mui/icons-material';
import Link from 'next/link';

export default function GameHeading({ 
  heading, 
  subheading, 
  actions,
  icon = 'gamepad'
}: { 
  heading: string;
  subheading: string;
  actions?: string[];
  icon?: 'gamepad' | 'settings' | 'refresh';
}) {
  // 选择图标
  const IconComponent = icon === 'gamepad' ? Gamepad : icon === 'settings' ? Settings : Refresh;

  return (
    <Box sx={{ mb: 4 }}>
      <Card 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            {/* 左侧：图标 + 标题 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {/* 图标容器 */}
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
                <IconComponent sx={{ fontSize: 40, color: 'white' }} />
              </Box>

              {/* 标题和副标题 */}
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
                  {heading}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.95,
                    fontWeight: 400 
                  }}
                >
                  {subheading}
                </Typography>
              </Box>
            </Box>

            {/* 右侧：操作按钮 */}
            {actions && actions.length > 0 && (
              <Stack direction="row" spacing={2}>
                {actions.map((action) => {
                  // 根据不同的 action 渲染不同样式的按钮
                  if (action === "New Game") {
                    return (
                      <Link key={action} href="/games/create" passHref style={{ textDecoration: 'none' }}>
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
                          {action}
                        </Button>
                      </Link>
                    );
                  } else {
                    // 其他按钮使用 outlined 样式
                    return (
                      <Button
                        key={action}
                        variant="outlined"
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
                        {action}
                      </Button>
                    );
                  }
                })}
              </Stack>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}