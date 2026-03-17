#!/bin/bash
# build-windows-zip.sh - 创建 Windows 便携版

echo "📦 创建 Windows 便携版..."
cd ~/Desktop/star-trade-station

# 清理
rm -rf dist/win-portable
mkdir -p dist/win-portable

# 构建
echo "🔨 构建应用..."
npm run build

# 复制构建文件
echo "📂 复制文件..."
cp -r dist/assets dist/win-portable/
cp -r dist/data dist/win-portable/
cp dist/index.html dist/win-portable/
cp -r electron dist/win-portable/
cp package.json dist/win-portable/

# 创建启动脚本
cat > dist/win-portable/start.bat << 'EOF'
@echo off
echo 正在启动星际贸易站...
npx electron .
EOF

# 创建说明
cat > dist/win-portable/README.txt << 'EOF'
星际贸易站 - Windows 便携版
==========================

运行方式：
1. 安装 Node.js (https://nodejs.org/) 
2. 在此目录打开命令行
3. 运行: npm install
4. 运行: npx electron .

或者双击 start.bat (需要已安装依赖)
EOF

# 打包 zip
cd dist
zip -r "星际贸易站-Windows便携版-$(date +%Y%m%d).zip" win-portable/

echo ""
echo "✅ 完成！"
echo "文件位置："
ls -lh "星际贸易站-Windows便携版-"*.zip
