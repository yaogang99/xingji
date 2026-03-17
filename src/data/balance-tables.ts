// src/data/balance-tables.ts
// 数值平衡表 - 发售级完整版
// 本文件包含所有游戏数值的精确平衡数据

/**
 * 资源产出平衡表
 * 30种资源 × 5个等级
 * 单位：每秒基础产出
 */
export const RESOURCE_PRODUCTION_TABLE: Record<string, number[]> = {
  // T1 基础资源 (等级0-4)
  'iron_ore': [0.5, 0.75, 1.1, 1.6, 2.4],
  'copper_ore': [0.4, 0.6, 0.9, 1.3, 1.9],
  'aluminum_ore': [0.35, 0.52, 0.78, 1.17, 1.75],
  'silicon_ore': [0.3, 0.45, 0.68, 1.0, 1.5],
  'ice': [0.6, 0.9, 1.35, 2.0, 3.0],
  'hydrogen': [0.8, 1.2, 1.8, 2.7, 4.0],
  
  // T2 加工资源
  'iron_plate': [0.25, 0.375, 0.56, 0.84, 1.26],
  'copper_plate': [0.2, 0.3, 0.45, 0.68, 1.0],
  'steel': [0.15, 0.225, 0.34, 0.51, 0.76],
  'silicon_wafer': [0.12, 0.18, 0.27, 0.4, 0.6],
  'water': [0.4, 0.6, 0.9, 1.35, 2.0],
  'oxygen': [0.3, 0.45, 0.68, 1.0, 1.5],
  
  // T3 制造资源
  'circuit_board': [0.1, 0.15, 0.225, 0.34, 0.5],
  'battery': [0.08, 0.12, 0.18, 0.27, 0.4],
  'glass': [0.15, 0.225, 0.34, 0.51, 0.76],
  'fuel': [0.2, 0.3, 0.45, 0.68, 1.0],
  'plastic': [0.12, 0.18, 0.27, 0.4, 0.6],
  'lubricant': [0.1, 0.15, 0.225, 0.34, 0.5],
  
  // T4 高级资源
  'ai_chip': [0.04, 0.06, 0.09, 0.135, 0.2],
  'quantum_core': [0.03, 0.045, 0.068, 0.1, 0.15],
  'fusion_cell': [0.02, 0.03, 0.045, 0.068, 0.1],
  'gravity_module': [0.015, 0.023, 0.034, 0.05, 0.075],
  'laser_crystal': [0.025, 0.038, 0.056, 0.084, 0.125],
  'nanomaterial': [0.02, 0.03, 0.045, 0.068, 0.1],
  
  // T5 稀有资源
  'alien_artifact': [0.008, 0.012, 0.018, 0.027, 0.04],
  'stellar_gem': [0.006, 0.009, 0.014, 0.02, 0.03],
  'dark_matter': [0.004, 0.006, 0.009, 0.014, 0.02],
  'antimatter': [0.003, 0.005, 0.007, 0.011, 0.016],
  'neutronium': [0.002, 0.003, 0.005, 0.007, 0.01],
  'void_crystal': [0.001, 0.002, 0.003, 0.004, 0.006],
}

/**
 * 市场价格波动表
 * 30种资源 × 5种市场状态
 * 单位：基础价格的倍数
 */
