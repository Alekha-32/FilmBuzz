import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetActorQuery, useGetMoviesByActorIdQuery } from '../../services/TMDB';
import { Movie as MovieIcon, ArrowBack } from '@mui/icons-material';
import { Typography, Button, Grid, Box, CircularProgress, } from '@mui/material';
import useStyles from "./styles";
import { MovieList } from '..';


const Actors = () => {
  const { id } = useParams();
  const page = 1;
  const { data, isFetching, error } = useGetActorQuery(id);
  const { data: moviesByActor } = useGetMoviesByActorIdQuery({ id, page });
  const navigate = useNavigate();
  const classes = useStyles();
  if (isFetching) {
    return (
      <Box display='flex' justifyContent='center'>
        <CircularProgress size="8rem" />
      </Box>
    )
  }
  if (error) {
    return (
      <Box display='flex' justifyContent='center' alignItems={"center"}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate("/")} color="primary">Go Back</Button>
      </Box>
    )
  }
  return (
    <Grid container spacing={3}>
      <Grid item lg={5} xl={4}>
        <img className={classes.poster}
          src={`https://image.tmdb.org/t/p/w500/${data?.profile_path}`}
          alt={data?.name} />
      </Grid>
      <Grid item lg={7} xl={8} style={{ display: 'flex', justifyConten: 'center', flexDirection: 'column' }}>
        <Typography variant='h2' gutterBottom>
          {data?.name}
        </Typography>
        <Typography variant='h5' gutterBottom>
          Born: {new Date(data?.birthday).toDateString()}
        </Typography>
        <Typography variant='body1' align='justify' paragraph>
          {data?.biography || "sorry, Not biography Yet"}
        </Typography>
        <Box marginTop='2rem' display="flex" justifyContent='space-around'>
          <Button variant='contained' color='primary' target="_blank" rel='noopener noreferrer' href={`https://www.imdb.com/name/${data?.imdb_id}`} endIcon={<MovieIcon />} >IMDB</Button>
          <Button startIcon={<ArrowBack />} onClick={() => navigate("/")} color="primary">Back</Button>
        </Box>
      </Grid>
      <Box margin={"2rem 0"}>
        <Typography variant='h2' gutterBottom align='center'>
          Movies
        </Typography>
        {moviesByActor && <MovieList movies={moviesByActor} numberOfMovies={12} />}
      </Box>
    </Grid>
  )
}

export default Actors