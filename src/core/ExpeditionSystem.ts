// src/core/ExpeditionSystem.ts
// 探险系统 - 飞船派遣与事件处理

import { GameError, ErrorCode } from './ErrorHandler'
import { ALL_SHIPS, ShipDefinition } from '../data/ships'

export interface Ship {
  id: string
  name: string
  cargo: number
  speed: number
  combatPower: number
  equipment: ShipEquipment[]
  status: 'idle' | 'expedition' | 'returning' | 'locked'
  currentExpedition?: Expedition
}

export interface ShipEquipment {
  id: string
  name: string
  type: 'engine' | 'weapon' | 'shield' | 'cargo' | 'sensor'
  power: number
}

export interface Expedition {
  id: string
  shipId: string
  destination: string
  duration: number
  startTime: number
  status: 'ongoing' | 'completed' | 'failed'
  events: ExpeditionEvent[]
}

export interface ExpeditionEvent {
  type: 'discovery' | 'combat' | 'trade' | 'anomaly'
  title: string
  description: string
  rewards?: EventReward
  damage?: number
}

export interface EventReward {
  credits?: number
  resources?: Record<string, number>
  researchPoints?: number
}

export const EVENT_TYPES = ['discovery', 'combat', 'trade', 'anomaly'] as const
export const EVENT_WEIGHTS = [0.4, 0.3, 0.2, 0.1] as const
export const BASE_EXPEDITION_DURATION = 300 // 5分钟

export class ExpeditionSystem {
  private ships: Map<string, Ship> = new Map()
  private expeditions: Map<string, Expedition> = new Map()
  private randomSeed = Date.now()

  constructor() {
    this.initializeShipsFromData()
  }

  private initializeShipsFromData(): void {
    // 从ships.ts加载55艘飞船
    // 默认解锁前3艘，其余需要购买解锁
    ALL_SHIPS.forEach((shipDef: ShipDefinition, index: number) => {
      const ship: Ship = {
        id: shipDef.id,
        name: shipDef.name,
        cargo: shipDef.cargo,
        speed: shipDef.speed,
        combatPower: shipDef.combatPower,
        equipment: shipDef.equipment.map(eq => ({ ...eq })),
        status: index < 3 ? 'idle' : 'locked', // 前3艘默认可用
      }
      this.ships.set(ship.id, ship)
    })
  }

  // 获取已解锁的飞船
  getUnlockedShips(): Ship[] {
    return this.getAllShips().filter(s => s.status !== 'locked')
  }

