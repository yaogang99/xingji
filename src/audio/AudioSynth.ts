// src/audio/AudioSynth.ts
// Web Audio API 音效合成器 - 26种游戏音效

export type SfxType = 
  // UI音效
  | 'click' | 'hover' | 'confirm' | 'back' | 'error' | 'success' | 'notification' | 'achievement'
  // 交易音效
  | 'buy' | 'sell' | 'profit' | 'trade'
  // 航行音效
  | 'warp_start' | 'warp_end' | 'warp_engine' | 'station_dock' | 'station_undock' | 'launch'
  // 任务音效
  | 'complete' | 'fail' | 'level_up'
  // 货物音效
  | 'cargo_load' | 'cargo_unload'
  // 金钱音效
  | 'gain' | 'loss'
  // 警报音效
  | 'low_fuel' | 'danger'

export type BgmType = 'menu_music' | 'game_music' | 'ambient_space'

export class AudioSynth {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private bgmGain: GainNode | null = null
  private sfxGain: GainNode | null = null
  private currentBgm: AudioBufferSourceNode | null = null

  constructor() {
    this.init()
  }

  private init() {
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.masterGain = this.ctx.createGain()
      this.masterGain.connect(this.ctx.destination)
      
      this.bgmGain = this.ctx.createGain()
      this.bgmGain.connect(this.masterGain)
      
      this.sfxGain = this.ctx.createGain()
      this.sfxGain.connect(this.masterGain)
      
      // 默认音量
      this.setMasterVolume(1)
      this.setBgmVolume(0.5)
      this.setSfxVolume(1)
    } catch (e) {
      console.warn('Web Audio API not supported')
    }
  }

  setMasterVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume))
    }
  }

  setBgmVolume(volume: number) {
    if (this.bgmGain) {
      this.bgmGain.gain.value = Math.max(0, Math.min(1, volume))
    }
  }

  setSfxVolume(volume: number) {
    if (this.sfxGain) {
      this.sfxGain.gain.value = Math.max(0, Math.min(1, volume))
    }
  }

  // 播放音效
  playSfx(type: SfxType) {
    if (!this.ctx || !this.sfxGain) return

    // 恢复音频上下文（如果暂停）
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    const now = this.ctx.currentTime

    switch (type) {
      // UI音效
      case 'click':
        this.playClick(now)
        break
      case 'hover':
        this.playHover(now)
        break
      case 'confirm':
        this.playConfirm(now)
        break
      case 'back':
        this.playBack(now)
        break
      case 'error':
        this.playError(now)
        break
      case 'success':
        this.playSuccess(now)
        break
      case 'notification':
        this.playNotification(now)
        break
      case 'achievement':
        this.playAchievement(now)
        break
      // 交易音效
      case 'buy':
        this.playBuy(now)
        break
      case 'sell':
        this.playSell(now)
        break
      case 'profit':
        this.playProfit(now)
        break
      case 'trade':
        this.playTrade(now)
        break
      // 航行音效
      case 'warp_start':
        this.playWarpStart(now)
        break
      case 'warp_end':
        this.playWarpEnd(now)
        break
      case 'warp_engine':
        this.playWarpEngine(now)
        break
      case 'station_dock':
        this.playStationDock(now)
        break
      case 'station_undock':
        this.playStationUndock(now)
        break
      case 'launch':
        this.playWarpStart(now)
        break
      // 任务音效
      case 'complete':
        this.playComplete(now)
        break
      case 'fail':
        this.playFail(now)
        break
      case 'level_up':
        this.playLevelUp(now)
        break
      // 货物音效
      case 'cargo_load':
        this.playCargoLoad(now)
        break
      case 'cargo_unload':
        this.playCargoUnload(now)
        break
      // 金钱音效
      case 'gain':
        this.playGain(now)
        break
      case 'loss':
        this.playLoss(now)
        break
      // 警报音效
      case 'low_fuel':
        this.playLowFuel(now)
        break
      case 'danger':
        this.playDanger(now)
        break
    }
  }

  // UI音效实现
  private playClick(now: number) {
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05)
    
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05)
    
    osc.connect(gain)
    gain.connect(this.sfxGain)
    
    osc.start(now)
    osc.stop(now + 0.05)
  }

  private playHover(now: number) {
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, now)
    
    gain.gain.setValueAtTime(0.1, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03)
    
    osc.connect(gain)
    gain.connect(this.sfxGain)
    
    osc.start(now)
    osc.stop(now + 0.03)
  }

  private playConfirm(now: number) {
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(440, now)
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15)
    
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
    
    osc.connect(gain)
    gain.connect(this.sfxGain)
    
    osc.start(now)
    osc.stop(now + 0.15)
  }

  private playBack(now: number) {
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(880, now)
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.1)
    
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
    
    osc.connect(gain)
    gain.connect(this.sfxGain)
    
    osc.start(now)
    osc.stop(now + 0.1)
  }

  private playError(now: number) {
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(200, now)
    osc.frequency.linearRampToValueAtTime(150, now + 0.2)
    
    gain.gain.setValueAtTime(0.4, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
    
    osc.connect(gain)
    gain.connect(this.sfxGain)
    
    osc.start(now)
    osc.stop(now + 0.2)
  }

  private playSuccess(now: number) {
    if (!this.ctx || !this.sfxGain) return
    // 播放成功和弦
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.05)
      
      gain.gain.setValueAtTime(0.2, now + i * 0.05)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3 + i * 0.05)
      
      osc.connect(gain)
      gain.connect(this.sfxGain!)
      
      osc.start(now + i * 0.05)
      osc.stop(now + 0.3 + i * 0.05)
    })
  }

  private playNotification(now: number) {
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, now)
    osc.frequency.setValueAtTime(800, now + 0.1)
    
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.linearRampToValueAtTime(0.3, now + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
    
    osc.connect(gain)
    gain.connect(this.sfxGain)
    
    osc.start(now)
    osc.stop(now + 0.3)
  }

  private playAchievement(now: number) {
    if (!this.ctx || !this.sfxGain) return
    // 华丽的成就音效
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      
      osc.type = i % 2 === 0 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(freq, now + i * 0.08)
      
      gain.gain.setValueAtTime(0.25, now + i * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5 + i * 0.08)
      
      osc.connect(gain)
      gain.connect(this.sfxGain!)
      
      osc.start(now + i * 0.08)
      osc.stop(now + 0.5 + i * 0.08)
    })
  }

  // 交易音效
  private playBuy(now: number) {
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'square'
    osc.frequency.setValueAtTime(300, now)
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.1)
    
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
    
    osc.connect(gain)
    gain.connect(this.sfxGain)
    
    osc.start(now)
    osc.stop(now + 0.1)
  }

  private playSell(now: number) {
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'square'
    osc.frequency.setValueAtTime(400, now)
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.1)
    
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
    
    osc.connect(gain)
    gain.connect(this.sfxGain)
    
    osc.start(now)
    osc.stop(now + 0.1)
  }

  private playTrade(now: number) {
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(500, now)
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.1)
    
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
    
    osc.connect(gain)
    gain.connect(this.sfxGain)
    
    osc.start(now)
    osc.stop(now + 0.1)
  }

  private playProfit(now: number) {
    if (!this.ctx || !this.sfxGain) return
    // 金币音效
    [800, 1000, 1200].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.03)
      
      gain.gain.setValueAtTime(0.15, now + i * 0.03)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1 + i * 0.03)
      
      osc.connect(gain)
      gain.connect(this.sfxGain!)
      
      osc.start(now + i * 0.03)
      osc.stop(now + 0.1 + i * 0.03)
    })
  }

  // 航行音效
  private playWarpStart(now: number) {
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(100, now)
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.5)
    
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.linearRampToValueAtTime(0.3, now + 0.4)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
    
    osc.connect(gain)
    gain.connect(this.sfxGain)
    
    osc.start(now)
    osc.stop(now + 0.5)
  }

  private playWarpEnd(now: number) {
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.3)
    
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
    
    osc.connect(gain)
    gain.connect(this.sfxGain)
    
    osc.start(now)
    osc.stop(now + 0.3)
  }

  private playWarpEngine(now: number) {
    if (!this.ctx || !this.sfxGain) return
    // 引擎轰鸣 - 白噪声
    const bufferSize = this.ctx.sampleRate * 0.5
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    
    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer
    
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 200
    
    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
    
    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.sfxGain)
    
    noise.start(now)
    noise.stop(now + 0.5)
  }

  private playStationDock(now: number) {
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(200, now)
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.4)
    
    gain.gain.setValueAtTime(0.4, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4)
    
    osc.connect(gain)
    gain.connect(this.sfxGain)
    
    osc.start(now)
    osc.stop(now + 0.4)
  }

  private playStationUndock(now: number) {
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(50, now)
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.4)
    
    gain.gain.setValueAtTime(0.4, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4)
    
    osc.connect(gain)
    gain.connect(this.sfxGain)
    
    osc.start(now)
    osc.stop(now + 0.4)
  }

  // 任务音效
  private playComplete(now: number) {
    if (!this.ctx || !this.sfxGain) return
    // 胜利和弦
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.05)
      
      gain.gain.setValueAtTime(0.2, now + i * 0.05)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4 + i * 0.05)
      
      osc.connect(gain)
      gain.connect(this.sfxGain!)
      
      osc.start(now + i * 0.05)
      osc.stop(now + 0.4 + i * 0.05)
    })
  }

  private playFail(now: number) {
    if (!this.ctx || !this.sfxGain) return
    // 失败音效
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(300, now)
    osc.frequency.linearRampToValueAtTime(200, now + 0.15)
    osc.frequency.linearRampToValueAtTime(150, now + 0.3)
    
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
    
    osc.connect(gain)
    gain.connect(this.sfxGain)
    
    osc.start(now)
    osc.stop(now + 0.3)
  }

  private playLevelUp(now: number) {
    if (!this.ctx || !this.sfxGain) return
    // 升级音效 - 上升音阶
    const notes = [440, 554, 659, 880, 1108]
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + i * 0.06)
      
      gain.gain.setValueAtTime(0.25, now + i * 0.06)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4 + i * 0.06)
      
      osc.connect(gain)
      gain.connect(this.sfxGain!)
      
      osc.start(now + i * 0.06)
      osc.stop(now + 0.4 + i * 0.06)
    })
  }

  // 货物音效
  private playCargoLoad(now: number) {
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'square'
    osc.frequency.setValueAtTime(150, now)
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.15)
    
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
    
    osc.connect(gain)
    gain.connect(this.sfxGain)
    
    osc.start(now)
    osc.stop(now + 0.15)
  }

  private playCargoUnload(now: number) {
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'square'
    osc.frequency.setValueAtTime(100, now)
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.15)
    
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
    
    osc.connect(gain)
    gain.connect(this.sfxGain)
    
    osc.start(now)
    osc.stop(now + 0.15)
  }

  // 金钱音效
  private playGain(now: number) {
    if (!this.ctx || !this.sfxGain) return
    // 金币声
    [1200, 1600].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.02)
      
      gain.gain.setValueAtTime(0.2, now + i * 0.02)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08 + i * 0.02)
      
      osc.connect(gain)
      gain.connect(this.sfxGain!)
      
      osc.start(now + i * 0.02)
      osc.stop(now + 0.08 + i * 0.02)
    })
  }

  private playLoss(now: number) {
    if (!this.ctx || !this.sfxGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(300, now)
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.15)
    
    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
    
    osc.connect(gain)
    gain.connect(this.sfxGain)
    
    osc.start(now)
    osc.stop(now + 0.15)
  }

  // 警报音效
  private playLowFuel(now: number) {
    if (!this.ctx || !this.sfxGain) return
    // 重复的哔哔声
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      
      osc.type = 'square'
      osc.frequency.setValueAtTime(800, now + i * 0.15)
      
      gain.gain.setValueAtTime(0.3, now + i * 0.15)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1 + i * 0.15)
      
      osc.connect(gain)
      gain.connect(this.sfxGain!)
      
      osc.start(now + i * 0.15)
      osc.stop(now + 0.1 + i * 0.15)
    }
  }

  private playDanger(now: number) {
    if (!this.ctx || !this.sfxGain) return
    // 危险的警报声
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = 'sawtooth'
    
    // 交替频率
    for (let i = 0; i < 4; i++) {
      osc.frequency.setValueAtTime(400, now + i * 0.15)
      osc.frequency.setValueAtTime(300, now + i * 0.15 + 0.075)
    }
    
    gain.gain.setValueAtTime(0.4, now)
    gain.gain.linearRampToValueAtTime(0.4, now + 0.5)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6)
    
    osc.connect(gain)
    gain.connect(this.sfxGain)
    
    osc.start(now)
    osc.stop(now + 0.6)
  }

  // 背景音乐生成
  playBgm(type: BgmType) {
    if (!this.ctx || !this.bgmGain) return

    // 停止当前BGM
    if (this.currentBgm) {
      try {
        this.currentBgm.stop()
      } catch (e) {}
      this.currentBgm = null
    }

    // 创建新的BGM
    const duration = type === 'menu_music' ? 30 : 60
    const sampleRate = this.ctx.sampleRate
    const buffer = this.ctx.createBuffer(2, sampleRate * duration, sampleRate)

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel)
      
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate
        let sample = 0

        if (type === 'menu_music') {
          // 菜单音乐 - 舒缓的电子氛围
          sample = Math.sin(t * 220 * Math.PI * 2) * 0.1 +
                   Math.sin(t * 330 * Math.PI * 2) * 0.05 +
                   Math.sin(t * 440 * Math.PI * 2) * 0.03
        } else if (type === 'game_music') {
          // 游戏音乐 - 更有节奏感
          sample = Math.sin(t * 130.81 * Math.PI * 2) * 0.08 +
                   Math.sin(t * 164.81 * Math.PI * 2) * 0.06 +
                   Math.sin(t * 196 * Math.PI * 2) * 0.04
        } else if (type === 'ambient_space') {
          // 太空环境音 - 白噪声低频
          sample = (Math.random() * 2 - 1) * 0.05
        }

        // 淡入淡出
        if (i < sampleRate * 2) {
          sample *= i / (sampleRate * 2)
        } else if (i > data.length - sampleRate * 2) {
          sample *= (data.length - i) / (sampleRate * 2)
        }

        data[i] = sample
      }
    }

    this.currentBgm = this.ctx.createBufferSource()
    this.currentBgm.buffer = buffer
    this.currentBgm.loop = true
    this.currentBgm.connect(this.bgmGain)
    this.currentBgm.start()
  }

  stopBgm() {
    if (this.currentBgm) {
      try {
        this.currentBgm.stop()
      } catch (e) {}
      this.currentBgm = null
    }
  }

  // 暂停/恢复音频上下文
  suspend() {
    if (this.ctx) {
      this.ctx.suspend()
    }
  }

  resume() {
    if (this.ctx) {
      this.ctx.resume()
    }
  }
}

export default AudioSynth
