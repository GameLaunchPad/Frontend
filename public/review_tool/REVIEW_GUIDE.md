# 🎮 游戏审核系统 - 完整指南

## 🚀 快速访问

**审核管理面板**: `http://localhost:3000/review_tool/review.html`

---

## 📋 游戏状态说明

游戏有三种状态：

| 状态 | 英文 | 说明 | 标签颜色 | 谁可以操作 |
|------|------|------|---------|-----------|
| 草稿 | draft | 正在编辑，未提交 | 🔵 蓝色 | 开发者 |
| 审核中 | reviewing | 已提交，等待审核 | 🟡 黄色 | 管理员 |
| 已发布 | published | 审核通过，已上线 | 🟢 绿色 | 所有人 |

---

## 🔄 完整生命周期

```
Step 1: 创建草稿 (Draft) 🔵
   ↓
   开发者填写表单 → 自动保存
   ↓
   列表显示蓝色 "Draft" 标签

Step 2: 提交审核 (Reviewing) 🟡
   ↓
   开发者点击 "Submit for Review"
   ↓
   状态变为 "Reviewing"，黄色标签
   ↓
   等待管理员审核（3-5个工作日）

Step 3: 管理员审核
   ↓
   方案A: 审核通过 → Published 🟢
   方案B: 审核拒绝 → Draft 🔵（返回草稿）

Step 4: 已发布 (Published) 🟢
   ↓
   游戏正式上线
   ↓
   玩家可以下载和游玩
```

---

## 🎮 审核管理面板功能

### 访问地址

```
http://localhost:3000/review_tool/review.html
```

### 主要功能

1. **📊 数据展示**
   - 显示所有游戏（包括草稿）
   - 实时统计：总数、已发布、审核中、草稿
   - 按状态筛选游戏

2. **✅ 审核操作**
   - 单个审核通过（Reviewing → Published）
   - 单个审核拒绝（Reviewing → Draft）
   - 批量审核通过所有待审核游戏

3. **🗑️ 删除功能**
   - 删除任何状态的游戏
   - 删除草稿数据

4. **🔄 实时更新**
   - 每5秒自动刷新
   - 跨标签页同步
   - 操作后立即更新显示

---

## 🚀 快速开始

### 1️⃣ 启动开发服务器

```bash
cd /Users/a1-6/github.com/Frontend
npm run dev
```

### 2️⃣ 访问审核面板

```
http://localhost:3000/review_tool/review.html
```

### 3️⃣ 添加测试数据

在浏览器控制台（F12）运行：

```javascript
localStorage.setItem('published_games', JSON.stringify([
  {
    id: "game_1",
    gameName: "已发布游戏",
    gameIntro: "这个游戏已经通过审核并发布",
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
    gameIntro: "这个游戏正在等待审核",
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

localStorage.setItem('game_form_data', JSON.stringify({
  gameName: "草稿游戏",
  gameIntro: "这个游戏还在编辑中",
  gameType: "Strategy",
  avatarSrc: "",
  headerImage: "",
  platforms: { android: true, ios: true, web: false },
  platformConfigs: {},
  screenshots: [],
  savedAt: Date.now()
}));

location.reload();
```

### 4️⃣ 开始审核

- 点击 "🟡 Reviewing" 标签查看待审核游戏
- 点击 "✅ Approve" 审核通过
- 点击 "❌ Reject" 拒绝审核

---

## 🎯 典型使用场景

### 场景 1: 审核单个游戏

1. 访问审核面板
2. 点击 "🟡 Reviewing" 标签
3. 查看游戏信息
4. 点击 "✅ Approve" 通过
5. 游戏状态变为 "Published" 🟢

### 场景 2: 批量审核

1. 点击 "✅ Approve All Reviewing"
2. 确认操作
3. 所有待审核游戏变为已发布

### 场景 3: 拒绝审核

1. 找到不合格的游戏
2. 点击 "❌ Reject"
3. 输入拒绝原因
4. 游戏返回草稿状态

---

## 💡 实用技巧

### 批量审核所有游戏

```javascript
const games = JSON.parse(localStorage.getItem('published_games') || '[]');
games.forEach(g => {
  if (g.status === 'reviewing') {
    g.status = 'published';
  }
});
localStorage.setItem('published_games', JSON.stringify(games));
location.reload();
```

### 查看审核进度

```javascript
const games = JSON.parse(localStorage.getItem('published_games') || '[]');
const stats = {
  待审核: games.filter(g => g.status === 'reviewing').length,
  已发布: games.filter(g => g.status === 'published').length,
  草稿: games.filter(g => g.status === 'draft').length,
  总计: games.length
};
console.log('📊 审核进度:', stats);
console.log('✅ 完成度:', ((stats.已发布 / stats.总计) * 100).toFixed(1) + '%');
```

---

## 🔗 相关链接

- 🎮 **游戏列表**: `http://localhost:3000/games`
- ➕ **创建游戏**: `http://localhost:3000/games/create`
- 🔍 **审核管理**: `http://localhost:3000/review_tool/review.html`
- 📖 **项目说明**: `README.md`

---

**审核系统已就绪！访问 http://localhost:3000/review_tool/review.html 开始使用！** 🎉