  // 解锁飞船
  unlockShip(shipId: string, credits: number): boolean {
    const ship = this.ships.get(shipId)
    if (!ship) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, `Ship not found: ${shipId}`)
    }
    if (ship.status !== 'locked') {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, 'Ship already unlocked')
    }

    const shipDef = ALL_SHIPS.find(s => s.id === shipId)
    if (!shipDef) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, `Ship definition not found: ${shipId}`)
    }

    if (credits < shipDef.unlockCost) {
      throw new GameError(ErrorCode.INSUFFICIENT_FUNDS, 'Insufficient credits to unlock ship')
    }

    ship.status = 'idle'
    return true
  }

  // 获取飞船解锁成本
  getShipUnlockCost(shipId: string): number {
    const shipDef = ALL_SHIPS.find(s => s.id === shipId)
    return shipDef?.unlockCost || 0
  }

  // 获取所有飞船定义
  getAllShipDefinitions(): ShipDefinition[] {
    return ALL_SHIPS
  }

  addShip(ship: Ship): void {
    this.validateShip(ship)
    this.ships.set(ship.id, ship)
  }

  removeShip(shipId: string): void {
    const ship = this.ships.get(shipId)
    if (!ship) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, `Ship not found: ${shipId}`)
    }
    if (ship.status !== 'idle') {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, 'Cannot remove ship on expedition')
    }
    this.ships.delete(shipId)
  }

  startExpedition(shipId: string, destination: string): Expedition {
    const ship = this.ships.get(shipId)
    if (!ship) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, `Ship not found: ${shipId}`)
    }
    if (ship.status !== 'idle') {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, 'Ship is not idle')
    }

    const expedition: Expedition = {
      id: `exp_${Date.now()}_${shipId}`,
      shipId,
      destination,
      duration: this.calculateDuration(ship),
      startTime: Date.now(),
      status: 'ongoing',
      events: [],
    }

    ship.status = 'expedition'
    ship.currentExpedition = expedition
    this.expeditions.set(expedition.id, expedition)

    return expedition
  }

  completeExpedition(expeditionId: string): ExpeditionEvent[] {
    const expedition = this.expeditions.get(expeditionId)
    if (!expedition) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, `Expedition not found: ${expeditionId}`)
    }

    const ship = this.ships.get(expedition.shipId)
    if (!ship) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, `Ship not found: ${expedition.shipId}`)
    }

    const elapsed = (Date.now() - expedition.startTime) / 1000
    if (elapsed < expedition.duration) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, 'Expedition not yet complete')
    }

    const events = this.generateEvents(ship, expedition.destination)
    expedition.events = events
    expedition.status = 'completed'
    ship.status = 'returning'

    return events
  }

  returnShip(shipId: string): void {
    const ship = this.ships.get(shipId)
    if (!ship) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, `Ship not found: ${shipId}`)
    }
    if (ship.status !== 'returning') {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, 'Ship is not returning')
    }
    ship.status = 'idle'
    ship.currentExpedition = undefined
  }

  private calculateDuration(ship: Ship): number {
    const baseDuration = BASE_EXPEDITION_DURATION
    const speedFactor = Math.max(0.5, Math.min(2.0, 10 / ship.speed))
    return Math.floor(baseDuration * speedFactor)
  }

  private generateEvents(ship: Ship, destination: string): ExpeditionEvent[] {
    const eventCount = Math.floor(Math.random() * 3) + 1
    const events: ExpeditionEvent[] = []

    for (let i = 0; i < eventCount; i++) {
      events.push(this.generateRandomEvent(ship, destination))
    }

    return events
  }

  private generateRandomEvent(ship: Ship, destination: string): ExpeditionEvent {
    const type = this.weightedRandom(EVENT_TYPES, EVENT_WEIGHTS)
    
    switch (type) {
      case 'discovery':
        return this.generateDiscoveryEvent(destination)
      case 'combat':
        return this.generateCombatEvent(ship)
      case 'trade':
        return this.generateTradeEvent()
      case 'anomaly':
        return this.generateAnomalyEvent()
      default:
        return this.generateDiscoveryEvent(destination)
    }
  }

  private generateDiscoveryEvent(_destination: string): ExpeditionEvent {
    const discoveries = [
      { title: '富矿小行星', desc: '发现富含矿物的小行星', resource: 'iron_ore', amount: 100 },
      { title: '古代残骸', desc: '发现古代飞船残骸', resource: 'steel', amount: 50 },
      { title: '冰彗星', desc: '发现富含冰的彗星', resource: 'ice', amount: 200 },
    ]
    const discovery = discoveries[Math.floor(Math.random() * discoveries.length)]
    
    return {
      type: 'discovery',
      title: discovery.title,
      description: discovery.desc,
      rewards: {
        resources: { [discovery.resource]: discovery.amount },
      },
    }
  }

  private generateCombatEvent(ship: Ship): ExpeditionEvent {
    const enemyPower = Math.floor(Math.random() * 50) + 20
    const shipPower = this.calculateShipPower(ship)
    
    if (shipPower > enemyPower) {
      return {
        type: 'combat',
        title: '战斗胜利',
        description: `击败海盗飞船（战力${enemyPower}）`,
        rewards: {
          credits: enemyPower * 10,
        },
      }
    } else {
      const damage = Math.floor((enemyPower - shipPower) * 0.5)
      return {
        type: 'combat',
        title: '战斗受损',
        description: `遭遇强敌（战力${enemyPower}），飞船受损`,
        damage,
      }
    }
  }

  private generateTradeEvent(): ExpeditionEvent {
    return {
      type: 'trade',
      title: '偶遇商人',
      description: '遇到游牧商人，进行有利可图的交易',
      rewards: {
        credits: 500 + Math.floor(Math.random() * 500),
        resources: { fuel: 20 + Math.floor(Math.random() * 20) },
      },
    }
  }

  private generateAnomalyEvent(): ExpeditionEvent {
    return {
      type: 'anomaly',
      title: '时空异常',
      description: '发现神秘的时空异常，研究获得宝贵数据',
      rewards: {
        researchPoints: 100 + Math.floor(Math.random() * 50),
      },
    }
  }

  private calculateShipPower(ship: Ship): number {
    const basePower = ship.combatPower
    const equipmentPower = ship.equipment.reduce((sum, eq) => sum + eq.power, 0)
    return basePower + equipmentPower
  }

  private weightedRandom<T>(items: readonly T[], weights: readonly number[]): T {
    const total = weights.reduce((a, b) => a + b, 0)
    let random = this.seededRandom() * total
    
    for (let i = 0; i < items.length; i++) {
      random -= weights[i]
      if (random <= 0) return items[i]
    }
    return items[items.length - 1]
  }

  private seededRandom(): number {
    this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280
    return this.randomSeed / 233280
  }

  private validateShip(ship: Ship): void {
    if (!ship.id || !ship.name) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, 'Ship must have id and name')
    }
    if (ship.cargo < 0 || ship.speed <= 0) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, 'Invalid ship stats')
    }
  }

  getShip(shipId: string): Ship | undefined {
    return this.ships.get(shipId)
  }

  getAllShips(): Ship[] {
    return Array.from(this.ships.values())
  }

  getIdleShips(): Ship[] {
    return this.getAllShips().filter(s => s.status === 'idle')
  }

  getExpedition(expeditionId: string): Expedition | undefined {
    return this.expeditions.get(expeditionId)
  }

  getOngoingExpeditions(): Expedition[] {
    return Array.from(this.expeditions.values())
      .filter(e => e.status === 'ongoing')
  }
}