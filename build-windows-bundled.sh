#!/bin/bash
# build-windows-bundled.sh - 创建带 Node.js 的 Windows 便携版

echo "📦 创建 Windows 完整包（含 Node.js 运行时）..."
cd ~/Desktop/star-trade-station

# 清理
rm -rf dist/win-bundled
mkdir -p dist/win-bundled

# 构建
echo "🔨 构建应用..."
npm run build

# 复制文件
cp -r dist/assets dist/win-bundled/
cp -r dist/data dist/win-bundled/
cp dist/index.html dist/win-bundled/
cp -r electron dist/win-bundled/
cp package.json dist/win-bundled/

# 下载 Windows 版 Node.js
echo "⬇️  下载 Windows Node.js..."
curl -L -o dist/win-bundled/node.exe https://nodejs.org/dist/v18.19.0/win-x64/node.exe 2>/dev/null || echo "⚠️  无法下载 Node.exe，用户需要自行安装 Node.js"

# 创建 Windows 启动脚本
cat > dist/win-portable/START.bat << 'EOF'
@echo off
echo ===================================
echo    星际贸易站 - Star Trade Station
echo ===================================
echo.

REM 检查 Node.js
where node > nul 2>&1
if %errorlevel% neq 0 (
    echo [❌] 未检测到 Node.js
    echo.
    echo 请先安装 Node.js:
    echo https://nodejs.org/dist/v18.19.0/node-v18.19.0-x64.msi
    echo.
    pause
    exit /b 1
)

echo [✓] 正在启动游戏...
npx electron .
EOF

# 创建详细说明
cat > dist/win-portable/使用说明.txt << 'EOF'
星际贸易站 v1.0 - Windows 版
==============================

【运行方式】
方法1：双击 START.bat（推荐）
方法2：命令行运行：
       npm install
       npx electron .

【系统要求】
- Windows 10/11 64位
- Node.js 18+ (如果没有，访问 https://nodejs.org/ 下载安装)

【存档位置】
游戏自动保存，存档存储在浏览器的本地存储中。

【问题反馈】
如有问题，请访问：https://gitee.com/yaogang99/xingji
EOF

# 打包
cd dist
zip -r "星际贸易站-v1.0-Windows完整版.zip" win-portable/

echo ""
echo "✅ 完成！"
ls -lh "星际贸易站-v1.0-Windows完整版.zip"
