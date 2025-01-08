import { postsState } from "@/types/posts.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Post } from "@/types/posts.types";
import { RootState } from "../store";

export const getPosts = createAsyncThunk("posts/getPosts", async (page: number, { getState }) => {
    const state = getState() as RootState;
    const token = state.userReducer.token
    const options = {
        url: `https://linked-posts.routemisr.com/posts?limit=10&page=${page}`,
        method: 'GET',
        headers: {
            token
        }
    }
    const { data } = await axios.request(options);
    if (data.paginationInfo.currentPage > data.numberOfPages) {
        return;
    }
    return data;
})
export const getPostDetail = createAsyncThunk("posts/getPostDetail", async (postId: string, { getState }) => {
    const state = getState() as RootState;
    const token = state.userReducer.token
    const options = {
        url: `https://linked-posts.routemisr.com/posts/${postId}`,
        method: 'GET',
        headers: {
            token
        }
    }
    const { data } = await axios.request(options);
    return data.post;
})

const initialState: postsState = {
    posts: null,
    postDetail: null,
    paginationInfo: null
}
const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
    },
    extraReducers: function (builder) {
        builder.addCase(getPosts.fulfilled, (state, action) => {
            if (state.posts) {
                state.posts = [
                    ...state.posts.filter(
                        existingPost => !action.payload.posts.some((newPost:Post) => newPost._id === existingPost._id)
                    ),
                    ...action.payload.posts
                ];
            } else {
                state.posts = action.payload.posts;
            }
            state.paginationInfo = action.payload.paginationInfo;
        })
        builder.addCase(getPosts.rejected, () => {
            console.log("no");
        })
        builder.addCase(getPostDetail.fulfilled, (state, action) => {
            console.log(action.payload);
            state.postDetail = action.payload
        })
        builder.addCase(getPostDetail.rejected, () => {
            console.log("no");
        })
    }
})

export const postReducer = postSlice.reducer