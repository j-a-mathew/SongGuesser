import { createSlice } from "@reduxjs/toolkit";

const rootSlice = createSlice({
    name: "root",
    initialState: {
        firstName: "First Name",
        lastName: "Last Name",
        favSong: "Favorite Song",
        score: "None",
        username: "Username"
    },
    reducers: {
        chooseFirstName: (state, action) => { state.firstName = action.payload },
        chooseLastName: (state, action) => { state.lastName = action.payload },
        chooseFavSong: (state, action) => { state.favSong = action.payload },
        setScore: (state, action) => { state.score = action.payload },
        setUsername: (state, action) => { state.username = action.payload }
    }
})

export const reducer = rootSlice.reducer;
export const { chooseFirstName, chooseLastName, chooseFavSong, setScore, setUsername } = rootSlice.actions;