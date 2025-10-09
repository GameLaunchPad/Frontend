// src/types/cp-info.ts

/**
 * 厂商基本信息
 * 对应后端 gp_cp 表的数据结构
 */
export interface CPInfo {
  cp_id: string              // 厂商ID
  cp_name: string            // 厂商名称
  contact_email?: string     // 联系邮箱
  mailing_address?: string   // 邮箱地址
  contact_phone?: string     // 联系电话
  phone_number?: string      // 电话号码
  cp_icon?: string          // 厂商LOGO
  verify_status: number      // 认证状态：0-未认证，1-已认证
  register_time?: number     // 注册时间（时间戳）
  registration_date?: number // 注册日期（时间戳）
}

/**
 * 认证状态枚举
 * 让状态值更易读
 */
export enum VerifyStatus {
  Unverified = 0,  // 未认证
  Verified = 1     // 已认证
}

/**
 * API 响应格式
 */
export interface ApiResponse<T> {
  code: number
  message: string
  data?: T
}