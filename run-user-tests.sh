#!/bin/bash
# 用户级全自动化测试脚本
# 运行方式: ./run-user-tests.sh

echo "=================================="
echo "星际贸易站 - 用户级全自动化测试"
echo "=================================="
echo ""

# 检查是否安装了Playwright
if ! command -v npx &> /dev/null; then
    echo "❌ 请先安装 Node.js"
    exit 1
fi

# 安装Playwright依赖（如果没有）
echo "📦 检查Playwright依赖..."
cd ~/Desktop/star-trade-station

if [ ! -d "node_modules/@playwright/test" ]; then
    echo "📥 安装Playwright..."
    npm install -D @playwright/test
    npx playwright install chromium
fi

# 启动HTTP服务器
echo ""
echo "🚀 启动HTTP服务器..."
python3 -m http.server 8888 &
SERVER_PID=$!
sleep 2

# 运行测试
echo ""
echo "🧪 运行全自动化测试..."
echo "=================================="
npx playwright test tests/e2e/tutorial-automation.spec.ts --headed

# 获取测试结果
TEST_RESULT=$?

# 停止服务器
echo ""
echo "🛑 停止HTTP服务器..."
kill $SERVER_PID 2>/dev/null

echo ""
echo "=================================="
if [ $TEST_RESULT -eq 0 ]; then
    echo "✅ 所有测试通过！"
else
    echo "❌ 测试失败，请查看上面的错误信息"
fi
echo "=================================="
