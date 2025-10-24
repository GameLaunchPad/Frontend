# GameLaunchPad 🎮

This is the frontend code repository of GameLaunchPad - A complete game management platform with creation, review, and publishing workflow.

## Getting Started

Install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔗 Quick Links

| Page | URL | Description |
|------|-----|-------------|
| 🎮 Game List | [http://localhost:3000/games](http://localhost:3000/games) | View all games with search and filter |
| ➕ Create Game | [http://localhost:3000/games/create](http://localhost:3000/games/create) | Create new game or edit existing |
| 🔍 Review Panel | [http://localhost:3000/review_tool/review.html](http://localhost:3000/review_tool/review.html) | Admin review management panel |
| 📖 Review Guide | [public/review_tool/REVIEW_GUIDE.md](public/review_tool/REVIEW_GUIDE.md) | Complete review system documentation |

## ✨ Features

- ✅ **Game Creation** - Create games with auto-save drafts
- ✅ **Draft Display** - Drafts shown in game list
- ✅ **Review Workflow** - Submit → Reviewing → Published
- ✅ **Game Editing** - Edit any game from the list
- ✅ **Search & Filter** - Search by keyword, filter by status/platform
- ✅ **Review Management** - Admin panel for approving/rejecting games
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

- [Review System Guide](public/review_tool/REVIEW_GUIDE.md) - Complete guide for the review workflow
- [Game Management Overview](GAME_MANAGEMENT_SYSTEM.md) - System overview and features
- [Quick Start Guide](QUICK_START.md) - Quick start and link reference

## 🛠️ Third-party Libraries

- [Next.js 15](https://nextjs.org/) - React framework
- [Material UI](https://mui.com/material-ui) - UI component library
- [TypeScript](https://www.typescriptlang.org/) - Type safety