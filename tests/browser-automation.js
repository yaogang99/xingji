// 直接在浏览器控制台执行的自动化测试脚本
// 使用方式: 打开游戏后，在Chrome DevTools Console中粘贴执行

(function() {
  console.log('==================================');
  console.log('星际贸易站 - 用户级全自动化测试');
  console.log('==================================\n');
  
  let testResults = { pass: 0, fail: 0 };
  
  function log(msg, type = 'info') {
    const prefix = type === 'pass' ? '✅' : type === 'fail' ? '❌' : 'ℹ️';
    console.log(`${prefix} ${msg}`);
    if (type === 'pass') testResults.pass++;
    if (type === 'fail') testResults.fail++;
  }
  
  // 测试1: 检查DOM结构
  console.log('\n--- Test 1: 检查DOM结构 ---');
  
  const root = document.getElementById('root');
  if (root) {
    log('#root 元素存在', 'pass');
  } else {
    log('#root 元素不存在', 'fail');
  }
  
  // 测试2: 检查导航按钮data-nav属性
  console.log('\n--- Test 2: 检查导航按钮data-nav属性 ---');
  
  const expectedNavs = ['planets', 'tech', 'expeditions', 'achievements', 'settings'];
  expectedNavs.forEach(nav => {
    const btn = document.querySelector(`.nav-btn[data-nav="${nav}"]`);
    if (btn) {
      log(`[data-nav="${nav}"] 存在`, 'pass');
    } else {
      log(`[data-nav="${nav}"] 不存在`, 'fail');
    }
  });
  
  // 测试3: 检查引导系统
  console.log('\n--- Test 3: 检查引导系统 ---');
  
  const tutorialState = localStorage.getItem('star_trade_station_tutorial');
  if (tutorialState) {
    const state = JSON.parse(tutorialState);
    log(`引导状态: completed=${state.completed}, skipped=${state.skipped}`, 'info');
  } else {
    log('引导未开始（首次访问）', 'info');
  }
  
  // 测试4: 检查是否有引导UI
  console.log('\n--- Test 4: 检查引导UI ---');
  
  const tutorialTooltip = document.querySelector('.tutorial-tooltip');
  if (tutorialTooltip) {
    log('引导UI已显示', 'pass');
    
    // 获取当前步骤
    const title = tutorialTooltip.querySelector('h3');
    if (title) {
      log(`当前步骤标题: "${title.textContent}"`, 'info');
    }
  } else {
    log('引导UI未显示（可能已完成或跳过）', 'info');
  }
  
  // 测试5: 检查高亮遮罩
  console.log('\n--- Test 5: 检查高亮遮罩 ---');
  
  const highlight = document.querySelector('.tutorial-highlight');
  if (highlight) {
    log('高亮遮罩存在', 'pass');
    const rect = highlight.getBoundingClientRect();
    log(`高亮位置: x=${Math.round(rect.x)}, y=${Math.round(rect.y)}, w=${Math.round(rect.width)}, h=${Math.round(rect.height)}`, 'info');
  } else {
    log('高亮遮罩不存在（center模式或无引导）', 'info');
  }
  
  // 测试6: 自动点击测试（模拟用户操作）
  console.log('\n--- Test 6: 自动点击测试 ---');
  
  function simulateClick(selector, description) {
    const element = document.querySelector(selector);
    if (element) {
      element.click();
      log(`点击 ${description} 成功`, 'pass');
      return true;
    } else {
      log(`点击 ${description} 失败 - 元素未找到`, 'fail');
      return false;
    }
  }
  
  // 如果有引导，点击下一步
  const nextBtn = document.querySelector('.tutorial-tooltip button:contains("下一步")') || 
                  document.querySelector('.tutorial-tooltip button:last-child');
  if (nextBtn && tutorialTooltip) {
    simulateClick('.tutorial-tooltip button:last-child', '引导下一步按钮');
  }
  
  // 测试7: 导航按钮点击测试
  console.log('\n--- Test 7: 导航按钮点击测试 ---');
  
  setTimeout(() => {
    simulateClick('.nav-btn[data-nav="planets"]', '行星导航按钮');
    
    setTimeout(() => {
      simulateClick('.nav-btn[data-nav="tech"]', '科技导航按钮');
      
      setTimeout(() => {
        simulateClick('.nav-btn[data-nav="expeditions"]', '探险导航按钮');
        
        // 最终结果
        console.log('\n==================================');
        console.log('测试结果汇总');
        console.log('==================================');
        console.log(`✅ 通过: ${testResults.pass}`);
        console.log(`❌ 失败: ${testResults.fail}`);
        
        if (testResults.fail === 0) {
          console.log('\n🎉 所有测试通过！');
        } else {
          console.log('\n⚠️  部分测试未通过');
        }
        console.log('==================================');
      }, 1000);
    }, 1000);
  }, 1000);
  
})();
