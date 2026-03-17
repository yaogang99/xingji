// src/ui/SettingsPanel.tsx
// 设置面板 - 发售级完整版（5个分类）

import { useState, useEffect } from 'react'

export interface SettingsData {
  // 音频设置
  masterVolume: number
  bgmVolume: number
  sfxVolume: number
  
  // 显示设置
  resolution: string
  fullscreen: boolean
  uiScale: number
  fpsLimit: number
  
  // 游戏设置
  autoSaveInterval: number
  showNotifications: boolean
  confirmDialogs: boolean
  
  // 辅助功能
  colorblindMode: 'none' | 'red-green' | 'blue-yellow'
  highContrast: boolean
  largeFont: boolean
  reduceMotion: boolean
  
  // 其他设置
  language: 'zh-CN' | 'en' | 'ja'
}

const DEFAULT_SETTINGS: SettingsData = {
  masterVolume: 1,
  bgmVolume: 0.5,
  sfxVolume: 1,
  resolution: '1280x720',
  fullscreen: false,
  uiScale: 1,
  fpsLimit: 60,
  autoSaveInterval: 30,
  showNotifications: true,
  confirmDialogs: true,
  colorblindMode: 'none',
  highContrast: false,
  largeFont: false,
  reduceMotion: false,
  language: 'zh-CN',
}

const RESOLUTIONS = [
  { value: '800x600', label: '800 × 600' },
  { value: '1024x768', label: '1024 × 768' },
  { value: '1280x720', label: '1280 × 720 (HD)' },
  { value: '1366x768', label: '1366 × 768' },
  { value: '1600x900', label: '1600 × 900' },
  { value: '1920x1080', label: '1920 × 1080 (Full HD)' },
]

const FPS_LIMITS = [
  { value: 30, label: '30 FPS' },
  { value: 60, label: '60 FPS' },
  { value: 120, label: '120 FPS' },
  { value: 0, label: '无限制' },
]

const AUTO_SAVE_INTERVALS = [
  { value: 30, label: '30秒' },
  { value: 60, label: '1分钟' },
  { value: 300, label: '5分钟' },
  { value: 600, label: '10分钟' },
]

