// src/ui/TechTree.tsx
// 科技树界面

import { Technology } from '../core/TechSystem'
import { BackButton } from './BackButton'

interface TechTreeProps {
  technologies: Technology[]
  researchPoints: number
  onResearch: (techId: string) => void
  onBack: () => void
}

export function TechTree({ technologies, researchPoints, onResearch, onBack }: TechTreeProps) {
  const tiers = [1, 2, 3, 4, 5]
  const unlockedCount = technologies.filter(t => t.researched).length
  const totalCount = technologies.length
  
  return (
    <div className="main-layout">
      {/* 左侧 - 科技树 */}
      <div className="left-panel">
        <div className="panel-header">
          <BackButton onClick={onBack} />
          <h2>🔬 科技树</h2>
        </div>
        <p className="research-points">研究点: {researchPoints.toLocaleString()}</p>
        
        {tiers.map(tier => (
          <div key={tier} className="tech-tier">
            <h3>T{tier} 科技</h3>
            <div className="tech-row">
              {technologies
                .filter(t => t.tier === tier)
                .map(tech => (
                  <div 
                    key={tech.id} 
                    className={`tech-card ${tech.researched ? 'researched' : ''} ${!tech.unlocked ? 'locked' : ''}`}
                  >
                    <h4>{tech.name}</h4>
                    <p className="tech-desc">{tech.description}</p>
                    <p className="tech-cost">💰 {tech.cost} RP</p>
                    
                    {!tech.researched && tech.unlocked && (
                      <button
                        onClick={() => onResearch(tech.id)}
                        disabled={researchPoints < tech.cost}
                        className="research-btn"
                      >
                        研究
                      </button>
                    )}
                    
                    {tech.researched && <span className="researched-badge">✓ 已研究</span>}
                    {!tech.unlocked && <span className="locked-badge">🔒 锁定</span>}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* 右侧 - 统计 */}
      <div className="right-panel">
        <section className="stats-section">
          <h2>📊 研究进度</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">已研究</span>
              <span className="stat-value">{unlockedCount}/{totalCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">研究点</span>
              <span className="stat-value">{researchPoints.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">完成度</span>
              <span className="stat-value">{Math.round((unlockedCount / totalCount) * 100)}%</span>
            </div>
          </div>
        </section>
        
        <section className="nav-section">
          <h2>💡 研究提示</h2>
          <div style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '14px', color: '#B0B0B0', lineHeight: '1.6' }}>
            <p>• 研究科技解锁新功能</p>
            <p>• 高级科技需要前置科技</p>
            <p>• 出售高级资源获得研究点</p>
          </div>
        </section>
      </div>
    </div>
  )
}
