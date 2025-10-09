import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { authorizedInterface } from "@/interfaces/user/user";

const initialState: authorizedInterface = {
    email: "",
    token: ""
};

const logInUserSlice = createSlice({
    name: "currentUser",
    initialState,
    reducers: {
        addCredentials: (state, action: PayloadAction<authorizedInterface>) => {
            state = {
                email: action.payload.email,
                token: action.payload.token,
            }
            return state;
        },
        logout: (state) => state = initialState
    }
});

export default logInUserSlice.reducer;
export const { addCredentials, logout } = logInUserSlice.actions;