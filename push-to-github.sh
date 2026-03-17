#!/bin/bash
# 一键推送脚本
# 使用方法：在终端运行此脚本

cd ~/Desktop/star-trade-station

# 检查 GitHub 远程
if ! git remote | grep -q "github"; then
    git remote add github https://github.com/yaogang99/xingji.git
    echo "✅ 已添加 GitHub 远程仓库"
fi

# 生成并显示推送命令
echo ""
echo "🚀 准备推送到 GitHub"
echo "======================"
echo ""
echo "请执行以下命令："
echo ""
echo "  git push github main"
echo ""
echo "如果提示输入密码，请输入 GitHub Token"
echo "（从这里获取：https://github.com/settings/tokens）"
echo ""
echo "或者使用 SSH 方式："
echo "  git remote set-url github git@github.com:yaogang99/xingji.git"
echo "  git push github main"
echo ""
