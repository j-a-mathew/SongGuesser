import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import styles from '../../styles.module.css';
import { useSigninCheck } from 'reactfire';

export const Navbar = () => {

    const { status, data: signInCheckResult } = useSigninCheck();

    const SignInOrOut = () => {
        if (status === 'loading'){
            return <span>Loading...</span>
        }

        if (signInCheckResult?.signedIn){
            return (
            <>
                <li><Link to="/song-guesser">Song Guessing Game</Link></li>
                <li><Link to="/leaderboard">Leaderboard</Link></li>
                <li><Link to="/signin">Sign Out</Link></li>
            </>)
        
        } else {
            return <li><Link to="/signin">Sign In</Link></li>
        }
    }

    return (
        <div>
            <div className={styles.navbar}>
                <div className={styles.links}>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        
                        <SignInOrOut />
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                        <li>
                            <Link to="/contact">Contact</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div><Outlet /></div>
        </div>
    )
}
