# GameLaunchPad 🎮

This is the frontend code repository of GameLaunchPad - A complete game management platform with creation, review, and publishing workflow.

## Getting Started

Install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:80](http://localhost:80) with your browser to see the result.

## 🔗 Quick Links

| Page | URL | Description |
|------|-----|-------------|
| 🎮 Game List | [http://localhost:80/games](http://localhost:80/games) | View all games with search and filter |
| ➕ Create Game | [http://localhost:80/games/create](http://localhost:80/games/create) | Create new game or edit existing |
| 🏢 Provider Materials | [http://localhost:80/cp-materials](http://localhost:80/cp-materials) | Submit provider verification materials |
| 🔍 Review Panel | [http://localhost:80/review_tool/review.html](http://localhost:80/review_tool/review.html) | Admin review panel (Game + Provider) |
| 🧪 CP Test Tool | [http://localhost:80/test-cp-material.html](http://localhost:80/test-cp-material.html) | Quick provider test data |
| 📖 Review Guide | [public/review_tool/REVIEW_GUIDE.md](public/review_tool/REVIEW_GUIDE.md) | Game review system documentation |
| 📖 Provider Review Guide | [PROVIDER_REVIEW_GUIDE.md](PROVIDER_REVIEW_GUIDE.md) | Provider review system documentation |

## ✨ Features

### 🎮 Game Management
- ✅ **Game Creation** - Create games with auto-save drafts
- ✅ **Draft Display** - Drafts shown in game list
- ✅ **Review Workflow** - Submit → Reviewing → Published
- ✅ **Game Editing** - Click card to edit, real-time preview
- ✅ **Search & Filter** - Search by keyword, filter by status/platform
- ✅ **Screenshots Preview** - Live preview panel with screenshots

### 🏢 Provider Management
- ✅ **Provider Verification** - Submit company verification materials
- ✅ **Auto-save Drafts** - Automatic draft saving
- ✅ **Review Workflow** - Draft → Reviewing → Approved/Rejected
- ✅ **File Upload** - PDF, JPG, PNG support (max 10MB)

### 🔍 Review Management
- ✅ **Unified Panel** - Game + Provider review in one place
- ✅ **Batch Operations** - Approve all reviewing items
- ✅ **Real-time Updates** - Auto-refresh every 5 seconds
- ✅ **Data Persistence** - All data stored in localStorage

## 📊 Game Status Flow

```
🔵 Draft → 🟡 Reviewing → 🟢 Published
         ↘ (Reject) ↙
```

## 🧪 Quick Test

Visit the review panel and run in browser console:

```javascript
// Add test data with all statuses
localStorage.setItem('published_games', JSON.stringify([
  {
    id: "game_1",
    gameName: "Published Game",
    gameType: "RPG",
    status: "published",
    platforms: { android: true, ios: true, web: false },
    downloads: 5000,
    rating: 4.8,
    version: "2.0.0",
    publishedAt: Date.now() - 7 * 24 * 60 * 60 * 1000
  },
  {
    id: "game_2",
    gameName: "Reviewing Game",
    gameType: "Action",
    status: "reviewing",
    platforms: { android: true, ios: false, web: true },
    downloads: 0,
    rating: 0,
    version: "1.0.0",
    publishedAt: Date.now()
  }
]));
location.reload();
```

## 📚 Documentation

- [Game Management System](GAME_MANAGEMENT_SYSTEM.md) - Complete game management guide
- [Game Review Guide](public/review_tool/REVIEW_GUIDE.md) - Game review workflow
- [Provider Review Guide](PROVIDER_REVIEW_GUIDE.md) - Provider review workflow
- [Quick Start Guide](QUICK_START.md) - Quick start and link reference
- [File Locations](FILE_LOCATIONS.md) - File structure and locations

## 🛠️ Third-party Libraries

- [Next.js 15](https://nextjs.org/) - React framework
- [Material UI](https://mui.com/material-ui) - UI component library
- [TypeScript](https://www.typescriptlang.org/) - Type safety