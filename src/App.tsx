import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { MarketSystem } from './core/MarketSystem'
import { OfflineEarnings } from './core/OfflineEarnings'
import { SteamAchievementManager } from './steam/SteamIntegration'
import { AudioManager } from './audio/AudioManager'
import { TechSystem } from './core/TechSystem'
import { ExpeditionSystem } from './core/ExpeditionSystem'
import { PlanetSystem } from './core/PlanetSystem'
import { FacilitySystem, FacilityInstance } from './core/FacilitySystem'
import { PlanetSystemExtended } from './core/PlanetSystemExtended'
import { SaveSystem } from './core/SaveSystem'
import { PlanetPanel, TechTree, ExpeditionPanel, SettingsPanel, AchievementPanel, MainMenu, AboutPanel, SaveSlotPanel, TutorialUI, ResourceList } from './ui'
import { ErrorBoundary } from './ui/ErrorBoundary'
import { SettingsData, SettingsStorage } from './ui/SettingsPanel'
import { TutorialSystem } from './core/TutorialSystem'
import resourcesData from './data/resources.json'

interface Resource {
  id: string
  name: string
  amount: number
  icon: string
}

const INITIAL_RESOURCES: Resource[] = resourcesData.map(r => ({
  id: r.id,
  name: r.name,
  amount: 0,
  icon: r.icon,
}))