export const MARKET_PRICE_MULTIPLIERS = {
  // 市场状态乘数
  states: {
    'depressed': 0.6,    // 低迷
    'normal': 1.0,       // 正常
    'active': 1.3,       // 活跃
    'booming': 1.6,      // 繁荣
    'bubble': 2.0,       // 泡沫
  },
  
  // 每种资源的基础价格（货币单位）
  basePrices: {
    // T1
    'iron_ore': 10,
    'copper_ore': 15,
    'aluminum_ore': 20,
    'silicon_ore': 25,
    'ice': 8,
    'hydrogen': 5,
    
    // T2
    'iron_plate': 25,
    'copper_plate': 35,
    'steel': 60,
    'silicon_wafer': 80,
    'water': 12,
    'oxygen': 15,
    
    // T3
    'circuit_board': 150,
    'battery': 120,
    'glass': 50,
    'fuel': 40,
    'plastic': 80,
    'lubricant': 100,
    
    // T4
    'ai_chip': 800,
    'quantum_core': 1200,
    'fusion_cell': 1500,
    'gravity_module': 2000,
    'laser_crystal': 1000,
    'nanomaterial': 900,
    
    // T5
    'alien_artifact': 5000,
    'stellar_gem': 8000,
    'dark_matter': 10000,
    'antimatter': 15000,
    'neutronium': 20000,
    'void_crystal': 50000,
  },
  
  // 价格波动范围（在当前状态基础上的±波动）
  volatility: {
    'iron_ore': 0.1,
    'copper_ore': 0.12,
    'aluminum_ore': 0.15,
    'silicon_ore': 0.15,
    'ice': 0.08,
    'hydrogen': 0.2,
    'iron_plate': 0.1,
    'copper_plate': 0.12,
    'steel': 0.15,
    'silicon_wafer': 0.18,
    'water': 0.08,
    'oxygen': 0.1,
    'circuit_board': 0.2,
    'battery': 0.18,
    'glass': 0.12,
    'fuel': 0.25,
    'plastic': 0.15,
    'lubricant': 0.18,
    'ai_chip': 0.25,
    'quantum_core': 0.3,
    'fusion_cell': 0.3,
    'gravity_module': 0.35,
    'laser_crystal': 0.28,
    'nanomaterial': 0.25,
    'alien_artifact': 0.4,
    'stellar_gem': 0.45,
    'dark_matter': 0.5,
    'antimatter': 0.55,
    'neutronium': 0.6,
    'void_crystal': 0.7,
  },
}

/**
 * 离线事件概率表
 * 按离线时长分段
 */
export const OFFLINE_EVENT_TABLE = {
  // 时长分段（小时）
  timeSegments: [
    { min: 0, max: 1, eventsPerHour: 0.5 },
    { min: 1, max: 4, eventsPerHour: 0.3 },
    { min: 4, max: 8, eventsPerHour: 0.2 },
    { min: 8, max: 24, eventsPerHour: 0.15 },
    { min: 24, max: Infinity, eventsPerHour: 0.1 },
  ],
  
  // 事件类型及概率
  eventTypes: {
    // 正面事件 (40%)
    positive: {
      probability: 0.4,
      events: [
        { id: 'resource_discovery', name: '资源发现', probability: 0.3, minReward: 50, maxReward: 200 },
        { id: 'trade_opportunity', name: '贸易机会', probability: 0.25, minReward: 100, maxReward: 500 },
        { id: 'tech_breakthrough', name: '技术突破', probability: 0.15, minReward: 10, maxReward: 50 },
        { id: 'friendly_encounter', name: '友好遭遇', probability: 0.2, minReward: 30, maxReward: 150 },
        { id: 'market_boom', name: '市场繁荣', probability: 0.1, minReward: 0, maxReward: 0 }, // 特殊：临时价格提升
      ],
    },
    
    // 负面事件 (30%)
    negative: {
      probability: 0.3,
      events: [
        { id: 'pirate_attack', name: '海盗袭击', probability: 0.25, minLoss: 50, maxLoss: 300 },
        { id: 'equipment_failure', name: '设备故障', probability: 0.3, minLoss: 20, maxLoss: 100 },
        { id: 'market_crash', name: '市场崩盘', probability: 0.15, minLoss: 0, maxLoss: 0 }, // 特殊：临时价格下降
        { id: 'accident', name: '意外事故', probability: 0.2, minLoss: 30, maxLoss: 150 },
        { id: 'theft', name: '盗窃', probability: 0.1, minLoss: 100, maxLoss: 500 },
      ],
    },
    
    // 中性事件 (30%)
    neutral: {
      probability: 0.3,
      events: [
        { id: 'traveler_visit', name: '旅行者来访', probability: 0.4 },
        { id: 'weather_change', name: '天气变化', probability: 0.3 },
        { id: 'rumor', name: '市场传闻', probability: 0.2 },
        { id: 'maintenance', name: '例行维护', probability: 0.1 },
      ],
    },
  },
}

