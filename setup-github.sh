#!/bin/bash
# setup-github.sh - 创建 GitHub 仓库并推送代码

REPO_NAME="xingji"
GITHUB_USER="yaogang99"

echo "🚀 设置 GitHub 仓库..."

cd ~/Desktop/star-trade-station

# 添加 GitHub 远程仓库
git remote add github https://github.com/${GITHUB_USER}/${REPO_NAME}.git 2>/dev/null || echo "GitHub 远程已存在"

# 检查是否有 GitHub token
if [ -z "$GITHUB_TOKEN" ]; then
    echo ""
    echo "⚠️  需要 GitHub Token 来自动创建仓库"
    echo ""
    echo "请按以下步骤操作："
    echo "1. 访问 https://github.com/settings/tokens"
    echo "2. 点击 'Generate new token (classic)'"
    echo "3. 勾选 'repo' 权限"
    echo "4. 复制 token"
    echo "5. 在终端运行: export GITHUB_TOKEN=你的token"
    echo ""
    echo "或者手动创建仓库："
    echo "1. 访问 https://github.com/new"
    echo "2. 仓库名: xingji"
    echo "3. 点击 'Create repository'"
    echo "4. 然后运行: git push github main"
    exit 1
fi

# 创建 GitHub 仓库（通过 API）
echo "📦 创建 GitHub 仓库..."
curl -H "Authorization: token $GITHUB_TOKEN" \
     -d '{"name":"'$REPO_NAME'","description":"星际贸易站 - 放置经营游戏","private":false}' \
     https://api.github.com/user/repos 2>/dev/null | grep -q '"name": "'$REPO_NAME'"' && echo "✅ 仓库创建成功" || echo "⚠️  仓库可能已存在"

# 推送代码
echo "📤 推送代码到 GitHub..."
git push github main --force

echo ""
echo "✅ 完成！"
echo "访问 https://github.com/${GITHUB_USER}/${REPO_NAME}/actions 查看打包进度"
echo "大约 5-10 分钟后可以下载 Windows 安装包"
