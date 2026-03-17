// src/core/OfflineEarnings.ts
// 离线收益系统 - 三段式收益计算

import { GameError, ErrorCode } from './ErrorHandler'

export interface OfflineEarningsResult {
  resources: Record<string, number>
  researchPoints: number
  events: OfflineEvent[]
  capped: boolean
  duration: number
  rate: number
}

export interface OfflineEvent {
  type: 'discovery' | 'combat' | 'trade' | 'anomaly'
  description: string
  rewards: Record<string, number>
}

export class OfflineEarnings {
  private readonly FULL_RATE_HOURS = 8
  private readonly REDUCED_RATE_HOURS = 24
  private readonly CAP_HOURS = 72

  calculateEarnings(
    offlineSeconds: number,
    facilities: FacilityForOffline[]
  ): OfflineEarningsResult {
    this.validateInput(offlineSeconds, facilities)
    
    const hours = offlineSeconds / 3600
    const rate = this.calculateRate(hours)
    const actualHours = Math.min(hours, this.CAP_HOURS)
    const capped = hours > this.CAP_HOURS

    const resources: Record<string, number> = {}
    let researchPoints = 0

    facilities.forEach(facility => {
      const output = facility.baseOutput * rate * actualHours * facility.count
      
      if (facility.outputType === 'research') {
        researchPoints += output
      } else {
        resources[facility.outputType] = (resources[facility.outputType] || 0) + output
      }
    })

    const events = this.generateEvents(hours)

    return {
      resources,
      researchPoints: Math.floor(researchPoints),
      events,
      capped,
      duration: actualHours * 3600,
      rate,
    }
  }

  private calculateRate(hours: number): number {
    if (hours <= this.FULL_RATE_HOURS) {
      return 1.0
    }
    if (hours <= this.REDUCED_RATE_HOURS) {
      return 0.8
    }
    return 0.5
  }

  private generateEvents(offlineHours: number): OfflineEvent[] {
    const events: OfflineEvent[] = []
    
    if (offlineHours <= this.FULL_RATE_HOURS) {
      return events
    }

    const eventCount = Math.min(
      Math.floor((offlineHours - this.FULL_RATE_HOURS) / 8),
      5
    )

    for (let i = 0; i < eventCount; i++) {
      events.push(this.generateRandomEvent())
    }

    return events
  }

  private generateRandomEvent(): OfflineEvent {
    const types: OfflineEvent['type'][] = ['discovery', 'combat', 'trade', 'anomaly']
    const weights = [0.4, 0.3, 0.2, 0.1]
    
    const type = this.weightedRandom(types, weights)
    
    const descriptions: Record<OfflineEvent['type'], string[]> = {
      discovery: ['发现富矿小行星', '找到古代残骸', '探测到冰彗星'],
      combat: ['遭遇海盗侦察船', '击退袭击者', '与外星探测器交火'],
      trade: ['遇到游牧商人', '发现黑市交易点', '紧急出售物资'],
      anomaly: ['发现时空异常', '遇到神秘信号', '探测到未知物体'],
    }

    return {
      type,
      description: this.randomPick(descriptions[type]),
      rewards: this.generateEventRewards(type),
    }
  }

  private generateEventRewards(type: OfflineEvent['type']): Record<string, number> {
    const rewards: Record<OfflineEvent['type'], Record<string, number>> = {
      discovery: { iron_ore: 100, copper_ore: 50 },
      combat: { credits: 500 },
      trade: { credits: 1000, fuel: 20 },
      anomaly: { researchPoints: 100 },
    }
    return rewards[type] || {}
  }

  private weightedRandom<T>(items: T[], weights: number[]): T {
    const total = weights.reduce((a, b) => a + b, 0)
    let random = Math.random() * total
    
    for (let i = 0; i < items.length; i++) {
      random -= weights[i]
      if (random <= 0) return items[i]
    }
    return items[items.length - 1]
  }

  private randomPick<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }

  private validateInput(seconds: number, facilities: FacilityForOffline[]): void {
    if (seconds < 0) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, 'Offline time cannot be negative')
    }
    if (!Array.isArray(facilities)) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, 'Facilities must be an array')
    }
  }
}

interface FacilityForOffline {
  baseOutput: number
  outputType: string
  count: number
}