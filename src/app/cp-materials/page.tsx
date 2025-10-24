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
  Divider
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
    introduction: ''
  })
  
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // 处理文件选择
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return
    
    setUploading(true)
    
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        
        // 验证文件大小（10MB）
        if (file.size > 10 * 1024 * 1024) {
          alert(`文件 ${file.name} 超过 10MB`)
          continue
        }
        
        // 验证文件类型
        const validTypes = ['image/jpeg', 'image/png', 'application/pdf']
        if (!validTypes.includes(file.type)) {
          alert(`文件 ${file.name} 格式不支持`)
          continue
        }
        
        // 上传文件
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
      console.error('上传失败:', error)
      alert('上传失败，请重试')
    } finally {
      setUploading(false)
    }
  }

  // 删除文件
  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  // 提交表单
  const handleSubmit = async (mode: SubmitMode) => {
    // 验证必填字段
    if (!formData.cpName) {
      alert('请输入厂商名称')
      return
    }
    if (!formData.businessLicense) {
      alert('请输入营业执照号')
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
        const action = mode === SubmitMode.SubmitDraft ? '保存草稿' : '提交审核'
        alert(`${action}成功！`)
        console.log('Material ID:', response.data?.material_id)
      } else {
        alert(`操作失败: ${response.message}`)
      }
    } catch (error) {
      console.error('提交失败:', error)
      alert('提交失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Box sx={{ maxWidth: 'xl', mx: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          上传审核材料/提交审核
        </Typography>
        
        <Paper elevation={1} sx={{ borderRadius: 2 }}>
          {/* 顶部按钮栏 */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 3, 
            borderBottom: 1, 
            borderColor: 'divider' 
          }}>
            <Button variant="outlined" color="primary">
              资质材料管理
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined"
                onClick={() => handleSubmit(SubmitMode.SubmitDraft)}
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={16} /> : null}
              >
                {submitting ? '处理中...' : '保存草稿'}
              </Button>
              <Button variant="outlined" color="primary">
                查看历史
              </Button>
              <Button 
                variant="contained"
                onClick={() => handleSubmit(SubmitMode.SubmitReview)}
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
              >
                {submitting ? '提交中...' : '提交审核'}
              </Button>
            </Box>
          </Box>

          {/* 表单内容 */}
          <Box sx={{ p: 3 }}>
            <Box component="form" onSubmit={(e) => e.preventDefault()}>
              <Grid container spacing={3}>
                {/* 厂商名称 + 营业执照号 */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="厂商名称"
                    value={formData.cpName}
                    onChange={(e) => setFormData({...formData, cpName: e.target.value})}
                    placeholder="请输入厂商名称"
                    required
                    helperText="* 必填字段"
                  />
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="营业执照号"
                    value={formData.businessLicense}
                    onChange={(e) => setFormData({...formData, businessLicense: e.target.value})}
                    placeholder="请输入营业执照号"
                    required
                    helperText="* 必填字段"
                  />
                </Grid>

                {/* 官网地址 */}
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="官网地址"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="请输入官网地址"
                  />
                </Grid>

                {/* 企业简介 */}
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="企业简介"
                    multiline
                    rows={5}
                    value={formData.introduction}
                    onChange={(e) => setFormData({...formData, introduction: e.target.value})}
                    placeholder="请输入企业简介"
                  />
                </Grid>
              </Grid>

              {/* 文件上传区域 */}
              <Grid size={12} sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  资质证明文件
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
                      {uploading ? '上传中...' : '上传文件'}
                    </Button>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      点击上传或拖拽文件到此区域
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      支持 JPG、PNG、PDF 格式，单个文件不超过 10MB
                    </Typography>
                  </CardContent>
                </Card>
                
                {/* 已上传文件列表 */}
                {files.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      已上传文件 ({files.length})
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
                                  删除
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
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}