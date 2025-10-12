import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { authorizedInterface } from "@/interfaces/user/user";

const initialState: authorizedInterface = {
    email: "",
    token: "",
    photoURL: "",
    displayName: "",
    phoneNumber: "",
    uid: "",
};

const logInUserSlice = createSlice({
    name: "currentUser",
    initialState,
    reducers: {
        addCredentials: (state, action: PayloadAction<authorizedInterface>) => {
            return { ...state, ...action.payload };
        },
        addPostsCount: (state, action: PayloadAction<{ totalPosts: number }>) => {
            state = { ...state, totalPosts: action.payload.totalPosts };
            return state;
        },
        logout: (state) => state = initialState
    }
});

export default logInUserSlice.reducer;
export const { addCredentials, logout, addPostsCount } = logInUserSlice.actions;