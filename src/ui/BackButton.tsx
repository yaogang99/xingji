// src/ui/BackButton.tsx
// 返回按钮组件

interface BackButtonProps {
  onClick: () => void
  label?: string
}

export function BackButton({ onClick, label = '← 返回' }: BackButtonProps) {
  return (
    <button className="back-btn" onClick={onClick}>
      {label}
    </button>
  )
}
