import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import styles from '../../styles.module.css';

export const Navbar = () => {
    return (
        <div>
            <div className={styles.navbar}>
                <div className={styles.links}>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/song-guesser">Song Guessing Game</Link>
                        </li>
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
