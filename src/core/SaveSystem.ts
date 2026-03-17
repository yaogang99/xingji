// src/core/SaveSystem.ts
// 存档系统 v2.0 - 10档位

export interface GameSaveData {
  version: string
  timestamp: number
  slotIndex: number          // 档位编号 (1-10)
  slotName: string           // 档位名称
  playTime: number           // 游戏时长(秒)
  credits: number
  researchPoints: number
  resources: Array<{
    id: string
    amount: number
  }>
  unlockedPlanets: string[]
  researchedTechs: string[]
  unlockedShips: string[]
  achievements: string[]
  planetData?: object        // 扩展行星数据
  facilities?: object        // 设施数据
  settings: {
    masterVolume: number
    bgmVolume: number
    sfxVolume: number
  }
}

export interface SaveSlotInfo {
  index: number
  exists: boolean
  name?: string
  timestamp?: number
  playTime?: number
  credits?: number
  researchPoints?: number
  achievementCount?: number
}

const SAVE_KEY_PREFIX = 'star_trade_station_save_slot_'
const VERSION = '1.0.0'
const MAX_SLOTS = 10

export class SaveSystem {
  // 获取档位key
  private static getKey(slotIndex: number): string {
    return `${SAVE_KEY_PREFIX}${slotIndex}`
  }

  // 保存到指定档位
  static save(slotIndex: number, slotName: string, data: Omit<GameSaveData, 'version' | 'timestamp' | 'slotIndex' | 'slotName' | 'playTime'>, playTime: number): boolean {
    if (slotIndex < 1 || slotIndex > MAX_SLOTS) {
      console.error('❌ 档位超出范围:', slotIndex)
      return false
    }
    
    try {
      const saveData: GameSaveData = {
        version: VERSION,
        timestamp: Date.now(),
        slotIndex,
        slotName,
        playTime,
        ...data
      }
      localStorage.setItem(this.getKey(slotIndex), JSON.stringify(saveData))
      console.log(`✅ 已保存到档位 ${slotIndex}: ${slotName}`)
      return true
    } catch (e) {
      console.error('❌ 保存失败:', e)
      return false
    }
  }

  // 加载指定档位
  static load(slotIndex: number): GameSaveData | null {
    if (slotIndex < 1 || slotIndex > MAX_SLOTS) return null
    
    try {
      const saved = localStorage.getItem(this.getKey(slotIndex))
      if (!saved) return null
      
      const data: GameSaveData = JSON.parse(saved)
      
      if (data.version !== VERSION) {
        console.warn(`⚠️ 档位${slotIndex}版本不匹配:`, data.version, 'vs', VERSION)
      }
      
      console.log(`✅ 已加载档位 ${slotIndex}: ${data.slotName}`)
      return data
    } catch (e) {
      console.error('❌ 加载失败:', e)
      return null
    }
  }

  // 检查档位是否存在
  static hasSave(slotIndex: number): boolean {
    if (slotIndex < 1 || slotIndex > MAX_SLOTS) return false
    return localStorage.getItem(this.getKey(slotIndex)) !== null
  }

  // 删除指定档位
  static delete(slotIndex: number): boolean {
    if (slotIndex < 1 || slotIndex > MAX_SLOTS) return false
    
    try {
      localStorage.removeItem(this.getKey(slotIndex))
      console.log(`✅ 档位 ${slotIndex} 已删除`)
      return true
    } catch (e) {
      console.error('❌ 删除失败:', e)
      return false
    }
  }

  // 获取所有档位信息
  static getAllSlots(): SaveSlotInfo[] {
    const slots: SaveSlotInfo[] = []
    
    for (let i = 1; i <= MAX_SLOTS; i++) {
      const saved = localStorage.getItem(this.getKey(i))
      
      if (saved) {
        try {
          const data: GameSaveData = JSON.parse(saved)
          slots.push({
            index: i,
            exists: true,
            name: data.slotName,
            timestamp: data.timestamp,
            playTime: data.playTime,
            credits: data.credits,
            researchPoints: data.researchPoints,
            achievementCount: data.achievements.length
          })
        } catch {
          slots.push({ index: i, exists: false })
        }
      } else {
        slots.push({ index: i, exists: false })
      }
    }
    
    return slots
  }

  // 获取空档位
  static getEmptySlot(): number {
    for (let i = 1; i <= MAX_SLOTS; i++) {
      if (!this.hasSave(i)) return i
    }
    return 0  // 无空档位
  }

  // 重命名档位
  static rename(slotIndex: number, newName: string): boolean {
    const data = this.load(slotIndex)
    if (!data) return false
    
    data.slotName = newName
    data.timestamp = Date.now()
    
    try {
      localStorage.setItem(this.getKey(slotIndex), JSON.stringify(data))
      console.log(`✅ 档位 ${slotIndex} 已重命名为: ${newName}`)
      return true
    } catch (e) {
      console.error('❌ 重命名失败:', e)
      return false
    }
  }

  // 导出指定档位
  static export(slotIndex: number): string | null {
    const saved = localStorage.getItem(this.getKey(slotIndex))
    return saved
  }

  // 导入到指定档位
  static import(slotIndex: number, saveString: string): boolean {
    if (slotIndex < 1 || slotIndex > MAX_SLOTS) return false
    
    try {
      const data = JSON.parse(saveString)
      if (data.version && data.timestamp) {
        data.slotIndex = slotIndex  // 更新档位号
        localStorage.setItem(this.getKey(slotIndex), JSON.stringify(data))
        console.log(`✅ 已导入到档位 ${slotIndex}`)
        return true
      }
      return false
    } catch (e) {
      console.error('❌ 导入失败:', e)
      return false
    }
  }

  // 快速保存（自动寻找空档位或覆盖最早存档）
  static quickSave(data: Omit<GameSaveData, 'version' | 'timestamp' | 'slotIndex' | 'slotName' | 'playTime'>, playTime: number): { success: boolean; slotIndex: number; isNewSlot: boolean } {
    // 先找空档位
    const emptySlot = this.getEmptySlot()
    if (emptySlot > 0) {
      const name = `存档 ${emptySlot}`
      const success = this.save(emptySlot, name, data, playTime)
      return { success, slotIndex: emptySlot, isNewSlot: true }
    }
    
    // 无空档位，找最早的存档覆盖
    const slots = this.getAllSlots()
    let oldestSlot = slots[0]
    
    for (const slot of slots) {
      if (slot.exists && slot.timestamp && oldestSlot.timestamp) {
        if (slot.timestamp < oldestSlot.timestamp!) {
          oldestSlot = slot
        }
      }
    }
    
    if (oldestSlot.exists) {
      const name = `存档 ${oldestSlot.index} (覆盖)`
      const success = this.save(oldestSlot.index, name, data, playTime)
      return { success, slotIndex: oldestSlot.index, isNewSlot: false }
    }
    
    return { success: false, slotIndex: 0, isNewSlot: false }
  }
}
