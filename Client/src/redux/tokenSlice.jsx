import { createSlice } from '@reduxjs/toolkit'
const i = {
    token: null,
    user: null
}
const tokenSlice = createSlice({
    name: 'token',
    initialState: i,
    reducers: {
        setToken(state, action) {
            state.token = action.payload
        },
        setUser(state, action) {
            state.user = action.payload

        },
        logOut(state, action) {
            state.token = null;
            state.user = null;
        }
    }
})

export const { setToken, logOut, setUser } = tokenSlice.actions
export default tokenSlice.reducer