const LANGUAGES = [
  { value: 'zh-CN', label: '中文 (简体)' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
]

interface SettingsPanelProps {
  settings: SettingsData
  onSettingsChange: (settings: SettingsData) => void
  onClose: () => void
  onExportSave?: () => string | null
  onImportSave?: (data: string) => boolean
}

export function SettingsPanel({ 
  settings, 
  onSettingsChange, 
  onClose,
  onExportSave,
  onImportSave,
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'audio' | 'display' | 'gameplay' | 'accessibility' | 'other'>('audio')
  const [localSettings, setLocalSettings] = useState<SettingsData>(settings)
  const [importText, setImportText] = useState('')
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importError, setImportError] = useState('')

  // 当外部settings变化时更新本地状态
  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const updateSetting = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)
    onSettingsChange(newSettings)
  }

  const handleExport = () => {
    if (onExportSave) {
      const data = onExportSave()
      if (data) {
        navigator.clipboard.writeText(data).then(() => {
          alert('存档数据已复制到剪贴板！')
        })
      } else {
        alert('没有可导出的存档数据')
      }
    }
  }

  const handleImport = () => {
    if (onImportSave && importText.trim()) {
      const success = onImportSave(importText.trim())
      if (success) {
        alert('存档导入成功！')
        setShowImportDialog(false)
        setImportText('')
        setImportError('')
      } else {
        setImportError('导入失败：数据格式无效')
      }
    }
  }

  const handleReset = () => {
    if (confirm('确定要重置所有设置吗？此操作不可撤销。')) {
      setLocalSettings(DEFAULT_SETTINGS)
      onSettingsChange(DEFAULT_SETTINGS)
    }
  }

  const renderAudioSettings = () => (
    <section className="settings-section">
      <h3>🎵 音频设置</h3>
      
      <div className="setting-item">
        <label>主音量</label>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={localSettings.masterVolume}
            onChange={(e) => updateSetting('masterVolume', parseFloat(e.target.value))}
          />
          <span>{Math.round(localSettings.masterVolume * 100)}%</span>
        </div>
      </div>

      <div className="setting-item">
        <label>背景音乐</label>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={localSettings.bgmVolume}
            onChange={(e) => updateSetting('bgmVolume', parseFloat(e.target.value))}
          />
          <span>{Math.round(localSettings.bgmVolume * 100)}%</span>
        </div>
      </div>

      <div className="setting-item">
        <label>音效</label>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={localSettings.sfxVolume}
            onChange={(e) => updateSetting('sfxVolume', parseFloat(e.target.value))}
          />
          <span>{Math.round(localSettings.sfxVolume * 100)}%</span>
        </div>
      </div>
    </section>
  )

  const renderDisplaySettings = () => (
    <section className="settings-section">
      <h3>🖥️ 显示设置</h3>
      
      <div className="setting-item">
        <label>分辨率</label>
        <select
          value={localSettings.resolution}
          onChange={(e) => updateSetting('resolution', e.target.value)}
        >
          {RESOLUTIONS.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      <div className="setting-item">
        <label>全屏模式</label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={localSettings.fullscreen}
            onChange={(e) => {
              updateSetting('fullscreen', e.target.checked)
              // 尝试切换全屏
              if (e.target.checked) {
                document.documentElement.requestFullscreen?.().catch(() => {})
              } else {
                document.exitFullscreen?.().catch(() => {})
              }
            }}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="setting-item">
        <label>UI缩放</label>
        <div className="slider-container">
          <input
            type="range"
            min="0.8"
            max="1.5"
            step="0.1"
            value={localSettings.uiScale}
            onChange={(e) => {
              const scale = parseFloat(e.target.value)
              updateSetting('uiScale', scale)
              document.documentElement.style.setProperty('--ui-scale', scale.toString())
            }}
          />
          <span>{Math.round(localSettings.uiScale * 100)}%</span>
        </div>
      </div>

      <div className="setting-item">
        <label>FPS限制</label>
        <select
          value={localSettings.fpsLimit}
          onChange={(e) => updateSetting('fpsLimit', parseInt(e.target.value))}
        >
          {FPS_LIMITS.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>
    </section>
  )

  const renderGameplaySettings = () => (
    <section className="settings-section">
      <h3>🎮 游戏设置</h3>
      
      <div className="setting-item">
        <label>自动保存间隔</label>
        <select
          value={localSettings.autoSaveInterval}
          onChange={(e) => updateSetting('autoSaveInterval', parseInt(e.target.value))}
        >
          {AUTO_SAVE_INTERVALS.map(i => (
            <option key={i.value} value={i.value}>{i.label}</option>
          ))}
        </select>
      </div>

      <div className="setting-item">
        <label>显示通知</label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={localSettings.showNotifications}
            onChange={(e) => updateSetting('showNotifications', e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="setting-item">
        <label>交易确认对话框</label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={localSettings.confirmDialogs}
            onChange={(e) => updateSetting('confirmDialogs', e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
    </section>
  )

  const renderAccessibilitySettings = () => (
    <section className="settings-section">
      <h3>♿ 辅助功能</h3>
      
      <div className="setting-item">
        <label>色盲模式</label>
        <select
          value={localSettings.colorblindMode}
          onChange={(e) => {
            const mode = e.target.value as SettingsData['colorblindMode']
            updateSetting('colorblindMode', mode)
            document.documentElement.setAttribute('data-colorblind', mode)
          }}
        >
          <option value="none">关闭</option>
          <option value="red-green">红绿色盲</option>
          <option value="blue-yellow">蓝黄色盲</option>
        </select>
      </div>

      <div className="setting-item">
        <label>高对比度模式</label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={localSettings.highContrast}
            onChange={(e) => {
              updateSetting('highContrast', e.target.checked)
              document.documentElement.toggleAttribute('data-high-contrast', e.target.checked)
            }}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="setting-item">
        <label>大字体模式</label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={localSettings.largeFont}
            onChange={(e) => {
              updateSetting('largeFont', e.target.checked)
              document.documentElement.toggleAttribute('data-large-font', e.target.checked)
            }}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="setting-item">
        <label>减少动画</label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={localSettings.reduceMotion}
            onChange={(e) => {
              updateSetting('reduceMotion', e.target.checked)
              document.documentElement.toggleAttribute('data-reduce-motion', e.target.checked)
            }}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
    </section>
  )

  const renderOtherSettings = () => (
    <section className="settings-section">
      <h3>⚙️ 其他设置</h3>
      
      <div className="setting-item">
        <label>语言</label>
        <select
          value={localSettings.language}
          onChange={(e) => updateSetting('language', e.target.value as SettingsData['language'])}
        >
          {LANGUAGES.map(l => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>

      <div className="setting-item save-actions">
        <h4>存档操作</h4>
        <div className="action-buttons">
          {onExportSave && (
            <button className="action-btn" onClick={handleExport}>
              📤 导出存档
            </button>
          )}
          {onImportSave && (
            <button className="action-btn" onClick={() => setShowImportDialog(true)}>
              📥 导入存档
            </button>
          )}
        </div>
      </div>

      <div className="setting-item reset-action">
        <h4>危险操作</h4>
        <button className="action-btn danger" onClick={handleReset}>
          🔄 重置所有设置
        </button>
      </div>
    </section>
  )

  return (
    <div className="settings-panel">
      <div className="panel-header">
        <button className="back-btn" onClick={onClose}>← 返回</button>
        <h2>⚙️ 设置</h2>
      </div>

      <div className="settings-tabs">
        {[
          { id: 'audio', label: '🎵 音频', icon: '🎵' },
          { id: 'display', label: '🖥️ 显示', icon: '🖥️' },
          { id: 'gameplay', label: '🎮 游戏', icon: '🎮' },
          { id: 'accessibility', label: '♿ 辅助', icon: '♿' },
          { id: 'other', label: '⚙️ 其他', icon: '⚙️' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="settings-content">
        {activeTab === 'audio' && renderAudioSettings()}
        {activeTab === 'display' && renderDisplaySettings()}
        {activeTab === 'gameplay' && renderGameplaySettings()}
        {activeTab === 'accessibility' && renderAccessibilitySettings()}
        {activeTab === 'other' && renderOtherSettings()}
      </div>

      {showImportDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>📥 导入存档</h3>
            <textarea
              placeholder="在此粘贴存档数据..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={6}
            />
            {importError && <p className="error">{importError}</p>}
            <div className="modal-actions">
              <button onClick={handleImport}>导入</button>
              <button onClick={() => {
                setShowImportDialog(false)
                setImportText('')
                setImportError('')
              }}>取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 设置保存/加载工具
export const SettingsStorage = {
  save(settings: SettingsData) {
    localStorage.setItem('star_trade_station_settings', JSON.stringify(settings))
  },

  load(): SettingsData {
    try {
      const saved = localStorage.getItem('star_trade_station_settings')
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
    return DEFAULT_SETTINGS
  },

  reset() {
    localStorage.removeItem('star_trade_station_settings')
  },
}

export { DEFAULT_SETTINGS }
export default SettingsPanel
