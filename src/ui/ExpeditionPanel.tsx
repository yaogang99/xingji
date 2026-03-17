// src/ui/ExpeditionPanel.tsx
// 探险界面

import { Ship, Expedition } from '../core/ExpeditionSystem'
import { BackButton } from './BackButton'

interface ExpeditionPanelProps {
  ships: Ship[]
  expeditions: Expedition[]
  onStartExpedition: (shipId: string, destination: string) => void
  onCompleteExpedition: (expeditionId: string) => void
  onBack: () => void
}

export function ExpeditionPanel({ ships, expeditions, onStartExpedition, onCompleteExpedition, onBack }: ExpeditionPanelProps) {
  const idleShips = ships.filter(s => s.status === 'idle')
  const ongoingExpeditions = expeditions.filter(e => e.status === 'ongoing')

  return (
    <div className="expedition-panel">
      <div className="panel-header">
        <BackButton onClick={onBack} />
        <h2>🚀 探险舰队</h2>
      </div>
      
      <section className="ships-section">
        <h3>飞船 ({idleShips.length} 可用)</h3>
        {ships.map(ship => (
          <div key={ship.id} className={`ship-card ${ship.status}`}>
            <div className="ship-info">
              <span className="ship-name">{ship.name}</span>
              <span className={`ship-status ${ship.status}`}>{getStatusText(ship.status)}</span>
            </div>
            <div className="ship-stats">
              <span>📦 {ship.cargo}</span>
              <span>⚡ {ship.speed}</span>
              <span>⚔️ {ship.combatPower}</span>
            </div>
            
            {ship.status === 'idle' && (
              <button 
                onClick={() => onStartExpedition(ship.id, 'unknown_region')}
                className="expedition-btn"
              >
                派遣探险
              </button>
            )}
          </div>
        ))}
      </section>

      {ongoingExpeditions.length > 0 && (
        <section className="expeditions-section">
          <h3>进行中的探险</h3>
          {ongoingExpeditions.map(exp => (
            <div key={exp.id} className="expedition-card">
              <p>目的地: {exp.destination}</p>
              <p>预计时间: {formatDuration(exp.duration)}</p>
              <button 
                onClick={() => onCompleteExpedition(exp.id)}
                className="complete-btn"
              >
                完成探险
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}

function getStatusText(status: string): string {
  const texts: Record<string, string> = {
    idle: '待命',
    expedition: '探险中',
    returning: '返航中',
    locked: '🔒 锁定',
  }
  return texts[status] || status
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}分${secs}秒`
}
