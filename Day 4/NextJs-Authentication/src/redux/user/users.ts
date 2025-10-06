import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { usersInterface } from "@/interfaces/user";
import { enqueueSnackbar } from "notistack";

const initialState: usersInterface[] = []

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        addNewUser: (state, action: PayloadAction<usersInterface>) => {
            state.push(action.payload);
        },
    }
});

export default usersSlice.reducer;
export const { addNewUser } = usersSlice.actions;