import React, { useState } from 'react';
import { Box, CircularProgress, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { useGetMoviesQuery } from '../../services/TMDB';
import { MovieList } from '../index';
import FeaturedMovie from '../FeaturedMovie/FeaturedMovie';

const Movies = () => {
  const { page } = useState(1);
  const { genreIdOrCategoryName, searchQuery } = useSelector((state) => state.CurrentGenreOrCategory);
  const { data, error, isFetching } = useGetMoviesQuery(genreIdOrCategoryName, page, searchQuery);
  const lg = useMediaQuery((theme) => theme.breakpoints.only('lg'));
  const numberOfMovies = lg ? 17 : 19;
  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress size="4rem" />
      </Box>
    );
  }
  if (error) {
    return (
      'An error has occured.'
    )
  }
  return (
    <div>
      <FeaturedMovie movie={data.results[0]} />
      <MovieList movies={data} numberOfMovies={numberOfMovies} excludeFirst />
    </div>
  )
}

export default Movies