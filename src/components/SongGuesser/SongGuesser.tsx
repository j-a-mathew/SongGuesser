import React, { useState, useEffect, useRef } from 'react';
import Fab from '@mui/material/Fab';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import { TextField, Button, Alert, Typography, Chip } from '@mui/material'
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from '../../styles.module.css';
import { getSong, stopSnippet, nextSnippet, previousSnippet, getSongInfo } from '../../api';

type Inputs = {
    guess: string,
};

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
    // let trackNum = 0;

    

    const [trackNum, setTrackNum] = useState(0);
    // guessStatus controls whether message appears to user to indicate a correct guess
    // guessStatus = 0 indicates no guess yet, guessStatus = 1 indicates correct artist
    // guessStatus = 2 indicates correct song (correct answer)
    // guessStatus = 3 indicates wrong answer
    // guessStatus = 4 indicates user pressed Submit before song was retrieved
    // guessStatus = 5 indicates user trying to guess song they already guessed correctly (is in alreadyGuessed array)
    const [guessStatus, setGuessStatus] = useState(0);
    const [correctGuesses, setCorrectGuesses] = useState(0);
    const [buttonClicks, setButtonClicks] = useState(0);
    const [previousSongState, setPreviousSongState] = useState("");
    const [alreadyGuessed, setAlreadyGuessed] = useState([""]);
    const isMounted = useRef(false);

    // TODO: need to initialize previousSongInfo with 1st song info, 
    // but getting undefined for the info, so cannot pull name
    // use state???
    // added async, await to getPreviousSongInfo method in server.ts --> check timing on console.log statements...
    // const initializePrevSong = async (prevTrackNum: number) => {
    //     try {
    //         let previousSongInfo = await getPreviousSongInfo(prevTrackNum);
    //         console.log("previous song info:", previousSongInfo);
    //         setPreviousSongState(previousSongInfo.name)
    //     } catch {
    //         console.log("There has been an error!")
    //     }
    // }
    
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data)
        setButtonClicks(buttonClicks + 1);
        console.log("num button clicks: " , buttonClicks)
        let currentSongInfo = getSongInfo();
        
        // console.log(previousSongState, "PREV SONG STATE")
        
        // if no song has been pulled yet (user hasn't clicked play), send an error Alert
        if (!currentSongInfo){
            setGuessStatus(4);
        }

        // if past the 1st song, get the previous song info for proper score tallying
        // otherwise user could click Submit multiple times on same song to rack up score
        // if (trackNum){
        //     console.log("AM I PRINTING?")
        //     initializePrevSong(trackNum - 1)
        // }

        let currentSong = currentSongInfo.name.toLowerCase();
        let currentArtist = currentSongInfo.artists[0].name.toLowerCase();

        console.log("Song: " + currentSong, typeof(currentSong), "Artist: " + currentArtist, typeof(currentArtist))
        console.log("Guessed song: " + data.guess.toLowerCase(), typeof(data.guess.toLowerCase()))
        
        console.log(previousSongState, previousSongState === currentSong)

        if (guessStatus === 2){
            return;
        }

        // set up guessStatus = 5 
        // need to get playlist length to stop user from clicking next or previous too many times

        //previousSongState.toLowerCase() != currentSong.toLowerCase()
        if (data.guess.toLowerCase().includes(currentSong) && !alreadyGuessed.includes(currentSong)){
            console.log("SUCCESS");
            // if (trackNum === 0){
            //     initializePrevSong(trackNum);
            // }
            setAlreadyGuessed([...alreadyGuessed, currentSong])
            console.log("These have been guessed: ", alreadyGuessed)
            setGuessStatus(2);
            setCorrectGuesses(correctGuesses + 1)
        } else if (data.guess.toLowerCase().includes(currentArtist)){
            console.log("PARTIAL SUCCESS (ARTIST)");
            setGuessStatus(1);
        // v fix this logic for going to the next song; if on next song and user makes multiple guesses,
        // incorrect alert should still show up!
        } else if (buttonClicks > 0 && (guessStatus === 0 || guessStatus === 2 || guessStatus === 3) ){
            setGuessStatus(0);
        } else {
            console.log("INCORRECT")
            setGuessStatus(3);
        }
    }

    const LabelGuess = (props: any) => {
        // console.log(props.status)
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
        } else {
            return <p></p>
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

    // useEffect( () => {
    //     nextSnippet(trackNum)
    // }, [])

    // useEffect( () => {
    //     if (isMounted.current){
    //         nextSong(trackNum)
    //     } else {
    //         isMounted.current = true;
    //     }
    // })

    const nextSong = (event: any) => {
        event.stopPropagation();
        console.log("Next song track num: ", trackNum)
        /* figure out logic for useEffect to make sure next song gets updated appropriately */
        setTrackNum(trackNum + 1);
        setGuessStatus(0); // remove the Alert (if present) if user moves to next 
        setButtonClicks(0); // reset the button clicks when you go to next song
        console.log("Next song track num: ", trackNum)
        nextSnippet(trackNum)
    }

    const previousSong = (event: any) => {
        event.stopPropagation();
        console.log("Prev Track #: ", trackNum)
        setTrackNum(trackNum - 1)
        setGuessStatus(0); // remove the Alert (if present) if user moves to previous song
        setButtonClicks(0); // reset the button clicks when you go to previous song
        previousSnippet(trackNum)
    }

    return (
        <div className={styles.backgroundColor}>
            <div className={styles.verticalCenter}>
                <Typography variant="h2" gutterBottom>SongGuesser</Typography>
                <Fab sx={{m: 2}} onClick={previousSong} color="primary" aria-label="previous-song">
                    <SkipPreviousIcon/>
                </Fab>
                <Fab sx={{m: 2}} onClick={startSong} color="success" aria-label="play">
                    <PlayCircleIcon />
                </Fab>
                {/* <Fab sx={{m: 2}} onClick={stopSong} color="primary" aria-label="pause">
                    <PauseCircleIcon />
                </Fab> */}
                <Fab sx={{m: 2}} onClick={stopSong} color="error" aria-label="pause">
                    <StopCircleIcon />
                </Fab>
                <Fab sx={{m: 2}} onClick={nextSong} color="primary" aria-label="next-song">
                    <SkipNextIcon/>
                </Fab>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* <label>Enter your guess: </label> */}
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
                    // {errors.guess && <span>You must enter a guess!</span>}
                    />
                    <br></br>
                    <br></br>
                    <div className={styles.labelGuess}>
                        <LabelGuess status={guessStatus} />
                    </div>
                    <ThemeProvider theme={theme}>
                        <Button type="submit" variant="contained" color="neutral" sx={{my:2}}>Submit</Button>
                    </ThemeProvider>
                    <br></br>
                    <br></br>
                    <Chip icon={<VideogameAssetIcon />} color="primary" label={`Current Score: ${correctGuesses}`}></Chip>
                </form>
            </div>
        </div>
    )
}
