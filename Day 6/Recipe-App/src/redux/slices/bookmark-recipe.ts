import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { bookMarkInterface, addBookMarkInterface } from '@/interfaces/recipe';

const initialState: bookMarkInterface[] = [];

const bookmarkRecipe = createSlice({
    name: "bookmark recipes",
    initialState,
    reducers: {
        addBookMark: (state, action: PayloadAction<addBookMarkInterface>) => {
            const { userEmail, recipeId } = action.payload;
            const userBookmark = state.find(bookmark => bookmark.userEmail === userEmail);

            if (userBookmark) {
                userBookmark.recipeIds = userBookmark.recipeIds.filter(id => id !== recipeId);
                userBookmark.recipeIds.push(recipeId);
            } else {
                state.push({
                    userEmail,
                    recipeIds: [recipeId],
                });
            }
        },
        removeBookMark: (state, action: PayloadAction<addBookMarkInterface>) => {
            const { userEmail, recipeId } = action.payload;
            const userBookmark = state.find(bookmark => bookmark.userEmail === userEmail);
            if (userBookmark) {
                userBookmark.recipeIds = userBookmark.recipeIds.filter(id => id !== recipeId);
            }
        }
    },
});

export default bookmarkRecipe.reducer;
export const { addBookMark, removeBookMark } = bookmarkRecipe.actions;