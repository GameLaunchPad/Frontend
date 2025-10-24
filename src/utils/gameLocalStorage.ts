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

// ====== 已发布游戏列表管理 ======

export interface PublishedGame extends GameFormData {
  id: string
  publishedAt: number
  status: 'published' | 'reviewing' | 'draft'
  downloads: number
  rating: number
  version: string
}

const PUBLISHED_GAMES_KEY = 'published_games'

/**
 * 获取所有已发布的游戏列表
 */
export function getPublishedGames(): PublishedGame[] {
  // 检查是否在浏览器环境中
  if (typeof window === 'undefined') {
    console.log('⚠️ 服务端环境，跳过 localStorage 读取')
    return []
  }

  try {
    const jsonData = localStorage.getItem(PUBLISHED_GAMES_KEY)
    if (!jsonData) {
      console.log('ℹ️ localStorage 中没有游戏数据')
      return []
    }
    
    const games = JSON.parse(jsonData) as PublishedGame[]
    console.log('✅ 从 Local Storage 加载游戏列表:', games.length, '个游戏', games)
    return games
  } catch (error) {
    console.error('❌ 从 Local Storage 读取游戏列表失败:', error)
    return []
  }
}

/**
 * 发布游戏（从表单数据创建为已发布游戏）
 */
export function publishGame(formData: GameFormData): PublishedGame {
  console.log('🚀 publishGame 被调用，参数:', formData);
  
  try {
    const games = getPublishedGames()
    console.log('📋 当前已有游戏:', games.length);
    
    const newGame: PublishedGame = {
      ...formData,
      id: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      publishedAt: Date.now(),
      status: 'published',
      downloads: 0,
      rating: 0,
      version: '1.0.0'
    }
    
    console.log('🎮 新游戏对象:', newGame);
    
    games.push(newGame)
    console.log('📦 准备保存的游戏列表:', games);
    
    const jsonString = JSON.stringify(games);
    console.log('💾 JSON 字符串长度:', jsonString.length);
    
    localStorage.setItem(PUBLISHED_GAMES_KEY, jsonString)
    console.log('✅ 游戏已发布到 localStorage:', newGame.gameName);
    
    // 验证保存
    const verification = localStorage.getItem(PUBLISHED_GAMES_KEY);
    console.log('🔍 验证保存结果:', verification ? '成功' : '失败');
    
    return newGame
  } catch (error) {
    console.error('❌ 发布游戏失败:', error)
    throw error
  }
}

/**
 * 更新游戏信息
 */
export function updateGame(gameId: string, updates: Partial<PublishedGame>): void {
  try {
    const games = getPublishedGames()
    const index = games.findIndex(g => g.id === gameId)
    
    if (index !== -1) {
      games[index] = { ...games[index], ...updates }
      localStorage.setItem(PUBLISHED_GAMES_KEY, JSON.stringify(games))
      console.log('✅ 游戏信息已更新:', gameId)
    }
  } catch (error) {
    console.error('❌ 更新游戏失败:', error)
  }
}

/**
 * 删除游戏
 */
export function deleteGame(gameId: string): void {
  try {
    const games = getPublishedGames()
    const filtered = games.filter(g => g.id !== gameId)
    localStorage.setItem(PUBLISHED_GAMES_KEY, JSON.stringify(filtered))
    console.log('✅ 游戏已删除:', gameId)
  } catch (error) {
    console.error('❌ 删除游戏失败:', error)
  }
}

/**
 * 获取所有游戏（包括已发布的和草稿）
 */
export function getAllGames(): PublishedGame[] {
  // 检查是否在浏览器环境中
  if (typeof window === 'undefined') {
    console.log('⚠️ 服务端环境，跳过 localStorage 读取')
    return []
  }

  try {
    const allGames: PublishedGame[] = []
    
    // 1. 获取已发布的游戏
    const publishedData = localStorage.getItem(PUBLISHED_GAMES_KEY)
    if (publishedData) {
      const publishedGames = JSON.parse(publishedData) as PublishedGame[]
      allGames.push(...publishedGames)
      console.log('✅ 加载已发布游戏:', publishedGames.length, '个')
    }
    
    // 2. 获取草稿游戏
    const draftData = localStorage.getItem(GAME_STORAGE_KEY)
    if (draftData) {
      const draft = JSON.parse(draftData) as GameFormData
      // 检查草稿是否已经在已发布列表中
      const draftExists = allGames.some(g => g.gameName === draft.gameName && g.status === 'draft')
      
      if (!draftExists && draft.gameName) {
        // 将草稿转换为游戏对象
        const draftGame: PublishedGame = {
          ...draft,
          id: 'draft_current',
          publishedAt: draft.savedAt || Date.now(),
          status: 'draft',
          downloads: 0,
          rating: 0,
          version: '0.1.0' // 草稿版本
        }
        allGames.push(draftGame)
        console.log('✅ 加载草稿游戏:', draft.gameName)
      }
    }
    
    console.log('📦 总共加载游戏:', allGames.length, '个')
    return allGames
  } catch (error) {
    console.error('❌ 加载游戏失败:', error)
    return []
  }
}

