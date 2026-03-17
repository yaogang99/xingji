# 安卓版开发计划

## 技术方案：Capacitor + React

### 为什么选Capacitor？
- 代码复用70%（现有React组件大部分保留）
- 可打包成APK上架Google Play
- 支持原生推送通知
- 支持SQLite离线存储

### 需要安装
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npm install @capacitor/push-notifications
npm install @capacitor/storage  # 替代localStorage
```

### 文件改动清单

#### 1. 核心适配（必须）
- [ ] `src/core/SaveSystem.ts` → 改用SQLite存储
- [ ] `src/App.tsx` → 添加Capacitor初始化
- [ ] `capacitor.config.ts` → 新建配置文件

#### 2. UI响应式（同PWA方案）
- [ ] `src/App.css` → 添加移动端媒体查询
- [ ] `src/ui/MainMenu.tsx` → 按钮尺寸调整
- [ ] `src/ui/PlanetPanel.tsx` → 网格布局改为2列
- [ ] `src/ui/ResourceList.tsx` → 添加滑动支持

#### 3. 推送通知（新增）
- [ ] `src/core/NotificationService.ts` → 新建
- [ ] `src/App.tsx` → 集成通知初始化

#### 4. 构建设置
- [ ] `android/` → Capacitor自动生成的安卓项目
- [ ] `.github/workflows/build-android.yml` → GitHub Actions打包APK

### 存储方案对比

| 桌面版 | 安卓版 |
|--------|--------|
| localStorage | SQLite |
| 5MB限制 | 无限制 |
| 同步阻塞 | 异步操作 |
| 简单JSON | 结构化查询 |

### 推送通知场景

```typescript
// 游戏内触发通知
NotificationService.schedule({
  title: '资源已满！',
  body: '铁矿已达到上限，快来出售吧',
  trigger: { at: new Date(Date.now() + 3600000) } // 1小时后
});
```

### 预计工作量
- AI生成代码：2-3轮对话
- 人类测试：1-2小时（真机测试）
- GitHub Actions打包：自动

### 最终输出
- APK文件（可安装到安卓手机）
- 或上架Google Play
