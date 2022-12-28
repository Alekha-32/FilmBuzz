import { configureStore } from "@reduxjs/toolkit";
import { tmbiApi } from "../services/TMDB";

import genreOrCategoryReducer from '../features/CurrentGenreOrCategory'
import userReducer  from '../features/auth'
export default configureStore({
    reducer: {
        [tmbiApi.reducerPath]: tmbiApi.reducer,
        CurrentGenreOrCategory: genreOrCategoryReducer,
        user:userReducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(tmbiApi.middleware),
})