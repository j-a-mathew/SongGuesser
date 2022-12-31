import React from 'react';
import { useRouteError } from 'react-router-dom';
import styles from '../../styles.module.css';

export const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div className={styles.errorPage}>
            <h1>Oops!</h1>
            <br></br>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                {/* <i>{ (error: any) => {error.statusText} || (error: any) => {error.message} }</i> */}
            </p>
        </div>
    )
}
