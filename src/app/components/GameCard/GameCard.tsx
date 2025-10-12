import React from 'react';
import styles from './GameCard.module.css';

const GameCard = ({ title, rating, type }) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardImage}>游戏头图</div>
            <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{title}</h3>
                <div className={styles.cardInfo}>
                    <span>评分: {rating}</span>
                    <span>{type}</span>
                </div>
            </div>
        </div>
    );
};

export default GameCard;