// src/types/cp-materials.ts

import type { ApiResponse, ReviewRemark, ReviewResult } from './common'

/**
 * 厂商材料
 */
export interface CPMaterial {
  material_id: string
  cp_id: string
  cp_icon: string
  cp_name: string
  verification_images: string[]
  business_license: string
  website: string
  status: MaterialStatus
  review_comment: string
  create_time: number
  modify_time: number
}

/**
 * 材料状态
 */
export enum MaterialStatus {
  Unset = 0,
  Draft = 1,
  Reviewing = 2,
  Online = 3,
  Rejected = 4
}

/**
 * 提交模式
 */
export enum SubmitMode {
  Unset = 0,
  SubmitDraft = 1,
  SubmitReview = 2
}

// ========== API 请求/响应类型 ==========

/**
 * 创建厂商材料
 */
export interface CreateCPMaterialRequest {
  cp_material: Partial<CPMaterial>
  submit_mode: SubmitMode
}

export interface CreateCPMaterialData {
  cp_id: string
  material_id: string
}

export type CreateCPMaterialResponse = ApiResponse<CreateCPMaterialData>

/**
 * 更新厂商材料
 */
export interface UpdateCPMaterialRequest {
  material_id: number
  cp_material: Partial<CPMaterial>
  submit_mode: SubmitMode
}

export type UpdateCPMaterialResponse = ApiResponse<void>

/**
 * 审核厂商材料
 */
export interface ReviewCPMaterialRequest {
  material_id: number
  cp_id: number
  review_result: ReviewResult
  review_remark: ReviewRemark
}

export type ReviewCPMaterialResponse = ApiResponse<void>

/**
 * 获取厂商材料
 */
export interface GetCPMaterialData {
  cp_material: CPMaterial
}

export type GetCPMaterialResponse = ApiResponse<GetCPMaterialData>