import React from 'react';
import styles from './GameCard.module.css';

const GameCard = ({ title, rating, type }: { title: string, rating: string, type: string }) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardImage}>Game Image</div>
            <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{title}</h3>
                <div className={styles.cardInfo}>
                    <span>Rating: {rating}</span>
                    <span>{type}</span>
                </div>
            </div>
        </div>
    );
};

export default GameCard;