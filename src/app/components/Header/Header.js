"use client";
import React from 'react';
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>LOGO</div>
            <nav className={styles.navLinks}>
                <a href="#" className={styles.active}>首页</a>
            </nav>
            <div className={styles.searchBar}>
                <input type="text" placeholder="搜索游戏、帖子和用户" />
                <button>🔍</button>
            </div>
            <div className={styles.userSection}>
                <button className={styles.downloadButton}>下载应用</button>
                <div className={styles.profile}>
                    <div className={styles.avatar}></div>
                    <span>理想 • 用户</span>
                </div>
            </div>
        </header>
    );
};

export default Header;