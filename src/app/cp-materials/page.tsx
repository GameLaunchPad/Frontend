'use client'

import { useState } from 'react'
import { createCPMaterial, uploadFile } from '@/services/api'
import { SubmitMode } from '@/types/cp-materials'

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          上传审核材料/提交审核
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* 顶部按钮栏 */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              资质材料管理
            </button>
            
            <div className="flex gap-3">
              <button 
                onClick={() => handleSubmit(SubmitMode.SubmitDraft)}
                disabled={submitting}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '处理中...' : '保存草稿'}
              </button>
              <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                查看历史
              </button>
              <button 
                onClick={() => handleSubmit(SubmitMode.SubmitReview)}
                disabled={submitting}
                className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '提交中...' : '提交审核'}
              </button>
            </div>
          </div>

          {/* 表单内容 */}
          <div className="p-6">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* 厂商名称 + 营业执照号 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    厂商名称 <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    value={formData.cpName}
                    onChange={(e) => setFormData({...formData, cpName: e.target.value})}
                    placeholder="请输入厂商名称"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    营业执照号 <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    value={formData.businessLicense}
                    onChange={(e) => setFormData({...formData, businessLicense: e.target.value})}
                    placeholder="请输入营业执照号"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 官网地址 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  官网地址
                </label>
                <input 
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  placeholder="请输入官网地址"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 企业简介 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  企业简介
                </label>
                <textarea 
                  value={formData.introduction}
                  onChange={(e) => setFormData({...formData, introduction: e.target.value})}
                  placeholder="请输入企业简介"
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* 文件上传区域 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  资质证明文件
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
                  <input 
                    type="file"
                    id="file-upload"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label 
                    htmlFor="file-upload"
                    className="inline-block px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer mb-3"
                  >
                    {uploading ? '上传中...' : '上传'}
                  </label>
                  <p className="text-sm text-gray-600 mb-1">
                    点击上传或拖拽文件到此区域
                  </p>
                  <p className="text-xs text-gray-500">
                    支持 JPG、PNG、PDF 格式，单个文件不超过 10MB
                  </p>
                </div>
                
                {/* 已上传文件列表 */}
                {files.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      已上传文件 ({files.length})
                    </p>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                              <span className="text-blue-600 text-xs font-medium">
                                {file.name.split('.').pop()?.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            删除
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}