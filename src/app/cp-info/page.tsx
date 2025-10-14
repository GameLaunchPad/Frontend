'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCPInfo } from '@/services/api'
import type { CPInfo } from '@/types/cp-info'

export default function CPInfoPage() {
  const router = useRouter()
  const [cpInfo, setCpInfo] = useState<CPInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCPInfo()
  }, [])

  const loadCPInfo = async () => {
    try {
      setLoading(true)
      // TODO: 从登录状态获取真实的 CP ID
      const cpId = 'cp_demo'
      
      const response = await getCPInfo(cpId)
      
      if (response.base_resp.code === '0' && response.data) {
        setCpInfo(response.data)
      } else {
        setError(response.base_resp.msg || '获取厂商信息失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
      console.error('加载厂商信息失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '--'
    return new Date(timestamp).toLocaleDateString('zh-CN')
  }

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

  const handleNavigate = (path: string) => {
    router.push(path)
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center text-white font-bold">
              GL
            </div>
            <h1 className="text-xl font-semibold text-gray-900">GameLaunchPad</h1>
          </div>
          
          <div className="px-4 py-2 bg-gray-100 rounded-md">
            <span className="text-sm text-gray-700">{cpInfo.cp_name}</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 左侧导航栏 */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-500 mb-4">功能导航</h2>
            
            <nav className="space-y-2">
              <button
                onClick={() => handleNavigate('/cp-info')}
                className="w-full px-4 py-3 text-left text-white bg-blue-600 rounded-md"
              >
                厂商信息
              </button>
              
              <button
                onClick={() => handleNavigate('/cp-materials')}
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300 transition-colors"
              >
                资质材料
              </button>
              
              <button
                onClick={() => handleNavigate('/game-list')}
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300 transition-colors"
              >
                游戏管理
              </button>
            </nav>
          </div>
        </aside>

        {/* 右侧主内容 */}
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* 卡片头部 */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">厂商基本信息</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${verifyStatus.className}`}>
                  {verifyStatus.text}
                </span>
              </div>

              {/* 信息表单 */}
              <div className="space-y-6">
                {/* 厂商名称 + 联系邮箱 */}
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

                {/* 邮寄地址 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    邮寄地址
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                    {cpInfo.mailing_address || '--'}
                  </div>
                </div>

                {/* 联系电话 + 手机号码 */}
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
                      手机号码
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                      {cpInfo.phone_number || '--'}
                    </div>
                  </div>
                </div>

                {/* 注册时间 */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      注册时间
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                      {formatDate(cpInfo.register_time)}
                    </div>
                  </div>
                </div>

                {/* LOGO 展示 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    厂商 LOGO
                  </label>
                  <div className="flex items-start gap-4">
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
                      {cpInfo.cp_icon ? (
                        <img 
                          src={cpInfo.cp_icon} 
                          alt="厂商LOGO" 
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <span className="text-sm text-gray-400">暂无 LOGO</span>
                      )}
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