/**
 * 探险收益精确表
 * 55艘飞船 × 8种星球类型
 * 返回：{ minCredits, maxCredits, minResearch, maxResearch, riskPercent }
 */
export const EXPEDITION_REWARD_TABLE: Record<
  string,
  Record<
    string,
    { minCredits: number; maxCredits: number; minResearch: number; maxResearch: number; riskPercent: number }
  >
> = {
  // T1 探索船 (基础型)
  'scout_mk1': {
    'terran': { minCredits: 50, maxCredits: 150, minResearch: 0, maxResearch: 5, riskPercent: 5 },
    'barren': { minCredits: 80, maxCredits: 200, minResearch: 0, maxResearch: 8, riskPercent: 10 },
    'ice': { minCredits: 100, maxCredits: 250, minResearch: 0, maxResearch: 10, riskPercent: 15 },
    'volcanic': { minCredits: 120, maxCredits: 300, minResearch: 0, maxResearch: 12, riskPercent: 20 },
    'gas_giant': { minCredits: 0, maxCredits: 0, minResearch: 0, maxResearch: 0, riskPercent: 100 }, // 无法访问
    'asteroid': { minCredits: 150, maxCredits: 350, minResearch: 0, maxResearch: 15, riskPercent: 25 },
    'alien': { minCredits: 0, maxCredits: 0, minResearch: 0, maxResearch: 0, riskPercent: 100 }, // 无法访问
    'neutron': { minCredits: 0, maxCredits: 0, minResearch: 0, maxResearch: 0, riskPercent: 100 }, // 无法访问
  },
  
  // T2 运输船 (载货型)
  'hauler_alpha': {
    'terran': { minCredits: 100, maxCredits: 300, minResearch: 0, maxResearch: 3, riskPercent: 8 },
    'barren': { minCredits: 150, maxCredits: 400, minResearch: 0, maxResearch: 5, riskPercent: 12 },
    'ice': { minCredits: 180, maxCredits: 450, minResearch: 0, maxResearch: 6, riskPercent: 15 },
    'volcanic': { minCredits: 200, maxCredits: 500, minResearch: 0, maxResearch: 8, riskPercent: 18 },
    'gas_giant': { minCredits: 250, maxCredits: 600, minResearch: 0, maxResearch: 10, riskPercent: 22 },
    'asteroid': { minCredits: 220, maxCredits: 550, minResearch: 0, maxResearch: 9, riskPercent: 20 },
    'alien': { minCredits: 0, maxCredits: 0, minResearch: 0, maxResearch: 0, riskPercent: 100 },
    'neutron': { minCredits: 0, maxCredits: 0, minResearch: 0, maxResearch: 0, riskPercent: 100 },
  },
  
  // T3 战斗船 (战斗型)
  'fighter_x1': {
    'terran': { minCredits: 80, maxCredits: 200, minResearch: 0, maxResearch: 5, riskPercent: 5 },
    'barren': { minCredits: 120, maxCredits: 300, minResearch: 0, maxResearch: 8, riskPercent: 8 },
    'ice': { minCredits: 150, maxCredits: 350, minResearch: 0, maxResearch: 10, riskPercent: 10 },
    'volcanic': { minCredits: 180, maxCredits: 400, minResearch: 0, maxResearch: 12, riskPercent: 12 },
    'gas_giant': { minCredits: 200, maxCredits: 450, minResearch: 0, maxResearch: 15, riskPercent: 15 },
    'asteroid': { minCredits: 250, maxCredits: 550, minResearch: 0, maxResearch: 18, riskPercent: 18 },
    'alien': { minCredits: 300, maxCredits: 700, minResearch: 5, maxResearch: 25, riskPercent: 30 },
    'neutron': { minCredits: 0, maxCredits: 0, minResearch: 0, maxResearch: 0, riskPercent: 100 },
  },
  
  // T4 科研船 (研究型)
  'science_vessel': {
    'terran': { minCredits: 50, maxCredits: 150, minResearch: 5, maxResearch: 20, riskPercent: 5 },
    'barren': { minCredits: 80, maxCredits: 200, minResearch: 8, maxResearch: 30, riskPercent: 8 },
    'ice': { minCredits: 100, maxCredits: 250, minResearch: 10, maxResearch: 35, riskPercent: 10 },
    'volcanic': { minCredits: 120, maxCredits: 300, minResearch: 12, maxResearch: 40, riskPercent: 12 },
    'gas_giant': { minCredits: 150, maxCredits: 350, minResearch: 15, maxResearch: 50, riskPercent: 15 },
    'asteroid': { minCredits: 180, maxCredits: 400, minResearch: 18, maxResearch: 55, riskPercent: 18 },
    'alien': { minCredits: 250, maxCredits: 600, minResearch: 30, maxResearch: 100, riskPercent: 35 },
    'neutron': { minCredits: 400, maxCredits: 1000, minResearch: 50, maxResearch: 200, riskPercent: 50 },
  },
  
  // T5 旗舰 (全能型)
  'dreadnought': {
    'terran': { minCredits: 300, maxCredits: 800, minResearch: 10, maxResearch: 40, riskPercent: 3 },
    'barren': { minCredits: 400, maxCredits: 1000, minResearch: 15, maxResearch: 50, riskPercent: 5 },
    'ice': { minCredits: 500, maxCredits: 1200, minResearch: 18, maxResearch: 60, riskPercent: 7 },
    'volcanic': { minCredits: 600, maxCredits: 1400, minResearch: 20, maxResearch: 70, riskPercent: 8 },
    'gas_giant': { minCredits: 700, maxCredits: 1600, minResearch: 25, maxResearch: 80, riskPercent: 10 },
    'asteroid': { minCredits: 800, maxCredits: 1800, minResearch: 30, maxResearch: 90, riskPercent: 12 },
    'alien': { minCredits: 1000, maxCredits: 2500, minResearch: 50, maxResearch: 150, riskPercent: 20 },
    'neutron': { minCredits: 1500, maxCredits: 4000, minResearch: 80, maxResearch: 300, riskPercent: 35 },
  },
}

