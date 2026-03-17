// src/data/facilities.ts
// 33种设施定义

export interface FacilityRecipe {
  input: Record<string, number>
  output: Record<string, number>
  duration: number // 秒
}

export interface FacilityDefinition {
  id: string
  name: string
  type: 'gathering' | 'processing' | 'manufacturing' | 'special'
  tier: 1 | 2 | 3 | 4 | 5
  powerConsumption: number
  baseOutput: number
  recipes: FacilityRecipe[]
  unlockCost: number
  description: string
  maxLevel: number
}

// T1 采集设施 (5种)
const T1_GATHERING: FacilityDefinition[] = [
  {
    id: 'mining_drill',
    name: '采矿钻机',
    type: 'gathering',
    tier: 1,
    powerConsumption: 5,
    baseOutput: 1.0,
    recipes: [
      { input: {}, output: { iron_ore: 1 }, duration: 10 },
      { input: {}, output: { copper_ore: 1 }, duration: 12 },
      { input: {}, output: { aluminum_ore: 1 }, duration: 11 },
    ],
    unlockCost: 0,
    description: '基础采矿设施，可采集多种矿石',
    maxLevel: 10,
  },
  {
    id: 'ice_extractor',
    name: '冰矿提取器',
    type: 'gathering',
    tier: 1,
    powerConsumption: 4,
    baseOutput: 1.2,
    recipes: [
      { input: {}, output: { ice: 1 }, duration: 8 },
    ],
    unlockCost: 500,
    description: '专门提取冰资源的设施',
    maxLevel: 10,
  },
  {
    id: 'gas_collector',
    name: '气体收集器',
    type: 'gathering',
    tier: 1,
    powerConsumption: 6,
    baseOutput: 0.8,
    recipes: [
      { input: {}, output: { hydrogen: 1 }, duration: 15 },
      { input: {}, output: { helium: 1 }, duration: 20 },
    ],
    unlockCost: 800,
    description: '收集气态资源',
    maxLevel: 10,
  },
  {
    id: 'silicon_mine',
    name: '硅矿场',
    type: 'gathering',
    tier: 1,
    powerConsumption: 5,
    baseOutput: 0.9,
    recipes: [
      { input: {}, output: { silicon_ore: 1 }, duration: 14 },
    ],
    unlockCost: 1000,
    description: '开采硅矿石',
    maxLevel: 10,
  },
  {
    id: 'carbon_extractor',
    name: '碳提取器',
    type: 'gathering',
    tier: 1,
    powerConsumption: 3,
    baseOutput: 1.5,
    recipes: [
      { input: {}, output: { carbon: 1 }, duration: 6 },
    ],
    unlockCost: 600,
    description: '提取碳资源',
    maxLevel: 10,
  },
]

