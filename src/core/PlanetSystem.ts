// src/core/PlanetSystem.ts
// 行星系统 - 8核心行星+无限外圈行星生成

import { GameError, ErrorCode } from './ErrorHandler'

export interface Planet {
  id: string
  name: string
  type: PlanetType
  distance: number
  resources: PlanetResource[]
  hazards: HazardType[]
  unlockCost: number
  unlocked: boolean
}

export type PlanetType = 'terran' | 'ice' | 'desert' | 'gas_giant' | 'volcanic' | 'ocean' | 'barren' | 'exotic'
export type HazardType = 'cold' | 'heat' | 'radiation' | 'toxic' | 'vacuum' | 'gravity'

export interface PlanetResource {
  resourceId: string
  abundance: number // 0-1
  difficulty: number // 1-10
}

export const CORE_PLANET_COUNT = 8
export const BASE_DISTANCE = 500
export const DISTANCE_MULTIPLIER = 1.5
export const BASE_UNLOCK_COST = 100000000
export const UNLOCK_COST_MULTIPLIER = 2

export class PlanetSystem {
  private planets: Map<string, Planet> = new Map()
  private outerPlanetCount = 0

  constructor() {
    this.initializeCorePlanets()
  }

  private initializeCorePlanets(): void {
    const corePlanets: Omit<Planet, 'unlocked'>[] = [
      {
        id: 'planet_0',
        name: '地球',
        type: 'terran',
        distance: 0,
        resources: [
          { resourceId: 'iron_ore', abundance: 0.5, difficulty: 1 },
          { resourceId: 'copper_ore', abundance: 0.4, difficulty: 1 },
          { resourceId: 'water', abundance: 0.8, difficulty: 1 },
        ],
        hazards: [],
        unlockCost: 0,
      },
      {
        id: 'planet_1',
        name: '火星',
        type: 'desert',
        distance: 1.5,
        resources: [
          { resourceId: 'iron_ore', abundance: 0.7, difficulty: 2 },
          { resourceId: 'silicon_ore', abundance: 0.5, difficulty: 3 },
        ],
        hazards: ['vacuum', 'cold'],
        unlockCost: 1000,
      },
      {
        id: 'planet_2',
        name: '欧罗巴',
        type: 'ice',
        distance: 4.2,
        resources: [
          { resourceId: 'ice', abundance: 0.9, difficulty: 3 },
          { resourceId: 'water', abundance: 1.0, difficulty: 2 },
        ],
        hazards: ['cold', 'vacuum'],
        unlockCost: 5000,
      },
      {
        id: 'planet_3',
        name: '泰坦',
        type: 'exotic',
        distance: 8.5,
        resources: [
          { resourceId: 'hydrogen', abundance: 0.8, difficulty: 4 },
          { resourceId: 'carbon', abundance: 0.6, difficulty: 4 },
        ],
        hazards: ['cold', 'toxic'],
        unlockCost: 20000,
      },
      {
        id: 'planet_4',
        name: '木星',
        type: 'gas_giant',
        distance: 5.2,
        resources: [
          { resourceId: 'hydrogen', abundance: 0.9, difficulty: 5 },
          { resourceId: 'helium', abundance: 0.7, difficulty: 6 },
        ],
        hazards: ['radiation', 'gravity'],
        unlockCost: 50000,
      },
      {
        id: 'planet_5',
        name: '金星',
        type: 'volcanic',
        distance: 0.7,
        resources: [
          { resourceId: 'aluminum_ore', abundance: 0.6, difficulty: 4 },
          { resourceId: 'carbon', abundance: 0.8, difficulty: 3 },
        ],
        hazards: ['heat', 'toxic'],
        unlockCost: 15000,
      },
      {
        id: 'planet_6',
        name: '开普勒-452b',
        type: 'ocean',
        distance: 1400,
        resources: [
          { resourceId: 'water', abundance: 1.0, difficulty: 5 },
          { resourceId: 'ice', abundance: 0.3, difficulty: 4 },
        ],
        hazards: ['vacuum'],
        unlockCost: 100000,
      },
      {
        id: 'planet_7',
        name: '比邻星b',
        type: 'barren',
        distance: 4.2,
        resources: [
          { resourceId: 'iron_ore', abundance: 0.5, difficulty: 6 },
          { resourceId: 'silicon_ore', abundance: 0.4, difficulty: 7 },
          { resourceId: 'aluminum_ore', abundance: 0.3, difficulty: 7 },
        ],
        hazards: ['radiation', 'vacuum'],
        unlockCost: 500000,
      },
    ]

    corePlanets.forEach((planet, index) => {
      this.planets.set(planet.id, {
        ...planet,
        unlocked: index === 0,
      })
    })
  }

