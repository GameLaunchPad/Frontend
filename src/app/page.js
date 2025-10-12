"use client";
import React from 'react';
import Header from './components/Header/Header'; // 引入Header组件
import GameCard from './components/GameCard/GameCard'; // 引入GameCard组件
import styles from './home.module.css'; // 主页面的样式

export default function HomePage() {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.mainContent}>

        <section className={styles.mainDisplay}>
          {/* 左侧主要内容 */}
          <div className={styles.featuredGame}>
            <div className={styles.featuredImage}>主要游戏头图</div>
            <div className={styles.featuredInfo}>
              <h2>游戏名称</h2>
              <p>游戏描述和特色介绍</p>
            </div>
          </div>

          {/* 右侧游戏列表 */}
          <aside className={styles.gameList}>
            {/* 模拟4个列表项 */}
            {[...Array(4)].map((_, index) => (
              <div className={styles.listItem} key={index}>
                <div className={styles.listItemImage}>图</div>
                <div className={styles.listItemInfo}>
                  <h4>游戏名称</h4>
                  <div>
                    <span>评分</span>
                    <span>分类</span>
                  </div>
                </div>
              </div>
            ))}
          </aside>
        </section>

        <section className={styles.popularSection}>
          <h2>热门游戏与话题</h2>
          <div className={styles.popularGrid}>
            {/* 使用GameCard组件 */}
            <GameCard title="游戏标题 1" rating="9.2" type="类型A" />
            <GameCard title="游戏标题 2" rating="8.9" type="类型B" />
            <GameCard title="游戏标题 3" rating="9.5" type="类型C" />
            <GameCard title="游戏标题 4" rating="8.5" type="类型D" />
          </div>
        </section>

      </main>
    </div>
  );
}