// src/audio/AudioManager.ts
// 音频管理器 - 集成 AudioSynth 提供完整音效系统

import { AudioSynth, SfxType, BgmType } from './AudioSynth'

export class AudioManager {
  private synth: AudioSynth
  private isMuted = false
  private masterVolume = 1.0
  private bgmVolume = 0.5
  private sfxVolume = 1.0

  constructor() {
    this.synth = new AudioSynth()
  }

  /**
   * 播放音效
   * @param type 音效类型 - 26种可选
   * 
   * UI音效: click, hover, confirm, back, error, success, notification, achievement
   * 交易音效: buy, sell, profit
   * 航行音效: warp_start, warp_end, warp_engine, station_dock, station_undock
   * 任务音效: complete, fail, level_up
   * 货物音效: cargo_load, cargo_unload
   * 金钱音效: gain, loss
   * 警报音效: low_fuel, danger
   */
  playSfx(type: SfxType): void {
    if (this.isMuted) return
    if (this.sfxVolume * this.masterVolume <= 0) return
    
    this.synth.playSfx(type)
  }

  /**
   * 播放背景音乐
   * @param type BGM类型: menu_music, game_music, ambient_space
   */
  playBgm(type: BgmType): void {
    if (this.isMuted) return
    if (this.bgmVolume * this.masterVolume <= 0) return
    
    this.synth.playBgm(type)
  }

  /**
   * 停止背景音乐
   */
  stopBgm(): void {
    this.synth.stopBgm()
  }

  // 音量控制
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume))
    this.synth.setMasterVolume(this.masterVolume)
  }

  setBgmVolume(volume: number): void {
    this.bgmVolume = Math.max(0, Math.min(1, volume))
    this.synth.setBgmVolume(this.bgmVolume)
  }

  setSfxVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume))
    this.synth.setSfxVolume(this.sfxVolume)
  }

  // 获取当前音量
  getMasterVolume(): number { return this.masterVolume }
  getBgmVolume(): number { return this.bgmVolume }
  getSfxVolume(): number { return this.sfxVolume }

  // 静音控制
  toggleMute(): boolean {
    this.isMuted = !this.isMuted
    if (this.isMuted) {
      this.synth.suspend()
      this.synth.stopBgm()
    } else {
      this.synth.resume()
    }
    return this.isMuted
  }

  isAudioMuted(): boolean {
    return this.isMuted
  }

  // 暂停/恢复（用于游戏暂停）
  suspend(): void {
    this.synth.suspend()
  }

  resume(): void {
    if (!this.isMuted) {
      this.synth.resume()
    }
  }
}

// 导出类型
export type { SfxType, BgmType } from './AudioSynth'
export default AudioManager
