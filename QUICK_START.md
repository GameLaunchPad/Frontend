# 🚀 快速开始指南

## 📁 文件结构

```
Frontend/
├── README.md                          # 项目说明
├── GAME_MANAGEMENT_SYSTEM.md         # 系统总览
├── QUICK_START.md                     # 本文档
│
├── src/app/
│   └── games/
│       ├── page.tsx                   # 游戏列表页面
│       └── create/page.tsx            # 创建/编辑页面
│
└── public/
    ├── review_tool/                   ⭐ 审核工具目录
    │   ├── REVIEW_GUIDE.md            完整审核指南
    │   └── review.html                审核管理面板
    │
    ├── quick-test.html                快速测试工具
    └── test-storage.html              存储测试工具
```

## 🔗 访问链接

| 页面 | URL | 文件位置 |
|------|-----|---------|
| 🎮 游戏列表 | `http://localhost:3000/games` | `src/app/games/page.tsx` |
| ➕ 创建/编辑 | `http://localhost:3000/games/create` | `src/app/games/create/page.tsx` |
| 🔍 审核管理 | `http://localhost:3000/review_tool/review.html` | `public/review_tool/review.html` ⭐ |
| 🧪 快速测试 | `http://localhost:3000/quick-test.html` | `public/quick-test.html` |

## ⚡ 3分钟快速测试

### 步骤 1: 启动服务器

```bash
cd /Users/a1-6/github.com/Frontend
npm run dev
```

### 步骤 2: 访问审核管理面板

```
http://localhost:3000/review_tool/review.html
```

### 步骤 3: 添加测试数据

在浏览器控制台（F12）粘贴运行：

```javascript
localStorage.setItem('published_games', JSON.stringify([
  {
    id: "game_1",
    gameName: "已发布游戏",
    gameIntro: "已通过审核",
    gameType: "RPG",
    avatarSrc: "",
    headerImage: "",
    platforms: { android: true, ios: true, web: false },
    platformConfigs: {},
    screenshots: [],
    publishedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    status: "published",
    downloads: 5000,
    rating: 4.8,
    version: "2.0.0",
    savedAt: Date.now()
  },
  {
    id: "game_2",
    gameName: "待审核游戏",
    gameIntro: "等待审核中",
    gameType: "Action",
    avatarSrc: "",
    headerImage: "",
    platforms: { android: true, ios: false, web: true },
    platformConfigs: {},
    screenshots: [],
    publishedAt: Date.now(),
    status: "reviewing",
    downloads: 0,
    rating: 0,
    version: "1.0.0",
    savedAt: Date.now()
  }
]));

location.reload();
```

### 步骤 4: 测试审核功能

- ✅ 看到 2 个游戏
- ✅ 点击 "🟡 Reviewing" 筛选
- ✅ 点击 "✅ Approve" 审核通过
- ✅ 游戏变为 Published 状态

---

## 📝 文件位置说明

### ✅ 正确的路径

审核管理文件现在在：
```
public/review_tool/
├── review.html         # 审核管理面板
└── REVIEW_GUIDE.md     # 审核指南
```

访问地址：
```
http://localhost:3000/review_tool/review.html  ✅
```

### ❌ 错误的路径

这些路径已不再使用：
```
public/review.html  ❌
src/app/review_tool/  ❌
```

---

## 📚 文档索引

1. **README.md** - 项目总览和快速链接
2. **GAME_MANAGEMENT_SYSTEM.md** - 系统功能说明
3. **public/review_tool/REVIEW_GUIDE.md** - 审核系统详细指南
4. **QUICK_START.md** (本文档) - 快速开始

---

## 🎯 快速访问（复制使用）

```
游戏列表: http://localhost:3000/games
创建游戏: http://localhost:3000/games/create
审核管理: http://localhost:3000/review_tool/review.html
```

**所有文件已正确放置，现在可以正常访问了！** 🎉

