// scripts/fix-electron-html.cjs
// 修复 Vite 输出的 HTML，使其兼容 Electron

const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../dist/index.html');

if (!fs.existsSync(htmlPath)) {
  console.error('dist/index.html not found');
  process.exit(1);
}

let html = fs.readFileSync(htmlPath, 'utf8');

// 移除导致 Windows 黑屏的属性
// 1. 移除 type="module"（Electron 不需要）
html = html.replace(/type="module"/g, '');

// 2. 移除 crossorigin 属性
html = html.replace(/crossorigin/g, '');

// 3. 确保路径都是相对路径 ./
html = html.replace(/src="\/assets\//g, 'src="./assets/');
html = html.replace(/href="\/assets\//g, 'href="./assets/');

fs.writeFileSync(htmlPath, html);
console.log('✅ HTML fixed for Electron');
