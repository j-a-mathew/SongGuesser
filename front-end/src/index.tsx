import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { Home, Navbar, Contact, About, SongGuesser, ErrorPage, SignIn, Leaderboard } from './components';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { AuthProvider, FirebaseAppProvider } from 'reactfire';
import { firebaseConfig, app } from './firebaseConfig';
import { Provider } from 'react-redux';
import { store } from './redux/store';

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
    <Provider store={store}>
        <AuthProvider sdk={auth}>
            <RouterProvider router={router} />
        </AuthProvider>
    </Provider>
    </FirebaseAppProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
