import React, { useState } from 'react';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useSigninCheck } from 'reactfire';
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { app } from '../../firebaseConfig';
import { Container, Button, Typography, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import styles from '../../styles.module.css';

export const SignIn = () => {

    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    const { status, data: signInCheckResult } = useSigninCheck();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    

    const handleSnackOpen = () => {
        setOpen(true)
    };

    const handleSnackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway'){
            return;
        }

        setOpen(false);

        //redirect to SongGuesser once signed in
        navigate("/song-guesser");
    }

    const sign_in = async () => {
        const response = await signInWithPopup(auth, provider);
        if (response.user){
            handleSnackOpen();
        }
    }

    const sign_out = async () => {
        await signOut(auth);
        console.log("Signed out")
    }

    const AuthButtons = (props: any) => {
        if (status === 'loading'){
            return <span>Loading...</span>
        }
        if (signInCheckResult.signedIn === false){
            return <Button variant="contained" color="secondary" className={styles.googleButton} 
                    onClick={sign_in}>Sign In with Google</Button>
        } else {
            return <Button variant="contained" color="error" className={styles.googleButton} 
                    onClick={sign_out}>Sign Out</Button>
        }
    }
    

    return (
        <div className={styles.backgroundColor}>
            <Container className={styles.verticalCenter} maxWidth='md'>
                <Typography sx={{mb: 4}} variant="h2" color="common.white">Sign In/Out Using Google</Typography>
                <AuthButtons></AuthButtons>
            </Container>
            <Snackbar message={'Success'} open={open} autoHideDuration={6000} onClose={handleSnackClose}>
                <Alert onClose={handleSnackClose} severity="success">
                    Successful Sign In - Redirect in 6 Seconds...
                </Alert>
            </Snackbar>
        </div>
    )
}
