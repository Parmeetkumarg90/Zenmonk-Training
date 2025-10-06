import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { logInUserInterface } from "@/interfaces/user";

const initialState: logInUserInterface = {
    email: "",
    username: "",
    password: ""
};

const logInUserSlice = createSlice({
    name: "currentUser",
    initialState,
    reducers: {
        addCredentials: (state, action: PayloadAction<logInUserInterface>) => {
            state.email = action.payload.email;
            state.username = action.payload.username;
            state.password = action.payload.password;
        },
        logout: (state) => state = initialState
    }
});

export default logInUserSlice.reducer;
export const { addCredentials, logout } = logInUserSlice.actions;