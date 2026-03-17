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
  
  return (
    <div className="tech-tree">
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
  )
}
