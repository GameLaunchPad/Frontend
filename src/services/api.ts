// src/services/api.ts

import type { 
  CPMaterial, 
  CreateCPMaterialRequest, 
  ApiResponse 
} from '@/types/cp-materials'

import type { CPInfo } from '@/types/cp-info'  // ✅ 只导入 CPInfo，不导入 ApiResponse
import { mockDelay, mockSuccess } from '@/utils/mock'

// 配置：是否使用 Mock 数据
const USE_MOCK = true

// API 基础地址
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/**
 * 创建厂商材料
 */
export async function createCPMaterial(
  request: CreateCPMaterialRequest
): Promise<ApiResponse<{ material_id: string }>> {
  if (USE_MOCK) {
    await mockDelay(800)
    console.log('📤 [Mock] 创建材料请求:', request)
    const mockMaterialId = `material_${Date.now()}`
    return mockSuccess({ material_id: mockMaterialId })
  }
  
  const response = await fetch(`${API_BASE_URL}/api/v1/cp-materials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  })
  
  return response.json()
}

/**
 * 获取厂商材料
 */
export async function getCPMaterial(
  cpId: string
): Promise<ApiResponse<CPMaterial>> {
  if (USE_MOCK) {
    await mockDelay(500)
    console.log('📥 [Mock] 获取材料:', cpId)
    
    const mockData: CPMaterial = {
      material_id: 'mock_material_123',
      cp_id: cpId,
      cp_icon: '',
      cp_name: '测试公司',
      verification_images: [],
      business_license: '91310000123456789X',
      website: 'https://example.com',
      status: 1,
      review_comment: '',
      create_time: Date.now(),
      modify_time: Date.now()
    }
    
    return mockSuccess(mockData)
  }
  
  const response = await fetch(
    `${API_BASE_URL}/api/v1/cp-materials?cp_id=${cpId}`
  )
  return response.json()
}

/**
 * 上传文件
 */
export async function uploadFile(file: File): Promise<ApiResponse<{ url: string }>> {
  if (USE_MOCK) {
    await mockDelay(1500)
    console.log('📤 [Mock] 上传文件:', file.name)
    const mockUrl = `https://cdn.example.com/${Date.now()}_${file.name}`
    return mockSuccess({ url: mockUrl })
  }
  
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch(`${API_BASE_URL}/api/v1/upload`, {
    method: 'POST',
    body: formData
  })
  
  return response.json()
}

/**
 * 获取厂商基本信息
 */
export async function getCPInfo(cpId: string): Promise<ApiResponse<CPInfo>> {
  if (USE_MOCK) {
    await mockDelay(500)
    console.log('📥 [Mock] 获取厂商信息:', cpId)
    
    const mockData: CPInfo = {
      cp_id: cpId,
      cp_name: 'example name',
      contact_email: 'contact@example.com',
      mailing_address: 'example address',
      contact_phone: '010-12345678',
      phone_number: '13800138000',
      cp_icon: '',
      verify_status: 0,
      register_time: Date.now() - 86400000 * 30,
      registration_date: Date.now() - 86400000 * 30
    }
    
    return mockSuccess(mockData)
  }
  
  const response = await fetch(`${API_BASE_URL}/api/v1/cp/${cpId}`)
  return response.json()
}