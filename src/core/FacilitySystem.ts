// src/core/FacilitySystem.ts
// 设施产出系统 - 管理设施建造、升级和自动产出

import { GameError, ErrorCode } from './ErrorHandler'
import facilitiesData from '../data/facilities.json'

// 设施定义
export interface FacilityDefinition {
  id: string
  name: string
  description: string
  icon: string
  buildCost: {
    credits: number
    researchPoints?: number
    resources?: { resourceId: string; amount: number }[]
  }
  production: {
    resourceId: string
    baseAmount: number
    tier: number
  }
  consumption?: {
    resourceId: string
    amount: number
  }
  upgradeCostMultiplier: number
  maxLevel: number
}

// 设施实例
export interface FacilityInstance {
  id: string
  definitionId: string
  planetId: string
  level: number
  count: number
  isActive: boolean
  lastProduction: number
}

// 产出计算结果
export interface ProductionResult {
  facilityId: string
  resourceId: string
  amount: number
  consumed?: { resourceId: string; amount: number }
}

// 科技加成映射
type TechBonuses = Map<string, number>

/**
 * 设施系统 - 管理设施建造、升级和自动产出
 */
export class FacilitySystem {
  private facilities: Map<string, FacilityInstance> = new Map()
  private definitions: Map<string, FacilityDefinition> = new Map()
  private techBonuses: TechBonuses = new Map()
  private planetBonuses: Map<string, number> = new Map()

  constructor() {
    // 加载设施定义
    facilitiesData.forEach((def: FacilityDefinition) => {
      this.definitions.set(def.id, def)
    })
  }

  /**
   * 获取所有设施定义
   */
  getAllDefinitions(): FacilityDefinition[] {
    return Array.from(this.definitions.values())
  }

  /**
   * 获取设施定义
   */
  getDefinition(id: string): FacilityDefinition | undefined {
    return this.definitions.get(id)
  }

  /**
   * 获取所有设施实例
   */
  getAllFacilities(): FacilityInstance[] {
    return Array.from(this.facilities.values())
  }

  /**
   * 获取指定行星的设施
   */
  getFacilitiesByPlanet(planetId: string): FacilityInstance[] {
    return this.getAllFacilities().filter(f => f.planetId === planetId)
  }

