// src/core/PlanetSystemExtended.ts
// 行星系统扩展 - 设施槽位、殖民地系统

import { Planet, PlanetType, PlanetSystem } from './PlanetSystem'
import { FacilityInstance } from './FacilitySystem'
import { GameError, ErrorCode } from './ErrorHandler'

// 设施槽位
export interface FacilitySlot {
  id: string
  facility?: FacilityInstance
  isUnlocked: boolean
  unlockCost: number
}

// 殖民地
export interface Colony {
  level: number
  population: number
  happiness: number        // 幸福度 0-100
  taxIncome: number        // 税收收入/秒
}

// 行星加成
export interface PlanetBonus {
  type: 'production' | 'research' | 'tax'
  resourceId?: string
  multiplier: number
}

// 扩展的行星数据
export interface ExtendedPlanet extends Planet {
  maxFacilities: number
  facilitySlots: FacilitySlot[]
  bonuses: PlanetBonus[]
  colony?: Colony
}

// 行星类型加成配置
const PLANET_TYPE_BONUSES: Record<PlanetType, PlanetBonus[]> = {
  terran: [
    { type: 'production', multiplier: 1.2 },
    { type: 'research', multiplier: 1.1 },
    { type: 'tax', multiplier: 1.5 }
  ],
  ice: [
    { type: 'production', resourceId: 'ice', multiplier: 2.0 },
    { type: 'production', resourceId: 'water', multiplier: 1.5 }
  ],
  desert: [
    { type: 'production', resourceId: 'silicon_ore', multiplier: 1.8 }
  ],
  gas_giant: [
    { type: 'production', resourceId: 'hydrogen', multiplier: 2.5 },
    { type: 'production', resourceId: 'helium', multiplier: 2.0 }
  ],
  volcanic: [
    { type: 'production', resourceId: 'iron_ore', multiplier: 2.0 },
    { type: 'production', resourceId: 'carbon', multiplier: 1.8 }
  ],
  ocean: [
    { type: 'production', resourceId: 'water', multiplier: 2.0 }
  ],
  barren: [
    { type: 'production', multiplier: 0.8 },  // 荒芜行星有惩罚
    { type: 'tax', multiplier: 0.5 }
  ],
  exotic: [
    { type: 'production', resourceId: 'alien_artifact', multiplier: 3.0 },
    { type: 'research', multiplier: 1.5 }
  ]
}

// 殖民地升级配置
const COLONY_LEVELS = [
  { level: 1, population: 100, taxIncome: 5, unlockSlots: 2 },
  { level: 2, population: 500, taxIncome: 15, unlockSlots: 3 },
  { level: 3, population: 2000, taxIncome: 40, unlockSlots: 4 },
  { level: 4, population: 10000, taxIncome: 100, unlockSlots: 4 },
  { level: 5, population: 50000, taxIncome: 250, unlockSlots: 5 }
]

export class PlanetSystemExtended {
  private planets: Map<string, ExtendedPlanet> = new Map()
  private basePlanetSystem: PlanetSystem

  constructor(baseSystem: PlanetSystem) {
    this.basePlanetSystem = baseSystem
    this.initializeExtendedPlanets()
  }

  private initializeExtendedPlanets(): void {
    const basePlanets = this.basePlanetSystem.getAllPlanets()
    
    basePlanets.forEach(planet => {
      const maxFacilities = planet.type === 'terran' ? 5 : 
                           planet.type === 'barren' ? 3 : 4
      
      // 初始化设施槽位
      const facilitySlots: FacilitySlot[] = Array.from({ length: maxFacilities }, (_, i) => ({
        id: `slot_${planet.id}_${i}`,
        isUnlocked: i < 2,  // 前2个槽位默认解锁
        unlockCost: 1000 * Math.pow(2, i)
      }))

      // 初始化殖民地（仅已解锁行星）
      const colony = planet.unlocked ? {
        level: 1,
        population: 100,
        happiness: 80,
        taxIncome: 5
      } : undefined

      const extendedPlanet: ExtendedPlanet = {
        ...planet,
        maxFacilities,
        facilitySlots,
        bonuses: PLANET_TYPE_BONUSES[planet.type] || [],
        colony
      }

      this.planets.set(planet.id, extendedPlanet)
    })
  }

  // 获取扩展行星数据
  getExtendedPlanet(planetId: string): ExtendedPlanet | undefined {
    return this.planets.get(planetId)
  }

  getAllExtendedPlanets(): ExtendedPlanet[] {
    return Array.from(this.planets.values())
  }

