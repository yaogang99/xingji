// tests/e2e/css-selector-test.cjs
// CSS选择器验证测试 - 用户级检测

const fs = require('fs');
const path = require('path');

console.log('==================================');
console.log('星际贸易站 - CSS选择器验证测试');
console.log('==================================\n');

let passCount = 0;
let failCount = 0;

// 读取App.tsx检查data-nav属性
console.log('Test 1: 检查App.tsx中的data-nav属性');
const appPath = path.join(__dirname, '../../src/App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');

const expectedNavs = ['planets', 'tech', 'expeditions', 'achievements', 'settings'];
expectedNavs.forEach(nav => {
  if (appContent.includes(`data-nav="${nav}"`)) {
    console.log(`  ✅ [data-nav="${nav}"] 存在于App.tsx`);
    passCount++;
  } else {
    console.log(`  ❌ [data-nav="${nav}"] 不存在于App.tsx - 需要修复！`);
    failCount++;
  }
});

// 读取TutorialSystem.ts检查选择器修复
console.log('\nTest 2: 检查TutorialSystem.ts选择器修复');
const tutorialPath = path.join(__dirname, '../../src/core/TutorialSystem.ts');
const tutorialContent = fs.readFileSync(tutorialPath, 'utf8');

// 检查是否使用了:contains()（错误）
if (tutorialContent.includes(':contains(')) {
  console.log('  ❌ 发现错误的选择器 `:contains()` - 需要修复！');
  console.log('     这是导致引导失败的根本原因！');
  failCount++;
} else {
  console.log('  ✅ 未发现 `:contains()` 错误选择器');
  passCount++;
}

// 检查是否使用了data-nav属性（正确）
if (tutorialContent.includes('data-nav="planets"') && 
    tutorialContent.includes('data-nav="tech"')) {
  console.log('  ✅ 发现正确的 `[data-nav="..."]` 选择器');
  passCount++;
} else {
  console.log('  ❌ 未发现正确的 `[data-nav="..."]` 选择器');
  failCount++;
}

// 检查构建后的文件
console.log('\nTest 3: 检查构建后的dist目录');
const distPath = path.join(__dirname, '../../dist');
const indexHtmlPath = path.join(distPath, 'index.html');

if (fs.existsSync(indexHtmlPath)) {
  console.log('  ✅ dist/index.html 存在');
  passCount++;
  
  // 检查JS文件引用
  const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');
  if (indexContent.includes('src="./assets/')) {
    console.log('  ✅ 路径已修复为相对路径 `./assets/`');
    passCount++;
  } else if (indexHtmlPath.includes('src="/assets/')) {
    console.log('  ❌ 路径仍为绝对路径 `/assets/` - 需要修复！');
    failCount++;
  }
} else {
  console.log('  ❌ dist/index.html 不存在 - 请先运行 npm run build');
  failCount++;
}

// 检查所有修复的步骤
console.log('\nTest 4: 验证所有修复的引导步骤');
const stepsToCheck = [
  { step: 5, name: 'planets_nav', pattern: /data-nav="planets"/ },
  { step: 7, name: 'tech_nav', pattern: /data-nav="tech"/ },
  { step: 9, name: 'expedition_nav', pattern: /data-nav="expeditions"/ },
  { step: 11, name: 'achievements', pattern: /data-nav="achievements"/ },
];

stepsToCheck.forEach(({ step, name, pattern }) => {
  if (pattern.test(tutorialContent)) {
    console.log(`  ✅ Step ${step} (${name}): 使用正确的data-nav选择器`);
    passCount++;
  } else {
    console.log(`  ❌ Step ${step} (${name}): 选择器可能有问题`);
    failCount++;
  }
});

// 测试结果汇总
console.log('\n==================================');
console.log('测试结果汇总');
console.log('==================================');
console.log(`✅ 通过: ${passCount}`);
console.log(`❌ 失败: ${failCount}`);

if (failCount === 0) {
  console.log('\n🎉 所有测试通过！');
  console.log('   CSS选择器已正确修复。');
  console.log('   请在浏览器中刷新页面验证。');
  process.exit(0);
} else {
  console.log('\n⚠️  测试发现问题');
  console.log('   请检查上述失败项并修复。');
  process.exit(1);
}
