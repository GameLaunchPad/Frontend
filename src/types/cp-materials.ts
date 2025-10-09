// 对应文档中的 CPMaterial 结构
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

// 材料状态
export enum MaterialStatus {
  Unset = 0,
  Draft = 1,      // 草稿
  Reviewing = 2,  // 审核中
  Online = 3,     // 已发布
  Rejected = 4    // 已拒绝
}

// 提交模式
export enum SubmitMode {
  Unset = 0,
  SubmitDraft = 1,   // 保存草稿
  SubmitReview = 2   // 提交审核
}

// API 响应格式
export interface ApiResponse<T> {
  code: number
  message: string
  data?: T
}

// 创建材料的请求参数
export interface CreateCPMaterialRequest {
  cp_material: Partial<CPMaterial>
  submit_mode: SubmitMode
}