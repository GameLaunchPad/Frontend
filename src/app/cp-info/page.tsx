'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCPInfo } from '@/services/api'
import type { CPInfo } from '@/types/cp-info'

export default function CPInfoPage() {
  // ========== 状态管理 ==========
  // 用 useState 存储数据，这样数据变化时页面会自动更新
  const [cpInfo, setCpInfo] = useState<CPInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // useRouter 用于页面跳转
  const router = useRouter()

  // ========== 数据获取 ==========
  // useEffect 在组件加载时自动执行
  useEffect(() => {
    const loadCPInfo = async () => {
      try {
        setLoading(true)
        // 这里硬编码一个厂商ID，实际应该从登录状态获取
        const response = await getCPInfo('cp_123')
        
        if (response.code === 0 && response.data) {
          setCpInfo(response.data)
        } else {
          setError('获取厂商信息失败')
        }
      } catch (err) {
        setError('网络错误，请稍后重试')
        console.error('加载厂商信息失败:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCPInfo()
  }, []) // 空数组表示只在组件首次加载时执行

  // ========== 工具函数 ==========
  // 格式化时间戳为可读日期
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '--'
    return new Date(timestamp).toLocaleDateString('zh-CN')
  }

  // 获取认证状态的显示文本和样式
  const getVerifyStatus = (status: number) => {
    if (status === 1) {
      return {
        text: '已认证',
        className: 'bg-green-100 text-green-800'
      }
    }
    return {
      text: '未认证',
      className: 'bg-gray-100 text-gray-800'
    }
  }

  // ========== 页面跳转处理 ==========
  const handleNavigate = (path: string) => {
    router.push(path)
  }

  // ========== 加载状态 ==========
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  // ========== 错误状态 ==========
  if (error || !cpInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || '数据加载失败'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  const verifyStatus = getVerifyStatus(cpInfo.verify_status)

  // ========== 主页面渲染 ==========
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          {/* 左侧：Logo + 标题 */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs text-gray-500">LOGO</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">GameLaunchPad</h1>
          </div>
          
          {/* 右侧：厂商名称 */}
          <div className="px-4 py-2 bg-gray-100 rounded-md">
            <span className="text-sm text-gray-700">{cpInfo.cp_name}</span>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex">
        {/* 左侧导航栏 */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-500 mb-4">侧边导航</h2>
            
            <nav className="space-y-2">
              {/* 游戏管理按钮 */}
              <button
                onClick={() => handleNavigate('/game-management')}
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300 transition-colors"
              >
                游戏管理
              </button>
              
              {/* 资质材料按钮 */}
              <button
                onClick={() => handleNavigate('/cp-materials')}
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300 transition-colors"
              >
                资质材料
              </button>
            </nav>
          </div>
        </aside>

        {/* 右侧主内容 */}
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            {/* 厂商基本信息卡片 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* 卡片头部 */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">厂商基本信息</h2>
                
                {/* 认证状态标签 */}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${verifyStatus.className}`}>
                  {verifyStatus.text}
                </span>
              </div>

              {/* 信息表单 */}
              <div className="space-y-6">
                {/* 第一行：厂商名称 + 联系邮箱 */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      厂商名称
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                      {cpInfo.cp_name}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      联系邮箱
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                      {cpInfo.contact_email || '--'}
                    </div>
                  </div>
                </div>

                {/* 第二行：厂商名称值 + 邮箱地址 */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      厂商名称值
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                      {cpInfo.cp_name}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      邮箱地址
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                      {cpInfo.mailing_address || '--'}
                    </div>
                  </div>
                </div>

                {/* 第三行：联系电话 + 电话号码 */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      联系电话
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                      {cpInfo.contact_phone || '--'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      电话号码
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                      {cpInfo.phone_number || '--'}
                    </div>
                  </div>
                </div>

                {/* 第四行：注册时间 + 注册日期 */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      注册时间
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                      {formatDate(cpInfo.register_time)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      注册日期
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                      {formatDate(cpInfo.registration_date)}
                    </div>
                  </div>
                </div>

                {/* LOGO 上传区域 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    厂商LOGO
                  </label>
                  <div className="flex items-start gap-4">
                    {/* LOGO 预览 */}
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
                      {cpInfo.cp_icon ? (
                        <img 
                          src={cpInfo.cp_icon} 
                          alt="厂商LOGO" 
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <span className="text-sm text-gray-400">LOGO</span>
                      )}
                    </div>
                    
                    {/* 品牌标识说明 */}
                    <div className="flex-1">
                      <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-600 text-sm min-h-[128px]">
                        当前使用的品牌标识
                      </div>
                    </div>
                  </div>
                  
                  
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}