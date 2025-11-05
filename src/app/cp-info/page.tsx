'use client'

import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
import { getCPInfo } from '@/services/api'
import type { CPInfo } from '@/types/cp-info'
import { loadCPMaterialData, ReviewStatus } from '@/utils/cpLocalStorage'
import { 
  Box, 
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
  Divider,
  InputAdornment
} from '@mui/material'
import { 
  Business, 
  Description, 
  VerifiedUser,
  ContactMail,
  Phone,
  Language,
  LocationOn,
  CalendarToday,
  Sync,
  Edit
} from '@mui/icons-material'

export default function CPInfoPage() {
  // State Management
  const [cpInfo, setCpInfo] = useState<CPInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [materialReviewStatus, setMaterialReviewStatus] = useState<ReviewStatus>(ReviewStatus.Draft)
  
  // useRouter for navigation
  // const router = useRouter()

  // Data Fetching - Initial load
  useEffect(() => {
    const loadCPInfo = async () => {
      try {
        setLoading(true)
        
        // 1. Load from localStorage first (from cp-materials page)
        const localData = loadCPMaterialData()
        
        // 2. Fetch from API
        const response = await getCPInfo('cp_123')
        
        if (response.code === 0 && response.data) {
          // 3. Merge localStorage data with API data (localStorage takes priority for edited fields)
          const mergedData: CPInfo = {
            ...response.data,
            // Override with localStorage data if available
            ...(localData && {
              cp_name: localData.cpName || response.data.cp_name,
              business_license: localData.businessLicense || response.data.business_license,
              website: localData.website || response.data.website,
              introduction: localData.introduction || response.data.introduction,
              cp_icon: localData.cpIcon || response.data.cp_icon,
              contact_email: localData.contactEmail || response.data.contact_email,
              contact_phone: localData.contactPhone || response.data.contact_phone,
              mailing_address: localData.mailingAddress || response.data.mailing_address,
              // Add verify_status based on material review status
              verify_status: (localData.reviewStatus === ReviewStatus.Approved) ? 1 : 0
            })
          }
          setCpInfo(mergedData)
          // 同步审核状态
          if (localData) {
            setMaterialReviewStatus(localData.reviewStatus || ReviewStatus.Draft)
          }
          console.log('📦 Loaded data from localStorage and API')
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
  
  // Auto-sync with localStorage changes
  useEffect(() => {
    // Listen to localStorage changes (from other tabs or pages)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cp_material_form_data') {
        console.log('📦 LocalStorage changed from another tab')
        setIsSyncing(true)
        const localData = loadCPMaterialData()
        if (localData && cpInfo) {
          setCpInfo(prev => prev ? {
            ...prev,
            cp_name: localData.cpName || prev.cp_name,
            business_license: localData.businessLicense || prev.business_license,
            website: localData.website || prev.website,
            introduction: localData.introduction || prev.introduction,
            cp_icon: localData.cpIcon || prev.cp_icon,
            contact_email: localData.contactEmail || prev.contact_email,
            contact_phone: localData.contactPhone || prev.contact_phone,
            mailing_address: localData.mailingAddress || prev.mailing_address,
            verify_status: (localData.reviewStatus === ReviewStatus.Approved) ? 1 : 0
          } : null)
          // 同步审核状态
          setMaterialReviewStatus(localData.reviewStatus || ReviewStatus.Draft)
        }
        setTimeout(() => setIsSyncing(false), 1000)
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Poll localStorage every 2 seconds for same-tab updates
    const pollInterval = setInterval(() => {
      const localData = loadCPMaterialData()
      if (localData && cpInfo) {
        setCpInfo(prev => {
          if (!prev) return null
          const updated = {
            ...prev,
            cp_name: localData.cpName || prev.cp_name,
            business_license: localData.businessLicense || prev.business_license,
            website: localData.website || prev.website,
            introduction: localData.introduction || prev.introduction,
            cp_icon: localData.cpIcon || prev.cp_icon,
            contact_email: localData.contactEmail || prev.contact_email,
            contact_phone: localData.contactPhone || prev.contact_phone,
            mailing_address: localData.mailingAddress || prev.mailing_address,
            verify_status: (localData.reviewStatus === ReviewStatus.Approved) ? 1 : 0
          }
          // Only update if data actually changed
          if (JSON.stringify(updated) !== JSON.stringify(prev)) {
            console.log('📦 Auto-synced from localStorage')
            setIsSyncing(true)
            setTimeout(() => setIsSyncing(false), 1000)
            // 同步审核状态
            setMaterialReviewStatus(localData.reviewStatus || ReviewStatus.Draft)
            return updated
          }
          return prev
        })
      }
    }, 2000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(pollInterval)
    }
  }, [cpInfo])

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
  
  // Get material review status display text and style
  const getMaterialReviewStatus = () => {
    switch (materialReviewStatus) {
      case ReviewStatus.Draft:
        return { text: 'Draft', color: 'default' as const, bgcolor: 'grey.200' }
      case ReviewStatus.Reviewing:
        return { text: 'Under Review', color: 'warning' as const, bgcolor: 'warning.light' }
      case ReviewStatus.Approved:
        return { text: 'Approved', color: 'success' as const, bgcolor: 'success.light' }
      case ReviewStatus.Rejected:
        return { text: 'Rejected', color: 'error' as const, bgcolor: 'error.light' }
      default:
        return { text: 'Draft', color: 'default' as const, bgcolor: 'grey.200' }
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

  // Main Page Render
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
        {/* Left Navigation Bar */}
        

        {/* Right Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
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
                <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 3,
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Business sx={{ fontSize: 48, color: 'white' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography 
                          variant="h4" 
                          component="h1" 
                          sx={{ 
                            fontWeight: 700,
                            letterSpacing: '-0.5px'
                          }}
                        >
                          Provider Information
                        </Typography>
                        <Chip 
                          icon={<VerifiedUser />}
                          label={verifyStatus.text}
                          sx={{
                            bgcolor: verifyStatus.color === 'success' 
                              ? 'rgba(76, 175, 80, 0.3)' 
                              : 'rgba(255, 152, 0, 0.3)',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            px: 2,
                            py: 0.5,
                            border: '2px solid',
                            borderColor: verifyStatus.color === 'success' 
                              ? 'rgba(129, 199, 132, 0.8)' 
                              : 'rgba(255, 183, 77, 0.8)',
                            boxShadow: verifyStatus.color === 'success'
                              ? '0 4px 12px rgba(76, 175, 80, 0.4)'
                              : '0 4px 12px rgba(255, 152, 0, 0.4)',
                            '& .MuiChip-icon': {
                              color: 'white',
                              fontSize: '1.2rem'
                            }
                          }}
                        />
                        {/* 材料审核状态 */}
                        <Chip
                          label={`Material: ${getMaterialReviewStatus().text}`}
                          sx={{
                            bgcolor: materialReviewStatus === ReviewStatus.Approved
                              ? 'rgba(76, 175, 80, 0.3)'  // 绿色 - 通过
                              : materialReviewStatus === ReviewStatus.Rejected
                              ? 'rgba(244, 67, 54, 0.3)'  // 红色 - 拒绝
                              : materialReviewStatus === ReviewStatus.Reviewing
                              ? 'rgba(255, 152, 0, 0.3)'  // 橙色 - 审核中
                              : 'rgba(255, 255, 255, 0.3)',  // 白色半透明 - 草稿
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            px: 2,
                            py: 0.5,
                            border: '2px solid',
                            borderColor: materialReviewStatus === ReviewStatus.Approved
                              ? 'rgba(129, 199, 132, 0.8)'  // 绿色边框
                              : materialReviewStatus === ReviewStatus.Rejected
                              ? 'rgba(239, 83, 80, 0.8)'  // 红色边框
                              : materialReviewStatus === ReviewStatus.Reviewing
                              ? 'rgba(255, 183, 77, 0.8)'  // 橙色边框
                              : 'rgba(255, 255, 255, 0.5)',  // 白色边框
                            boxShadow: materialReviewStatus === ReviewStatus.Approved
                              ? '0 4px 12px rgba(76, 175, 80, 0.4)'  // 绿色阴影
                              : materialReviewStatus === ReviewStatus.Rejected
                              ? '0 4px 12px rgba(244, 67, 54, 0.4)'  // 红色阴影
                              : materialReviewStatus === ReviewStatus.Reviewing
                              ? '0 4px 12px rgba(255, 152, 0, 0.4)'  // 橙色阴影
                              : '0 4px 12px rgba(0, 0, 0, 0.2)'  // 默认阴影
                          }}
                        />
                      </Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          opacity: 0.95,
                          fontWeight: 400 
                        }}
                      >
                        View and manage your company profile and verification status
                      </Typography>
                    </Box>
                    {/* Sync Indicator and Edit Button */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                      {isSyncing && (
                        <Chip
                          icon={<Sync sx={{ animation: 'spin 1s linear infinite', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }} />}
                          label="Syncing..."
                          size="small"
                          sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            fontWeight: 600,
                            border: '1px solid rgba(255, 255, 255, 0.3)'
                          }}
                        />
                      )}
                      <Button
                        variant="contained"
                        startIcon={<Edit />}
                        href="/Frontend/cp-materials"
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          color: 'primary.main',
                          fontWeight: 600,
                          px: 3,
                          '&:hover': {
                            bgcolor: 'white'
                          }
                        }}
                      >
                        Edit in Materials
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Provider Information Card */}
            <Paper 
              elevation={2} 
              sx={{ 
                p: 4, 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >

              {/* Basic Information Section */}
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 0.5,
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  🏢 Basic Information
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Company basic details and contact information
                </Typography>
                <Divider sx={{ mb: 3 }} />
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
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      )
                    }}
                    variant="filled"
                    sx={{
                      '& .MuiInputBase-input': {
                        fontWeight: 500
                      }
                    }}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Contact Email"
                    value={cpInfo.contact_email || '--'}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <ContactMail sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      )
                    }}
                    variant="filled"
                    sx={{
                      '& .MuiInputBase-input': {
                        fontWeight: 500
                      }
                    }}
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
                      startAdornment: (
                        <InputAdornment position="start">
                          <Description sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      )
                    }}
                    variant="filled"
                    sx={{
                      '& .MuiInputBase-input': {
                        fontWeight: 500
                      }
                    }}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Contact Phone"
                    value={cpInfo.contact_phone || '--'}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      )
                    }}
                    variant="filled"
                    sx={{
                      '& .MuiInputBase-input': {
                        fontWeight: 500
                      }
                    }}
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
                      startAdornment: (
                        <InputAdornment position="start">
                          <Language sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      )
                    }}
                    variant="filled"
                    sx={{
                      '& .MuiInputBase-input': {
                        fontWeight: 500
                      }
                    }}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Mailing Address"
                    value={cpInfo.mailing_address || '--'}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      )
                    }}
                    variant="filled"
                    sx={{
                      '& .MuiInputBase-input': {
                        fontWeight: 500
                      }
                    }}
                  />
                </Grid>

                {/* Registration Information Section */}
                <Grid size={12}>
                  <Box sx={{ mt: 4, mb: 2 }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 0.5,
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      📅 Registration Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Account registration and verification dates
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                  </Box>
                </Grid>

                {/* Row 4: Register Time + Registration Date */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Register Time"
                    value={formatDate(cpInfo.register_time)}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      )
                    }}
                    variant="filled"
                    sx={{
                      '& .MuiInputBase-input': {
                        fontWeight: 500
                      }
                    }}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Registration Date"
                    value={formatDate(cpInfo.registration_date)}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      )
                    }}
                    variant="filled"
                    sx={{
                      '& .MuiInputBase-input': {
                        fontWeight: 500
                      }
                    }}
                  />
                </Grid>

                {/* Company Introduction Section */}
                <Grid size={12}>
                  <Box sx={{ mt: 4, mb: 2 }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 0.5,
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      📝 Company Introduction
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Brief description about your company
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                  </Box>
                </Grid>

                {/* Company Introduction */}
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Company Introduction"
                    value={cpInfo.introduction || 'No introduction provided'}
                    multiline
                    rows={4}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                    sx={{
                      '& .MuiFilledInput-root': {
                        bgcolor: 'grey.50'
                      },
                      '& .MuiInputBase-input': {
                        fontWeight: 400,
                        lineHeight: 1.6
                      }
                    }}
                  />
                </Grid>

                {/* Provider Icon */}
                <Grid size={12}>
                  <Box sx={{ mt: 4, mb: 2 }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 0.5,
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      🎨 Provider Icon
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Your company brand icon
                  </Typography>
                    <Divider sx={{ mb: 3 }} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                    {/* Icon Preview */}
                    <Avatar
                      src={cpInfo.cp_icon}
                      alt="Provider Icon"
                      variant="rounded"
                      sx={{ 
                        width: 140, 
                        height: 140,
                        bgcolor: 'grey.100',
                        border: '3px solid',
                        borderColor: cpInfo.cp_icon ? 'primary.main' : 'grey.300',
                        boxShadow: cpInfo.cp_icon ? 3 : 0,
                        transition: 'all 0.3s ease'
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
                        minHeight: 140,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <CardContent sx={{ width: '100%' }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          Brand Icon Status
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {cpInfo.cp_icon 
                            ? 'Current brand icon in use. This icon represents your company across the platform.'
                            : 'No brand icon uploaded yet. Upload an icon in the Materials section to enhance your brand presence.'
                          }
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Chip 
                            label={cpInfo.cp_icon ? 'Icon Set' : 'No Icon'}
                            color={cpInfo.cp_icon ? 'success' : 'default'}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
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