// T2 加工设施 (8种)
const T2_PROCESSING: FacilityDefinition[] = [
  {
    id: 'smelter',
    name: '冶炼炉',
    type: 'processing',
    tier: 2,
    powerConsumption: 15,
    baseOutput: 0.5,
    recipes: [
      { input: { iron_ore: 2 }, output: { iron_plate: 1 }, duration: 20 },
      { input: { copper_ore: 2 }, output: { copper_wire: 1 }, duration: 20 },
      { input: { aluminum_ore: 2 }, output: { aluminum_sheet: 1 }, duration: 20 },
    ],
    unlockCost: 2000,
    description: '将矿石冶炼成基础材料',
    maxLevel: 10,
  },
  {
    id: 'ice_processor',
    name: '冰处理器',
    type: 'processing',
    tier: 2,
    powerConsumption: 10,
    baseOutput: 0.8,
    recipes: [
      { input: { ice: 2 }, output: { water: 1 }, duration: 10 },
    ],
    unlockCost: 1500,
    description: '将冰加工成水',
    maxLevel: 10,
  },
  {
    id: 'silicon_refinery',
    name: '硅精炼厂',
    type: 'processing',
    tier: 2,
    powerConsumption: 12,
    baseOutput: 0.6,
    recipes: [
      { input: { silicon_ore: 2 }, output: { silicon_wafer: 1 }, duration: 25 },
    ],
    unlockCost: 2500,
    description: '精炼硅矿石成硅片',
    maxLevel: 10,
  },
  {
    id: 'steel_mill',
    name: '钢铁厂',
    type: 'processing',
    tier: 2,
    powerConsumption: 18,
    baseOutput: 0.4,
    recipes: [
      { input: { iron_plate: 2, carbon: 1 }, output: { steel: 1 }, duration: 30 },
    ],
    unlockCost: 3000,
    description: '生产钢材',
    maxLevel: 10,
  },
  {
    id: 'fuel_plant',
    name: '燃料厂',
    type: 'processing',
    tier: 2,
    powerConsumption: 20,
    baseOutput: 0.5,
    recipes: [
      { input: { hydrogen: 3, carbon: 2 }, output: { fuel: 1 }, duration: 20 },
    ],
    unlockCost: 3500,
    description: '生产飞船燃料',
    maxLevel: 10,
  },
  {
    id: 'plastic_factory',
    name: '塑料工厂',
    type: 'processing',
    tier: 2,
    powerConsumption: 14,
    baseOutput: 0.6,
    recipes: [
      { input: { carbon: 3, hydrogen: 2 }, output: { plastic: 1 }, duration: 18 },
    ],
    unlockCost: 2800,
    description: '生产塑料',
    maxLevel: 10,
  },
  {
    id: 'advanced_smelter',
    name: '高级冶炼炉',
    type: 'processing',
    tier: 2,
    powerConsumption: 25,
    baseOutput: 0.8,
    recipes: [
      { input: { iron_ore: 1.5 }, output: { iron_plate: 1 }, duration: 15 },
      { input: { copper_ore: 1.5 }, output: { copper_wire: 1 }, duration: 15 },
      { input: { aluminum_ore: 1.5 }, output: { aluminum_sheet: 1 }, duration: 15 },
    ],
    unlockCost: 5000,
    description: '高效冶炼设施',
    maxLevel: 10,
  },
  {
    id: 'gas_processor',
    name: '气体加工厂',
    type: 'processing',
    tier: 2,
    powerConsumption: 16,
    baseOutput: 0.7,
    recipes: [
      { input: { hydrogen: 2 }, output: { fuel: 0.5 }, duration: 12 },
    ],
    unlockCost: 3200,
    description: '加工气态资源',
    maxLevel: 10,
  },
]

