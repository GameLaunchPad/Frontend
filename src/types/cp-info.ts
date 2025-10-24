// src/types/cp-info.ts

/**
 * Provider Information
 * Corresponds to backend gp_cp table data structure
 */
export interface CPInfo {
  cp_id: string              // Provider ID
  cp_name: string            // Provider Name
  business_license?: string  // Business License Number
  contact_email?: string     // Contact Email
  mailing_address?: string   // Mailing Address
  contact_phone?: string     // Contact Phone
  phone_number?: string      // Phone Number
  website?: string           // Website
  introduction?: string      // Company Introduction
  cp_icon?: string          // Provider Icon/Logo
  verify_status: number      // Verification Status: 0-Unverified, 1-Verified
  register_time?: number     // Register Time (timestamp)
  registration_date?: number // Registration Date (timestamp)
}

/**
 * Verification Status Enum
 * Makes status values more readable
 */
export enum VerifyStatus {
  Unverified = 0,  // Unverified
  Verified = 1     // Verified
}

/**
 * API Response Format
 */
export interface ApiResponse<T> {
  code: number
  message: string
  data?: T
}