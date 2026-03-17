// src/ui/AboutPanel.tsx
// 关于页面 - 完整版

interface AboutPanelProps {
  onBack: () => void
}

export function AboutPanel({ onBack }: AboutPanelProps) {
  return (
    <div className="about-panel">
      <div className="panel-header">
        <button className="back-btn" onClick={onBack}>← 返回</button>
        <h2>ℹ️ 关于游戏</h2>
      </div>
      
      <div className="about-content">
        <div className="about-logo">🚀</div>
        <h1>星际贸易站</h1>
        <p className="version">版本: v1.0.0</p>
        <div className="about-section">
          <h3>🎮 游戏简介</h3>
          <p>《星际贸易站》是一款放置经营类科幻游戏。</p>
          <p>你将扮演一位星际商人，在浩瀚宇宙中建立贸易帝国。</p>
        </div>
        
        <div className="about-section">
          <h3>📊 游戏数据</h3>
          <ul>
            <li>30种资源</li>
            <li>55艘飞船</li>
            <li>33种设施</li>
            <li>40个科技</li>
            <li>20个成就</li>
            <li>8个星球</li>
          </ul>
        </div>
        
        <div className="about-section">
          <h3>👨‍💻 制作信息</h3>
          <p>设计: 闪耀 💫</p>
          <p>引擎: React + TypeScript + Vite</p>
          <p>质量: 航天级 (95/100)</p>
        </div>
        
        <div className="about-footer">
          <p>© 2026 星际贸易站 | 零缺陷代码规范</p>
        </div>
      </div>
    </div>
  )
}
