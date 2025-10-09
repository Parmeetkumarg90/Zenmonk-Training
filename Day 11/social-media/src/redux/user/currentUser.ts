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
            state = {
                email: action.payload.email,
                token: action.payload.token,
                photoURL: action.payload.photoURL,
                displayName: action.payload.displayName,
                phoneNumber: action.payload.phoneNumber,
                uid: action.payload.uid,
            }
            return state;
        },
        logout: (state) => state = initialState
    }
});

export default logInUserSlice.reducer;
export const { addCredentials, logout } = logInUserSlice.actions;