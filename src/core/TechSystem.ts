// src/core/TechSystem.ts
// 科技系统 - 40科技树管理

import { GameError, ErrorCode } from './ErrorHandler'

export interface Technology {
  id: string
  name: string
  description: string
  tier: number
  cost: number
  prerequisites: string[]
  effects: TechEffect[]
  unlocked: boolean
  researched: boolean
}

export interface TechEffect {
  type: 'production_boost' | 'cost_reduction' | 'unlock_facility' | 'unlock_resource'
  target: string
  value: number
}

export const TECH_TIERS = {
  TIER_1: { max: 6, multiplier: 1 },
  TIER_2: { max: 8, multiplier: 2 },
  TIER_3: { max: 12, multiplier: 4 },
  TIER_4: { max: 10, multiplier: 8 },
  TIER_5: { max: 4, multiplier: 16 },
} as const

export const BASE_RESEARCH_COST = 100

export class TechSystem {
  private technologies: Map<string, Technology> = new Map()
  private researchPoints = 0

  constructor() {
    this.initializeTechnologies()
  }

  private initializeTechnologies(): void {
    const techList: Omit<Technology, 'unlocked' | 'researched'>[] = [
      // Tier 1 (6个)
      { id: 'basic_automation', name: '基础自动化', description: '生产效率+10%', tier: 1, cost: 100, prerequisites: [], effects: [{ type: 'production_boost', target: 'all', value: 0.1 }] },
      { id: 'efficient_mining', name: '高效采矿', description: '采矿产出+15%', tier: 1, cost: 150, prerequisites: [], effects: [{ type: 'production_boost', target: 'mining', value: 0.15 }] },
      { id: 'storage_optimization', name: '仓储优化', description: '仓库容量+20%', tier: 1, cost: 120, prerequisites: [], effects: [{ type: 'production_boost', target: 'storage', value: 0.2 }] },
      { id: 'energy_management', name: '能源管理', description: '能耗-10%', tier: 1, cost: 180, prerequisites: [], effects: [{ type: 'cost_reduction', target: 'energy', value: 0.1 }] },
      { id: 'basic_smelting', name: '基础冶炼', description: '解锁冶炼炉', tier: 1, cost: 200, prerequisites: [], effects: [{ type: 'unlock_facility', target: 'smelter', value: 1 }] },
      { id: 'logistics_basic', name: '物流基础', description: '运输速度+10%', tier: 1, cost: 160, prerequisites: [], effects: [{ type: 'production_boost', target: 'logistics', value: 0.1 }] },
      
      // Tier 2 (8个)
      { id: 'advanced_smelting', name: '高级冶炼', description: '冶炼效率+20%', tier: 2, cost: 400, prerequisites: ['basic_smelting'], effects: [{ type: 'production_boost', target: 'smelting', value: 0.2 }] },
      { id: 'solar_tech', name: '太阳能技术', description: '解锁太阳能板', tier: 2, cost: 500, prerequisites: ['energy_management'], effects: [{ type: 'unlock_facility', target: 'solar_panel', value: 1 }] },
      { id: 'material_science', name: '材料科学', description: '加工效率+15%', tier: 2, cost: 450, prerequisites: ['basic_smelting'], effects: [{ type: 'production_boost', target: 'processing', value: 0.15 }] },
      { id: 'fuel_refinement', name: '燃料精炼', description: '解锁燃料厂', tier: 2, cost: 600, prerequisites: ['basic_smelting'], effects: [{ type: 'unlock_facility', target: 'fuel_plant', value: 1 }] },
      { id: 'exploration_tech', name: '勘探技术', description: '发现概率+20%', tier: 2, cost: 550, prerequisites: ['efficient_mining'], effects: [{ type: 'production_boost', target: 'exploration', value: 0.2 }] },
      { id: 'cold_resistance', name: '抗寒技术', description: '冰星开采效率+25%', tier: 2, cost: 480, prerequisites: ['efficient_mining'], effects: [{ type: 'production_boost', target: 'ice_mining', value: 0.25 }] },
      { id: 'heat_shielding', name: '隔热技术', description: '热星开采效率+25%', tier: 2, cost: 480, prerequisites: ['efficient_mining'], effects: [{ type: 'production_boost', target: 'heat_mining', value: 0.25 }] },
      { id: 'mining_expansion', name: '采矿扩展', description: '采矿钻机上限+5', tier: 2, cost: 520, prerequisites: ['efficient_mining'], effects: [{ type: 'production_boost', target: 'mining_limit', value: 5 }] },
      
      // Tier 3 (12个)
      { id: 'electronic_miniaturization', name: '电子微型化', description: '电路板成本-20%', tier: 3, cost: 1200, prerequisites: ['material_science'], effects: [{ type: 'cost_reduction', target: 'circuit', value: 0.2 }] },
      { id: 'interstellar_logistics', name: '星际物流', description: '跨星运输速度+30%', tier: 3, cost: 1400, prerequisites: ['logistics_basic'], effects: [{ type: 'production_boost', target: 'interstellar', value: 0.3 }] },
      { id: 'quantum_research', name: '量子研究', description: '研究速度+25%', tier: 3, cost: 1600, prerequisites: ['material_science'], effects: [{ type: 'production_boost', target: 'research', value: 0.25 }] },
      { id: 'advanced_manufacturing', name: '先进制造', description: '制造效率+20%', tier: 3, cost: 1300, prerequisites: ['material_science'], effects: [{ type: 'production_boost', target: 'manufacturing', value: 0.2 }] },
      { id: 'automation_engineering', name: '自动化工程', description: '自动化设施+2', tier: 3, cost: 1500, prerequisites: ['basic_automation'], effects: [{ type: 'production_boost', target: 'automation', value: 2 }] },
      { id: 'deep_space_detection', name: '深空探测', description: '探测范围+50%', tier: 3, cost: 1100, prerequisites: ['exploration_tech'], effects: [{ type: 'production_boost', target: 'detection', value: 0.5 }] },
      { id: 'resource_recycling', name: '资源循环', description: '废料回收率+15%', tier: 3, cost: 1000, prerequisites: ['material_science'], effects: [{ type: 'production_boost', target: 'recycling', value: 0.15 }] },
      { id: 'combat_systems', name: '战斗系统', description: '飞船攻击+20%', tier: 3, cost: 1400, prerequisites: ['exploration_tech'], effects: [{ type: 'production_boost', target: 'combat', value: 0.2 }] },
      { id: 'trade_negotiation', name: '贸易谈判', description: '交易价格+10%', tier: 3, cost: 1200, prerequisites: ['interstellar_logistics'], effects: [{ type: 'production_boost', target: 'trade', value: 0.1 }] },
      { id: 'asteroid_mining', name: '小行星采矿', description: '小行星产出+30%', tier: 3, cost: 1350, prerequisites: ['mining_expansion'], effects: [{ type: 'production_boost', target: 'asteroid', value: 0.3 }] },
      { id: 'alien_linguistics', name: '外星语言学', description: '外星交易+15%', tier: 3, cost: 1100, prerequisites: ['exploration_tech'], effects: [{ type: 'production_boost', target: 'alien_trade', value: 0.15 }] },
      { id: 'plasma_propulsion', name: '等离子推进', description: '飞船速度+25%', tier: 3, cost: 1450, prerequisites: ['fuel_refinement'], effects: [{ type: 'production_boost', target: 'ship_speed', value: 0.25 }] },
      
      // Tier 4 (10个)
      { id: 'ai_optimization', name: 'AI优化', description: '全设施效率+15%', tier: 4, cost: 3200, prerequisites: ['automation_engineering', 'quantum_research'], effects: [{ type: 'production_boost', target: 'all', value: 0.15 }] },
      { id: 'fusion_energy', name: '聚变能源', description: '能耗-25%', tier: 4, cost: 3500, prerequisites: ['solar_tech', 'fuel_refinement'], effects: [{ type: 'cost_reduction', target: 'energy', value: 0.25 }] },
      { id: 'alien_archaeology', name: '外星考古', description: '遗物发现率+50%', tier: 4, cost: 3000, prerequisites: ['alien_linguistics'], effects: [{ type: 'production_boost', target: 'artifact', value: 0.5 }] },
      { id: 'quantum_teleportation', name: '量子传送', description: '瞬间运输', tier: 4, cost: 4000, prerequisites: ['quantum_research', 'interstellar_logistics'], effects: [{ type: 'unlock_facility', target: 'teleporter', value: 1 }] },
      { id: 'nano_engineering', name: '纳米工程', description: '制造成本-20%', tier: 4, cost: 3400, prerequisites: ['advanced_manufacturing'], effects: [{ type: 'cost_reduction', target: 'manufacturing', value: 0.2 }] },
      { id: 'dark_matter_detection', name: '暗物质探测', description: '解锁暗物质采集', tier: 4, cost: 3800, prerequisites: ['deep_space_detection'], effects: [{ type: 'unlock_resource', target: 'dark_matter', value: 1 }] },
      { id: 'time_dilation', name: '时间膨胀', description: '生产速度+20%', tier: 4, cost: 3600, prerequisites: ['quantum_research'], effects: [{ type: 'production_boost', target: 'production_speed', value: 0.2 }] },
      { id: 'dimensional_storage', name: '维度存储', description: '仓库容量翻倍', tier: 4, cost: 3300, prerequisites: ['storage_optimization', 'quantum_research'], effects: [{ type: 'production_boost', target: 'storage', value: 1.0 }] },
      { id: 'singularity_weapons', name: '奇点武器', description: '飞船攻击+50%', tier: 4, cost: 3700, prerequisites: ['combat_systems'], effects: [{ type: 'production_boost', target: 'combat', value: 0.5 }] },
      { id: 'universal_translator', name: '通用翻译器', description: '所有交易+20%', tier: 4, cost: 3100, prerequisites: ['alien_linguistics', 'trade_negotiation'], effects: [{ type: 'production_boost', target: 'all_trade', value: 0.2 }] },
      
      // Tier 5 (4个)
      { id: 'singularity_tech', name: '奇点技术', description: '全产出+30%', tier: 5, cost: 8000, prerequisites: ['ai_optimization', 'time_dilation'], effects: [{ type: 'production_boost', target: 'all', value: 0.3 }] },
      { id: 'dark_matter_harvesting', name: '暗物质采集', description: '暗物质产出+100%', tier: 5, cost: 7500, prerequisites: ['dark_matter_detection'], effects: [{ type: 'production_boost', target: 'dark_matter', value: 1.0 }] },
      { id: 'multiverse_theory', name: '多重宇宙理论', description: '解锁平行宇宙贸易', tier: 5, cost: 9000, prerequisites: ['quantum_teleportation'], effects: [{ type: 'unlock_facility', target: 'multiverse_portal', value: 1 }] },
      { id: 'omega_point', name: '欧米伽点', description: '科技胜利条件', tier: 5, cost: 10000, prerequisites: ['singularity_tech', 'multiverse_theory'], effects: [{ type: 'production_boost', target: 'victory', value: 1 }] },
    ]

    techList.forEach(tech => {
      this.technologies.set(tech.id, {
        ...tech,
        unlocked: tech.prerequisites.length === 0,
        researched: false,
      })
    })
  }

