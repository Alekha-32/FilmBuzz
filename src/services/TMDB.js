import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const tmdbApiKey = process.env.REACT_APP_TMDB_KEY;

// /movie/popular?api_key=<<api_key>>&language=en-US&page=1
export const tmbiApi = createApi({
    reducerPath: 'tmbiApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.themoviedb.org/3' }),
    endpoints: (builder) => ({
        //* get movie genre
        getGenres: builder.query({
            query: () => `genre/movie/list?api_key=${tmdbApiKey}`,
        }),
        //*get movie by [type]
        getMovies: builder.query({
            query: (genreIdOrCategoryName, page, searchQuery) => {
                // get movie by search 
                //search/movie?api_key=<<api_key>>&page=1&include_adult=false
                if (searchQuery) {
                    return `/search/movie?query=${searchQuery}&page=${page}&api_key=${tmdbApiKey}`;
                }
                // get Movies by categories
                if (genreIdOrCategoryName && typeof genreIdOrCategoryName === 'string') {
                    return `movie/${genreIdOrCategoryName}?page=${page}&api_key=${tmdbApiKey}`;
                }
                //get movies by Genre
                if (genreIdOrCategoryName && typeof genreIdOrCategoryName === 'number') {
                    return `discover/movie?with_genres=${genreIdOrCategoryName}&page=${page}&api_key=${tmdbApiKey}`;
                }
                //get popular movies
                return `movie/popular?page=${page}&api_key=${tmdbApiKey}`;
            },
        }),
        //* get movie 
        getMovie: builder.query({
            query: (id) => `/movie/${id}?append_to_response=videos,credits&api_key=${tmdbApiKey}`
        }),

        getList: builder.query({
            query: ({ listname, accountId, sessionId, page }) => `/account/${accountId}/${listname}?api_key=${tmdbApiKey}&session_id=${sessionId}&page=${page}`
        }),

        //* get user specific lists
        getRecommendations: builder.query({
            query: ({ movie_id, list }) => `/movie/${movie_id}/${list}?api_key=${tmdbApiKey}`
        }),
        //*get actor specific page
        getActor: builder.query({
            query: (person_id) => `/person/${person_id}?api_key=${tmdbApiKey}`
        }),
        getMoviesByActorId: builder.query({
            query: ({ id, page }) => `/discover/movie/?with_cast=${id}&page=${page}&api_key=${tmdbApiKey}`
        }),
    }),
});

export const {
    useGetGenresQuery,
    useGetMoviesQuery,
    useGetMovieQuery,
    useGetRecommendationsQuery,
    useGetActorQuery,
    useGetMoviesByActorIdQuery,
    useGetListQuery
} = tmbiApi;