// src/ui/PlanetPanel.tsx - 完整版
import { useState } from 'react'
import { ExtendedPlanet } from '../core/PlanetSystemExtended'
import { FacilityDefinition, FacilityInstance } from '../core/FacilitySystem'
import { BackButton } from './BackButton'

interface PlanetPanelProps {
  planets: ExtendedPlanet[]
  facilities: FacilityInstance[]
  facilityDefinitions: FacilityDefinition[]
  credits: number
  researchPoints: number
  resources: { id: string; amount: number }[]
  onUnlockPlanet: (planetId: string) => void
  onUnlockSlot: (planetId: string, slotId: string) => void
  onBuildFacility: (planetId: string, slotId: string, definitionId: string) => void
  onRemoveFacility: (planetId: string, slotId: string) => void
  onUpgradeColony: (planetId: string) => void
  onToggleFacility: (facilityId: string) => void
  onBack: () => void
}

export function PlanetPanel(props: PlanetPanelProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<ExtendedPlanet | null>(null)
  const [buildMenuSlot, setBuildMenuSlot] = useState<string | null>(null)

  if (!selectedPlanet) {
    return <PlanetList {...props} onSelect={setSelectedPlanet} />
  }

  return <PlanetDetail planet={selectedPlanet} {...props} onBackToList={() => setSelectedPlanet(null)} buildMenuSlot={buildMenuSlot} setBuildMenuSlot={setBuildMenuSlot} />
}

function PlanetList({ planets, credits, onUnlockPlanet, onSelect, onBack }: any) {
  return (
    <div className="planet-panel">
      <div className="panel-header"><BackButton onClick={onBack} /><h2>🪐 行星管理</h2></div>
      <div className="planet-list">
        {planets.map((planet: ExtendedPlanet) => (
          <div key={planet.id} className={`planet-card ${planet.unlocked ? 'unlocked' : 'locked'}`}>
            <div className="planet-header">
              <span className="planet-icon">{getPlanetIcon(planet.type)}</span>
              <span className="planet-name">{planet.name}</span>
              {planet.unlocked ? (
                <button className="manage-btn" onClick={() => onSelect(planet)}>管理</button>
              ) : (
                <button className="unlock-btn" onClick={() => onUnlockPlanet(planet.id)} disabled={credits < planet.unlockCost}>
                  解锁 ({planet.unlockCost.toLocaleString()}💰)
                </button>
              )}
            </div>
            <div className="planet-details">
              <p>类型: {getPlanetTypeName(planet.type)} | 距离: {planet.distance} AU</p>
              <p>资源: {planet.resources.map(r => r.resourceId).join(', ')}</p>
              {planet.unlocked && planet.colony && <p>🏘️ 殖民地 Lv.{planet.colony.level} | 💰+{planet.colony.taxIncome}/s</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PlanetDetail({ planet, ...props }: any) {
  return (
    <div className="planet-panel planet-detail">
      <div className="panel-header">
        <button className="back-btn" onClick={props.onBackToList}>←</button>
        <h2>{getPlanetIcon(planet.type)} {planet.name}</h2>
      </div>

      <section className="planet-info-section">
        <p><strong>类型:</strong> {getPlanetTypeName(planet.type)}</p>
        <p><strong>距离:</strong> {planet.distance} AU</p>
        {planet.bonuses.length > 0 && <p><strong>加成:</strong> {planet.bonuses.map((b: any) => `${b.type}${b.resourceId ? '[' + b.resourceId + ']' : ''} ${Math.round((b.multiplier - 1) * 100)}%`).join(', ')}</p>}
      </section>

      {planet.colony && (
        <section className="colony-section">
          <h3>🏘️ 殖民地 (等级 {planet.colony.level})</h3>
          <div className="colony-stats">
            <span>人口: {planet.colony.population.toLocaleString()}</span>
            <span>幸福度: {planet.colony.happiness}%</span>
            <span>税收: +{planet.colony.taxIncome}💰/秒</span>
          </div>
          {planet.colony.level < 5 && <button className="upgrade-btn" onClick={() => props.onUpgradeColony(planet.id)}>升级殖民地</button>}
        </section>
      )}

      <section className="facilities-section">
        <h3>🏭 设施 ({planet.facilitySlots.filter((s: any) => s.facility).length}/{planet.maxFacilities})</h3>
        <div className="facility-slots">
          {planet.facilitySlots.map((slot: any, index: number) => (
            <FacilitySlot key={slot.id} slot={slot} index={index} planet={planet} {...props} />
          ))}
        </div>
      </section>
    </div>
  )
}

function FacilitySlot({ slot, index, planet, credits, resources, facilityDefinitions, onUnlockSlot, onBuildFacility, onRemoveFacility, onToggleFacility, buildMenuSlot, setBuildMenuSlot }: any) {
  return (
    <div className={`facility-slot ${slot.isUnlocked ? '' : 'locked'} ${slot.facility ? 'occupied' : ''}`}>
      <div className="slot-header">
        <span>槽位 {index + 1}</span>
        {!slot.isUnlocked && <span className="lock-icon">🔒</span>}
      </div>
      {!slot.isUnlocked && <button className="unlock-slot-btn" onClick={() => onUnlockSlot(planet.id, slot.id)} disabled={credits < slot.unlockCost}>解锁 ({slot.unlockCost.toLocaleString()}💰)</button>}
      {slot.isUnlocked && !slot.facility && (
        <>
          <button className="build-btn" onClick={() => setBuildMenuSlot(buildMenuSlot === slot.id ? null : slot.id)}>建造设施</button>
          {buildMenuSlot === slot.id && (
            <div className="build-menu">
              {facilityDefinitions.map((def: FacilityDefinition) => {
                const canAfford = credits >= def.buildCost.credits && (!def.buildCost.resources || def.buildCost.resources.every(r => (resources.find((res: any) => res.id === r.resourceId)?.amount || 0) >= r.amount))
                return (
                  <button key={def.id} className={`build-option ${!canAfford ? 'disabled' : ''}`} onClick={() => { if (canAfford) { onBuildFacility(planet.id, slot.id, def.id); setBuildMenuSlot(null) } }} disabled={!canAfford}>
                    <span>{def.icon} {def.name}</span>
                    <span>💰{def.buildCost.credits} +{def.production.baseAmount}/s</span>
                  </button>
                )
              })}
            </div>
          )}
        </>
      )}
      {slot.facility && (
        <div className="facility-info">
          <span>⛏️ 设施 Lv.{slot.facility.level} ×{slot.facility.count}</span>
          <div className="facility-actions">
            <button className="toggle-btn" onClick={() => onToggleFacility(slot.facility.id)}>{slot.facility.isActive ? '⏸️' : '▶️'}</button>
            <button className="remove-btn" onClick={() => onRemoveFacility(planet.id, slot.id)}>拆除</button>
          </div>
        </div>
      )}
    </div>
  )
}

function getPlanetIcon(type: string) {
  const icons: Record<string, string> = { terran: '🌍', ice: '🧊', desert: '🏜️', gas_giant: '🪐', volcanic: '🌋', ocean: '🌊', barren: '🌑', exotic: '👽' }
  return icons[type] || '🪐'
}

function getPlanetTypeName(type: string) {
  const names: Record<string, string> = { terran: '类地行星', ice: '冰行星', desert: '沙漠行星', gas_giant: '气态巨行星', volcanic: '火山行星', ocean: '海洋行星', barren: '荒芜行星', exotic: '异域行星' }
  return names[type] || type
}
