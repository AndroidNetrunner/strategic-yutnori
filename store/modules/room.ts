import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  guest: null,
  gameStarted: false,
  ready: false,
  invitationCode: null,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setAdmin: (state, payload) => {
      state.admin = payload.payload;
    },
    setGuest: (state, payload) => {
      state.admin = payload.payload;
    },
    setGameStarted: (state, payload) => {
      state.gameStarted = payload.payload;
    },
    setReady: (state, payload) => (state.ready = payload.payload),
    setInvitationCode: (state, payload) => {
      state.invitationCode = payload;
    },
  },
});

export const { setAdmin, setGuest, setGameStarted, setReady } =
  roomSlice.actions;
export default roomSlice.reducer;
