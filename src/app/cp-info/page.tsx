'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
// import { useRouter } from 'next/navigation'
import { getCPInfo } from '@/services/api'
import type { CPInfo } from '@/types/cp-info'
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Toolbar,
  Paper,
  Typography,
  Grid,
  TextField,
  Chip,
  CircularProgress,
  Button,
  Card,
  CardContent,
  Avatar,
  Divider
} from '@mui/material'

export default function CPInfoPage() {
  // ========== 状态管理 ==========
  // 用 useState 存储数据，这样数据变化时页面会自动更新
  const [cpInfo, setCpInfo] = useState<CPInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // useRouter 用于页面跳转
  // const router = useRouter()

  // ========== 数据获取 ==========
  // useEffect 在组件加载时自动执行
  useEffect(() => {
    const loadCPInfo = async () => {
      try {
        setLoading(true)
        // 这里硬编码一个厂商ID，实际应该从登录状态获取
        const response = await getCPInfo('cp_123')
        
        if (response.code === 0 && response.data) {
          setCpInfo(response.data)
        } else {
          setError('获取厂商信息失败')
        }
      } catch (err) {
        setError('网络错误，请稍后重试')
        console.error('加载厂商信息失败:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCPInfo()
  }, []) // 空数组表示只在组件首次加载时执行

  // ========== 工具函数 ==========
  // 格式化时间戳为可读日期
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '--'
    return new Date(timestamp).toLocaleDateString('zh-CN')
  }

  // 获取认证状态的显示文本和样式
  const getVerifyStatus = (status: number) => {
    if (status === 1) {
      return {
        text: '已认证',
        color: 'success' as const
      }
    }
    return {
      text: '未认证',
      color: 'default' as const
    }
  }

  // ========== 页面跳转处理 ==========
  // const handleNavigate = (path: string) => {
  //   router.push(path)
  // }

  // ========== 加载状态 ==========
  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'grey.50'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={64} sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            加载中...
          </Typography>
        </Box>
      </Box>
    )
  }

  // ========== 错误状态 ==========
  if (error || !cpInfo) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'grey.50'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            {error || '数据加载失败'}
          </Typography>
          <Button 
            variant="contained"
            onClick={() => window.location.reload()}
          >
            重新加载
          </Button>
        </Box>
      </Box>
    )
  }

  const verifyStatus = getVerifyStatus(cpInfo.verify_status)

  const drawerWidth = 240;

  // ========== 主页面渲染 ==========
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
        {/* 左侧导航栏 */}

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
              <ListItem disablePadding>
                <ListItemButton href='/games'>
                  <ListItemText primary="Game Management" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton href='/cp-materials'>
                  <ListItemText primary="Materials" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>

        {/* 右侧主内容 */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ maxWidth: 'lg', mx: 'auto' }}>
            {/* 厂商基本信息卡片 */}
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
              {/* 卡片头部 */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" component="h2" fontWeight="semibold">
                  厂商基本信息
                </Typography>
                
                {/* 认证状态标签 */}
                <Chip 
                  label={verifyStatus.text}
                  color={verifyStatus.color}
                  size="small"
                />
              </Box>

              {/* 信息表单 */}
              <Grid container spacing={3}>
                {/* 第一行：厂商名称 + 联系邮箱 */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="厂商名称"
                    value={cpInfo.cp_name}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                  />
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="联系邮箱"
                    value={cpInfo.contact_email || '--'}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                  />
                </Grid>

                {/* 第二行：厂商名称值 + 邮箱地址 */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="厂商名称值"
                    value={cpInfo.cp_name}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                  />
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="邮箱地址"
                    value={cpInfo.mailing_address || '--'}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                  />
                </Grid>

                {/* 第三行：联系电话 + 电话号码 */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="联系电话"
                    value={cpInfo.contact_phone || '--'}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                  />
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="电话号码"
                    value={cpInfo.phone_number || '--'}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                  />
                </Grid>

                {/* 第四行：注册时间 + 注册日期 */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="注册时间"
                    value={formatDate(cpInfo.register_time)}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                  />
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="注册日期"
                    value={formatDate(cpInfo.registration_date)}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                  />
                </Grid>

                {/* LOGO 上传区域 */}
                <Grid size={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    厂商LOGO
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    {/* LOGO 预览 */}
                    <Card 
                      variant="outlined"
                      sx={{ 
                        width: 128, 
                        height: 128,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed',
                        borderColor: 'grey.300',
                        bgcolor: 'grey.50'
                      }}
                    >
                      {cpInfo.cp_icon ? (
                        <Avatar
                          src={cpInfo.cp_icon} 
                          alt="厂商LOGO"
                          variant="square"
                          sx={{ width: '100%', height: '100%' }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          LOGO
                        </Typography>
                      )}
                    </Card>
                    
                    {/* 品牌标识说明 */}
                    <Card 
                      variant="outlined"
                      sx={{ 
                        flex: 1,
                        minHeight: 128,
                        bgcolor: 'grey.50'
                      }}
                    >
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          当前使用的品牌标识
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Box>
      </Box>
  )
}