// T3 制造设施 (12种)
const T3_MANUFACTURING: FacilityDefinition[] = [
  {
    id: 'circuit_factory',
    name: '电路板工厂',
    type: 'manufacturing',
    tier: 3,
    powerConsumption: 40,
    baseOutput: 0.2,
    recipes: [
      { input: { silicon_wafer: 2, copper_wire: 3, plastic: 1 }, output: { circuit: 1 }, duration: 40 },
    ],
    unlockCost: 8000,
    description: '生产电子电路板',
    maxLevel: 10,
  },
  {
    id: 'battery_factory',
    name: '电池工厂',
    type: 'manufacturing',
    tier: 3,
    powerConsumption: 35,
    baseOutput: 0.25,
    recipes: [
      { input: { aluminum_sheet: 2, copper_wire: 2, plastic: 1 }, output: { battery: 1 }, duration: 35 },
    ],
    unlockCost: 7000,
    description: '生产电池',
    maxLevel: 10,
  },
  {
    id: 'solar_panel_factory',
    name: '太阳能板工厂',
    type: 'manufacturing',
    tier: 3,
    powerConsumption: 45,
    baseOutput: 0.15,
    recipes: [
      { input: { silicon_wafer: 3, aluminum_sheet: 2, copper_wire: 2 }, output: { solar_panel: 1 }, duration: 50 },
    ],
    unlockCost: 10000,
    description: '生产太阳能板',
    maxLevel: 10,
  },
  {
    id: 'engine_factory',
    name: '引擎工厂',
    type: 'manufacturing',
    tier: 3,
    powerConsumption: 60,
    baseOutput: 0.12,
    recipes: [
      { input: { steel: 3, aluminum_sheet: 2, circuit: 1, fuel: 2 }, output: { engine: 1 }, duration: 60 },
    ],
    unlockCost: 12000,
    description: '生产飞船引擎',
    maxLevel: 10,
  },
  {
    id: 'sensor_factory',
    name: '传感器工厂',
    type: 'manufacturing',
    tier: 3,
    powerConsumption: 50,
    baseOutput: 0.15,
    recipes: [
      { input: { silicon_wafer: 2, copper_wire: 3, circuit: 1 }, output: { sensor: 1 }, duration: 45 },
    ],
    unlockCost: 11000,
    description: '生产传感器',
    maxLevel: 10,
  },
  {
    id: 'display_factory',
    name: '显示屏工厂',
    type: 'manufacturing',
    tier: 3,
    powerConsumption: 42,
    baseOutput: 0.18,
    recipes: [
      { input: { silicon_wafer: 2, plastic: 2, copper_wire: 1 }, output: { display: 1 }, duration: 40 },
    ],
    unlockCost: 9500,
    description: '生产显示屏',
    maxLevel: 10,
  },
  {
    id: 'motor_factory',
    name: '电机工厂',
    type: 'manufacturing',
    tier: 3,
    powerConsumption: 48,
    baseOutput: 0.16,
    recipes: [
      { input: { steel: 2, copper_wire: 3, aluminum_sheet: 1 }, output: { motor: 1 }, duration: 42 },
    ],
    unlockCost: 10500,
    description: '生产电机',
    maxLevel: 10,
  },
  {
    id: 'composite_factory',
    name: '复合材料工厂',
    type: 'manufacturing',
    tier: 3,
    powerConsumption: 55,
    baseOutput: 0.14,
    recipes: [
      { input: { steel: 2, plastic: 3, carbon: 2 }, output: { composite: 1 }, duration: 48 },
    ],
    unlockCost: 11500,
    description: '生产高级复合材料',
    maxLevel: 10,
  },
  {
    id: 'electronic_factory',
    name: '电子工厂',
    type: 'manufacturing',
    tier: 3,
    powerConsumption: 50,
    baseOutput: 0.2,
    recipes: [
      { input: { circuit: 2, battery: 1, plastic: 1 }, output: { ai_chip: 0.2 }, duration: 60 },
    ],
    unlockCost: 15000,
    description: '生产AI芯片',
    maxLevel: 10,
  },
  {
    id: 'weapon_factory',
    name: '武器工厂',
    type: 'manufacturing',
    tier: 3,
    powerConsumption: 70,
    baseOutput: 0.1,
    recipes: [
      { input: { steel: 4, circuit: 2, battery: 1 }, output: { sensor: 0.5 }, duration: 55 }, // 实际上是武器组件
    ],
    unlockCost: 14000,
    description: '生产武器组件',
    maxLevel: 10,
  },
  {
    id: 'shield_factory',
    name: '护盾工厂',
    type: 'manufacturing',
    tier: 3,
    powerConsumption: 65,
    baseOutput: 0.12,
    recipes: [
      { input: { composite: 2, circuit: 2, battery: 2 }, output: { display: 0.3 }, duration: 50 }, // 护盾组件
    ],
    unlockCost: 13500,
    description: '生产护盾发生器',
    maxLevel: 10,
  },
  {
    id: 'life_support',
    name: '生命维持系统',
    type: 'manufacturing',
    tier: 3,
    powerConsumption: 30,
    baseOutput: 0.3,
    recipes: [
      { input: { water: 2, plastic: 2, circuit: 1 }, output: { water: 3 }, duration: 30 }, // 回收水
    ],
    unlockCost: 9000,
    description: '生命维持和水循环系统',
    maxLevel: 10,
  },
]

