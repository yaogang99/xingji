// src/ui/ResourceList.tsx
// 批量出售资源列表组件

import { useState, useRef, useCallback } from 'react'

interface Resource {
  id: string
  name: string
  amount: number
  icon: string
}

interface ResourceListProps {
  resources: Resource[]
  prices: Map<string, number>
  onSellBatch: (resourceId: string, quantity: number) => { sold: number; earned: number; researchGain: number }
}

// 预设批量数量
const PRESET_QUANTITIES = [1, 10, 100, 1000]

export function ResourceList({ resources, prices, onSellBatch }: ResourceListProps) {
  const [longPressing, setLongPressing] = useState<string | null>(null)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const sellIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // 开始长按
  const startLongPress = useCallback((resourceId: string) => {
    longPressTimerRef.current = setTimeout(() => {
      setLongPressing(resourceId)
      // 开始连发
      sellIntervalRef.current = setInterval(() => {
        const resource = resources.find(r => r.id === resourceId)
        if (resource && resource.amount > 0) {
          onSellBatch(resourceId, 1)
        } else {
          stopLongPress()
        }
      }, 100) // 每100ms卖1个
    }, 500) // 按住500ms后开始连发
  }, [resources, onSellBatch])

  // 停止长按
  const stopLongPress = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
    if (sellIntervalRef.current) {
      clearInterval(sellIntervalRef.current)
      sellIntervalRef.current = null
    }
    setLongPressing(null)
  }, [])

  return (
    <div className="resource-list">
      {resources.map(resource => {
        const price = prices.get(resource.id) || 0
        const hasAmount = resource.amount > 0
        
        return (
          <div key={resource.id} className={`resource-item ${!hasAmount ? 'empty' : ''}`}>
            <div className="resource-main">
              <span className="icon">{resource.icon}</span>
              <div className="info">
                <span className="name">{resource.name}</span>
                <span className="amount">{Math.floor(resource.amount).toLocaleString()}</span>
                <span className="price">💰{price.toFixed(0)}/个</span>
              </div>
            </div>
            
            <div className="sell-controls">
              {/* 预设数量按钮 */}
              {PRESET_QUANTITIES.map(qty => (
                <button
                  key={qty}
                  className="sell-btn sell-preset-btn"
                  onClick={() => onSellBatch(resource.id, qty)}
                  disabled={!hasAmount || resource.amount < qty}
                  title={`出售 ${qty >= 1000 ? '全部' : qty} 个`}
                >
                  {qty >= 1000 ? '全部' : qty}
                </button>
              ))}
              
              {/* 长按连续出售按钮 */}
              <button
                className={`sell-longpress-btn ${longPressing === resource.id ? 'active' : ''}`}
                onMouseDown={() => startLongPress(resource.id)}
                onMouseUp={stopLongPress}
                onMouseLeave={stopLongPress}
                onTouchStart={() => startLongPress(resource.id)}
                onTouchEnd={stopLongPress}
                disabled={!hasAmount}
              >
                {longPressing === resource.id ? '出售中...' : '按住连续出售'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
