import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from 'redux-persist/es/storage';
import persistStore from "redux-persist/es/persistStore";
import persistReducer from "redux-persist/lib/persistReducer";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import currentUserReducer from '@/redux/user/currentUser';
import currentUserPostReducer from "@/redux/post/user-post";
import usersReducer from '@/redux/user/users';

const rootReducer = combineReducers({
    currentUser: currentUserReducer,
    posts: currentUserPostReducer,
});

const persistConfig = {
    key: "root",
    storage,
}

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

export { store, persister, rootReducer };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;