// T4 特殊设施 (4种)
const T4_SPECIAL: FacilityDefinition[] = [
  {
    id: 'quantum_lab',
    name: '量子实验室',
    type: 'special',
    tier: 4,
    powerConsumption: 100,
    baseOutput: 0.05,
    recipes: [
      { input: { ai_chip: 5, circuit: 10, steel: 5 }, output: { quantum_core: 1 }, duration: 120 },
    ],
    unlockCost: 50000,
    description: '生产量子核心',
    maxLevel: 5,
  },
  {
    id: 'fusion_reactor',
    name: '聚变反应堆',
    type: 'special',
    tier: 4,
    powerConsumption: 80,
    baseOutput: 0.08,
    recipes: [
      { input: { fuel: 5, steel: 3, circuit: 3 }, output: { fusion_cell: 1 }, duration: 100 },
    ],
    unlockCost: 45000,
    description: '生产聚变电池',
    maxLevel: 5,
  },
  {
    id: 'gravity_generator',
    name: '重力发生器',
    type: 'special',
    tier: 4,
    powerConsumption: 120,
    baseOutput: 0.04,
    recipes: [
      { input: { quantum_core: 0.5, fusion_cell: 2, composite: 5 }, output: { gravity_module: 1 }, duration: 150 },
    ],
    unlockCost: 80000,
    description: '生产重力模块',
    maxLevel: 5,
  },
  {
    id: 'teleporter',
    name: '传送装置',
    type: 'special',
    tier: 4,
    powerConsumption: 150,
    baseOutput: 0,
    recipes: [
      { input: { quantum_core: 1, energy: 100 }, output: {}, duration: 1 }, // 瞬间传送，消耗量子核心
    ],
    unlockCost: 100000,
    description: '瞬间运输资源',
    maxLevel: 3,
  },
]

// T5 顶级设施 (4种)
const T5_SPECIAL: FacilityDefinition[] = [
  {
    id: 'alien_tech_lab',
    name: '外星科技实验室',
    type: 'special',
    tier: 5,
    powerConsumption: 200,
    baseOutput: 0.02,
    recipes: [
      { input: { quantum_core: 2, fusion_cell: 5, ai_chip: 10 }, output: { alien_artifact: 1 }, duration: 300 },
    ],
    unlockCost: 200000,
    description: '研究外星科技，生产外星遗物',
    maxLevel: 3,
  },
  {
    id: 'stellar_forge',
    name: '恒星熔炉',
    type: 'special',
    tier: 5,
    powerConsumption: 250,
    baseOutput: 0.01,
    recipes: [
      { input: { alien_artifact: 1, gravity_module: 2, fusion_cell: 10 }, output: { stellar_gem: 1 }, duration: 600 },
    ],
    unlockCost: 500000,
    description: '利用恒星能量生产星辰宝石',
    maxLevel: 3,
  },
  {
    id: 'dyson_panel',
    name: '戴森球组件工厂',
    type: 'special',
    tier: 5,
    powerConsumption: 180,
    baseOutput: 0.05,
    recipes: [
      { input: { solar_panel: 10, steel: 20, circuit: 5 }, output: { ai_chip: 2 }, duration: 200 },
    ],
    unlockCost: 300000,
    description: '生产戴森球组件',
    maxLevel: 3,
  },
  {
    id: 'multiverse_portal',
    name: '多元宇宙传送门',
    type: 'special',
    tier: 5,
    powerConsumption: 500,
    baseOutput: 0,
    recipes: [
      { input: { stellar_gem: 1, quantum_core: 5, energy: 1000 }, output: {}, duration: 1 },
    ],
    unlockCost: 1000000,
    description: '开启多元宇宙贸易通道',
    maxLevel: 1,
  },
]

// 导出所有设施
export const ALL_FACILITIES: FacilityDefinition[] = [
  ...T1_GATHERING,
  ...T2_PROCESSING,
  ...T3_MANUFACTURING,
  ...T4_SPECIAL,
  ...T5_SPECIAL,
]

// 统计
console.log(`总设施数量: ${ALL_FACILITIES.length}`)
console.log(`T1采集: ${T1_GATHERING.length}`)
console.log(`T2加工: ${T2_PROCESSING.length}`)
console.log(`T3制造: ${T3_MANUFACTURING.length}`)
console.log(`T4特殊: ${T4_SPECIAL.length}`)
console.log(`T5顶级: ${T5_SPECIAL.length}`)
