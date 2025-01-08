import { userState } from "@/types/user.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import  Cookies  from 'js-cookie';


export const signup = createAsyncThunk('user/signup', async (values: {
    name: string,
    email: string,
    password: string,
    rePassword: string,
    dateOfBirth: string,
    gender: string;
}) => 
    {
        const options = {
            url: "https://linked-posts.routemisr.com/users/signup",
            method: 'POST',
            data: values
        }
        let { data } = await axios.request(options);
        return data;
})
export const login = createAsyncThunk('user/login', async (values: { email: string, password: string }) => {
    const options = {
        url: "https://linked-posts.routemisr.com/users/signin",
        method: 'POST',
        data: values
    }
    let { data } = await axios.request(options);
    return data;
    
})
const initialState: userState = {
    token: Cookies.get("token")
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null; // Clear the token from Redux state
            Cookies.remove("token"); // Remove the token from localStorage
            toast.success("Logged out successfully!"); // Optional: Show a notification
        }
    },
    extraReducers: function (builder) {
        builder.addCase(login.fulfilled, (state, action) => {
            console.log("yes")
            state.token = action.payload.token;
            Cookies.set("token", action.payload.token, {expires: 7});
            toast.success("login successful!!!")
        })
        builder.addCase(login.rejected, (state, action) => {
            console.log("no", action.error); // Ensure it logs
            toast.error("login failed!!!"); // Ensure this is reached
        })
        builder.addCase(signup.fulfilled, (state, action) => {
            console.log("yes")
            toast.success("signup successful!!!")
        })
        builder.addCase(signup.rejected, (state, action) => {
            console.log("no", action.error); // Ensure it logs
            toast.error("signup failed!!!"); // Ensure this is reached
        })
    }
})

export const { logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
