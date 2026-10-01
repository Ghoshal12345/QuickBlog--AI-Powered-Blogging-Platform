import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios.js";


export const fetchBlogs = createAsyncThunk(
    "blogs/fetchBlogs",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/api/blog/all");

            return data.blogs;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch blogs"
            );
        }
    }
);


const blogSlice = createSlice({

    name: "blogs",

    initialState: {
        blogs: [],
        loading: false,
        error: null,
        searchTerm: "",
    },

    reducers: {
        setSearchTerm: (state, action)=>{
            state.searchTerm = action.payload;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = action.payload;
            })

            .addCase(fetchBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setSearchTerm } = blogSlice.actions;
export default blogSlice.reducer;