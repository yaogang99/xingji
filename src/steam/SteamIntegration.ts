// src/steam/SteamIntegration.ts
// Steam集成系统 - 成就+云存档+统计

import { GameError, ErrorCode } from '../core/ErrorHandler'

export interface SteamAchievement {
  id: string
  name: string
  description: string
  unlocked: boolean
  unlockTime?: number
}

export class SteamAchievementManager {
  private achievements: Map<string, SteamAchievement> = new Map()
  private unlockedCache: Set<string> = new Set()

  constructor() {
    this.initializeAchievements()
  }

  private initializeAchievements(): void {
    const achievementList: SteamAchievement[] = [
      { id: 'first_steps', name: '第一步', description: '建造第一个设施', unlocked: false },
      { id: 'industrial_revolution', name: '工业革命', description: '拥有10个设施', unlocked: false },
      { id: 'automation_king', name: '自动化之王', description: '拥有50个设施', unlocked: false },
      { id: 'first_million', name: '第一桶金', description: '总资产达到100万', unlocked: false },
      { id: 'billionaire', name: '亿万富翁', description: '总资产达到10亿', unlocked: false },
      { id: 'trillionaire', name: '万亿巨头', description: '总资产达到1万亿', unlocked: false },
      { id: 'explorer', name: '探索者', description: '解锁第2个星球', unlocked: false },
      { id: 'colonizer', name: '殖民者', description: '解锁5个星球', unlocked: false },
      { id: 'galactic_emperor', name: '银河皇帝', description: '解锁所有核心星球', unlocked: false },
      { id: 'scientist', name: '科学家', description: '研究第一个科技', unlocked: false },
      { id: 'tech_guru', name: '科技大师', description: '研究10个科技', unlocked: false },
      { id: 'tech_genius', name: '科技天才', description: '研究所有科技', unlocked: false },
      { id: 'captain', name: '船长', description: '拥有第一艘飞船', unlocked: false },
      { id: 'fleet_commander', name: '舰队指挥官', description: '拥有5艘飞船', unlocked: false },
      { id: 'adventurer', name: '冒险家', description: '完成第一次探险', unlocked: false },
      { id: 'seasoned_explorer', name: '资深探险家', description: '完成10次探险', unlocked: false },
      { id: 'trader', name: '商人', description: '累计交易100万信用点', unlocked: false },
      { id: 'master_trader', name: '贸易大师', description: '累计交易10亿信用点', unlocked: false },
      { id: 'hard_worker', name: '勤劳者', description: '累计游戏时间24小时', unlocked: false },
      { id: 'dedicated_player', name: '忠实玩家', description: '累计游戏时间7天', unlocked: false },
    ]

    achievementList.forEach(a => this.achievements.set(a.id, a))
  }

  unlockAchievement(achievementId: string): void {
    if (this.unlockedCache.has(achievementId)) return

    const achievement = this.achievements.get(achievementId)
    if (!achievement) {
      throw new GameError(ErrorCode.UNKNOWN_ERROR, `Achievement not found: ${achievementId}`)
    }

    achievement.unlocked = true
    achievement.unlockTime = Date.now()
    this.unlockedCache.add(achievementId)

    this.showAchievementPopup(achievement)
    this.syncToSteam(achievementId)
  }

  private showAchievementPopup(achievement: SteamAchievement): void {
    console.log(`🏆 解锁成就: ${achievement.name} - ${achievement.description}`)
  }

  private syncToSteam(achievementId: string): void {
    if (window.Steamworks) {
      window.Steamworks.unlockAchievement(achievementId)
    }
  }

  isUnlocked(achievementId: string): boolean {
    return this.unlockedCache.has(achievementId)
  }

  getProgress(): { total: number; unlocked: number } {
    return {
      total: this.achievements.size,
      unlocked: this.unlockedCache.size,
    }
  }

  getAllAchievements(): SteamAchievement[] {
    return Array.from(this.achievements.values())
  }
}

export class SteamCloudManager {
  private readonly SAVE_KEY = 'star_trade_station_save'
  private readonly CLOUD_KEY = 'star_trade_station_cloud'

  async saveToCloud(data: any): Promise<boolean> {
    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(data))
      
      if (window.Steamworks?.cloud) {
        await window.Steamworks.cloud.save(this.CLOUD_KEY, JSON.stringify(data))
      }
      
      return true
    } catch (e) {
      console.error('Cloud save failed:', e)
      return false
    }
  }

  async loadFromCloud(): Promise<any | null> {
    try {
      const localData = localStorage.getItem(this.SAVE_KEY)
      
      if (window.Steamworks?.cloud) {
        const cloudData = await window.Steamworks.cloud.load(this.CLOUD_KEY)
        if (cloudData) {
          return JSON.parse(cloudData)
        }
      }
      
      return localData ? JSON.parse(localData) : null
    } catch (e) {
      console.error('Cloud load failed:', e)
      return null
    }
  }
}

export class SteamStatsManager {
  private stats: Map<string, number> = new Map()

  incrementStat(statName: string, value: number = 1): void {
    const current = this.stats.get(statName) || 0
    this.stats.set(statName, current + value)
    
    if (window.Steamworks?.stats) {
      window.Steamworks.stats.set(statName, current + value)
    }
  }

  getStat(statName: string): number {
    return this.stats.get(statName) || 0
  }
}

// Steamworks类型声明
declare global {
  interface Window {
    Steamworks?: {
      unlockAchievement: (id: string) => void
      cloud?: {
        save: (key: string, data: string) => Promise<void>
        load: (key: string) => Promise<string | null>
      }
      stats?: {
        set: (name: string, value: number) => void
      }
    }
  }
}