// src/types/cp-info.ts

/**
 * 厂商基本信息
 * 注意：这个不在 IDL 中
 */
export interface CPInfo {
  cp_id: string
  cp_name: string
  contact_email?: string
  mailing_address?: string
  contact_phone?: string
  phone_number?: string
  cp_icon?: string
  verify_status: number
  register_time?: number
  registration_date?: number
}

export enum VerifyStatus {
  Unverified = 0,
  Verified = 1
}