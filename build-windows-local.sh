#!/bin/bash
# build-windows-local.sh - 本地打包 Windows 版本

echo "📦 打包 Windows 版本..."
cd ~/Desktop/star-trade-station

# 确保依赖安装
npm ci

# 构建应用
npm run build

# 安装 Wine 支持（如果还没装）
if ! command -v wine &> /dev/null; then
    echo "🍷 正在安装 Wine..."
    brew install --cask wine-stable || echo "请手动安装 Wine"
fi

# 打包 Windows
npx electron-builder --win --x64 \
    --config.productName="星际贸易站" \
    --config.appId="com.yaogang99.star-trade-station" \
    --config.directories.output="dist/win" \
    --config.win.target="nsq,zip"

echo "✅ Windows 安装包已生成在 dist/win/"
ls -lh dist/win/
