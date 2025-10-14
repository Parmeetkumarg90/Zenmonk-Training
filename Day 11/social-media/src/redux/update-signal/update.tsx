import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    isPostCreated: false,
    isCommentCreated: false,
    isFollowerOrFollowingChanged: false,
};

const updateReducer = createSlice({
    name: "update-signal",
    initialState,
    reducers: {
        updatePostSignal: (state, action: PayloadAction<boolean>) => {
            state.isPostCreated = action.payload;
        },
        updateCommentSignal: (state, action: PayloadAction<boolean>) => {
            state.isCommentCreated = action.payload;
        },
        updateFollowerOrFollowingSignal: (state, action: PayloadAction<boolean>) => {
            state.isFollowerOrFollowingChanged = action.payload;
        }
    }
});

export default updateReducer.reducer;
export const { updatePostSignal, updateCommentSignal, updateFollowerOrFollowingSignal } = updateReducer.actions;