  generateOuterPlanet(index: number, seed: number): Planet {
    const id = `planet_${CORE_PLANET_COUNT + index}`
    const distance = this.calculateOuterPlanetDistance(index)
    const unlockCost = this.calculateOuterPlanetCost(index)
    
    const types: PlanetType[] = ['barren', 'ice', 'desert', 'gas_giant', 'volcanic', 'exotic']
    const type = types[(seed + index) % types.length]
    
    const planet: Planet = {
      id,
      name: `外域-${index + 1}`,
      type,
      distance,
      resources: this.generateResources(type, seed + index),
      hazards: this.generateHazards(type, seed + index),
      unlockCost,
      unlocked: false,
    }
    
    this.planets.set(id, planet)
    this.outerPlanetCount = Math.max(this.outerPlanetCount, index + 1)
    
    return planet
  }

  private calculateOuterPlanetDistance(index: number): number {
    return BASE_DISTANCE * Math.pow(DISTANCE_MULTIPLIER, index)
  }

  private calculateOuterPlanetCost(index: number): number {
    return Math.floor(BASE_UNLOCK_COST * Math.pow(UNLOCK_COST_MULTIPLIER, index))
  }

  private generateResources(type: PlanetType, _seed: number): PlanetResource[] {
    const resourcePool: Record<PlanetType, string[]> = {
      terran: ['iron_ore', 'copper_ore', 'water', 'carbon'],
      ice: ['ice', 'water', 'hydrogen'],
      desert: ['iron_ore', 'silicon_ore', 'aluminum_ore'],
      gas_giant: ['hydrogen', 'helium'],
      volcanic: ['iron_ore', 'carbon', 'aluminum_ore'],
      ocean: ['water', 'ice', 'hydrogen'],
      barren: ['iron_ore', 'silicon_ore', 'aluminum_ore'],
      exotic: ['alien_artifact', 'stellar_gem', 'quantum_core'],
    }
    
    const pool = resourcePool[type] || resourcePool.barren
    const count = 2 + (_seed % 3)
    
    return pool.slice(0, count).map((resourceId, i) => ({
      resourceId,
      abundance: 0.3 + ((_seed + i) % 7) / 10,
      difficulty: 5 + ((_seed + i) % 6),
    }))
  }

  private generateHazards(type: PlanetType, _seed: number): HazardType[] {
    const hazardPool: Record<PlanetType, HazardType[]> = {
      terran: [],
      ice: ['cold', 'vacuum'],
      desert: ['heat', 'vacuum'],
      gas_giant: ['radiation', 'gravity'],
      volcanic: ['heat', 'toxic'],
      ocean: ['vacuum', 'cold'],
      barren: ['radiation', 'vacuum'],
      exotic: ['radiation', 'gravity', 'toxic'],
    }
    
    return hazardPool[type] || ['vacuum']
  }

  unlockPlanet(planetId: string, credits: number): boolean {
    const planet = this.planets.get(planetId)
    if (!planet) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, `Planet not found: ${planetId}`)
    }
    if (planet.unlocked) {
      throw new GameError(ErrorCode.INITIALIZATION_FAILED, 'Planet already unlocked')
    }
    if (credits < planet.unlockCost) {
      throw new GameError(ErrorCode.INSUFFICIENT_FUNDS, 'Insufficient credits to unlock planet')
    }
    
    planet.unlocked = true
    return true
  }

  getPlanet(planetId: string): Planet | undefined {
    return this.planets.get(planetId)
  }

  getAllPlanets(): Planet[] {
    return Array.from(this.planets.values())
  }

  getUnlockedPlanets(): Planet[] {
    return this.getAllPlanets().filter(p => p.unlocked)
  }

  getLockedPlanets(): Planet[] {
    return this.getAllPlanets().filter(p => !p.unlocked)
  }

  getPlanetsByType(type: PlanetType): Planet[] {
    return this.getAllPlanets().filter(p => p.type === type)
  }

  getNextUnlockablePlanet(): Planet | undefined {
    return this.getLockedPlanets().sort((a, b) => a.unlockCost - b.unlockCost)[0]
  }

  getMiningDifficulty(planetId: string, resourceId: string): number {
    const planet = this.planets.get(planetId)
    if (!planet) return 10
    
    const resource = planet.resources.find(r => r.resourceId === resourceId)
    return resource?.difficulty || 10
  }

  getResourceAbundance(planetId: string, resourceId: string): number {
    const planet = this.planets.get(planetId)
    if (!planet) return 0
    
    const resource = planet.resources.find(r => r.resourceId === resourceId)
    return resource?.abundance || 0
  }
}