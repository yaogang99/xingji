// src/ui/MainMenu.tsx
// 主菜单界面 - 标准游戏菜单逻辑

interface MainMenuProps {
  onNewGame: () => void      // 新游戏 - 选择档位开始新游戏
  onLoadGame: () => void     // 读取存档 - 选择档位加载游戏
  onSettings: () => void     // 设置
  onAbout: () => void        // 关于
  onExit?: () => void        // 退出游戏（可选）
  hasSaveData: boolean       // 是否有存档（用于显示提醒）
}

export function MainMenu({ 
  onNewGame, 
  onLoadGame, 
  onSettings, 
  onAbout, 
  onExit,
  hasSaveData 
}: MainMenuProps) {
  return (
    <div className="main-menu">
      <div className="menu-bg">🚀</div>
      <h1 className="game-title">星际贸易站</h1>
      <p className="game-subtitle">STAR TRADE STATION</p>
      
      <div className="menu-buttons">
        {/* 🎮 新游戏 - 始终显示 */}
        <button className="menu-btn primary" onClick={onNewGame}>
          🎮 新游戏
        </button>
        
        {/* 💾 读取存档 - 始终显示，有存档时高亮提示 */}
        <button 
          className={`menu-btn ${hasSaveData ? 'highlight' : ''}`} 
          onClick={onLoadGame}
        >
          💾 读取存档 {hasSaveData && '(✅ 有存档)'}
        </button>
        
        {/* ⚙️ 设置 */}
        <button className="menu-btn" onClick={onSettings}>
          ⚙️ 设置
        </button>
        
        {/* ℹ️ 关于 */}
        <button className="menu-btn" onClick={onAbout}>
          ℹ️ 关于
        </button>
        
        {/* 🚪 退出 - 如果有onExit回调才显示 */}
        {onExit && (
          <button className="menu-btn exit" onClick={onExit}>
            🚪 退出游戏
          </button>
        )}
      </div>
      
      <p className="version">
        v1.0.0 | 航天级质量 | {hasSaveData ? '✅ 存档已存在' : '⚪ 无存档'}
      </p>
    </div>
  )
}
