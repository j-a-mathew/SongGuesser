// installed:
// react-hook-form
// react-router-dom
// @mui/material
// @mui/icons-material
// firebase
// reactfire
// @reduxjs/toolkit
// react-redux
// pg
// pg-hstore
// sequelize
// express
// cors
// url -> for polyfill webpack error
// util -> for polyfill webpack error
// assert -> for polyfill webpack error


import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { Home, Navbar, Contact, About, SongGuesser, ErrorPage, SignIn, Leaderboard } from './components';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { AuthProvider, FirebaseAppProvider } from 'reactfire';
import { firebaseConfig, app } from './firebaseConfig';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navbar />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/contact",
                element: <Contact />,
            },
            {
                path: "/about",
                element: <About />,
            },
            {
                path: "/song-guesser",
                element: <SongGuesser />
            },
            {
                path: "/signin",
                element: <SignIn />
            },
            {
                path: "/leaderboard",
                element: <Leaderboard />
            }
        ]
    }
])

const auth = getAuth(app);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <AuthProvider sdk={auth}>
            <RouterProvider router={router} />
        </AuthProvider>
    </FirebaseAppProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
