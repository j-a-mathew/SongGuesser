import React from 'react';
import styles from '../../styles.module.css';
import Typography from '@mui/material/Typography';

export const Home = () => {
    return (
        <div className={styles.backgroundColor}>
            <div>
                <Typography variant="h2" className={styles.mainText}>SongGuesser</Typography>
                <div className={`${styles.recordImage} ${styles.verticalCenter}`}></div>
            </div>
            
        </div>
    )
}
