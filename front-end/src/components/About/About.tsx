import React from 'react';
import Typography from '@mui/material/Typography';
import styles from '../../styles.module.css';

export const About = () => {
    return (
        <div className={`${styles.backgroundColor}`}>
            <div className={styles.verticalCenter}>
                <Typography variant="h2" color="common.white" sx={{mb:4}}>About</Typography>
                <Typography variant="h6">This song guessing game was created to demonstrate React functionality using 
                    Spotify's API. <br/> <br/>
                    Simply sign in using Google credentials, and you will be directed to the Song Guessing Game. There you
                    will be presented with a music player with a playlist of songs. Click play, and guess the song that is 
                    playing. Get it right, and you will see your score increase!
                    <br/> <br/>
                    Can't think of the song that's playing? Go ahead and skip to the next one! If you happen to remember it 
                    later, you can always come back to it. Also, if you think you know the artist, try typing that in to see 
                    if you're on the right track.
                    <br/> <br/>
                    Once you've guessed all you can, go ahead and submit your score to the leaderboard! There you will be prompted
                    to enter in your name, along with your favorite song from the game's playlist, and your score from the game 
                    will automatically be populated upon submission.
                </Typography>
            </div>
        </div>
    )
}
