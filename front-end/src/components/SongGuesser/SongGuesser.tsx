import React, { useState, useEffect, useRef } from 'react';
import Fab from '@mui/material/Fab';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import { TextField, Button, Alert, Typography, Chip, Snackbar } from '@mui/material'
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from '../../styles.module.css';
import { getSong, stopSnippet, playSnippet, getSongInfo, getPlaylistInfo } from '../../api';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setScore, setUsername } from '../../redux/slices/RootSlice';
import { useUser } from 'reactfire';

type Inputs = {
    guess: string,
};

interface RootState {
    score: number
}

const theme = createTheme({
  palette: {
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
  },
});

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
  }
}

// Update the Button's color prop options
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}

export const SongGuesser = () => {

    const { register, control, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const [trackNum, setTrackNum] = useState(0);

    /* guessStatus controls whether a message appears to user to indicate a correct guess
       guessStatus = 0 indicates no guess yet; 
       guessStatus = 1 indicates correct artist;
       guessStatus = 2 indicates correct song (correct answer);
       guessStatus = 3 indicates wrong answer;
       guessStatus = 4 indicates user pressed Submit before song was retrieved;
       guessStatus = 5 indicates user trying to guess song they already guessed correctly (is in alreadyGuessed array) */
    const [guessStatus, setGuessStatus] = useState(0);

    const [correctGuesses, setCorrectGuesses] = useState(0);
    const [buttonClicks, setButtonClicks] = useState(0);
    const [numNextPrevClicks, setNumNextPrevClicks] = useState(0); // counter for num of times next/prev buttons clicked
    const [alreadyGuessed, setAlreadyGuessed] = useState([""]);
    const [tracklistOpen, setTracklistOpen] = useState(false);    // state for Snackbar indicating end of tracklist
    const [submitScoreOpen, setSubmitScoreOpen] = useState(false); // state for Snackbar indicating submit of score
    const isMounted = useRef(false);
    const navigate = useNavigate();
    const score = useSelector((state: RootState) => state.score)
    const dispatch = useDispatch();
    const { status: userStatus, data: user } = useUser();

        
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data)
        setButtonClicks(buttonClicks + 1);
        let currentSongInfo = getSongInfo();
        
        // If no song has been pulled yet (user hasn't clicked play), send an error Alert
        if (!currentSongInfo){
            setGuessStatus(4);
            setButtonClicks(0);
            return;
        }

        let currentSong = currentSongInfo.name.toLowerCase();
        let currentArtist = currentSongInfo.artists[0].name.toLowerCase();        

        // If user already guessed this song, keep the right answer alert on the screen, and just return
        if (guessStatus === 2){
            return;
        }

        // Check if user is trying to guess the same song again
        if (data.guess.toLowerCase().includes(currentSong) && alreadyGuessed.includes(currentSong)){
            setGuessStatus(5);

        // If not guessing same song again, just check for correct guess
        } else if (data.guess.toLowerCase().includes(currentSong)){
            setAlreadyGuessed([...alreadyGuessed, currentSong])
            setGuessStatus(2);
            setCorrectGuesses(correctGuesses + 1)

        // Give user a hint if they guess the right artist
        } else if (data.guess.toLowerCase().includes(currentArtist)){
            setGuessStatus(1);

        // Set status back to 0
        } else if (buttonClicks > 0 && (guessStatus === 0 || guessStatus === 2) ){
            setGuessStatus(0);

        // If none of the above are met, they have entered an incorrect guess
        } else {
            setGuessStatus(3);
        }
    }

    // Label Component that will display based on the guessStatus
    const LabelGuess = (props: any) => {
        if (props.status === 1){
            return <Alert sx={{mx: "auto", mb: 3, width: 350, px: 5}}
                    variant="filled" 
                    severity="info" >You've got the right artist, now guess the song!</Alert>
        } else if (props.status === 2) {
            return <Alert sx={{mx: "auto", mb: 3, width: 240, pl: 6}}
                    variant="filled" 
                    severity="success">You got the right answer!!</Alert>
        } else if (props.status === 3) {
            return <Alert sx={{mx: "auto", mb: 2, width: 100, px: 5}}
                    variant="filled" 
                    severity="error">Incorrect!</Alert>
        } else if (props.status === 4) {
            return <Alert sx={{mx: "auto", mb: 2, width: 250, px: 4}}
                    variant="filled" 
                    severity="error">Play the song before guessing!</Alert>
        } else if (props.status === 5) { 
            return <Alert sx={{mx: "auto", mb: 2, width: 275, px: 4}}
                    variant="filled" 
                    severity="error">You can't guess the same song again!</Alert>
        } else {
            return <></>
        }
    }

    const startSong = (event: any) => {
        event.stopPropagation();
        setGuessStatus(0); // remove the Alert (if present) when user starts song
        getSong(trackNum);
    }

    const stopSong = (event: any) => {
        event.stopPropagation();
        stopSnippet();
    }

    // This helps to ensure that songs don't auto-play upon first navigating to SongGuesser
    useEffect( () => {
        if (isMounted.current && numNextPrevClicks > 0){
            playSnippet(trackNum)
        } else {
            isMounted.current = true;
        }
    }, [trackNum])

    const nextSong = (event: any) => {
        event.stopPropagation();
        setNumNextPrevClicks(numNextPrevClicks + 1);
        const playlistLength = getPlaylistInfo().tracks.total;
        if (trackNum >= playlistLength-1) {
            console.log("You've reached the end of the songs!");
            setTracklistOpen(true);
        } else {
            setTrackNum(trackNum + 1);
            setGuessStatus(0); // remove the Alert (if present) if user moves to next 
            setButtonClicks(0); // reset the button clicks when you go to next song
        }
    }

    const previousSong = (event: any) => {
        event.stopPropagation();
        setNumNextPrevClicks(numNextPrevClicks + 1);
        if (trackNum <= 0){
            console.log("You've reached the beginning of the songs!");
            setTracklistOpen(true);
        } else {
            setTrackNum(trackNum - 1)
            setGuessStatus(0); // remove the Alert (if present) if user moves to previous song
            setButtonClicks(0); // reset the button clicks when you go to previous song
        }
    }

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
    
        setTracklistOpen(false);
    };

    const handleSubmitScoreClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSubmitScoreOpen(false);

        //redirect to Leaderboard once score is submitted
        navigate("/leaderboard");
    }

    // Submit score to Leaderboard using redux dispatch, along with username of signed-in user
    const scoreSubmit = () => {
        dispatch(setScore(correctGuesses));
        if (userStatus === 'success'){
            dispatch(setUsername(user?.displayName));
        }

        setSubmitScoreOpen(true);
    }

    return (
        <div className={`${styles.backgroundColor}`}>
            <div className={`${styles.verticalCenter} ${styles.borderBox}`}>
            <div className={`${styles.verticalCenter}`}>
                <Typography sx={{mt: 2}} variant="h2" color="common.white" gutterBottom>SongGuesser</Typography>
                <Fab sx={{m: 2}} onClick={previousSong} color="primary" aria-label="previous-song">
                    <SkipPreviousIcon/>
                </Fab>
                <Fab sx={{m: 2}} onClick={startSong} color="success" aria-label="play">
                    <PlayCircleIcon />
                </Fab>
                <Fab sx={{m: 2}} onClick={stopSong} color="error" aria-label="pause">
                    <StopCircleIcon />
                </Fab>
                <Fab sx={{m: 2}} onClick={nextSong} color="primary" aria-label="next-song">
                    <SkipNextIcon/>
                </Fab>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller name="guess" control={control} defaultValue=""
                        render={({ field }) => (
                            <TextField 
                                {...field} 
                                required
                                label="What song is it?" 
                                variant="outlined"
                                color="primary"
                                sx={{my: 2}} 
                                error={!!errors.guess}
                                helperText={errors.guess ? errors.guess.message : ''} 
                            />
                        )}
                    />
                    <br></br>
                    <br></br>
                    <div className={styles.labelGuess}>
                        <LabelGuess status={guessStatus} />
                    </div>
                    <ThemeProvider theme={theme}>
                        <Button type="submit" variant="contained" color="neutral" sx={{my:2}}>Submit Answer</Button>
                    </ThemeProvider>
                    <br></br>
                    <br></br>
                    <Chip icon={<VideogameAssetIcon />} color="primary" label={`Current Score: ${correctGuesses}`}></Chip>
                </form>
                <br></br>
                <form onSubmit={handleSubmit(scoreSubmit)}>
                    <Button type="submit" variant="contained" color="success" sx={{mt:2}}>Submit Current Score</Button>
                </form>
            </div>
            </div>
            <Snackbar message={'Redirecting'} open={submitScoreOpen} autoHideDuration={5000} onClose={handleSubmitScoreClose}>
                <Alert onClose={handleSubmitScoreClose} severity="success">
                    Successful Score Submit - Redirect in 5 Seconds...
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "center"}}
                open={tracklistOpen}
                autoHideDuration={3000}
                onClose={handleClose}
                message={`You've reached 
                            ${trackNum <= 0 ? 'the beginning' : trackNum >= getPlaylistInfo().tracks.total-1 
                                            ? 'the end' : 'song ' + (trackNum+1)} of the track list!`}
            />
        </div>
    )
}
