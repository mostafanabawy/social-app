import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./features/user.slice";
import { postReducer } from "./features/post.slice";


export const store = configureStore({
    reducer: {
        userReducer,
        postReducer
    }
})


export type storeType = typeof store

export type RootState = ReturnType<storeType['getState']>

export type AppDispatch = typeof store.dispatch