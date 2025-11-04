// src/utils/localStorage.ts

/**
 * Local Storage 工具类
 * 用于管理厂商材料表单数据的本地缓存
 */

// 审核状态枚举
export enum ReviewStatus {
  Draft = 0,        // 草稿
  Reviewing = 1,    // 审核中
  Approved = 2,     // 已通过
  Rejected = 3      // 已拒绝
}

export interface CPMaterialFormData {
  cpName: string
  businessLicense: string
  website: string
  introduction: string
  cpIcon: string
  contactEmail: string  // 联系邮箱
  contactPhone: string  // 联系电话
  mailingAddress: string  // 邮寄地址
  files: Array<{
    name: string
    url: string
    size: number
  }>
  submitted: boolean  // 标记是否已提交审核
  submittedAt?: number  // 提交时间戳
  reviewStatus: ReviewStatus  // 审核状态
  reviewComment?: string  // 审核备注
  rejectedAt?: number
  rejectionReason?: string
}

const STORAGE_KEY = 'cp_material_form_data'

/**
 * 保存表单数据到 Local Storage
 */
export function saveCPMaterialData(data: CPMaterialFormData): void {
  try {
    const jsonData = JSON.stringify(data)
    localStorage.setItem(STORAGE_KEY, jsonData)
    console.log('✅ 表单数据已保存到 Local Storage')
  } catch (error) {
    console.error('❌ 保存到 Local Storage 失败:', error)
  }
}

/**
 * 从 Local Storage 读取表单数据
 */
export function loadCPMaterialData(): CPMaterialFormData | null {
  try {
    const jsonData = localStorage.getItem(STORAGE_KEY)
    if (!jsonData) {
      return null
    }
    
    const data = JSON.parse(jsonData) as CPMaterialFormData
    console.log('✅ 从 Local Storage 加载表单数据')
    return data
  } catch (error) {
    console.error('❌ 从 Local Storage 读取失败:', error)
    return null
  }
}

/**
 * 清除 Local Storage 中的表单数据
 */
export function clearCPMaterialData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
    console.log('✅ 已清除 Local Storage 中的表单数据')
  } catch (error) {
    console.error('❌ 清除 Local Storage 失败:', error)
  }
}

/**
 * 更新提交状态
 */
export function updateSubmitStatus(submitted: boolean): void {
  const data = loadCPMaterialData()
  if (data) {
    data.submitted = submitted
    if (submitted) {
      data.submittedAt = Date.now()
    }
    saveCPMaterialData(data)
  }
}

