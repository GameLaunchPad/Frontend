// src/types/common.ts

/**
 * 基础响应（对应 common.thrift）
 */
export interface BaseResp {
  code: string    // IDL 中是 string 类型
  msg: string
}

/**
 * 标准 API 响应格式
 * 所有接口都遵循这个格式：{ data?, base_resp }
 */
export interface ApiResponse<T = void> {
  data?: T
  base_resp: BaseResp
}

/**
 * 审核备注
 */
export interface ReviewRemark {
  remark: string
  operator: string
  review_time: number
  meta: string
}

/**
 * 审核结果
 */
export enum ReviewResult {
  Unset = 0,
  Pass = 1,
  Reject = 2
}