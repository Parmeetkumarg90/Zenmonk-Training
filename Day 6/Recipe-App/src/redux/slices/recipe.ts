import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from "@reduxjs/toolkit";
import { recipeInterface } from '@/interfaces/recipe';

const initialState: recipeInterface[] = [];

const recipeSlice = createSlice({
    name: "recipeList",
    initialState,
    reducers: {
        addRecipes: (state, action: PayloadAction<recipeInterface[]>) => {
            const newList = action.payload || [];
            const duplicateElements = [...state, ...newList];
            state = duplicateElements.filter(
                (currentRecipe, index, self) => index === self.findIndex(eachRecipe => eachRecipe.id === currentRecipe.id)
            ); // remove duplicate recipes if present
            return state;
        }
    },
});

export default recipeSlice.reducer;
export const { addRecipes } = recipeSlice.actions;