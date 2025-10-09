// 模拟 API 延迟
export const mockDelay = (ms: number = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 模拟成功响应
export const mockSuccess = <T>(data: T) => {
  return {
    code: 0,
    message: 'success',
    data
  }
}

// 模拟错误响应
export const mockError = (message: string) => {
  return {
    code: -1,
    message,
    data: null
  }
}