// src/utils/gameLocalStorage.ts

/**
 * Local Storage 工具类
 * 用于管理游戏创建表单数据的本地缓存
 */

export interface GameFormData {
  gameName: string
  gameIntro: string
  gameType: string
  avatarSrc: string
  headerImage: string  // 头图 base64
  platforms: {
    android: boolean
    ios: boolean
    web: boolean
  }
  platformConfigs: {
    androidPackageName?: string
    androidDownloadUrl?: string
    iosPackageName?: string
    iosDownloadUrl?: string
    webUrl?: string
  }
  screenshots: string[]  // base64 图片数组
  savedAt?: number  // 保存时间戳
}

const GAME_STORAGE_KEY = 'game_form_data'

/**
 * 保存游戏表单数据到 Local Storage
 */
export function saveGameFormData(data: GameFormData): void {
  try {
    const jsonData = JSON.stringify(data)
    localStorage.setItem(GAME_STORAGE_KEY, jsonData)
    console.log('✅ 游戏表单数据已保存到 Local Storage')
  } catch (error) {
    console.error('❌ 保存到 Local Storage 失败:', error)
  }
}

/**
 * 从 Local Storage 读取游戏表单数据
 */
export function loadGameFormData(): GameFormData | null {
  try {
    const jsonData = localStorage.getItem(GAME_STORAGE_KEY)
    if (!jsonData) {
      return null
    }
    
    const data = JSON.parse(jsonData) as GameFormData
    console.log('✅ 从 Local Storage 加载游戏表单数据')
    return data
  } catch (error) {
    console.error('❌ 从 Local Storage 读取失败:', error)
    return null
  }
}

/**
 * 清除 Local Storage 中的游戏表单数据
 */
export function clearGameFormData(): void {
  try {
    localStorage.removeItem(GAME_STORAGE_KEY)
    console.log('✅ 已清除 Local Storage 中的游戏表单数据')
  } catch (error) {
    console.error('❌ 清除 Local Storage 失败:', error)
  }
}

