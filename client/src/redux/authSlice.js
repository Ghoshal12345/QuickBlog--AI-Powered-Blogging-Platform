import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios.js";


// Check whether the current browser session is authenticated
export const checkAuth = createAsyncThunk(
    "auth/checkAuth",

    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/api/user/me");
            return data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Not authenticated"
            );
        }
    }
);


const authSlice = createSlice({

    name: "auth",

    initialState: {
        user: null,
        isAuthenticated: false,
        authLoading: true,
        error: null,
    },

    reducers: {

        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.authLoading = false;
            state.user = action.payload || null;
            state.error = null;
        },

        logoutSuccess: (state) => {
            state.isAuthenticated = false;
            state.authLoading = false;
            state.user = null;
            state.error = null;
        },
    },


    extraReducers: (builder) => {

        builder

            .addCase(checkAuth.pending, (state) => {
                state.authLoading = true;
            })

            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.authLoading = false;

                // /api/user/me directly returns the user object
                state.user = action.payload;

                state.error = null;
            })

            .addCase(checkAuth.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.authLoading = false;
                state.user = null;

                state.error = action.payload;
            });

    },
});


export const {
    loginSuccess,
    logoutSuccess,
} = authSlice.actions;


export default authSlice.reducer;