  /**
   * 创建设施
   */
  createFacility(
    definitionId: string,
    planetId: string,
    count: number = 1
  ): FacilityInstance {
    const definition = this.definitions.get(definitionId)
    if (!definition) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, `设施定义不存在: ${definitionId}`)
    }

    const facility: FacilityInstance = {
      id: `${definitionId}_${planetId}_${Date.now()}`,
      definitionId,
      planetId,
      level: 1,
      count,
      isActive: true,
      lastProduction: Date.now()
    }

    this.facilities.set(facility.id, facility)
    return facility
  }

  /**
   * 升级设施
   */
  upgradeFacility(facilityId: string): boolean {
    const facility = this.facilities.get(facilityId)
    if (!facility) return false

    const definition = this.definitions.get(facility.definitionId)
    if (!definition) return false

    if (facility.level >= definition.maxLevel) {
      return false // 已达最大等级
    }

    facility.level++
    return true
  }

  /**
   * 切换设施运行状态
   */
  toggleFacility(facilityId: string): boolean {
    const facility = this.facilities.get(facilityId)
    if (!facility) return false

    facility.isActive = !facility.isActive
    return facility.isActive
  }

  /**
   * 移除设施
   */
  removeFacility(facilityId: string): boolean {
    return this.facilities.delete(facilityId)
  }

  /**
   * 计算设施产出
   * 公式: 基础产出 × 数量 × 等级加成 × 科技加成 × 行星加成
   */
  calculateProduction(facility: FacilityInstance): ProductionResult | null {
    if (!facility.isActive) return null

    const definition = this.definitions.get(facility.definitionId)
    if (!definition) return null

    const baseOutput = definition.production.baseAmount * facility.count
    const levelMultiplier = 1 + (facility.level - 1) * 0.5 // 每级+50%
    const techMultiplier = 1 + (this.techBonuses.get(definition.production.resourceId) || 0)
    const planetMultiplier = this.planetBonuses.get(facility.planetId) || 1

    const totalOutput = baseOutput * levelMultiplier * techMultiplier * planetMultiplier

    return {
      facilityId: facility.id,
      resourceId: definition.production.resourceId,
      amount: totalOutput
    }
  }

  /**
   * 计算所有设施的产出（包含消耗）
   * 返回: Map<resourceId, 净产出>
   */
  calculateAllProduction(): Map<string, number> {
    const netProduction = new Map<string, number>()

    this.facilities.forEach(facility => {
      const definition = this.definitions.get(facility.definitionId)
      if (!definition || !facility.isActive) return

      // 计算产出
      const production = this.calculateProduction(facility)
      if (production) {
        const current = netProduction.get(production.resourceId) || 0
        netProduction.set(production.resourceId, current + production.amount)
      }

      // 计算消耗
      if (definition.consumption) {
        const consumedAmount = definition.consumption.amount * facility.count
        const current = netProduction.get(definition.consumption.resourceId) || 0
        netProduction.set(definition.consumption.resourceId, current - consumedAmount)
      }
    })

    return netProduction
  }

  /**
   * 执行生产周期
   * 返回实际产出（考虑资源不足导致的停产）
   */
  executeProduction(
    currentResources: Map<string, number>
  ): { produced: Map<string, number>; consumed: Map<string, number>; stopped: string[] } {
    const produced = new Map<string, number>()
    const consumed = new Map<string, number>()
    const stopped: string[] = []

    this.facilities.forEach(facility => {
      const definition = this.definitions.get(facility.definitionId)
      if (!definition || !facility.isActive) return

      // 检查消耗资源是否充足
      if (definition.consumption) {
        const requiredAmount = definition.consumption.amount * facility.count
        const currentAmount = currentResources.get(definition.consumption.resourceId) || 0

        if (currentAmount < requiredAmount) {
          // 资源不足，停止设施
          facility.isActive = false
          stopped.push(facility.id)
          return
        }

        // 记录消耗
        const currentConsumed = consumed.get(definition.consumption.resourceId) || 0
        consumed.set(definition.consumption.resourceId, currentConsumed + requiredAmount)
      }

      // 计算产出
      const production = this.calculateProduction(facility)
      if (production) {
        const current = produced.get(production.resourceId) || 0
        produced.set(production.resourceId, current + production.amount)
      }

      // 更新时间戳
      facility.lastProduction = Date.now()
    })

    return { produced, consumed, stopped }
  }

  /**
   * 设置科技加成
   */
  setTechBonus(resourceId: string, bonus: number): void {
    this.techBonuses.set(resourceId, bonus)
  }

  /**
   * 设置行星加成
   */
  setPlanetBonus(planetId: string, multiplier: number): void {
    this.planetBonuses.set(planetId, multiplier)
  }

  /**
   * 获取建造升级成本
   */
  getUpgradeCost(facilityId: string): { credits: number; researchPoints?: number } | null {
    const facility = this.facilities.get(facilityId)
    if (!facility) return null

    const definition = this.definitions.get(facility.definitionId)
    if (!definition) return null

    if (facility.level >= definition.maxLevel) {
      return null
    }

    const multiplier = Math.pow(definition.upgradeCostMultiplier, facility.level)
    return {
      credits: Math.floor(definition.buildCost.credits * multiplier),
      researchPoints: definition.buildCost.researchPoints 
        ? Math.floor(definition.buildCost.researchPoints * multiplier)
        : undefined
    }
  }

  /**
   * 导出数据（用于存档）
   */
  exportData(): FacilityInstance[] {
    return this.getAllFacilities()
  }

  /**
   * 导入数据（用于读档）
   */
  importData(data: FacilityInstance[]): void {
    this.facilities.clear()
    data.forEach(facility => {
      this.facilities.set(facility.id, facility)
    })
  }
}
