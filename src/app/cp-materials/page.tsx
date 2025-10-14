'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  createCPMaterial, 
  updateCPMaterial, 
  getCPMaterial 
} from '@/services/api'
import { 
  SubmitMode, 
  MaterialStatus,
  type CPMaterial 
} from '@/types/cp-materials'

export default function CPMaterialsPage() {
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [existingMaterial, setExistingMaterial] = useState<CPMaterial | null>(null)
  
  const [formData, setFormData] = useState({
    cpName: '',
    cpIcon: '',
    businessLicense: '',
    website: '',
    verificationImages: [] as string[],
  })

  const [uploadingIcon, setUploadingIcon] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)

  useEffect(() => {
    loadExistingMaterial()
  }, [])

  const loadExistingMaterial = async () => {
    try {
      setLoading(true)
      // TODO: 从登录状态获取真实的 CP ID 和 Material ID
      const cpId = 'cp_demo'
      const materialId = 'material_demo'
      
      const response = await getCPMaterial(materialId, cpId)
      
      if (response.base_resp.code === '0' && response.data) {
        const material = response.data.cp_material
        setExistingMaterial(material)
        
        if (material.status === MaterialStatus.Draft || 
            material.status === MaterialStatus.Rejected) {
          setFormData({
            cpName: material.cp_name,
            cpIcon: material.cp_icon,
            businessLicense: material.business_license,
            website: material.website,
            verificationImages: material.verification_images,
          })
        }
      }
    } catch (error) {
      console.error('加载材料失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // 模拟文件上传
  const mockUploadFile = async (file: File): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    return `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.name)}`
  }

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('文件超过 5MB')
      return
    }

    setUploadingIcon(true)
    try {
      const url = await mockUploadFile(file)
      setFormData(prev => ({ ...prev, cpIcon: url }))
    } catch (error) {
      alert('上传失败')
    } finally {
      setUploadingIcon(false)
    }
  }

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImages(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        if (file.size > 10 * 1024 * 1024) {
          alert(`文件 ${file.name} 超过 10MB`)
          continue
        }

        const url = await mockUploadFile(file)
        setFormData(prev => ({
          ...prev,
          verificationImages: [...prev.verificationImages, url],
        }))
      }
    } catch (error) {
      alert('上传失败')
    } finally {
      setUploadingImages(false)
      e.target.value = ''
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      verificationImages: prev.verificationImages.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (mode: SubmitMode) => {
    if (!formData.cpName) {
      alert('请输入厂商名称')
      return
    }
    if (!formData.businessLicense) {
      alert('请输入营业执照号')
      return
    }
    if (mode === SubmitMode.SubmitReview && formData.verificationImages.length === 0) {
      alert('提交审核前请至少上传一张资质图片')
      return
    }

    setSubmitting(true)

    try {
      const materialData = {
        cp_name: formData.cpName,
        cp_icon: formData.cpIcon,
        business_license: formData.businessLicense,
        website: formData.website,
        verification_images: formData.verificationImages,
      }

      let response

      if (existingMaterial) {
        response = await updateCPMaterial({
          material_id: parseInt(existingMaterial.material_id),
          cp_material: materialData,
          submit_mode: mode,
        })
      } else {
        response = await createCPMaterial({
          cp_material: materialData,
          submit_mode: mode,
        })
      }

      if (response.base_resp.code === '0') {
        const action = mode === SubmitMode.SubmitDraft ? '保存草稿' : '提交审核'
        alert(`${action}成功！`)
        await loadExistingMaterial()
      } else {
        alert(`操作失败: ${response.base_resp.msg}`)
      }
    } catch (error) {
      console.error('提交失败:', error)
      alert('提交失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  const isEditable = !existingMaterial || 
    existingMaterial.status === MaterialStatus.Draft || 
    existingMaterial.status === MaterialStatus.Rejected

  const getStatusBadge = (status: MaterialStatus) => {
    const config: Record<MaterialStatus, { text: string; className: string }> = {
      [MaterialStatus.Unset]: { text: '未设置', className: 'bg-gray-100 text-gray-800' },
      [MaterialStatus.Draft]: { text: '草稿', className: 'bg-blue-100 text-blue-800' },
      [MaterialStatus.Reviewing]: { text: '审核中', className: 'bg-yellow-100 text-yellow-800' },
      [MaterialStatus.Online]: { text: '已上线', className: 'bg-green-100 text-green-800' },
      [MaterialStatus.Rejected]: { text: '已拒绝', className: 'bg-red-100 text-red-800' },
    }
    const { text, className } = config[status]
    return <span className={`px-3 py-1 rounded-full text-sm font-medium ${className}`}>{text}</span>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {existingMaterial ? '编辑厂商材料' : '创建厂商材料'}
            </h1>
            {existingMaterial && (
              <div className="mt-2">
                {getStatusBadge(existingMaterial.status)}
              </div>
            )}
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            返回
          </button>
        </div>

        {existingMaterial?.status === MaterialStatus.Rejected && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">审核意见</h3>
            <p className="text-red-700">{existingMaterial.review_comment || '无'}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-end gap-3 p-6 border-b border-gray-200">
            <button
              onClick={() => handleSubmit(SubmitMode.SubmitDraft)}
              disabled={submitting || !isEditable}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '处理中...' : '保存草稿'}
            </button>
            <button
              onClick={() => handleSubmit(SubmitMode.SubmitReview)}
              disabled={submitting || !isEditable}
              className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '提交中...' : '提交审核'}
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                厂商名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cpName"
                value={formData.cpName}
                onChange={handleInputChange}
                disabled={!isEditable}
                placeholder="请输入厂商名称"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                营业执照号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="businessLicense"
                value={formData.businessLicense}
                onChange={handleInputChange}
                disabled={!isEditable}
                placeholder="请输入营业执照号"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                官网地址
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                disabled={!isEditable}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                厂商 LOGO
              </label>
              <div className="flex items-start gap-4">
                {formData.cpIcon ? (
                  <div className="relative w-32 h-32 border-2 border-gray-300 rounded-md overflow-hidden">
                    <img
                      src={formData.cpIcon}
                      alt="LOGO"
                      className="w-full h-full object-cover"
                    />
                    {isEditable && (
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, cpIcon: '' }))}
                        className="absolute top-1 right-1 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                      >
                        删除
                      </button>
                    )}
                  </div>
                ) : (
                  isEditable && (
                    <div>
                      <input
                        type="file"
                        id="icon-upload"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleIconUpload}
                        disabled={uploadingIcon}
                        className="hidden"
                      />
                      <label
                        htmlFor="icon-upload"
                        className={`inline-block px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer ${uploadingIcon ? 'opacity-50' : 'hover:bg-gray-50'}`}
                      >
                        {uploadingIcon ? '上传中...' : '选择文件'}
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                资质证明文件
              </label>
              
              {formData.verificationImages.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {formData.verificationImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`资质图片 ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md border border-gray-300"
                      />
                      {isEditable && (
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          删除
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {isEditable && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="images-upload"
                    accept=".jpg,.jpeg,.png,.pdf"
                    multiple
                    onChange={handleImagesUpload}
                    disabled={uploadingImages}
                    className="hidden"
                  />
                  <label
                    htmlFor="images-upload"
                    className={`inline-block px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer ${uploadingImages ? 'opacity-50' : 'hover:bg-gray-50'}`}
                  >
                    {uploadingImages ? '上传中...' : '选择文件'}
                  </label>
                  <p className="text-sm text-gray-600 mt-3">
                    支持 JPG、PNG、PDF 格式，单个文件不超过 10MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}