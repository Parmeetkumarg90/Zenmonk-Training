import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { logInUserInterface } from "@/interfaces/user/user";

const initialState: logInUserInterface = {
    email: "",
    password: ""
};

const logInUserSlice = createSlice({
    name: "currentUser",
    initialState,
    reducers: {
        addCredentials: (state, action: PayloadAction<logInUserInterface>) => {
            state = {
                email: action.payload.email,
                password: action.payload.password,
            }
            return state;
        },
        logout: (state) => state = initialState
    }
});

export default logInUserSlice.reducer;
export const { addCredentials, logout } = logInUserSlice.actions;