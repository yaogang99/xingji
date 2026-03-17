// src/core/ProductionSystem.ts
// 生产系统 - 33设施生产链管理

import { GameError, ErrorCode } from './ErrorHandler'
import { ALL_FACILITIES, FacilityDefinition, FacilityRecipe } from '../data/facilities'

/**
 * 设施实例 - 表示一个已建造的具体设施
 */
export interface FacilityInstance {
  id: string
  facilityId: string
  level: number
  count: number
  planetId: string
}

/**
 * 设施产出 - 表示设施的生产输出
 */
export interface FacilityOutput {
  resourceId: string
  amount: number
  productionCycle: number
}

/**
 * 生产系统 - 管理33种设施的建造、升级和产出
 * 
 * 核心功能:
 * 1. 设施建造与管理
 * 2. 设施升级 (等级提升20%产出)
 * 3. 配方查询与生产
 * 4. 能耗计算
 * 5. 产出计算
 */
export class ProductionSystem {
  private facilities: Map<string, FacilityInstance> = new Map()

  /**
   * 获取设施定义
   * 
   * @param facilityId - 设施类型ID
   * @returns FacilityDefinition | undefined - 设施定义或undefined
   * 
   * @example
   * const def = productionSystem.getFacilityDefinition('mining_drill')
   * console.log(def.name) // '采矿钻机'
   */
  getFacilityDefinition(facilityId: string): FacilityDefinition | undefined {
    return ALL_FACILITIES.find(f => f.id === facilityId)
  }

  /**
   * 获取所有设施定义
   * 
   * @returns FacilityDefinition[] - 33种设施的完整定义列表
   */
  getAllFacilityDefinitions(): FacilityDefinition[] {
    return ALL_FACILITIES
  }

  /**
   * 获取已解锁的设施（默认解锁T1设施）
   * 
   * @returns FacilityDefinition[] - T1等级设施列表
   */
  getUnlockedFacilities(): FacilityDefinition[] {
    return ALL_FACILITIES.filter(f => f.tier === 1)
  }

  /**
   * 获取设施的配方列表
   * 
   * @param facilityId - 设施类型ID
   * @returns FacilityRecipe[] - 该设施可执行的配方列表
   * 
   * @example
   * const recipes = productionSystem.getFacilityRecipes('smelter')
   * // [{ input: { iron_ore: 2 }, output: { iron_plate: 1 }, duration: 20 }, ...]
   */
  getFacilityRecipes(facilityId: string): FacilityRecipe[] {
    const facility = this.getFacilityDefinition(facilityId)
    return facility?.recipes || []
  }

  /**
   * 添加设施实例
   * 
   * @param instance - 设施实例对象
   * @throws {GameError} 当设施ID无效或实例数据不合法时抛出错误
   * 
   * @example
   * productionSystem.addFacility({
   *   id: 'facility_001',
   *   facilityId: 'mining_drill',
   *   level: 1,
   *   count: 1,
   *   planetId: 'planet_0'
   * })
   */
  addFacility(instance: FacilityInstance): void {
    this.validateFacility(instance)
    this.facilities.set(instance.id, instance)
  }

