import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from 'redux-persist/es/storage';
import persistStore from "redux-persist/es/persistStore";
import persistReducer from "redux-persist/lib/persistReducer";
import recipeReducer from '@/redux/slices/recipe';
import currentUserReducer from '@/redux/slices/currentUser';
import usersReducer from '@/redux/slices/users';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import bookMarkRecipeReducer from '@/redux/slices/bookmark-recipe';

const rootReducer = combineReducers({
    recipes: recipeReducer,
    currentUser: currentUserReducer,
    users: usersReducer,
    bookmarkRecipe: bookMarkRecipeReducer,
});

const persistConfig = {
    key: "root",
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }),
});

const persister = persistStore(store);

export { persister, store, rootReducer };

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch