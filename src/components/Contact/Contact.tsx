import React from 'react';
import styles from '../../styles.module.css';
import Typography from '@mui/material/Typography';

export const Contact = () => {
    return (
        <div className={styles.backgroundColor}>
            <div className={styles.verticalCenter}>
                <Typography variant="h2" color="common.white" sx={{mb: 4}}>Contact</Typography>
                <Typography variant="h6">
                This app was created by Justin Mathew.
                <br/><br/>
                Check out my Github @ <a href="https://github.com/j-a-mathew">Justin's Github</a>
                <br></br>
                <br></br>
                😊 
                </Typography>
            </div>
        </div>
    )
}
