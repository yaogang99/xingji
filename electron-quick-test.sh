#!/bin/bash
# electron-quick-test.sh - 快速验证 Electron 应用

echo "🚀 星际贸易站 - Electron 快速测试"
echo "=================================="

# 构建应用
echo "📦 构建应用..."
cd ~/Desktop/star-trade-station
npm run build > /dev/null 2>&1

# 关闭已有的 Electron
pkill -f "electron" 2>/dev/null
sleep 1

# 启动 Electron 并截图
echo "📸 启动应用并截图..."
unset NODE_OPTIONS

# 使用 playwright 快速截图验证
npx playwright test --config=playwright.electron.config.ts -g "应用成功启动" --reporter=line 2>&1

# 显示结果
if [ -f "test-results/01-main-menu.png" ]; then
    echo "✅ 截图已生成: test-results/01-main-menu.png"
    ls -lh test-results/01-main-menu.png
else
    echo "❌ 截图未生成"
fi

echo ""
echo "📁 所有截图在: test-results/"
echo "✅ 快速测试完成！"
