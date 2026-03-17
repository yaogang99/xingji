// src/ui/AchievementPanel.tsx
// 成就界面

import { SteamAchievement } from '../steam/SteamIntegration'
import { BackButton } from './BackButton'

interface AchievementPanelProps {
  achievements: SteamAchievement[]
  onBack: () => void
}

export function AchievementPanel({ achievements, onBack }: AchievementPanelProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length
  const progress = Math.round((unlockedCount / totalCount) * 100)

  return (
    <div className="main-layout">
      {/* 左侧 - 成就列表 */}
      <div className="left-panel">
        <div className="panel-header">
          <BackButton onClick={onBack} />
          <h2>🏆 成就</h2>
        </div>
        
        <div className="achievement-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p>{unlockedCount} / {totalCount} ({progress}%)</p>
        </div>

        <div className="achievement-list">
          {achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">
                {achievement.unlocked ? '🏆' : '🔒'}
              </div>
              
              <div className="achievement-info">
                <h4>{achievement.name}</h4>
                <p>{achievement.description}</p>
                {achievement.unlocked && achievement.unlockTime && (
                  <p className="unlock-time">
                    解锁于: {new Date(achievement.unlockTime).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 右侧 - 统计 */}
      <div className="right-panel">
        <section className="stats-section">
          <h2>📊 成就统计</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">已解锁</span>
              <span className="stat-value">{unlockedCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">未解锁</span>
              <span className="stat-value">{totalCount - unlockedCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">完成度</span>
              <span className="stat-value">{progress}%</span>
            </div>
          </div>
        </section>
        
        <section className="nav-section">
          <h2>💡 成就提示</h2>
          <div style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '14px', color: '#B0B0B0', lineHeight: '1.6' }}>
            <p>• 完成特定目标解锁成就</p>
            <p>• 探索游戏获得隐藏成就</p>
            <p>• 成就进度自动保存</p>
          </div>
        </section>
      </div>
    </div>
  )
}
