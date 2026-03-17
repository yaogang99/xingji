// electron/main.cjs - Windows 黑屏终极修复版
const { app, BrowserWindow, Menu, protocol, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

// 注册自定义协议（解决 file:// 协议的安全限制）
function registerProtocol() {
  protocol.registerFileProtocol('app', (request, callback) => {
    const url = request.url.substr(6); // 去掉 'app://'
    let decodedUrl = decodeURIComponent(url);
    
    // Windows 路径处理
    if (process.platform === 'win32') {
      decodedUrl = decodedUrl.replace(/\\/g, '/');
    }
    
    const filePath = path.join(__dirname, '../dist', decodedUrl);
    
    // 安全检查：确保文件在 dist 目录内
    const distPath = path.join(__dirname, '../dist');
    if (!filePath.startsWith(distPath)) {
      callback({ error: -6 }); // 拒绝访问
      return;
    }
    
    callback({ path: filePath });
  });
}

function createWindow() {
  // 注册协议
  registerProtocol();
  
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: '星际贸易站',
    icon: path.join(__dirname, '../dist/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      webSecurity: false, // 允许加载本地资源
      allowRunningInsecureContent: true,
      // 启用开发者工具以便调试
      devTools: true
    },
    backgroundColor: '#0a0a0f',
    show: false
  });

  const isDev = process.argv.includes('--dev');
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // 使用自定义协议加载（最可靠的方式）
    const indexPath = path.join(__dirname, '../dist/index.html');
    
    // 检查文件是否存在
    if (!fs.existsSync(indexPath)) {
      console.error('Error: index.html not found at', indexPath);
      dialog.showErrorBox('启动失败', '找不到游戏文件');
      return;
    }
    
    console.log('Loading from:', indexPath);
    
    // Windows 上使用 file:// 协议，但先修改 HTML 移除 module 属性
    mainWindow.loadURL('file://' + indexPath.replace(/\\/g, '/'));
    
    // 调试：监听加载失败
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
      console.error('Load failed:', errorCode, errorDescription, validatedURL);
    });
    
    // 调试：监听控制台消息
    mainWindow.webContents.on('console-message', (event, level, message) => {
      console.log('Console:', ['verbose', 'info', 'warning', 'error'][level], message);
    });
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.maximize();
    
    // 调试：打开开发者工具
    // mainWindow.webContents.openDevTools();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Windows 隐藏菜单栏
  if (process.platform === 'darwin') {
    createMenu();
  } else {
    Menu.setApplicationMenu(null);
  }
}

function createMenu() {
  const { Menu } = require('electron');
  const template = [
    {
      label: '游戏',
      submenu: [
        {
          label: '新游戏',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-game');
          }
        },
        {
          label: '读取存档',
          accelerator: 'CmdOrCtrl+L',
          click: () => {
            mainWindow.webContents.send('menu-load-game');
          }
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// 应用准备就绪
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
