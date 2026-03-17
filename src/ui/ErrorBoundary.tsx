// src/ui/ErrorBoundary.tsx
// 错误边界组件 - 防止引导崩溃影响整个应用

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Tutorial Error:', error)
    console.error('Error Info:', errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#1a1a2e',
          border: '2px solid #FF6B6B',
          borderRadius: 12,
          padding: 24,
          zIndex: 10000,
          maxWidth: 400,
        }}>
          <h3 style={{ color: '#FF6B6B', marginBottom: 12 }}>⚠️ 引导出现问题</h3>
          <p style={{ color: '#d1d5db', marginBottom: 16 }}>
            新手引导遇到了问题，但游戏可以继续进行。
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '10px 20px',
              background: '#00CED1',
              border: 'none',
              borderRadius: 6,
              color: '#000',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            跳过引导继续游戏
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
