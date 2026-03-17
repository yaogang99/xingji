// src/ui/SaveSlotPanel.tsx
// 存档档位选择界面 - 10档位

import { SaveSystem, SaveSlotInfo } from '../core/SaveSystem'
import { useState, useEffect } from 'react'

interface SaveSlotPanelProps {
  mode: 'load' | 'save' | 'new'    // 加载模式 / 保存模式 / 新游戏模式
  onSelectSlot: (slotIndex: number, exists: boolean) => void
  onBack: () => void
  currentSlotIndex?: number  // 当前使用的档位
}

export function SaveSlotPanel({ mode, onSelectSlot, onBack, currentSlotIndex }: SaveSlotPanelProps) {
  const [slots, setSlots] = useState<SaveSlotInfo[]>([])
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [renameSlot, setRenameSlot] = useState<number | null>(null)
  const [newName, setNewName] = useState('')
  
  useEffect(() => {
    refreshSlots()
  }, [])
  
  const refreshSlots = () => {
    setSlots(SaveSystem.getAllSlots())
  }
  
  const handleSlotClick = (slot: SaveSlotInfo) => {
    setSelectedSlot(slot.index)
  }
  
  const handleConfirm = () => {
    if (selectedSlot !== null) {
      const slot = slots.find(s => s.index === selectedSlot)
      if (slot) {
        onSelectSlot(slot.index, slot.exists)
      }
    }
  }
  
  const handleDelete = () => {
    if (selectedSlot !== null) {
      if (confirm(`确定要删除档位 ${selectedSlot} 的存档吗？`)) {
        SaveSystem.delete(selectedSlot)
        refreshSlots()
        setSelectedSlot(null)
      }
    }
  }
  
  const handleRename = () => {
    if (selectedSlot !== null && newName.trim()) {
      SaveSystem.rename(selectedSlot, newName.trim())
      refreshSlots()
      setRenameSlot(null)
      setNewName('')
    }
  }
  
  const formatTime = (seconds?: number) => {
    if (!seconds) return '0分钟'
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}小时${mins}分钟`
    return `${mins}分钟`
  }
  
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="save-slot-panel">
      <div className="panel-header">
        <button className="back-btn" onClick={onBack}>← 返回</button>
        <h2>
          {mode === 'load' ? '📂 读取存档' : mode === 'new' ? '🎮 选择档位 - 新游戏' : '💾 保存游戏'}
        </h2>
      </div>
      
      <div className="slots-grid">
        {slots.map(slot => (
          <div
            key={slot.index}
            className={`slot-card ${slot.exists ? 'occupied' : 'empty'} ${selectedSlot === slot.index ? 'selected' : ''} ${currentSlotIndex === slot.index ? 'current' : ''}`}
            onClick={() => handleSlotClick(slot)}
          >
            <div className="slot-header">
              <span className="slot-number">档位 {slot.index}</span>
              {currentSlotIndex === slot.index && <span className="current-badge">当前</span>}
            </div>
            
            {slot.exists ? (
              <>
                <div className="slot-name">{slot.name}</div>
                <div className="slot-stats">
                  <span>💰 {slot.credits?.toLocaleString()}</span>
                  <span>🔬 {slot.researchPoints?.toLocaleString()}</span>
                  <span>🏆 {slot.achievementCount}</span>
                </div>
                <div className="slot-meta">
                  <span>⏱️ {formatTime(slot.playTime)}</span>
                  <span>📅 {formatDate(slot.timestamp)}</span>
                </div>
              </>
            ) : (
              <div className="slot-empty">空档位</div>
            )}
          </div>
        ))}
      </div>
      
      {selectedSlot !== null && (
        <div className="slot-actions">
          {renameSlot === selectedSlot ? (
            <div className="rename-form">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="输入新名称"
                maxLength={20}
              />
              <button onClick={handleRename}>确认</button>
              <button onClick={() => { setRenameSlot(null); setNewName(''); }}>取消</button>
            </div>
          ) : (
            <>
              <button className="action-btn primary" onClick={handleConfirm}>
                {mode === 'load' 
                  ? (slots.find(s => s.index === selectedSlot)?.exists ? '读取此存档' : '空档位 - 无法读取') 
                  : mode === 'new'
                  ? (slots.find(s => s.index === selectedSlot)?.exists ? '覆盖并开始新游戏' : '开始新游戏')
                  : (slots.find(s => s.index === selectedSlot)?.exists ? '覆盖保存' : '保存到新档位')
                }
              </button>
              
              {slots.find(s => s.index === selectedSlot)?.exists && (
                <>
                  <button className="action-btn" onClick={() => { setRenameSlot(selectedSlot); setNewName(slots.find(s => s.index === selectedSlot)?.name || ''); }}>
                    重命名
                  </button>
                  <button className="action-btn danger" onClick={handleDelete}>
                    删除
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
