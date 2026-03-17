// src/core/MarketSystem.ts
// 市场系统 - 价格波动与交易

import { GameError, ErrorCode } from './ErrorHandler'
import resourcesData from '../data/resources.json'

export interface MarketPrice {
  resourceId: string
  basePrice: number
  currentPrice: number
  volatility: number
  lastUpdate: number
}

/**
 * 市场系统 - 管理资源价格波动与交易
 * 
 * 核心算法:
 * 1. 价格波动基于正弦周期 + 随机波动
 * 2. 价格范围限制在基准价的 ±30%
 * 3. 维护100条历史价格记录用于趋势分析
 */
export class MarketSystem {
  private prices: Map<string, MarketPrice> = new Map()
  private priceHistory: Map<string, number[]> = new Map()
  private readonly MAX_HISTORY = 100

  constructor(resourceIds: string[]) {
    resourceIds.forEach(id => this.initializePrice(id))
  }

  private initializePrice(resourceId: string): void {
    const resource = resourcesData.find(r => r.id === resourceId)
    if (!resource) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, `Resource not found: ${resourceId}`)
    }
    
    this.prices.set(resourceId, {
      resourceId,
      basePrice: resource.baseValue,
      currentPrice: resource.baseValue,
      volatility: resource.marketVolatility,
      lastUpdate: Date.now(),
    })
    this.priceHistory.set(resourceId, [resource.baseValue])
  }

  /**
   * 更新所有资源的市场价格
   * 
   * 伪代码:
   * ```
   * for each resource in prices:
   *   newPrice = calculateNewPrice(resource)
   *   resource.currentPrice = newPrice
   *   add newPrice to priceHistory[resourceId]
   *   if history.length > 100:
   *     remove oldest entry
   * ```
   */
  updatePrices(): void {
    this.prices.forEach((price, resourceId) => {
      const newPrice = this.calculateNewPrice(price)
      price.currentPrice = newPrice
      price.lastUpdate = Date.now()
      
      const history = this.priceHistory.get(resourceId) || []
      history.push(newPrice)
      if (history.length > this.MAX_HISTORY) {
        history.shift()
      }
      this.priceHistory.set(resourceId, history)
    })
  }

  /**
   * 计算新的市场价格
   * 
   * 算法公式:
   * ```
   * cycle = sin(currentTime / 1hour * 2π)  // 正弦周期，1小时一个周期
   * random = (random() - 0.5) * volatility  // 随机波动
   * variation = cycle * 0.1 + random         // 总变化率
   * 
   * newPrice = basePrice * (1 + variation)
   * 
   * // 边界限制
   * minPrice = basePrice * 0.7   // -30%
   * maxPrice = basePrice * 1.3   // +30%
   * return clamp(newPrice, minPrice, maxPrice)
   * ```
   * 
   * @param price - 当前市场价格对象
   * @returns 计算后的新价格
   */
  private calculateNewPrice(price: MarketPrice): number {
    // 计算时间周期因子 (1小时一个完整正弦波)
    const cycle = Math.sin(Date.now() / 1000 / 60 / 60 * Math.PI * 2)
    // 计算随机波动
    const randomVolatility = (Math.random() - 0.5) * price.volatility
    // 总变化 = 周期变化(权重10%) + 随机波动
    const variation = cycle * 0.1 + randomVolatility
    
    // 应用变化率
    const newPrice = price.basePrice * (1 + variation)
    // 边界限制
    const minPrice = price.basePrice * 0.7
    const maxPrice = price.basePrice * 1.3
    
    return Math.max(minPrice, Math.min(maxPrice, newPrice))
  }

  /**
   * 获取资源的当前市场价格
   * 
   * @param resourceId - 资源唯一标识符
   * @returns 当前市场价格（信用点）
   * @throws {GameError} 当资源不存在时抛出 INITIALIZATION_FAILED 错误
   * 
   * @example
   * const price = marketSystem.getPrice('iron_ore'); // 返回 10.5
   */
  getPrice(resourceId: string): number {
    const price = this.prices.get(resourceId)
    if (!price) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, `Resource not found in market: ${resourceId}`)
    }
    return price.currentPrice
  }

  /**
   * 获取资源价格趋势
   * 
   * 算法:
   * ```
   * recent = 最近5条历史价格
   * old = 最早5条历史价格
   * change = (avg(recent) - avg(old)) / avg(old)
   * 
   * if change > 5%:  return 'up'
   * if change < -5%: return 'down'
   * else:            return 'stable'
   * ```
   * 
   * @param resourceId - 资源唯一标识符
   * @returns 'up' | 'down' | 'stable' - 价格趋势
   */
  getPriceTrend(resourceId: string): 'up' | 'down' | 'stable' {
    const history = this.priceHistory.get(resourceId)
    if (!history || history.length < 2) return 'stable'
    
    const recent = history.slice(-5)
    const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length
    const avgOld = history.slice(0, 5).reduce((a, b) => a + b, 0) / 5
    
    const change = (avgRecent - avgOld) / avgOld
    if (change > 0.05) return 'up'
    if (change < -0.05) return 'down'
    return 'stable'
  }
}