  getTechnology(id: string): Technology | undefined {
    return this.technologies.get(id)
  }

  getAllTechnologies(): Technology[] {
    return Array.from(this.technologies.values())
  }

  getResearchedTechs(): Technology[] {
    return this.getAllTechnologies().filter(t => t.researched)
  }

  getAvailableTechs(): Technology[] {
    return this.getAllTechnologies().filter(t => t.unlocked && !t.researched)
  }

  canResearch(techId: string): boolean {
    const tech = this.technologies.get(techId)
    if (!tech) return false
    if (tech.researched) return false
    if (!tech.unlocked) return false
    return this.researchPoints >= tech.cost
  }

  research(techId: string): boolean {
    if (!this.canResearch(techId)) {
      throw new GameError(ErrorCode.INSUFFICIENT_FUNDS, `Cannot research ${techId}`)
    }

    const tech = this.technologies.get(techId)!
    this.researchPoints -= tech.cost
    tech.researched = true

    this.unlockDependentTechs(techId)
    return true
  }

  private unlockDependentTechs(_researchedId: string): void {
    this.technologies.forEach(tech => {
      if (!tech.unlocked && !tech.researched) {
        const allPrereqsMet = tech.prerequisites.every(prereq => {
          const prereqTech = this.technologies.get(prereq)
          return prereqTech?.researched === true
        })
        if (allPrereqsMet) {
          tech.unlocked = true
        }
      }
    })
  }

  addResearchPoints(points: number): void {
    if (points < 0) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, 'Research points cannot be negative')
    }
    this.researchPoints += points
  }

  getResearchPoints(): number {
    return this.researchPoints
  }

  getResearchProgress(): { researched: number; total: number } {
    const all = this.getAllTechnologies()
    return {
      researched: all.filter(t => t.researched).length,
      total: all.length,
    }
  }

  getEffectMultiplier(effectType: string, target: string): number {
    let multiplier = 1.0
    
    this.getResearchedTechs().forEach(tech => {
      tech.effects.forEach(effect => {
        if (effect.type === effectType && (effect.target === target || effect.target === 'all')) {
          multiplier += effect.value
        }
      })
    })
    
    return multiplier
  }
}