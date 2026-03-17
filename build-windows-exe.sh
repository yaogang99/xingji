#!/bin/bash
# build-windows-exe.sh - 使用 Docker 打包 Windows 安装包

echo "🚀 星际贸易站 - Windows EXE 打包"
echo "================================="

cd ~/Desktop/star-trade-station

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ 需要安装 Docker"
    echo "请访问 https://docs.docker.com/desktop/install/mac-install/"
    exit 1
fi

# 构建 Docker 镜像（基于 electron-builder 的 Windows 镜像）
echo "🐳 准备打包环境..."
docker run --rm \
    --env-file <(env | grep -E '^(CI|NODE_|ELECTRON_)') \
    -v "${PWD}:/project" \
    -v "${PWD}/node_modules:/project/node_modules" \
    electronuserland/builder:wine \
    bash -c "
        cd /project && \
        npm ci && \
        npm run build && \
        npx electron-builder build --win --x64
    "

# 检查输出
echo ""
echo "✅ 打包完成！"
ls -lh dist/*.exe 2>/dev/null || echo "请检查 dist/ 目录"
