'use client'

import { useState, useEffect } from 'react'
import { createCPMaterial, uploadFile } from '@/services/api'
import { SubmitMode } from '@/types/cp-materials'
import { 
  saveCPMaterialData, 
  loadCPMaterialData, 
  clearCPMaterialData,
  ReviewStatus
} from '@/utils/cpLocalStorage'
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Paper, 
  TextField, 
  Typography, 
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AlertTitle,
  IconButton,
  Collapse
} from '@mui/material'
import { CloudUpload, Delete, AttachFile, VerifiedUser, ArrowBack, Save, Warning, Close, ErrorOutline } from '@mui/icons-material'

interface UploadedFile {
  name: string
  url: string
  size: number
}

export default function CPMaterialsPage() {
  const [formData, setFormData] = useState({
    cpName: '',
    businessLicense: '',
    website: '',
    introduction: '',
    cpIcon: '',
    contactEmail: '',
    contactPhone: '',
    mailingAddress: ''
  })
  
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [iconUploading, setIconUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)  // 是否已提交审核
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>(ReviewStatus.Draft)  // 审核状态
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)  // 提交成功弹窗
  const [showDraftDialog, setShowDraftDialog] = useState(false)  // 草稿保存成功弹窗
  const [rejectionReason, setRejectionReason] = useState<string | undefined>(undefined)  // 拒绝原因
  const [rejectedAt, setRejectedAt] = useState<number | undefined>(undefined)  // 拒绝时间
  const [showRejectionAlert, setShowRejectionAlert] = useState(true)  // 显示拒绝提示
  
  // 将文件转换为 base64 URL 用于预览
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
  
  // 从 Local Storage 加载数据
  useEffect(() => {
    const savedData = loadCPMaterialData()
    if (savedData) {
      setFormData({
        cpName: savedData.cpName,
        businessLicense: savedData.businessLicense,
        website: savedData.website,
        introduction: savedData.introduction,
        cpIcon: savedData.cpIcon,
        contactEmail: savedData.contactEmail || '',
        contactPhone: savedData.contactPhone || '',
        mailingAddress: savedData.mailingAddress || ''
      })
      setFiles(savedData.files)
      // 如果状态是 Rejected，自动解锁表单以便修改
      const isRejected = savedData.reviewStatus === ReviewStatus.Rejected
      setSubmitted(isRejected ? false : savedData.submitted)
      setReviewStatus(savedData.reviewStatus || ReviewStatus.Draft)
      setRejectionReason(savedData.rejectionReason)
      setRejectedAt(savedData.rejectedAt)
      console.log('📦 已从缓存恢复表单数据', isRejected ? '（被拒绝，表单已解锁）' : '')
    }
  }, [])
  
  // 保存表单数据到 Local Storage（防抖）
  useEffect(() => {
    const timer = setTimeout(() => {
      saveCPMaterialData({
        ...formData,
        files,
        submitted,
        reviewStatus,
        rejectionReason,
        rejectedAt
      })
    }, 500)  // 500ms 防抖
    
    return () => clearTimeout(timer)
  }, [formData, files, submitted, reviewStatus, rejectionReason, rejectedAt])

  // 处理文件选择
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return
    
    setUploading(true)
    
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        
        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} exceeds 10MB`)
          continue
        }
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'application/pdf']
        if (!validTypes.includes(file.type)) {
          alert(`File ${file.name} format is not supported`)
          continue
        }
        
        // Convert file to base64 for preview (for images)
        let previewUrl = ''
        if (file.type.startsWith('image/')) {
          previewUrl = await convertFileToBase64(file)
        }
        
        // Upload file to server
        const response = await uploadFile(file)
        
        if (response.code === 0 && response.data) {
          setFiles(prev => [...prev, {
            name: file.name,
            url: previewUrl || response.data!.url, // Use base64 for images, server URL for others
            size: file.size
          }])
          console.log(`✅ File uploaded: ${file.name} (${file.type.startsWith('image/') ? 'base64 preview' : 'server URL'})`)
        }
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed, please retry')
    } finally {
      setUploading(false)
    }
  }

  // Remove file
  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Handle Icon upload
  const handleIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Icon file size should not exceed 5MB')
      return
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      alert('Only JPG and PNG formats are supported for icons')
      return
    }
    
    setIconUploading(true)
    
    try {
      // Convert file to base64 for local preview
      const base64Url = await convertFileToBase64(file)
      
      // Upload file to server (in production, use the returned URL)
      const response = await uploadFile(file)
      
      if (response.code === 0 && response.data) {
        // Use base64 URL for immediate preview (works in both mock and production)
        setFormData(prev => ({...prev, cpIcon: base64Url}))
        console.log('✅ Icon uploaded successfully (using base64 for preview)')
      }
    } catch (error) {
      console.error('Icon upload failed:', error)
      alert('Icon upload failed, please retry')
    } finally {
      setIconUploading(false)
    }
  }

  // Submit form
  const handleSubmit = async (mode: SubmitMode) => {
    // Validate required fields
    if (!formData.cpName) {
      alert('Please enter provider name')
      return
    }
    if (!formData.businessLicense) {
      alert('Please enter business license number')
      return
    }
    
    setSubmitting(true)
    
    try {
      const response = await createCPMaterial({
        cp_material: {
          cp_name: formData.cpName,
          business_license: formData.businessLicense,
          website: formData.website,
          verification_images: files.map(f => f.url)
        },
        submit_mode: mode
      })
      
      if (response.code === 0) {
        console.log('Material ID:', response.data?.material_id)
        
        // 如果是提交审核，则锁定表单并显示弹窗
        if (mode === SubmitMode.SubmitReview) {
          setSubmitted(true)
          setReviewStatus(ReviewStatus.Reviewing)  // 设置为审核中
          // 清除拒绝相关字段（重新提交时）
          setRejectionReason(undefined)
          setRejectedAt(undefined)
          // 立即保存到 Local Storage
          saveCPMaterialData({
            ...formData,
            files,
            submitted: true,
            submittedAt: Date.now(),
            reviewStatus: ReviewStatus.Reviewing,
            rejectionReason: undefined,
            rejectedAt: undefined
          })
          // 显示提交成功弹窗
          setShowSuccessDialog(true)
        } else {
          // 保存草稿成功
          setShowDraftDialog(true)
        }
      } else {
        alert(`Operation failed: ${response.message}`)
      }
    } catch (error) {
      console.error('Submission failed:', error)
      alert('Submission failed, please retry')
    } finally {
      setSubmitting(false)
    }
  }
  
  // 重置表单（清除缓存）
  const handleReset = () => {
    if (confirm('Are you sure you want to clear all form data and start over?')) {
      setFormData({
        cpName: '',
        businessLicense: '',
        website: '',
        introduction: '',
        cpIcon: '',
        contactEmail: '',
        contactPhone: '',
        mailingAddress: ''
      })
      setFiles([])
      setSubmitted(false)
      setReviewStatus(ReviewStatus.Draft)
      setRejectionReason(undefined)
      setRejectedAt(undefined)
      clearCPMaterialData()
      alert('Form has been reset')
    }
  }
  
  // 重新提交（被拒绝后）
  const handleResubmit = () => {
    setSubmitted(false)  // 解锁表单
    setShowRejectionAlert(true)  // 保持显示提示，提醒用户修改
  }
  
  // 获取审核状态显示文本和样式
  const getReviewStatusInfo = () => {
    switch (reviewStatus) {
      case ReviewStatus.Draft:
        return { text: 'Draft', color: 'default' as const, bgcolor: 'grey.100', borderColor: 'grey.300' }
      case ReviewStatus.Reviewing:
        return { text: 'Under Review', color: 'warning' as const, bgcolor: 'warning.light', borderColor: 'warning.main' }
      case ReviewStatus.Approved:
        return { text: 'Approved', color: 'success' as const, bgcolor: 'success.light', borderColor: 'success.main' }
      case ReviewStatus.Rejected:
        return { text: 'Rejected', color: 'error' as const, bgcolor: 'error.light', borderColor: 'error.main' }
      default:
        return { text: 'Draft', color: 'default' as const, bgcolor: 'grey.100', borderColor: 'grey.300' }
    }
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Box sx={{ maxWidth: 'xl', mx: 'auto' }}>
        {/* Modern Header Section */}
        <Box sx={{ mb: 4 }}>
          {/* Back Button */}
          <Button 
            startIcon={<ArrowBack />}
            variant="text" 
            color="primary"
            href="/cp-info"
            sx={{ mb: 2 }}
          >
            Back to Material Management
          </Button>
          
          {/* Beautiful Title Card */}
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
                  <VerifiedUser sx={{ fontSize: 48, color: 'white' }} />
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
                      CP Verification
                    </Typography>
                    {/* 审核状态徽章 */}
                    <Chip
                      label={getReviewStatusInfo().text}
                      sx={{
                        bgcolor: reviewStatus === ReviewStatus.Rejected 
                          ? 'error.main' 
                          : reviewStatus === ReviewStatus.Approved
                          ? 'success.main'
                          : 'rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        px: 2,
                        py: 0.5,
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
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
                    Complete your content provider verification to unlock full platform access
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Paper 
          elevation={2} 
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          
          {/* Rejection Reason Alert */}
          {reviewStatus === ReviewStatus.Rejected && rejectionReason && showRejectionAlert && (
            <Box sx={{ m: 3, mb: 0 }}>
              <Collapse in={showRejectionAlert}>
                <Alert
                  severity="error"
                  variant="filled"
                  icon={<ErrorOutline sx={{ fontSize: 28 }} />}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => setShowRejectionAlert(false)}
                    >
                      <Close fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{
                    borderRadius: 3,
                    py: 2,
                    px: 3,
                    boxShadow: 6,
                    animation: 'slideDown 0.5s ease-out',
                    '@keyframes slideDown': {
                      from: { opacity: 0, transform: 'translateY(-20px)' },
                      to: { opacity: 1, transform: 'translateY(0)' }
                    }
                  }}
                >
                  <AlertTitle sx={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1
                  }}>
                    <Warning sx={{ fontSize: 24 }} />
                    审核未通过 - Verification Rejected
                  </AlertTitle>
                  <Box sx={{ ml: 4 }}>
                    <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 500 }}>
                      您的材料未通过审核，请根据以下原因进行修改后重新提交：
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: 2,
                        mb: 1.5
                      }}
                    >
                      <Typography variant="body2" sx={{ 
                        color: 'white',
                        fontWeight: 500,
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap'
                      }}>
                        📋 拒绝原因：{rejectionReason}
                      </Typography>
                    </Paper>
                    {rejectedAt && (
                      <Typography variant="caption" sx={{ 
                        opacity: 0.9,
                        display: 'block',
                        mb: 2
                      }}>
                        ⏰ 拒绝时间：{new Date(rejectedAt).toLocaleString('zh-CN')}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleResubmit}
                        sx={{
                          bgcolor: 'white',
                          color: 'error.main',
                          fontWeight: 600,
                          '&:hover': {
                            bgcolor: 'grey.100'
                          }
                        }}
                      >
                        修改并重新提交
                      </Button>
                      <Typography variant="body2" sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 500 
                      }}>
                        💡 点击按钮解锁表单，修改后重新提交审核
                      </Typography>
                    </Box>
                  </Box>
                </Alert>
              </Collapse>
            </Box>
          )}

          {/* Submission Status Alert */}
          {(submitted || reviewStatus === ReviewStatus.Reviewing || reviewStatus === ReviewStatus.Approved) && reviewStatus !== ReviewStatus.Rejected && (
            <Alert 
              severity={reviewStatus === ReviewStatus.Approved ? 'success' : 'info'}
              icon={<VerifiedUser />}
              sx={{ 
                m: 3, 
                mb: 0,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: 28
                }
              }}
              action={
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={handleReset}
                  variant="outlined"
                  sx={{ 
                    borderColor: reviewStatus === ReviewStatus.Approved ? 'success.main' : 'info.main',
                    '&:hover': {
                      borderColor: reviewStatus === ReviewStatus.Approved ? 'success.dark' : 'info.dark',
                      bgcolor: reviewStatus === ReviewStatus.Approved ? 'success.light' : 'info.light'
                    }
                  }}
                >
                  Reset Form
                </Button>
              }
            >
              <Typography variant="body1" fontWeight={600}>
                {reviewStatus === ReviewStatus.Approved 
                  ? '✅ Verification Approved!' 
                  : reviewStatus === ReviewStatus.Reviewing
                  ? '⏳ Under Review'
                  : '✅ Verification Submitted Successfully!'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {reviewStatus === ReviewStatus.Approved
                  ? 'Your materials have been approved. You can now access all platform features.'
                  : reviewStatus === ReviewStatus.Reviewing
                  ? 'Your materials are being reviewed. This process typically takes 3-5 business days.'
                  : 'Your materials have been submitted for review. The form is now locked. Click "Reset Form" to create a new submission.'}
              </Typography>
            </Alert>
          )}

          {/* Form Content */}
          <Box sx={{ p: 4 }}>
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
                📋 Basic Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Please provide your company&apos;s basic information
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Box>
            
            <Box component="form" onSubmit={(e) => e.preventDefault()}>
              <Grid container spacing={3}>
                {/* Provider Name + Business License */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Provider Name"
                    value={formData.cpName}
                    onChange={(e) => setFormData({...formData, cpName: e.target.value})}
                    placeholder="Enter provider name"
                    required
                    helperText="* Required field"
                    disabled={submitted}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Business License Number"
                    value={formData.businessLicense}
                    onChange={(e) => setFormData({...formData, businessLicense: e.target.value})}
                    placeholder="Enter business license number"
                    required
                    helperText="* Required field"
                    disabled={submitted}
                  />
                </Grid>

                {/* Website */}
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="Enter website URL"
                    disabled={submitted}
                  />
                </Grid>

                {/* Contact Email + Contact Phone */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Contact Email"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    placeholder="Enter contact email"
                    disabled={submitted}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Contact Phone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                    placeholder="Enter contact phone"
                    disabled={submitted}
                  />
                </Grid>

                {/* Mailing Address */}
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Mailing Address"
                    value={formData.mailingAddress}
                    onChange={(e) => setFormData({...formData, mailingAddress: e.target.value})}
                    placeholder="Enter mailing address"
                    disabled={submitted}
                  />
                </Grid>

                {/* Introduction */}
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Company Introduction"
                    multiline
                    rows={5}
                    value={formData.introduction}
                    onChange={(e) => setFormData({...formData, introduction: e.target.value})}
                    placeholder="Enter company introduction"
                    disabled={submitted}
                  />
                </Grid>

                {/* Provider Icon Upload */}
                <Grid size={12}>
                  <Box sx={{ mt: 3, mb: 2 }}>
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
                      Upload your company logo or brand icon
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar
                      src={formData.cpIcon}
                      alt="Provider Icon"
                      variant="rounded"
                      sx={{ 
                        width: 120, 
                        height: 120,
                        bgcolor: 'grey.100',
                        border: '3px solid',
                        borderColor: formData.cpIcon ? 'primary.main' : 'grey.300',
                        boxShadow: formData.cpIcon ? 3 : 0,
                        transition: 'all 0.3s ease'
                      }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <input 
                        type="file"
                        id="icon-upload"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleIconChange}
                        style={{ display: 'none' }}
                      />
                      <Button
                        variant="contained"
                        component="label"
                        htmlFor="icon-upload"
                        startIcon={iconUploading ? <CircularProgress size={16} /> : <CloudUpload />}
                        disabled={iconUploading || submitted}
                        sx={{
                          py: 1.2,
                          px: 3,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        {iconUploading ? 'Uploading...' : formData.cpIcon ? 'Change Icon' : 'Upload Icon'}
                      </Button>
                      {formData.cpIcon && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => setFormData(prev => ({...prev, cpIcon: ''}))}
                          disabled={submitted}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600
                          }}
                        >
                          Remove Icon
                        </Button>
                      )}
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Recommended: Square image, JPG or PNG format, max 5MB
                  </Typography>
                </Grid>
              </Grid>

              {/* Certification Files Upload */}
              <Grid size={12} sx={{ mt: 2 }}>
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
                    📄 Certification Documents
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Upload business license, certificates, and other verification documents
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Box>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    border: '3px dashed',
                    borderColor: files.length > 0 ? 'primary.main' : 'grey.300',
                    textAlign: 'center',
                    p: 6,
                    bgcolor: files.length > 0 ? 'primary.50' : 'grey.50',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: submitted ? 'grey.400' : 'primary.main',
                      bgcolor: submitted ? 'grey.50' : 'primary.50',
                    }
                  }}
                >
                  <CardContent>
                    <input 
                      type="file"
                      id="file-upload"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <CloudUpload 
                      sx={{ 
                        fontSize: 64, 
                        color: 'primary.main', 
                        mb: 2,
                        opacity: 0.6 
                      }} 
                    />
                    <Button
                      variant="contained"
                      component="label"
                      htmlFor="file-upload"
                      startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
                      disabled={uploading || submitted}
                      size="large"
                      sx={{ 
                        mb: 2,
                        py: 1.5,
                        px: 4,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '1rem'
                      }}
                    >
                      {uploading ? 'Uploading...' : 'Choose Files to Upload'}
                    </Button>
                    <Typography variant="body1" color="text.primary" gutterBottom fontWeight={500}>
                      Click to upload or drag files to this area
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Supports JPG, PNG, PDF formats • Max 10MB per file
                    </Typography>
                  </CardContent>
                </Card>
                
                {/* Uploaded Files List */}
                {files.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 2
                      }}
                    >
                      📎 Uploaded Files ({files.length})
                    </Typography>
                    <Grid container spacing={2}>
                      {files.map((file, index) => (
                        <Grid size={12} key={index}>
                          <Card 
                            variant="outlined" 
                            sx={{ 
                              bgcolor: 'background.paper',
                              border: '1px solid',
                              borderColor: 'grey.200',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                boxShadow: 2,
                                borderColor: 'primary.main'
                              }
                            }}
                          >
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Chip 
                                    icon={<AttachFile />}
                                    label={file.name.split('.').pop()?.toUpperCase()}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                  />
                                  <Box>
                                    <Typography variant="body2" fontWeight="medium">
                                      {file.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {(file.size / 1024).toFixed(2)} KB
                                    </Typography>
                                  </Box>
                                </Box>
                                <Button
                                  size="small"
                                  color="error"
                                  startIcon={<Delete />}
                                  onClick={() => handleRemoveFile(index)}
                                  disabled={submitted}
                                >
                                  Delete
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Grid>
            </Box>

            {/* Bottom Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2, 
              pt: 4,
              borderTop: '2px solid',
              borderColor: 'divider',
              mt: 5
            }}>
              <Typography variant="body2" color="text.secondary">
                {submitted ? '✅ Form submitted and locked' : '* Required fields must be filled'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="outlined"
                  size="large"
                  onClick={() => handleSubmit(SubmitMode.SubmitDraft)}
                  disabled={submitting || submitted}
                  startIcon={submitting ? <CircularProgress size={20} /> : null}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    minWidth: 150
                  }}
                >
                  {submitting ? 'Processing...' : 'Save Draft'}
                </Button>
                <Button 
                  variant="contained"
                  size="large"
                  onClick={() => handleSubmit(SubmitMode.SubmitReview)}
                  disabled={submitting || submitted}
                  startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <VerifiedUser />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    minWidth: 200,
                    background: submitted ? undefined : 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    boxShadow: submitted ? undefined : 3,
                    '&:hover': {
                      boxShadow: submitted ? undefined : 6,
                    }
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit for Review'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
      
      {/* 提交成功弹窗 */}
      <Dialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'success.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' },
                  '100%': { transform: 'scale(1)' }
                }
              }}
            >
              <VerifiedUser sx={{ fontSize: 48, color: 'success.main' }} />
            </Box>
            <Typography variant="h5" fontWeight={700} color="success.main">
              Submission Successful!
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" paragraph>
              Your verification materials have been successfully submitted for review.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Status:</strong> Under Review
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Our team will review your materials and contact you within 3-5 business days.
            </Typography>
            <Alert severity="info" sx={{ mt: 2, textAlign: 'left' }}>
              <Typography variant="body2">
                You can check the review status on the Provider Information page at any time.
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setShowSuccessDialog(false)}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            href="/cp-info"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
            }}
          >
            View Status
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 草稿保存成功弹窗 */}
      <Dialog
        open={showDraftDialog}
        onClose={() => setShowDraftDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'info.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'bounce 1s ease-in-out',
                '@keyframes bounce': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-10px)' }
                }
              }}
            >
              <Save sx={{ fontSize: 48, color: 'info.main' }} />
            </Box>
            <Typography variant="h5" fontWeight={700} color="info.main">
              Draft Saved!
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" paragraph>
              Your verification materials have been saved as a draft.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Status:</strong> Draft
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              You can continue editing and submit for review when you&apos;re ready.
            </Typography>
            <Alert severity="info" sx={{ mt: 2, textAlign: 'left' }}>
              <Typography variant="body2">
                💡 Your draft is automatically saved. You can access it anytime by returning to this page.
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setShowDraftDialog(false)}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1
            }}
          >
            Continue Editing
          </Button>
          <Button
            variant="contained"
            onClick={() => setShowDraftDialog(false)}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}