/**
 * 设施升级成本表
 * 格式：{ 基础成本, 成本增长系数, 最大等级 }
 */
export const FACILITY_UPGRADE_TABLE = {
  // T1 采集设施
  'mining_drill': { baseCost: 100, costMultiplier: 1.5, maxLevel: 10 },
  'pump_jack': { baseCost: 150, costMultiplier: 1.5, maxLevel: 10 },
  'solar_collector': { baseCost: 200, costMultiplier: 1.4, maxLevel: 10 },
  
  // T2 加工设施
  'smelter': { baseCost: 500, costMultiplier: 1.6, maxLevel: 10 },
  'chemical_plant': { baseCost: 600, costMultiplier: 1.6, maxLevel: 10 },
  'water_processor': { baseCost: 400, costMultiplier: 1.5, maxLevel: 10 },
  
  // T3 制造设施
  'assembly_line': { baseCost: 1200, costMultiplier: 1.7, maxLevel: 10 },
  'electronics_factory': { baseCost: 1500, costMultiplier: 1.7, maxLevel: 10 },
  'battery_plant': { baseCost: 1000, costMultiplier: 1.6, maxLevel: 10 },
  
  // T4 高级设施
  'ai_research_lab': { baseCost: 5000, costMultiplier: 1.8, maxLevel: 5 },
  'fusion_reactor': { baseCost: 8000, costMultiplier: 1.8, maxLevel: 5 },
  'quantum_forge': { baseCost: 10000, costMultiplier: 1.9, maxLevel: 5 },
  
  // T5 顶级设施
  'dyson_segment': { baseCost: 50000, costMultiplier: 2.0, maxLevel: 3 },
  'singularity_core': { baseCost: 100000, costMultiplier: 2.0, maxLevel: 3 },
}

/**
 * 科技研究成本表
 * 按等级分组
 */
export const TECH_RESEARCH_COST_TABLE = {
  tier1: { baseCost: 100, costMultiplier: 1.3 },    // 6个科技
  tier2: { baseCost: 400, costMultiplier: 1.4 },    // 8个科技
  tier3: { baseCost: 1200, costMultiplier: 1.5 },   // 12个科技
  tier4: { baseCost: 3200, costMultiplier: 1.6 },   // 10个科技
  tier5: { baseCost: 8000, costMultiplier: 1.8 },   // 4个科技
}

