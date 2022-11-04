import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chosenYut: {
        blue: null,
        red: null,
    },
    finishedPieces: {bluePartner: 0, bluePlayer: 0, redPartner: 0, redPlayer: 0},
    playingPieces: {
        bluePartner: [],
        bluePlayer: [],
        redPartner: [],
        redPlayer: [],
    },
    remainedPieces: {
        bluePartner: 2,
        bluePlayer: 2,
        redPartner: 2,
        redPlayer: 2
    },
    turn: {
        isBlue: true,
        isPartner: false,
    }
    
}

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        chooseYut: (state, payload) => {
            state.chosenYut[payload.color] = payload.yut
        },
        finishPiece: (state, payload) => {
            state.finishedPieces[payload.role] += 1
            state.playingPieces[payload.role][]
        },
        playNewPiece: (state, payload) => {
            state.playingPieces[payload.role] -= 1
        },
        returnPiece: 
    }
})