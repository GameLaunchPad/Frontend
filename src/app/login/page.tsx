// 设置为客户端组件，以便使用 useState 等 hooks
"use client";

import React, { useState } from 'react';
// Next.js 中用于页面导航的 hook
// import { useRouter } from 'next/navigation';

// 创建一个独立的 CSS 模块文件来实现样式隔离
import styles from './login.module.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    // const router = useRouter();

    const handleLogin = (e) => {
        e.preventDefault();
        // 在这里可以添加调用后端 API 进行登录验证的逻辑
        console.log('登录信息:', { username, password, rememberMe });
        // 登录成功后跳转到主页
        // router.push('/');
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginLeft}>
                <div className={styles.logoSection}>
                    <div className={styles.logo}>LOGO</div>
                    <h1 className={styles.platformName}>平台名称</h1>
                    <p className={styles.platformDescription}>平台口号/描述</p>
                </div>
                <div className={styles.featuresSection}>
                    <div className={styles.featureItem}>核心功能点1</div>
                    <div className={styles.featureItem}>核心功能点2</div>
                    <div className={styles.featureItem}>核心功能点3</div>
                    <div className={styles.featureItem}>核心功能点4</div>
                </div>
            </div>
            <div className={styles.loginRight}>
                <div className={styles.loginFormWrapper}>
                    <h2>欢迎登录</h2>
                    <p>请输入您的账号信息</p>
                    <form onSubmit={handleLogin}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="username">用户名/邮箱</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="password">密码</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className={styles.optionsGroup}>
                            <div className={styles.rememberMe}>
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor="rememberMe">记住我</label>
                            </div>
                            <a href="#">忘记密码?</a>
                        </div>
                        <button type="submit" className={styles.loginButton}>登录按钮</button>
                    </form>
                    <div className={styles.registerLink}>
                        <span>还没有账号? </span>
                        <a href="#">立即注册</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