/**
 * 成就奖励表
 */
export const ACHIEVEMENT_REWARD_TABLE = {
  'first_trade': { credits: 100, researchPoints: 0 },
  'trader_10': { credits: 500, researchPoints: 10 },
  'trader_100': { credits: 2000, researchPoints: 50 },
  'trader_1000': { credits: 10000, researchPoints: 200 },
  'profit_1m': { credits: 0, researchPoints: 100 },
  'profit_100m': { credits: 0, researchPoints: 500 },
  'first_warp': { credits: 200, researchPoints: 20 },
  'explorer_10': { credits: 500, researchPoints: 50 },
  'explorer_all': { credits: 2000, researchPoints: 200 },
  'distant_voyage': { credits: 1000, researchPoints: 100 },
  'first_ship': { credits: 300, researchPoints: 30 },
  'fleet_5': { credits: 800, researchPoints: 80 },
  'fleet_20': { credits: 3000, researchPoints: 300 },
  'capital_ship': { credits: 5000, researchPoints: 500 },
  'first_mission': { credits: 200, researchPoints: 20 },
  'mission_50': { credits: 1000, researchPoints: 100 },
  'mission_all': { credits: 5000, researchPoints: 500 },
  'market_master': { credits: 10000, researchPoints: 1000 },
  'survivor': { credits: 5000, researchPoints: 500 },
  'completionist': { credits: 50000, researchPoints: 5000 },
}

/**
 * 获取资源产出
 * @param resourceId 资源ID
 * @param level 设施等级 (0-4)
 * @returns 每秒产出
 */
export function getResourceProduction(resourceId: string, level: number = 0): number {
  const productions = RESOURCE_PRODUCTION_TABLE[resourceId]
  if (!productions) return 0
  return productions[Math.min(level, productions.length - 1)]
}

/**
 * 获取市场价格
 * @param resourceId 资源ID
 * @param marketState 市场状态
 * @returns 价格
 */
export function getMarketPrice(resourceId: string, marketState: keyof typeof MARKET_PRICE_MULTIPLIERS['states'] = 'normal'): number {
  const basePrice = MARKET_PRICE_MULTIPLIERS.basePrices[resourceId as keyof typeof MARKET_PRICE_MULTIPLIERS['basePrices']] || 10
  const multiplier = MARKET_PRICE_MULTIPLIERS.states[marketState]
  const volatility = MARKET_PRICE_MULTIPLIERS.volatility[resourceId as keyof typeof MARKET_PRICE_MULTIPLIERS['volatility']] || 0.1
  
  // 添加随机波动
  const randomFactor = 1 + (Math.random() - 0.5) * volatility * 2
  return Math.round(basePrice * multiplier * randomFactor)
}

/**
 * 获取探险收益
 * @param shipId 飞船ID
 * @param planetType 星球类型
 * @returns 收益范围
 */
export function getExpeditionReward(
  shipId: string,
  planetType: string
): { minCredits: number; maxCredits: number; minResearch: number; maxResearch: number; riskPercent: number } {
  const shipRewards = EXPEDITION_REWARD_TABLE[shipId]
  if (!shipRewards) {
    return { minCredits: 0, maxCredits: 0, minResearch: 0, maxResearch: 0, riskPercent: 100 }
  }
  return shipRewards[planetType] || { minCredits: 0, maxCredits: 0, minResearch: 0, maxResearch: 0, riskPercent: 100 }
}

export default {
  RESOURCE_PRODUCTION_TABLE,
  MARKET_PRICE_MULTIPLIERS,
  OFFLINE_EVENT_TABLE,
  EXPEDITION_REWARD_TABLE,
  FACILITY_UPGRADE_TABLE,
  TECH_RESEARCH_COST_TABLE,
  ACHIEVEMENT_REWARD_TABLE,
  getResourceProduction,
  getMarketPrice,
  getExpeditionReward,
}
