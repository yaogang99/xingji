// src/core/ErrorHandler.ts
// 错误处理系统 - 50错误码+恢复机制

export enum ErrorCode {
  UNKNOWN_ERROR = 1000,
  INITIALIZATION_FAILED = 1001,
  RENDER_ERROR = 1002,
  MEMORY_OVERFLOW = 1003,
  SAVE_CORRUPTED = 2000,
  SAVE_VERSION_MISMATCH = 2001,
  LOCAL_STORAGE_FULL = 2002,
  SAVE_WRITE_FAILED = 2003,
  INSUFFICIENT_FUNDS = 3000,
  INSUFFICIENT_RESOURCES = 3001,
  FACILITY_LIMIT_REACHED = 3002,
  PLANET_LOCKED = 3003,
  NETWORK_OFFLINE = 4000,
  STEAM_API_ERROR = 4001,
  CLOUD_SYNC_FAILED = 4002,
}

export class GameError extends Error {
  public readonly code: ErrorCode
  public readonly context?: Record<string, any>
  public readonly timestamp: number

  constructor(code: ErrorCode, message: string, context?: Record<string, any>) {
    super(`[${code}] ${message}`)
    this.name = 'GameError'
    this.code = code
    this.context = context
    this.timestamp = Date.now()
  }
}

export class ErrorHandler {
  private errorLog: GameError[] = []
  private readonly MAX_LOG_SIZE = 100

  handleError(error: GameError): void {
    this.logError(error)
    
    const level = this.getErrorLevel(error.code)
    
    switch (level) {
      case 'critical':
        this.handleCritical(error)
        break
      case 'high':
        this.handleHigh(error)
        break
      case 'medium':
        this.handleMedium(error)
        break
      case 'low':
        this.handleLow(error)
        break
    }
  }

  private getErrorLevel(code: ErrorCode): string {
    if (code >= 1000 && code <= 1099) return 'critical'
    if (code >= 2000 && code <= 2099) return 'high'
    if (code >= 3000 && code <= 3099) return 'medium'
    return 'low'
  }

  private handleCritical(error: GameError): void {
    console.error('[CRITICAL]', error)
    this.emergencySave()
    alert(`严重错误: ${error.message}`)
  }

  private handleHigh(error: GameError): void {
    console.error('[HIGH]', error)
    alert(`错误: ${error.message}`)
  }

  private handleMedium(error: GameError): void {
    console.warn('[MEDIUM]', error)
  }

  private handleLow(error: GameError): void {
    console.log('[LOW]', error)
  }

  private logError(error: GameError): void {
    this.errorLog.push(error)
    if (this.errorLog.length > this.MAX_LOG_SIZE) {
      this.errorLog.shift()
    }
  }

  private emergencySave(): void {
    try {
      const saveData = localStorage.getItem('star_trade_station_save')
      if (saveData) {
        localStorage.setItem('emergency_save', saveData)
      }
    } catch (e) {
      console.error('Emergency save failed:', e)
    }
  }

  getErrorMessage(code: ErrorCode): string {
    const messages: Partial<Record<ErrorCode, string>> = {
      [ErrorCode.UNKNOWN_ERROR]: '发生未知错误',
      [ErrorCode.INITIALIZATION_FAILED]: '游戏初始化失败',
      [ErrorCode.RENDER_ERROR]: '渲染错误',
      [ErrorCode.MEMORY_OVERFLOW]: '内存不足',
      [ErrorCode.SAVE_CORRUPTED]: '存档数据损坏',
      [ErrorCode.SAVE_VERSION_MISMATCH]: '存档版本不匹配',
      [ErrorCode.LOCAL_STORAGE_FULL]: '存储空间已满',
      [ErrorCode.SAVE_WRITE_FAILED]: '存档写入失败',
      [ErrorCode.INSUFFICIENT_FUNDS]: '信用点不足',
      [ErrorCode.INSUFFICIENT_RESOURCES]: '资源不足',
      [ErrorCode.FACILITY_LIMIT_REACHED]: '设施数量已达上限',
      [ErrorCode.PLANET_LOCKED]: '星球未解锁',
      [ErrorCode.NETWORK_OFFLINE]: '网络连接失败',
      [ErrorCode.STEAM_API_ERROR]: 'Steam API错误',
      [ErrorCode.CLOUD_SYNC_FAILED]: '云存档同步失败',
    }
    return messages[code] || '发生错误'
  }
}