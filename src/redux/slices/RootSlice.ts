import { createSlice } from "@reduxjs/toolkit";

const rootSlice = createSlice({
    name: "root",
    initialState: {
        firstName: "First Name",
        lastName: "Last Name",
        favSong: "Favorite Song",
        score: "Score",
    },
    reducers: {
        chooseFirstName: (state, action) => { state.firstName = action.payload },
        chooseLastName: (state, action) => { state.lastName = action.payload },
        chooseFavSong: (state, action) => { state.favSong = action.payload },
        chooseScore: (state, action) => { state.score = action.payload},
    }
})

export const reducer = rootSlice.reducer;
export const { chooseFirstName, chooseLastName, chooseFavSong, chooseScore } = rootSlice.actions;