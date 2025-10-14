// src/utils/mock.ts

import type { ApiResponse } from '@/types/common'

export const mockDelay = (ms: number = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const mockSuccess = <T>(data: T): ApiResponse<T> => {
  return {
    data,
    base_resp: {
      code: '0',      // 字符串类型
      msg: 'success',
    },
  }
}

export const mockError = (message: string): ApiResponse<never> => {
  return {
    base_resp: {
      code: '-1',
      msg: message,
    },
  }
}