type ViewType = 'menu' | 'select-slot-load' | 'main' | 'planets' | 'tech' | 'expeditions' | 'settings' | 'achievements' | 'about'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [view, setView] = useState<ViewType>('menu')
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number | null>(null)
  const [hasAnySave, setHasAnySave] = useState(false)
  const [playTime, setPlayTime] = useState(0)
  const [credits, setCredits] = useState(1000)
  const [researchPoints, setResearchPoints] = useState(0)
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES)
  const [settings, setSettings] = useState<SettingsData>(SettingsStorage.load())
  const [facilitySystem] = useState(() => new FacilitySystem())
  const [facilities, setFacilities] = useState<FacilityInstance[]>([])
  const [planetSystemExt] = useState(() => new PlanetSystemExtended(new PlanetSystem()))
  
  const [marketSystem] = useState(() => new MarketSystem(INITIAL_RESOURCES.map(r => r.id)))
  const [techSystem] = useState(() => new TechSystem())
  const [expeditionSystem] = useState(() => new ExpeditionSystem())
  const [_offlineEarnings] = useState(() => new OfflineEarnings())
  const [achievementManager] = useState(() => new SteamAchievementManager())
  const [audioManager] = useState(() => new AudioManager())
  const [tutorialSystem] = useState(() => new TutorialSystem())

  // 检查是否有任何存档 + 启动引导
  useEffect(() => {
    const slots = SaveSystem.getAllSlots()
    setHasAnySave(slots.some(s => s.exists))
  }, [])

  // 游戏开始后启动引导
  useEffect(() => {
    if (gameStarted && TutorialSystem.shouldShowTutorial()) {
      // 延迟显示引导，让界面先加载完成
      const timer = setTimeout(() => {
        tutorialSystem.start()
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [gameStarted, tutorialSystem])

  // 应用设置
  useEffect(() => {
    // 应用音频设置
    audioManager.setMasterVolume(settings.masterVolume)
    audioManager.setBgmVolume(settings.bgmVolume)
    audioManager.setSfxVolume(settings.sfxVolume)
    
    // 应用UI缩放
    document.documentElement.style.setProperty('--ui-scale', settings.uiScale.toString())
    
    // 应用辅助功能
    document.documentElement.setAttribute('data-colorblind', settings.colorblindMode)
    if (settings.highContrast) {
      document.documentElement.setAttribute('data-high-contrast', '')
    }
    if (settings.largeFont) {
      document.documentElement.setAttribute('data-large-font', '')
    }
    if (settings.reduceMotion) {
      document.documentElement.setAttribute('data-reduce-motion', '')
    }
  }, [audioManager, settings])

  // 游戏时长计时器
  useEffect(() => {
    if (!gameStarted) return
    
    const interval = setInterval(() => {
      setPlayTime(prev => prev + 1)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [gameStarted])

  // 自动保存 (每30秒)
  useEffect(() => {
    if (!gameStarted || !currentSlotIndex) return
    
    const interval = setInterval(() => {
      saveToSlot(currentSlotIndex)
    }, 30000)
    
    return () => clearInterval(interval)
  }, [gameStarted, currentSlotIndex, credits, researchPoints, resources, playTime])

  // 游戏循环 - 设施产出
  useEffect(() => {
    if (!gameStarted) return

    const interval = setInterval(() => {
      // 执行设施产出
      const currentResourcesMap = new Map(resources.map(r => [r.id, r.amount]))
      const { produced, consumed, stopped } = facilitySystem.executeProduction(currentResourcesMap)

      // 更新资源
      setResources(prev => prev.map(r => {
        const producedAmount = produced.get(r.id) || 0
        const consumedAmount = consumed.get(r.id) || 0
        const netChange = producedAmount - consumedAmount

        if (netChange !== 0) {
          return { ...r, amount: Math.max(0, r.amount + netChange) }
        }
        return r
      }))

      // 更新设施状态
      if (stopped.length > 0) {
        setFacilities([...facilitySystem.getAllFacilities()])
      }
      
      // 收取殖民地税收
      const taxIncome = planetSystemExt.getTotalTaxIncome()
      if (taxIncome > 0) {
        setCredits(c => c + taxIncome)
      }
      
      // 更新市场价格
      marketSystem.updatePrices()
    }, 1000)

    return () => clearInterval(interval)
  }, [gameStarted, resources, facilitySystem])

  // 批量出售资源 - 根据设计文档实现
  const sellResourceBatch = useCallback((resourceId: string, quantity: number): { sold: number; earned: number; researchGain: number } => {
    const price = marketSystem.getPrice(resourceId)
    const resource = resources.find(r => r.id === resourceId)
    
    if (!resource || resource.amount <= 0) {
      return { sold: 0, earned: 0, researchGain: 0 }
    }
    
    const actualQuantity = Math.min(quantity, Math.floor(resource.amount))
    const totalEarned = actualQuantity * price
    const researchGain = calculateResearchGain(resourceId) * actualQuantity
    
    setResources(prev => prev.map(r => {
      if (r.id === resourceId) {
        return { ...r, amount: r.amount - actualQuantity }
      }
      return r
    }))
    
    setCredits(c => c + totalEarned)
    
    if (researchGain > 0) {
      setResearchPoints(prev => prev + researchGain)
    }
    
    audioManager.playSfx('trade')
    
    return { sold: actualQuantity, earned: totalEarned, researchGain }
  }, [resources, marketSystem, audioManager])

  // 出售单个资源（兼容旧代码）- 已由 sellResourceBatch 替代
  // const sellResource = useCallback((resourceId: string) => {
  //   sellResourceBatch(resourceId, 1)
  // }, [sellResourceBatch])

  const calculateResearchGain = (resourceId: string): number => {
    const tier4Resources = ['ai_chip', 'quantum_core', 'fusion_cell', 'gravity_module']
    const tier5Resources = ['alien_artifact', 'stellar_gem']
    
    if (tier4Resources.includes(resourceId)) return 5
    if (tier5Resources.includes(resourceId)) return 20
    return 0
  }

  const researchTech = useCallback((techId: string) => {
    try {
      const tech = techSystem.getTechnology(techId)
      if (tech && techSystem.canResearch(techId)) {
        techSystem.research(techId)
        setResearchPoints(prev => prev - tech.cost)
        audioManager.playSfx('success')
        achievementManager.unlockAchievement('scientist')
      }
    } catch (e) {
      audioManager.playSfx('error')
    }
  }, [techSystem, achievementManager, audioManager])

  const unlockPlanet = useCallback((planetId: string) => {
    try {
      const planet = planetSystemExt.getExtendedPlanet(planetId)
      if (planet && !planet.unlocked && credits >= planet.unlockCost) {
        // 更新基础系统
        planet.unlocked = true
        // 初始化殖民地
        planet.colony = {
          level: 1,
          population: 100,
          happiness: 80,
          taxIncome: 5
        }
        setCredits(prev => prev - planet.unlockCost)
        audioManager.playSfx('success')
        achievementManager.unlockAchievement('explorer')
      }
    } catch (e) {
      audioManager.playSfx('error')
    }
  }, [planetSystemExt, credits, achievementManager, audioManager])

  // 解锁设施槽位
  const unlockFacilitySlot = useCallback((planetId: string, slotId: string) => {
    try {
      const result = planetSystemExt.unlockFacilitySlot(planetId, slotId, credits)
      if (result) {
        const slot = planetSystemExt.getExtendedPlanet(planetId)?.facilitySlots.find(s => s.id === slotId)
        if (slot) {
          setCredits(prev => prev - slot.unlockCost)
          audioManager.playSfx('success')
        }
      }
    } catch (e) {
      audioManager.playSfx('error')
    }
  }, [planetSystemExt, credits, audioManager])

  // 在槽位上建设施
  const buildFacility = useCallback((planetId: string, slotId: string, definitionId: string) => {
    try {
      const definition = facilitySystem.getDefinition(definitionId)
      if (!definition) return

      // 检查并扣除建造成本
      if (credits < definition.buildCost.credits) {
        audioManager.playSfx('error')
        return
      }
      
      // 检查资源成本
      if (definition.buildCost.resources) {
        for (const cost of definition.buildCost.resources) {
          const resource = resources.find(r => r.id === cost.resourceId)
          if (!resource || resource.amount < cost.amount) {
            audioManager.playSfx('error')
            return
          }
        }
      }

      // 扣除credits
      setCredits(prev => prev - definition.buildCost.credits)
      
      // 扣除资源
      if (definition.buildCost.resources) {
        setResources(prev => prev.map(r => {
          const cost = definition.buildCost.resources?.find(c => c.resourceId === r.id)
          if (cost) {
            return { ...r, amount: r.amount - cost.amount }
          }
          return r
        }))
      }

      // 创建设施
      const facility = facilitySystem.createFacility(definitionId, planetId)
      
      // 绑定到槽位
      planetSystemExt.buildFacilityInSlot(planetId, slotId, facility)
      setFacilities([...facilitySystem.getAllFacilities()])
      
      audioManager.playSfx('success')
    } catch (e) {
      audioManager.playSfx('error')
    }
  }, [planetSystemExt, facilitySystem, credits, resources, audioManager])

  // 拆除设施
  const removeFacility = useCallback((planetId: string, slotId: string) => {
    try {
      planetSystemExt.removeFacilityFromSlot(planetId, slotId)
      setFacilities([...facilitySystem.getAllFacilities()])
      audioManager.playSfx('success')
    } catch (e) {
      audioManager.playSfx('error')
    }
  }, [planetSystemExt, facilitySystem, audioManager])

  // 切换设施运行状态
  const toggleFacility = useCallback((facilityId: string) => {
    facilitySystem.toggleFacility(facilityId)
    setFacilities([...facilitySystem.getAllFacilities()])
  }, [facilitySystem])

  // 升级殖民地
  const upgradeColony = useCallback((planetId: string) => {
    try {
      const result = planetSystemExt.upgradeColony(planetId, credits)
      const cost = result.cost
      if (result.success && cost !== undefined) {
        setCredits(prev => prev - cost)
        audioManager.playSfx('success')
      } else if (cost !== undefined) {
        audioManager.playSfx('error')
      }
    } catch (e) {
      audioManager.playSfx('error')
    }
  }, [planetSystemExt, credits, audioManager])

  const startExpedition = useCallback((shipId: string, destination: string) => {
    expeditionSystem.startExpedition(shipId, destination)
    audioManager.playSfx('launch')
  }, [expeditionSystem, audioManager])

  const completeExpedition = useCallback((expeditionId: string) => {
    const events = expeditionSystem.completeExpedition(expeditionId)
    expeditionSystem.returnShip(expeditionSystem.getExpedition(expeditionId)?.shipId || '')
    
    events.forEach(event => {
      const rewards = event.rewards
      if (rewards) {
        const credits = rewards.credits
        const researchPts = rewards.researchPoints
        if (credits && credits > 0) {
          setCredits(prev => prev + credits)
        }
        if (researchPts && researchPts > 0) {
          setResearchPoints(prev => prev + researchPts)
        }
      }
    })
    
    audioManager.playSfx('success')
    achievementManager.unlockAchievement('adventurer')
  }, [expeditionSystem, achievementManager, audioManager])

  // 处理设置变更
  const handleSettingsChange = useCallback((newSettings: SettingsData) => {
    setSettings(newSettings)
    SettingsStorage.save(newSettings)
    
    // 应用音频设置
    audioManager.setMasterVolume(newSettings.masterVolume)
    audioManager.setBgmVolume(newSettings.bgmVolume)
    audioManager.setSfxVolume(newSettings.sfxVolume)
    
    // 应用UI缩放
    document.documentElement.style.setProperty('--ui-scale', newSettings.uiScale.toString())
    
    // 应用辅助功能
    document.documentElement.setAttribute('data-colorblind', newSettings.colorblindMode)
    if (newSettings.highContrast) {
      document.documentElement.setAttribute('data-high-contrast', '')
    } else {
      document.documentElement.removeAttribute('data-high-contrast')
    }
    if (newSettings.largeFont) {
      document.documentElement.setAttribute('data-large-font', '')
    } else {
      document.documentElement.removeAttribute('data-large-font')
    }
    if (newSettings.reduceMotion) {
      document.documentElement.setAttribute('data-reduce-motion', '')
    } else {
      document.documentElement.removeAttribute('data-reduce-motion')
    }
  }, [audioManager])

  // 保存到指定档位
  const saveToSlot = useCallback((slotIndex: number) => {
    const slotName = SaveSystem.getAllSlots().find(s => s.index === slotIndex)?.name || `存档 ${slotIndex}`
    
    const saveData = {
      credits,
      researchPoints,
      resources: resources.map(r => ({ id: r.id, amount: r.amount })),
      unlockedPlanets: planetSystemExt.getAllExtendedPlanets().filter(p => p.unlocked).map(p => p.id),
      researchedTechs: techSystem.getResearchedTechs().map(t => t.id),
      unlockedShips: expeditionSystem.getUnlockedShips().map(s => s.id),
      achievements: achievementManager.getAllAchievements().filter(a => a.unlocked).map(a => a.id),
      planetData: planetSystemExt.exportData(),
      facilities: facilitySystem.exportData(),
      settings: {
        masterVolume: 1,
        bgmVolume: 0.5,
        sfxVolume: 1
      }
    }
    
    SaveSystem.save(slotIndex, slotName, saveData, playTime)
    setCurrentSlotIndex(slotIndex)
    setHasAnySave(true)
    console.log(`✅ 已保存到档位 ${slotIndex}`)
  }, [credits, researchPoints, resources, planetSystemExt, techSystem, expeditionSystem, achievementManager, facilitySystem, playTime])

  // 从档位加载
  const loadFromSlot = useCallback((slotIndex: number) => {
    const saved = SaveSystem.load(slotIndex)
    if (saved) {
      setCredits(saved.credits)
      setResearchPoints(saved.researchPoints)
      setResources(prev => prev.map(r => {
        const savedResource = saved.resources.find(sr => sr.id === r.id)
        return savedResource ? { ...r, amount: savedResource.amount } : r
      }))
      setPlayTime(saved.playTime || 0)
      
      // 恢复行星数据
      saved.unlockedPlanets.forEach((id: string) => {
        const planet = planetSystemExt.getExtendedPlanet(id)
        if (planet) {
          planet.unlocked = true
          planet.colony = {
            level: 1,
            population: 100,
            happiness: 80,
            taxIncome: 5
          }
        }
      })
      
      // 恢复扩展行星数据
      if (saved.planetData) {
        planetSystemExt.importData(saved.planetData)
      }
      
      // 恢复设施数据
      if (saved.facilities) {
        facilitySystem.importData(saved.facilities as FacilityInstance[])
        setFacilities(facilitySystem.getAllFacilities())
      }
      
      saved.researchedTechs.forEach((id: string) => {
        const tech = techSystem.getTechnology(id)
        if (tech) {
          tech.researched = true
          tech.unlocked = true
        }
      })
      
      saved.achievements.forEach((id: string) => {
        achievementManager.unlockAchievement(id)
      })
      
      setCurrentSlotIndex(slotIndex)
      setGameStarted(true)
      setView('main')
      audioManager.playSfx('success')
      console.log(`✅ 已从档位 ${slotIndex} 加载`)
    }
  }, [planetSystemExt, techSystem, expeditionSystem, achievementManager, facilitySystem, audioManager])

  // 新游戏 - 直接开始，不选择档位
  const startNewGame = useCallback(() => {
    setCredits(1000)
    setResearchPoints(0)
    setResources(INITIAL_RESOURCES)
    setPlayTime(0)
    setCurrentSlotIndex(null)
    
    // 创建默认设施
    const defaultFacility = facilitySystem.createFacility('mining_drill', 'earth', 1)
    setFacilities([defaultFacility])
    
    setGameStarted(true)
    setView('main')
    audioManager.playSfx('success')
  }, [audioManager, facilitySystem])

  const renderMainView = () => (
    <div className="main-layout">
      {/* 左侧栏 - 资源和设施 */}
      <div className="left-panel">
        <section className="resources">
          <h2>💰 资源库存</h2>
          <ResourceList
            resources={resources}
            prices={new Map(resources.map(r => [r.id, marketSystem.getPrice(r.id)]))}
            onSellBatch={sellResourceBatch}
          />
        </section>

        <section className="facilities-section">
          <h2>🏭 设施生产</h2>
          <div className="facility-list">
            {facilities.length === 0 ? (
              <p className="empty-hint">暂无设施，前往行星管理建造</p>
            ) : (
              facilities.map(facility => {
                const definition = facilitySystem.getDefinition(facility.definitionId)
                if (!definition) return null
                const production = facilitySystem.calculateProduction(facility)
                return (
                  <div key={facility.id} className={`facility-item ${!facility.isActive ? 'inactive' : ''}`}>
                    <span className="facility-icon">{definition.icon}</span>
                    <div className="facility-info">
                      <span className="facility-name">{definition.name} Lv.{facility.level}</span>
                      <span className="facility-count">×{facility.count}</span>
                      {production && (
                        <span className="facility-output">
                          +{production.amount.toFixed(1)}/秒
                        </span>
                      )}
                    </div>
                    <button 
                      className="facility-toggle"
                      onClick={() => {
                        facilitySystem.toggleFacility(facility.id)
                        setFacilities([...facilitySystem.getAllFacilities()])
                      }}
                    >
                      {facility.isActive ? '⏸️' : '▶️'}
                    </button>
                  </div>
                )
              })
            )}
          </div>      
        </section>
      </div>

      {/* 右侧栏 - 导航 */}
      <div className="right-panel">
        <section className="nav-section">
          <h2>🚀 快速导航</h2>
          <div className="nav-grid">
            <button onClick={() => setView('planets')} className="nav-card" data-nav="planets">
              <span className="nav-icon">🪐</span>
              <span className="nav-label">行星</span>
              <span className="nav-desc">探索星球</span>
            </button>
            <button onClick={() => setView('tech')} className="nav-card" data-nav="tech">
              <span className="nav-icon">🔬</span>
              <span className="nav-label">科技</span>
              <span className="nav-desc">研究科技</span>
            </button>
            <button onClick={() => setView('expeditions')} className="nav-card" data-nav="expeditions">
              <span className="nav-icon">🚀</span>
              <span className="nav-label">探险</span>
              <span className="nav-desc">派遣飞船</span>
            </button>
            <button onClick={() => setView('achievements')} className="nav-card" data-nav="achievements">
              <span className="nav-icon">🏆</span>
              <span className="nav-label">成就</span>
              <span className="nav-desc">查看进度</span>
            </button>
            <button onClick={() => setView('settings')} className="nav-card" data-nav="settings">
              <span className="nav-icon">⚙️</span>
              <span className="nav-label">设置</span>
              <span className="nav-desc">游戏配置</span>
            </button>
          </div>
        </section>

        <section className="stats-section">
          <h2>📊 今日统计</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">游戏时长</span>
              <span className="stat-value">{Math.floor(playTime / 60)}分钟</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">已解锁成就</span>
              <span className="stat-value">{achievementManager.getProgress().unlocked}/{achievementManager.getProgress().total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">当前档位</span>
              <span className="stat-value">{currentSlotIndex || '-'}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )

  // 存档选择界面 - 读取存档模式
  if (view === 'select-slot-load') {
    return (
      <div className="app">
        <SaveSlotPanel
          mode="load"
          onSelectSlot={(slotIndex, exists) => {
            if (exists) {
              loadFromSlot(slotIndex)
            }
          }}
          onBack={() => setView('menu')}
        />
      </div>
    )
  }

  // 主菜单
  if (!gameStarted) {
    return (
      <div className="app">
        <MainMenu
          onNewGame={() => {
            startNewGame()
          }}
          onLoadGame={() => {
            setView('select-slot-load')
          }}
          onSettings={() => setView('settings')}
          onAbout={() => setView('about')}
          hasSaveData={hasAnySave}
        />
      </div>
    )
  }

  // 游戏主界面
  return (
    <div className="app">
      <header className="header">
        <h1 onClick={() => setView('main')} style={{ cursor: 'pointer' }}>🚀 星际贸易站</h1>
        <div className="stats">
          <span className="credits">💰 {Math.floor(credits).toLocaleString()}</span>
          <span className="research">🔬 {Math.floor(researchPoints).toLocaleString()}</span>
        </div>
      </header>

      <main className="main">
        {view === 'main' && renderMainView()}
        
        {view === 'planets' && (
          <PlanetPanel
            planets={planetSystemExt.getAllExtendedPlanets()}
            facilities={facilities}
            facilityDefinitions={facilitySystem.getAllDefinitions()}
            credits={credits}
            researchPoints={researchPoints}
            resources={resources}
            onUnlockPlanet={unlockPlanet}
            onUnlockSlot={unlockFacilitySlot}
            onBuildFacility={buildFacility}
            onRemoveFacility={removeFacility}
            onUpgradeColony={upgradeColony}
            onToggleFacility={toggleFacility}
            onBack={() => setView('main')}
          />
        )}
        
        {view === 'tech' && (
          <TechTree
            technologies={techSystem.getAllTechnologies()}
            researchPoints={researchPoints}
            onResearch={researchTech}
            onBack={() => setView('main')}
          />
        )}
        
        {view === 'expeditions' && (
          <ExpeditionPanel
            ships={expeditionSystem.getAllShips()}
            expeditions={expeditionSystem.getOngoingExpeditions()}
            onStartExpedition={startExpedition}
            onCompleteExpedition={completeExpedition}
            onBack={() => setView('main')}
          />
        )}
        
        {view === 'settings' && (
          <SettingsPanel
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onClose={() => gameStarted ? setView('main') : setView('menu')}
            onExportSave={() => {
              if (currentSlotIndex !== null) {
                return SaveSystem.export(currentSlotIndex) || ''
              }
              return ''
            }}
            onImportSave={(data) => {
              try {
                // 导入到第一个空档位
                for (let i = 1; i <= 10; i++) {
                  if (!SaveSystem.getAllSlots().find(s => s.index === i)?.exists) {
                    const success = SaveSystem.import(i, data)
                    if (success) {
                      const slots = SaveSystem.getAllSlots()
                      setHasAnySave(slots.some(s => s.exists))
                      return true
                    }
                  }
                }
                // 如果没有空档位，导入到档位10
                const success = SaveSystem.import(10, data)
                if (success) {
                  const slots = SaveSystem.getAllSlots()
                  setHasAnySave(slots.some(s => s.exists))
                }
                return success
              } catch (e) {
                return false
              }
            }}
          />
        )}
        
        {view === 'achievements' && (
          <AchievementPanel
            achievements={achievementManager.getAllAchievements()}
            onBack={() => setView('main')}
          />
        )}

        {view === 'about' && (
          <AboutPanel onBack={() => setView('menu')} />
        )}

        {/* 新手引导UI */}
        <ErrorBoundary onError={() => tutorialSystem.skip()}>
          <TutorialUI
            tutorialSystem={tutorialSystem}
            onComplete={(reward) => {
              // 发放完成奖励
              if (reward) {
                if (reward.credits && reward.credits > 0) setCredits(prev => prev + reward.credits!)
                if (reward.researchPoints && reward.researchPoints > 0) setResearchPoints(prev => prev + reward.researchPoints!)
              }
              // 播放完成音效
              audioManager.playSfx('success')
            }}
            onSkip={() => {
              audioManager.playSfx('back')
            }}
          />
        </ErrorBoundary>
      </main>

      <footer className="footer">
        <p>
          星际贸易站 v1.0 | 
          {achievementManager.getProgress().unlocked}/{achievementManager.getProgress().total} 成就 |
          档位 {currentSlotIndex || '-'} |
          ⏱️ {Math.floor(playTime / 60)}分钟
        </p>
      </footer>
    </div>
  )
}

export default App
