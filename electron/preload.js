// electron/preload.js
// Electron 预加载脚本

const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 监听菜单事件
  onMenuNewGame: (callback) => ipcRenderer.on('menu-new-game', callback),
  onMenuLoadGame: (callback) => ipcRenderer.on('menu-load-game', callback),
  onMenuSettings: (callback) => ipcRenderer.on('menu-settings', callback),
  onMenuAbout: (callback) => ipcRenderer.on('menu-about', callback),
  
  // 移除监听器
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});
