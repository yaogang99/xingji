#!/bin/bash
# build-windows.sh - macOS 本地打包 Windows 版本（使用 electron-forge）

echo "🚀 星际贸易站 - Windows 打包脚本"
echo "=================================="

cd ~/Desktop/star-trade-station

# 1. 清理旧构建
echo "🧹 清理旧构建..."
rm -rf dist/win out/make

# 2. 安装依赖
echo "📦 安装依赖..."
npm ci

# 3. 构建应用
echo "🔨 构建应用..."
npm run build

# 4. 打包 Windows
echo "🎁 打包 Windows 版本..."
# 使用 cross-env 设置平台环境
npx cross-env NODE_PLATFORM=win32 npm run electron:package -- --platform=win32 --arch=x64

# 5. 检查输出
echo ""
echo "✅ 打包完成！"
echo "输出文件："
ls -lh out/make/squirrel.windows/x64/ 2>/dev/null || ls -lh out/make/ 2>/dev/null || echo "请检查 out/ 目录"
