import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    admin: null,
    guest: null,
    gameStarted: false,
    ready: false,
    invitationCode: null,
};

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setAdmin: (state, payload) => {state.admin = payload},
        setGuest: (state, payload) => {state.admin = payload},
        setGameStarted: (state, payload) => {state.gameStarted = payload},
        setReady: (state, payload) => (state.ready = payload),
        setInvitationCode: (state, payload) => {state.invitationCode = payload}
    }
})

export const { setAdmin, setGuest, setGameStarted, setReady } = roomState.reducers;
export default roomSlice.reducer;