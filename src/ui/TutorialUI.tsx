// src/ui/TutorialUI.tsx
// 新手引导UI组件

import { useEffect, useState, useCallback } from 'react'
import { TutorialSystem, TutorialStep, TUTORIAL_STEPS } from '../core/TutorialSystem'

interface TutorialUIProps {
  tutorialSystem: TutorialSystem
  onComplete?: (reward?: { credits?: number; researchPoints?: number } | null) => void
  onSkip?: () => void
}

export function TutorialUI({ tutorialSystem, onComplete, onSkip }: TutorialUIProps) {
  const [currentStep, setCurrentStep] = useState<TutorialStep | null>(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null)

  // 更新当前步骤
  const updateStep = useCallback(() => {
    try {
      const step = tutorialSystem.getCurrentStep()
      const index = tutorialSystem.getCurrentStepIndex()
      const state = tutorialSystem.getState()
      
      setCurrentStep(step)
      setStepIndex(index)
      setIsVisible(state.isActive)
      
      // 计算高亮区域
      if (step?.highlightElement && state.isActive) {
        // 延迟一点等待DOM更新
        setTimeout(() => {
          try {
            const element = document.querySelector(step.highlightElement!)
            if (element) {
              setHighlightRect(element.getBoundingClientRect())
            } else {
              console.warn(`Tutorial: Highlight element not found: ${step.highlightElement}`)
              setHighlightRect(null)
            }
          } catch (e) {
            console.error('Tutorial: Error calculating highlight:', e)
            setHighlightRect(null)
          }
        }, 100)
      } else {
        setHighlightRect(null)
      }
    } catch (e) {
      console.error('Tutorial: Error in updateStep:', e)
    }
  }, [tutorialSystem])

  // 监听引导系统状态变化
  useEffect(() => {
    updateStep()
    tutorialSystem.addListener(updateStep)
    
    return () => {
      tutorialSystem.removeListener(updateStep)
    }
  }, [tutorialSystem, updateStep])

  // 监听窗口大小变化，更新高亮位置
  useEffect(() => {
    const handleResize = () => {
      try {
        if (currentStep?.highlightElement) {
          const element = document.querySelector(currentStep.highlightElement)
          if (element) {
            setHighlightRect(element.getBoundingClientRect())
          }
        }
      } catch (e) {
        console.error('Tutorial: Error in resize handler:', e)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentStep])

  const handleNext = () => {
    try {
      tutorialSystem.nextStep()
    } catch (e) {
      console.error('Tutorial: Error in nextStep:', e)
    }
  }

  const handlePrev = () => {
    try {
      tutorialSystem.prevStep()
    } catch (e) {
      console.error('Tutorial: Error in prevStep:', e)
    }
  }

  const handleSkip = () => {
    try {
      if (confirm('确定要跳过新手引导吗？')) {
        tutorialSystem.skip()
        onSkip?.()
      }
    } catch (e) {
      console.error('Tutorial: Error in skip:', e)
    }
  }

  const handleComplete = () => {
    try {
      const reward = tutorialSystem.getCurrentStepReward()
      tutorialSystem.complete()
      setTimeout(() => {
        onComplete?.(reward)
      }, 0)
    } catch (e) {
      console.error('Tutorial: Error in complete:', e)
    }
  }

  if (!isVisible || !currentStep) return null

  const totalSteps = tutorialSystem.getTotalSteps()
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === totalSteps - 1
  const hasReward = !!currentStep.reward

  // 计算提示框位置 - 固定在底部中央
  const getTooltipPosition = () => {
    return {
      position: 'fixed',
      bottom: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '400px',
      maxWidth: '90vw',
    } as React.CSSProperties
  }

  return (
    <div className="tutorial-overlay">
      {/* 遮罩层 */}
      <div className="tutorial-backdrop" />
      
      {/* 高亮区域 */}
      {highlightRect && (
        <div
          className="tutorial-highlight"
          style={{
            position: 'fixed',
            top: highlightRect.top - 8,
            left: highlightRect.left - 8,
            width: highlightRect.width + 16,
            height: highlightRect.height + 16,
            borderRadius: 8,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 20px rgba(59, 130, 246, 0.5)',
            pointerEvents: 'none',
            zIndex: 9998,
          }}
        />
      )}
      
      {/* 提示框 */}
      <div
        className="tutorial-tooltip"
        style={{
          ...getTooltipPosition(),
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          border: '2px solid #3b82f6',
          borderRadius: 12,
          padding: 24,
          zIndex: 9999,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(59, 130, 246, 0.2)',
        }}
      >
        {/* 步骤指示器 */}
        <div className="tutorial-progress" style={{ marginBottom: 16 }}>
          {TUTORIAL_STEPS.map((_, idx) => (
            <span
              key={idx}
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                marginRight: 6,
                background: idx === stepIndex ? '#3b82f6' : idx < stepIndex ? '#10b981' : '#4b5563',
              }}
            />
          ))}
          <span style={{ marginLeft: 12, color: '#9ca3af', fontSize: 12 }}>
            {stepIndex + 1} / {totalSteps}
          </span>
        </div>
        
        {/* 标题 */}
        <h3 style={{ margin: '0 0 12px', color: '#fff', fontSize: 18 }}>{currentStep.title}</h3>
        
        {/* 元素未找到警告 */}
        {!highlightRect && currentStep.highlightElement && (
          <div style={{
            background: 'rgba(255, 107, 107, 0.2)',
            border: '1px solid #FF6B6B',
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            color: '#FF6B6B',
            fontSize: 13,
          }}>
            ⚠️ 未找到目标元素: {currentStep.highlightElement}
          </div>
        )}
        
        {/* 描述 */}
        <p style={{ margin: '0 0 20px', color: '#d1d5db', fontSize: 14, lineHeight: 1.6 }}>
          {currentStep.description}
        </p>
        
        {/* 奖励提示 */}
        {hasReward && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10b981',
              borderRadius: 8,
              padding: 12,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span>🎁</span>
            <div>
              <div style={{ color: '#10b981', fontSize: 12, fontWeight: 'bold' }}>完成奖励</div>
              <div style={{ color: '#d1d5db', fontSize: 13 }}>
                {currentStep.reward?.credits && currentStep.reward.credits > 0 ? `💰 ${currentStep.reward.credits} 货币 ` : ''}
                {currentStep.reward?.researchPoints && currentStep.reward.researchPoints > 0 ? `🔬 ${currentStep.reward.researchPoints} 研究点` : ''}
              </div>
            </div>
          </div>
        )}
        
        {/* 按钮组 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handleSkip}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid #6b7280',
              borderRadius: 6,
              color: '#9ca3af',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            跳过引导
          </button>
          
          <div style={{ display: 'flex', gap: 12 }}>
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                style={{
                  padding: '10px 20px',
                  background: '#374151',
                  border: 'none',
                  borderRadius: 6,
                  color: '#fff',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                上一步
              </button>
            )}
            
            <button
              onClick={isLastStep ? handleComplete : handleNext}
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none',
                borderRadius: 6,
                color: '#fff',
                fontSize: 14,
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
              }}
            >
              {isLastStep ? '完成引导' : '下一步'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorialUI
