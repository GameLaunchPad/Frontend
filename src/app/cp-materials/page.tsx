'use client'

import { useState } from 'react'
import { createCPMaterial, uploadFile } from '@/services/api'
import { SubmitMode } from '@/types/cp-materials'
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar
} from '@mui/material'
import { CloudUpload, Delete, Description, AttachFile } from '@mui/icons-material'

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
    cpIcon: ''
  })
  
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [iconUploading, setIconUploading] = useState(false)

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
        
        // Upload file
        const response = await uploadFile(file)
        
        if (response.code === 0 && response.data) {
          setFiles(prev => [...prev, {
            name: file.name,
            url: response.data!.url,
            size: file.size
          }])
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
      const response = await uploadFile(file)
      
      if (response.code === 0 && response.data) {
        setFormData(prev => ({...prev, cpIcon: response.data!.url}))
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
        const action = mode === SubmitMode.SubmitDraft ? 'Save Draft' : 'Submit for Review'
        alert(`${action} successful!`)
        console.log('Material ID:', response.data?.material_id)
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

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Box sx={{ maxWidth: 'xl', mx: 'auto' }}>
        {/* Header with Back Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <Button 
            variant="outlined" 
            color="primary"
            href="/cp-info"
          >
            Material Management
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Upload Materials / Submit for Review
          </Typography>
        </Box>
        
        <Paper elevation={1} sx={{ borderRadius: 2 }}>

          {/* Form Content */}
          <Box sx={{ p: 3 }}>
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
                  />
                </Grid>

                {/* Provider Icon Upload */}
                <Grid size={12}>
                  <Typography variant="h6" gutterBottom>
                    Provider Icon
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={formData.cpIcon}
                      alt="Provider Icon"
                      variant="rounded"
                      sx={{ 
                        width: 100, 
                        height: 100,
                        bgcolor: 'grey.200',
                        border: '2px solid',
                        borderColor: 'grey.300'
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
                        variant="outlined"
                        component="label"
                        htmlFor="icon-upload"
                        startIcon={iconUploading ? <CircularProgress size={16} /> : <CloudUpload />}
                        disabled={iconUploading}
                      >
                        {iconUploading ? 'Uploading...' : formData.cpIcon ? 'Change Icon' : 'Upload Icon'}
                      </Button>
                      {formData.cpIcon && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => setFormData(prev => ({...prev, cpIcon: ''}))}
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
                <Typography variant="h6" gutterBottom>
                  Certification Documents
                </Typography>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    border: '2px dashed',
                    borderColor: 'grey.300',
                    textAlign: 'center',
                    p: 6,
                    '&:hover': {
                      borderColor: 'grey.400',
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
                    <Button
                      variant="outlined"
                      component="label"
                      htmlFor="file-upload"
                      startIcon={uploading ? <CircularProgress size={16} /> : <CloudUpload />}
                      disabled={uploading}
                      sx={{ mb: 2 }}
                    >
                      {uploading ? 'Uploading...' : 'Upload Files'}
                    </Button>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Click to upload or drag files to this area
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Supports JPG, PNG, PDF formats, max 10MB per file
                    </Typography>
                  </CardContent>
                </Card>
                
                {/* Uploaded Files List */}
                {files.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Uploaded Files ({files.length})
                    </Typography>
                    <Grid container spacing={2}>
                      {files.map((file, index) => (
                        <Grid size={12} key={index}>
                          <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
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
              justifyContent: 'flex-end', 
              gap: 2, 
              pt: 3,
              borderTop: 1,
              borderColor: 'divider',
              mt: 3
            }}>
              <Button 
                variant="outlined"
                size="large"
                onClick={() => handleSubmit(SubmitMode.SubmitDraft)}
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={16} /> : null}
              >
                {submitting ? 'Processing...' : 'Save Draft'}
              </Button>
              <Button 
                variant="contained"
                size="large"
                onClick={() => handleSubmit(SubmitMode.SubmitReview)}
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
              >
                {submitting ? 'Submitting...' : 'Submit for Review'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}