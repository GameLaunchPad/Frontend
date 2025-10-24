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
  // State Management
  const [cpInfo, setCpInfo] = useState<CPInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // useRouter for navigation
  // const router = useRouter()

  // Data Fetching
  useEffect(() => {
    const loadCPInfo = async () => {
      try {
        setLoading(true)
        // Hardcoded provider ID, should get from login state in production
        const response = await getCPInfo('cp_123')
        
        if (response.code === 0 && response.data) {
          setCpInfo(response.data)
        } else {
          setError('Failed to load provider information')
        }
      } catch (err) {
        setError('Network error, please try again later')
        console.error('Failed to load provider info:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCPInfo()
  }, [])

  // Utility Functions
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '--'
    return new Date(timestamp).toLocaleDateString('en-US')
  }

  // Get verification status display text and style
  const getVerifyStatus = (status: number) => {
    if (status === 1) {
      return {
        text: 'Verified',
        color: 'success' as const
      }
    }
    return {
      text: 'Unverified',
      color: 'default' as const
    }
  }

  // Navigation handling
  // const handleNavigate = (path: string) => {
  //   router.push(path)
  // }

  // Loading State
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
            Loading...
          </Typography>
        </Box>
      </Box>
    )
  }

  // Error State
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
            {error || 'Failed to load data'}
          </Typography>
          <Button 
            variant="contained"
            onClick={() => window.location.reload()}
          >
            Reload
          </Button>
        </Box>
      </Box>
    )
  }

  const verifyStatus = getVerifyStatus(cpInfo.verify_status)

  const drawerWidth = 240;

  // Main Page Render
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
        {/* Left Navigation Bar */}

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

        {/* Right Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ maxWidth: 'lg', mx: 'auto' }}>
            {/* Provider Information Card */}
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
              {/* Card Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" component="h2" fontWeight="semibold">
                  Provider Information
                </Typography>
                
                {/* Verification Status */}
                <Chip 
                  label={verifyStatus.text}
                  color={verifyStatus.color}
                  size="small"
                />
              </Box>

              {/* Information Form */}
              <Grid container spacing={3}>
                {/* Row 1: Provider Name + Contact Email */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Provider Name"
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
                    label="Contact Email"
                    value={cpInfo.contact_email || '--'}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                  />
                </Grid>

                {/* Row 2: Business License + Contact Phone */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Business License Number"
                    value={cpInfo.business_license || '--'}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                  />
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Contact Phone"
                    value={cpInfo.contact_phone || '--'}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                  />
                </Grid>

                {/* Row 3: Website + Mailing Address */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Website"
                    value={cpInfo.website || '--'}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                  />
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Mailing Address"
                    value={cpInfo.mailing_address || '--'}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                  />
                </Grid>

                {/* Row 4: Register Time + Registration Date */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Register Time"
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
                    label="Registration Date"
                    value={formatDate(cpInfo.registration_date)}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                  />
                </Grid>

                {/* Company Introduction */}
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Company Introduction"
                    value={cpInfo.introduction || '--'}
                    multiline
                    rows={4}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                  />
                </Grid>

                {/* Provider Icon */}
                <Grid size={12}>
                  <Typography variant="h6" gutterBottom>
                    Provider Icon
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    {/* Icon Preview */}
                    <Avatar
                      src={cpInfo.cp_icon}
                      alt="Provider Icon"
                      variant="rounded"
                      sx={{ 
                        width: 128, 
                        height: 128,
                        bgcolor: 'grey.200',
                        border: '2px solid',
                        borderColor: 'grey.300'
                      }}
                    >
                      {!cpInfo.cp_icon && (
                        <Typography variant="body2" color="text.secondary">
                          No Icon
                        </Typography>
                      )}
                    </Avatar>
                    
                    {/* Brand Description */}
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
                          Current brand icon in use
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