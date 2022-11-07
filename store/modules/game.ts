import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chosenYut: {
    blue: null,
    red: null,
  },
  possibleMoves: [],
  chosenMove: null,
  remainedPieces: {
    bluePlayer: 2,
    bluePartner: 2,
    redPlayer: 2,
    redPartner: 2,
  },
  finishedPieces: {
    bluePlayer: 0,
    bluePartner: 0,
    redPlayer: 0,
    redPartner: 0,
  },
  playingPieces: {
    bluePlayer: [],
    bluePartner: [],
    redPlayer: [],
    redPartner: [],
  },
  turn: {
    color: "blue",
    parner: false,
  },
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    updateGame: (state, { payload }) => {
      const { chosenYut, turn, playingPieces, finishedPieces, remainedPieces, possibleMoves } = payload;
      state.chosenYut = chosenYut;
      state.turn = turn;
      state.playingPieces = playingPieces;
      state.finishedPieces = finishedPieces;
      state.remainedPieces = remainedPieces;
      state.possibleMoves = possibleMoves;
    },
    chooseYut: (state, { payload }) => {
      state.chosenYut[payload.color] = payload.yut;
    },
    startNewPiece: (state, { payload }) => {
      state.remainedPieces[payload.role] -= 1;
    },
    returnPiece: (state, { payload }) => {
      state.playingPieces[payload.role].remove(payload.pos);
      state.remainedPieces[payload.role] += 1;
    },
    movePiece: (state, { payload }) => {
      state.playingPieces[payload.role].remove(payload.before);
      state.playingPieces[payload.role].push(payload.after);
    },
    finishPiece: (state, { payload }) => {
      state.playingPieces[payload.role].remove(payload.pos);
      state.finishedPieces[payload.role] += 1;
    },
    chooseMove: (state, { payload }) => {
      state.chosenMove = payload.move;
    },
  },
});

export const { chooseYut, chooseMove } = gameSlice.actions;
export default gameSlice.reducer;