  // 解锁设施槽位
  unlockFacilitySlot(planetId: string, slotId: string, credits: number): boolean {
    const planet = this.planets.get(planetId)
    if (!planet) throw new GameError(ErrorCode.INITIALIZATION_FAILED, 'Planet not found')

    const slot = planet.facilitySlots.find(s => s.id === slotId)
    if (!slot) throw new GameError(ErrorCode.INITIALIZATION_FAILED, 'Slot not found')
    if (slot.isUnlocked) throw new GameError(ErrorCode.INITIALIZATION_FAILED, 'Slot already unlocked')
    if (credits < slot.unlockCost) throw new GameError(ErrorCode.INSUFFICIENT_FUNDS, 'Insufficient credits')

    slot.isUnlocked = true
    return true
  }

  // 在槽位上建设施
  buildFacilityInSlot(
    planetId: string, 
    slotId: string, 
    facility: FacilityInstance
  ): boolean {
    const planet = this.planets.get(planetId)
    if (!planet) return false

    const slot = planet.facilitySlots.find(s => s.id === slotId)
    if (!slot || !slot.isUnlocked) return false
    if (slot.facility) return false  // 槽位已被占用

    slot.facility = facility
    return true
  }

  // 移除槽位上的设施
  removeFacilityFromSlot(planetId: string, slotId: string): boolean {
    const planet = this.planets.get(planetId)
    if (!planet) return false

    const slot = planet.facilitySlots.find(s => s.id === slotId)
    if (!slot) return false

    slot.facility = undefined
    return true
  }

  // 升级殖民地
  upgradeColony(planetId: string, credits: number): { success: boolean; newLevel?: number; cost?: number } {
    const planet = this.planets.get(planetId)
    if (!planet || !planet.colony) return { success: false }

    const currentLevel = planet.colony.level
    if (currentLevel >= 5) return { success: false }

    const nextLevel = COLONY_LEVELS[currentLevel]
    const upgradeCost = 5000 * Math.pow(3, currentLevel - 1)

    if (credits < upgradeCost) {
      return { success: false, cost: upgradeCost }
    }

    // 升级殖民地
    planet.colony.level = nextLevel.level
    planet.colony.population = nextLevel.population
    planet.colony.taxIncome = nextLevel.taxIncome

    // 解锁对应数量的设施槽位
    planet.facilitySlots.forEach((slot, index) => {
      if (index < nextLevel.unlockSlots) {
        slot.isUnlocked = true
      }
    })

    return { success: true, newLevel: nextLevel.level, cost: upgradeCost }
  }

  // 计算行星的总加成
  calculatePlanetBonus(planetId: string, resourceId?: string): number {
    const planet = this.planets.get(planetId)
    if (!planet) return 1

    let totalMultiplier = 1

    // 基础类型加成
    planet.bonuses.forEach(bonus => {
      if (bonus.type === 'production') {
        if (!bonus.resourceId || bonus.resourceId === resourceId) {
          totalMultiplier *= bonus.multiplier
        }
      }
    })

    // 殖民地等级加成
    if (planet.colony && planet.colony.level >= 4) {
      totalMultiplier *= 1 + (planet.colony.level - 3) * 0.15
    }

    return totalMultiplier
  }

  // 获取行星税收收入
  getTaxIncome(planetId: string): number {
    const planet = this.planets.get(planetId)
    if (!planet || !planet.colony) return 0

    const baseIncome = planet.colony.taxIncome
    const happinessMultiplier = planet.colony.happiness / 100

    return baseIncome * happinessMultiplier
  }

  // 获取所有行星的总税收
  getTotalTaxIncome(): number {
    return this.getAllExtendedPlanets()
      .filter(p => p.unlocked)
      .reduce((total, planet) => total + this.getTaxIncome(planet.id), 0)
  }

  // 获取设施所在的行星ID
  getFacilityPlanetId(facilityId: string): string | undefined {
    for (const [planetId, planet] of this.planets) {
      const slot = planet.facilitySlots.find(s => s.facility?.id === facilityId)
      if (slot) return planetId
    }
    return undefined
  }

  // 导出数据（用于存档）
  exportData(): object {
    return {
      planets: Array.from(this.planets.entries()).map(([id, planet]) => ({
        id,
        facilitySlots: planet.facilitySlots.map(slot => ({
          id: slot.id,
          isUnlocked: slot.isUnlocked,
          facilityId: slot.facility?.id
        })),
        colony: planet.colony
      }))
    }
  }

  // 导入数据（用于读档）
  importData(data: any): void {
    if (!data.planets) return
    
    data.planets.forEach((planetData: any) => {
      const planet = this.planets.get(planetData.id)
      if (planet) {
        // 恢复槽位解锁状态
        planetData.facilitySlots.forEach((slotData: any) => {
          const slot = planet.facilitySlots.find(s => s.id === slotData.id)
          if (slot) {
            slot.isUnlocked = slotData.isUnlocked
          }
        })
        
        // 恢复殖民地数据
        if (planetData.colony) {
          planet.colony = planetData.colony
        }
      }
    })
  }
}