  /**
   * 移除设施实例
   * 
   * @param instanceId - 设施实例ID
   * @throws {GameError} 当设施不存在时抛出错误
   */
  removeFacility(instanceId: string): void {
    if (!this.facilities.has(instanceId)) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, `Facility not found: ${instanceId}`)
    }
    this.facilities.delete(instanceId)
  }

  /**
   * 升级设施
   * 
   * 算法:
   * ```
   * if facility.level >= maxLevel:
   *   throw error
   * facility.level += 1
   * // 产出提升20%每级
   * ```
   * 
   * @param instanceId - 设施实例ID
   * @throws {GameError} 当设施不存在或已达最大等级时抛出错误
   */
  upgradeFacility(instanceId: string): void {
    const facility = this.facilities.get(instanceId)
    if (!facility) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, `Facility not found: ${instanceId}`)
    }
    const facilityDef = this.getFacilityDefinition(facility.facilityId)
    if (facilityDef && facility.level >= facilityDef.maxLevel) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, 'Facility already at max level')
    }
    facility.level += 1
  }

  /**
   * 计算设施产出
   * 
   * 算法公式:
   * ```
   * output = baseOutput 
   *          * (1.2 ^ (level - 1))  // 等级加成，每级+20%
   *          * (1 + techBoost)       // 科技加成
   *          * count                 // 数量加成
   * ```
   * 
   * @param instanceId - 设施实例ID
   * @param techBoost - 科技加成系数 (默认0)
   * @returns number - 计算后的产出数量
   */
  calculateOutput(instanceId: string, techBoost: number = 0): number {
    const facility = this.facilities.get(instanceId)
    if (!facility) return 0

    const baseOutput = this.getBaseOutput(facility.facilityId)
    const levelMultiplier = Math.pow(1.2, facility.level - 1)
    
    return baseOutput * levelMultiplier * (1 + techBoost) * facility.count
  }

  /**
   * 验证设施实例数据
   * 
   * @param instance - 设施实例对象
   * @throws {GameError} 当数据不合法时抛出错误
   * @private
   */
  private validateFacility(instance: FacilityInstance): void {
    if (!instance.id || !instance.facilityId) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, 'Invalid facility instance: missing id or facilityId')
    }
    if (instance.level < 1) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, 'Invalid facility level: must be >= 1')
    }
    if (instance.count < 1) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, 'Invalid facility count: must be >= 1')
    }
    // 验证设施ID是否存在
    const facilityDef = this.getFacilityDefinition(instance.facilityId)
    if (!facilityDef) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, `Unknown facility type: ${instance.facilityId}`)
    }
  }

  /**
   * 获取设施基准产出
   * 
   * @param facilityId - 设施类型ID
   * @returns number - 基准产出值
   * @private
   */
  private getBaseOutput(facilityId: string): number {
    const facilityDef = this.getFacilityDefinition(facilityId)
    return facilityDef?.baseOutput || 0.1
  }

  /**
   * 获取指定星球上的所有设施
   * 
   * @param planetId - 星球ID
   * @returns FacilityInstance[] - 该星球上的设施实例列表
   */
  getFacilitiesByPlanet(planetId: string): FacilityInstance[] {
    return Array.from(this.facilities.values())
      .filter(f => f.planetId === planetId)
  }

  /**
   * 计算指定星球的总能耗
   * 
   * 算法:
   * ```
   * total = sum(facility.powerConsumption * facility.count)
   * ```
   * 
   * @param planetId - 星球ID
   * @returns number - 总能耗
   */
  getTotalPowerConsumption(planetId: string): number {
    return this.getFacilitiesByPlanet(planetId)
      .reduce((total, f) => total + this.getPowerConsumption(f.facilityId) * f.count, 0)
  }

  /**
   * 获取设施功耗
   * 
   * @param facilityId - 设施类型ID
   * @returns number - 功耗值
   * @private
   */
  private getPowerConsumption(facilityId: string): number {
    const facilityDef = this.getFacilityDefinition(facilityId)
    return facilityDef?.powerConsumption || 10
  }

  /**
   * 获取设施最大等级
   * 
   * @param facilityId - 设施类型ID
   * @returns number - 最大等级（T1-T3:10, T4:5, T5:3）
   */
  getFacilityMaxLevel(facilityId: string): number {
    const facilityDef = this.getFacilityDefinition(facilityId)
    return facilityDef?.maxLevel || 10
  }

  /**
   * 按类型获取设施定义
   * 
   * @param type - 设施类型 ('gathering' | 'processing' | 'manufacturing' | 'special')
   * @returns FacilityDefinition[] - 该类型的设施列表
   * 
   * @example
   * const gathering = productionSystem.getFacilitiesByType('gathering')
   * // [采矿钻机, 冰矿提取器, ...]
   */
  getFacilitiesByType(type: string): FacilityDefinition[] {
    return ALL_FACILITIES.filter(f => f.type === type)
  }

  /**
   * 按等级获取设施定义
   * 
   * @param tier - 设施等级 (1-5)
   * @returns FacilityDefinition[] - 该等级的设施列表
   */
  getFacilitiesByTier(tier: number): FacilityDefinition[] {
    return ALL_FACILITIES.filter(f => f.tier === tier)
  }
}