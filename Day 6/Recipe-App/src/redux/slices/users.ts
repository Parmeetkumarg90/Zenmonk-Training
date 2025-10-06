import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { usersInterface } from "@/interfaces/user";

const initialState: usersInterface[] = [];

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        addNewUser: (state, action: PayloadAction<usersInterface>) => {
            const newState = [...state];
            newState.push(action.payload);
            state = newState;
            return state;
        },
    }
});

export default usersSlice.reducer;
export const { addNewUser } = usersSlice.actions;