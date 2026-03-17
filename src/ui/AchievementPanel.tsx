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
    <div className="achievement-panel">
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
  )
}
