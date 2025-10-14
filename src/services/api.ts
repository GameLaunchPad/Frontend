// src/services/api.ts

import type { 
  CreateCPMaterialRequest,
  CreateCPMaterialResponse,
  UpdateCPMaterialRequest,
  UpdateCPMaterialResponse,
  ReviewCPMaterialRequest,
  ReviewCPMaterialResponse,
  GetCPMaterialResponse,
  CPMaterial,
  // MaterialStatus
} from '@/types/cp-materials'

// 单独导入 enum（因为它会被当作值使用）
import { MaterialStatus } from '@/types/cp-materials'

import type { CPInfo } from '@/types/cp-info'
import type { ApiResponse } from '@/types/common'
import { mockDelay, mockSuccess } from '@/utils/mock'

// ========== 配置 ==========
const USE_MOCK = true
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// ========== 工具函数 ==========

async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('❌ API 请求失败:', error)
    return {
      base_resp: {
        code: '-1',
        msg: error instanceof Error ? error.message : '网络错误',
      },
    }
  }
}

// ========== CP 材料相关 API ==========

/**
 * 创建厂商材料
 * POST /api/v1/cp/materials
 */
export async function createCPMaterial(
  request: CreateCPMaterialRequest
): Promise<CreateCPMaterialResponse> {
  if (USE_MOCK) {
    await mockDelay(800)
    console.log('📤 [Mock] CreateCPMaterial:', request)
    
    return mockSuccess({
      cp_id: 'cp_' + Date.now(),
      material_id: 'material_' + Date.now(),
    })
  }

  return apiFetch(`${API_BASE_URL}/api/v1/cp/materials`, {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

/**
 * 更新厂商材料
 * PUT /api/v1/cp/materials/:id
 */
export async function updateCPMaterial(
  request: UpdateCPMaterialRequest
): Promise<UpdateCPMaterialResponse> {
  if (USE_MOCK) {
    await mockDelay(600)
    console.log('📤 [Mock] UpdateCPMaterial:', request)
    return mockSuccess(undefined)
  }

  return apiFetch(
    `${API_BASE_URL}/api/v1/cp/materials/${request.material_id}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        cp_material: request.cp_material,
        submit_mode: request.submit_mode,
      }),
    }
  )
}

/**
 * 审核厂商材料（管理员）
 * POST /api/v1/cp/materials/review
 */
export async function reviewCPMaterial(
  request: ReviewCPMaterialRequest
): Promise<ReviewCPMaterialResponse> {
  if (USE_MOCK) {
    await mockDelay(1000)
    console.log('📤 [Mock] ReviewCPMaterial:', request)
    return mockSuccess(undefined)
  }

  return apiFetch(`${API_BASE_URL}/api/v1/cp/materials/review`, {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

/**
 * 获取厂商材料
 * GET /api/v1/cp/materials/:id?cp_id=xxx
 */
export async function getCPMaterial(
  materialId: string,
  cpId: string
): Promise<GetCPMaterialResponse> {
  if (USE_MOCK) {
    await mockDelay(500)
    console.log('📥 [Mock] GetCPMaterial:', { materialId, cpId })

    const mockData: CPMaterial = {
      material_id: materialId,
      cp_id: cpId,
      cp_icon: 'https://via.placeholder.com/150',
      cp_name: '示例游戏公司',
      verification_images: [
        'https://via.placeholder.com/400x300',
        'https://via.placeholder.com/400x300',
      ],
      business_license: '91310000123456789X',
      website: 'https://example.com',
      status: MaterialStatus.Draft,
      review_comment: '',
      create_time: Date.now() - 86400000,
      modify_time: Date.now(),
    }

    return mockSuccess({ cp_material: mockData })
  }

  // 注意：根据 IDL，materialId 在路径中，cpId 在查询参数中
  return apiFetch(
    `${API_BASE_URL}/api/v1/cp/materials/${materialId}?cp_id=${cpId}`
  )
}

// ========== 文件上传（非 IDL 接口，实际业务需要）==========

export async function uploadFile(
  file: File
): Promise<ApiResponse<{ url: string }>> {
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
    body: formData,
  })

  if (!response.ok) {
    return {
      base_resp: {
        code: '-1',
        msg: `上传失败: ${response.statusText}`,
      },
    }
  }

  return await response.json()
}

// ========== CP 信息（非 IDL 接口）==========

export async function getCPInfo(cpId: string): Promise<ApiResponse<CPInfo>> {
  if (USE_MOCK) {
    await mockDelay(500)
    console.log('📥 [Mock] GetCPInfo:', cpId)

    const mockData: CPInfo = {
      cp_id: cpId,
      cp_name: '示例游戏公司',
      contact_email: 'contact@example.com',
      mailing_address: '北京市朝阳区示例路 123 号',
      contact_phone: '010-12345678',
      phone_number: '13800138000',
      cp_icon: 'https://via.placeholder.com/150',
      verify_status: 1,
      register_time: Date.now() - 86400000 * 90,
      registration_date: Date.now() - 86400000 * 90,
    }

    return mockSuccess(mockData)
  }

  return apiFetch(`${API_BASE_URL}/api/v1/cp/${cpId}`)
}