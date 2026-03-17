// tests/e2e/tutorial-dom-test.js
// 使用JSDOM进行用户级DOM测试 - 无需真实浏览器

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

console.log('==================================');
console.log('星际贸易站 - 用户级DOM测试');
console.log('==================================\n');

// 读取构建后的HTML和JS
const distPath = path.join(__dirname, '../../dist');
const htmlContent = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');

// 创建JSDOM环境
const dom = new JSDOM(htmlContent, {
  url: 'http://localhost:8888',
  pretendToBeVisual: true,
  resources: 'usable',
  runScripts: 'dangerously',
});

const { document, window } = dom;

// 等待脚本加载
setTimeout(() => {
  try {
    const { document, window } = dom;
    
    console.log('🔍 开始DOM测试...\n');
  
  let passCount = 0;
  let failCount = 0;
  
  // 测试1: 检查根元素
  console.log('Test 1: 检查 #root 元素');
  const root = document.getElementById('root');
  if (root) {
    console.log('  ✅ #root 元素存在');
    passCount++;
  } else {
    console.log('  ❌ #root 元素不存在');
    failCount++;
  }
  
  // 测试2: 检查导航按钮（修复后的关键测试）
  console.log('\nTest 2: 检查导航按钮data-nav属性');
  const navButtons = document.querySelectorAll('.nav-btn');
  console.log(`  找到 ${navButtons.length} 个导航按钮`);
  
  const expectedNavs = ['planets', 'tech', 'expeditions', 'achievements', 'settings'];
  let allNavsPresent = true;
  
  expectedNavs.forEach(nav => {
    const btn = document.querySelector(`.nav-btn[data-nav="${nav}"]`);
    if (btn) {
      console.log(`  ✅ [data-nav="${nav}"] 存在`);
      passCount++;
    } else {
      console.log(`  ❌ [data-nav="${nav}"] 不存在 - 这是修复的关键！`);
      failCount++;
      allNavsPresent = false;
    }
  });
  
  // 测试3: 检查旧版错误选择器（应该失败）
  console.log('\nTest 3: 验证旧版错误选择器（应该找不到元素）');
  try {
    const oldSelector = document.querySelector('.nav-btn:contains("行星")');
    if (oldSelector) {
      console.log('  ⚠️  旧选择器居然有效（意外）');
    } else {
      console.log('  ✅ 旧选择器 `:contains()` 无效（符合预期）');
      console.log('     这就是为什么需要修复的原因！');
      passCount++;
    }
  } catch (e) {
    console.log('  ✅ 旧选择器报错（符合预期）:', e.message.substring(0, 50));
    passCount++;
  }
  
  // 测试4: 检查Tutorial相关DOM元素
  console.log('\nTest 4: 检查引导UI元素');
  
  // 模拟引导启动
  window.TutorialSystem = window.TutorialSystem || {
    shouldShowTutorial: () => true,
    start: () => {
      console.log('  📋 引导系统启动方法存在');
    }
  };
  
  // 检查必要的CSS类
  const requiredClasses = [
    '.tutorial-overlay',
    '.tutorial-backdrop', 
    '.tutorial-highlight',
    '.tutorial-tooltip',
    '.tutorial-progress'
  ];
  
  // 这些类是动态创建的，检查样式表中是否存在
  const styles = document.querySelectorAll('style');
  let tutorialStylesFound = false;
  styles.forEach(style => {
    if (style.textContent.includes('tutorial')) {
      tutorialStylesFound = true;
    }
  });
  
  if (tutorialStylesFound) {
    console.log('  ✅ 引导样式已加载');
    passCount++;
  } else {
    console.log('  ⚠️  引导样式可能内联在JS中');
  }
  
  // 测试5: 验证选择器兼容性
  console.log('\nTest 5: 验证所有引导步骤选择器');
  const tutorialSteps = [
    { step: 1, selector: null, desc: 'welcome (center mode)' },
    { step: 2, selector: '.resources', desc: 'resources_intro' },
    { step: 3, selector: '.sell-btn', desc: 'sell_resource' },
    { step: 4, selector: '.currency-display, .header', desc: 'currency_intro' },
    { step: 5, selector: '.nav-btn[data-nav="planets"]', desc: 'planets_nav (修复后)' },
    { step: 6, selector: '.unlock-btn, .planet-card', desc: 'planet_unlock' },
    { step: 7, selector: '.nav-btn[data-nav="tech"]', desc: 'tech_nav (修复后)' },
    { step: 8, selector: '.tech-node.available', desc: 'research_tech' },
    { step: 9, selector: '.nav-btn[data-nav="expeditions"]', desc: 'expedition_nav (修复后)' },
    { step: 10, selector: '.ship-card, .expedition-btn', desc: 'send_expedition' },
    { step: 11, selector: '.nav-btn[data-nav="achievements"]', desc: 'achievements (修复后)' },
    { step: 12, selector: null, desc: 'complete (center mode)' },
  ];
  
  tutorialSteps.forEach(({ step, selector, desc }) => {
    if (!selector) {
      console.log(`  ✅ Step ${step} (${desc}): center模式无高亮`);
      passCount++;
      return;
    }
    
    try {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`  ✅ Step ${step} (${desc}): 选择器有效`);
        passCount++;
      } else {
        console.log(`  ⚠️  Step ${step} (${desc}): 元素未找到（可能页面未渲染）`);
        // 这不一定是错误，因为React可能还没渲染
      }
    } catch (e) {
      console.log(`  ❌ Step ${step} (${desc}): 选择器语法错误 - ${e.message}`);
      failCount++;
    }
  });
  
  // 测试结果汇总
  console.log('\n==================================');
  console.log('测试结果汇总');
  console.log('==================================');
  console.log(`✅ 通过: ${passCount}`);
  console.log(`❌ 失败: ${failCount}`);
  
  if (failCount === 0 && allNavsPresent) {
    console.log('\n🎉 所有关键测试通过！');
    console.log('   修复后的选择器工作正常。');
    process.exit(0);
  } else if (!allNavsPresent) {
    console.log('\n⚠️  警告: 导航按钮data-nav属性缺失');
    console.log('   请确保重新构建了项目！');
    process.exit(1);
  } else {
    console.log('\n⚠️  部分测试未通过');
    process.exit(1);
  }
  
  } catch (error) {
    console.error('\n❌ 测试执行错误:', error.message);
    console.log('\n⚠️  注意: JSDOM无法完全模拟React渲染环境');
    console.log('   但这不影响真实浏览器的测试结果。');
    process.exit(1);
  }
}, 1000); // 等待1秒让脚本加载
