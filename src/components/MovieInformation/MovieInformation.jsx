import React, { useState, useEffect } from 'react';
import { Modal, Typography, Button, ButtonGroup, Grid, Box, CircularProgress, Rating } from '@mui/material';
import { Movie as MovieIcon, Theaters, Language, PlusOne, Favorite, FavoriteBorderOutlined, Remove, ArrowBack } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import useStyles from './styles';
import { useGetListQuery, useGetMovieQuery, useGetRecommendationsQuery } from '../../services/TMDB';
import { selectGenreOrCategory } from '../../features/CurrentGenreOrCategory';
import MovieList from '../MovieList/MovieList';
import { userSelector } from '../../features/auth';

const MovieInformation = () => {
  const { user } = useSelector(userSelector);
  const { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchListed, setIsMovieWatchListed] = useState(false);


  const { data, isFetching, error } = useGetMovieQuery(id);
  const { data: recommdentaions, } = useGetRecommendationsQuery({ movie_id: id, list: 'recommendations' });
  const { data: favoriteMovies } = useGetListQuery({ listname: 'favorite/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 });
  const { data: watchlistMovies } = useGetListQuery({ listname: 'watchlist/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 })


  const addToFavorites = async () => {
    await axios.post(`https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${process.env.REACT_APP_TMDB_KEY}&session_id=${localStorage.getItem('session_id')}`, {
      media_type: 'movie',
      media_id: id,
      favorite: !isMovieFavorited,
    });
    setIsMovieFavorited((prev) => !prev);
  }
  const addToWatchList = async () => {
    await axios.post(`https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${process.env.REACT_APP_TMDB_KEY}&session_id=${localStorage.getItem('session_id')}`, {
      media_type: 'movie',
      media_id: id,
      watchlist: !isMovieWatchListed,
    });
    setIsMovieWatchListed((prev) => !prev);

  }
  useEffect(() => {
    setIsMovieFavorited(!!favoriteMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [favoriteMovies, data])

  useEffect(() => {
    setIsMovieWatchListed(!!watchlistMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [watchlistMovies, data])

  if (isFetching) {
    return (
      <Box display='flex' justifyContent='center'>
        <CircularProgress size="8rem" />
      </Box>
    )
  }
  if (error) {
    return (
      <Box display='flex' justifyContent='center'>
        <Link to="/">Something as gone wrong, Go back </Link>
      </Box>
    )
  }
  return (
    <Grid container className={classes.containerSpaceAround}>
      <Grid item sm={12} lg={4}>
        <img className={classes.poster}
          src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
          alt={data?.title} />
      </Grid>
      <Grid item container direction='column' lg={7}>
        <Typography varient="h3" align='center' gutterBottom>
          {data?.title} ({data.release_date.split('-')[0]})
        </Typography>
        <Typography varient="h5" align='center' gutterBottom>
          {data?.tagline}
        </Typography>
        <Grid item container className={classes.containerSpaceAround}>
          <Box display='flex' align='center'>
            <Rating readOnly value={data?.vote_average / 2} />
            <Typography varient="subtitle1" gutterBottom style={{ marginLeft: '10px' }} >
              {data?.vote_average} / 10
            </Typography>
          </Box>
          <Typography varient="h6" align='center' gutterBottom>
            {data?.runtime}min {data?.spoken_languages.length > 0 ? ` / ${data?.spoken_languages[0].name}` : ''}
          </Typography>
        </Grid>
        <Grid item className={classes.genresContainer}>
          {data?.genres?.map((genre, i) => (
            <Link key={genre.name} className={classes.links} to="/" onClick={() => dispatch(selectGenreOrCategory(genre.id))}>
              <Typography color='textPrimary' varient="subtitle1">
                {genre?.name}
              </Typography>
            </Link>
          ))}
        </Grid>
        <Typography varient="h5" gutterBottom style={{ marginTop: '10px' }} >
          Overview
        </Typography>
        <Typography style={{ marginBottom: '2rem' }}>
          {data?.overview}
        </Typography>
        <Typography variant='h5' gutterBottom>
          Top Cast
        </Typography>
        <Grid item container spacing={2}>
          {data && data.credits.cast?.map((character, i) => (
            character.profile_path && (<Grid key={i} item xs={4} md={2} component={Link} to={`/actors/${character.id}`} style={{ textDecoration: 'none' }}>
              <img className={classes.castImage} src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`} alt={character.name} />
              <Typography color='textPrimary'>
                {character?.name}
              </Typography>
              <Typography color="textSecondary">{character.character.split('/')[0]}</Typography>
            </Grid>
            )
          )).slice(0, 6)}
        </Grid>
        <Grid item container style={{ marginTop: '2rem' }}>
          <div className={classes.buttonContainer}>
            <Grid item xs={12} sm={6} className={classes.buttonContainer} >
              <ButtonGroup size='small' variant='outlined'>
                <Button target="_blank" rel='noopener noreferrer' href={data?.homepage} endIcon={<Language />} >website</Button> <br />
                <Button target="_blank" rel='noopener noreferrer' href={`https://www.imdb.com/title/${data?.imdb_id}`} endIcon={<MovieIcon />} >IMDB</Button>
                <Button onClick={() => setOpen(true)} href="#" endIcon={<Theaters />}>Trailer</Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.buttonContainer} >
              <ButtonGroup size='medium' variant='outlined'>
                <Button onClick={addToFavorites} endIcon={isMovieFavorited ? <FavoriteBorderOutlined /> : <Favorite />}>{isMovieFavorited ? 'unFavorited' : 'Favorite'}</Button>
                <Button onClick={addToWatchList} endIcon={isMovieWatchListed ? <Remove /> : <PlusOne />}>Watchlist</Button>
                <Button endIcon={<ArrowBack />} sx={{ borderColor: 'primary.main' }}>
                  <Typography component={Link} to="/" color="inherit" varient="subtitle2" style={{ textDecoration: 'none' }}> Back
                  </Typography>
                </Button>
              </ButtonGroup>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Box marginTop={"5rem"} width="100%">
        <Typography variant='h3' gutterBottom align='center'>
          you might also like
        </Typography>
        {recommdentaions ? <MovieList movies={recommdentaions} numberOfMovies={12} /> : <Box>
          Sorry, nothing was found
        </Box>}
      </Box>
      <Modal closeAfterTransition className={classes.modal} open={open}
        onClose={() => setOpen(false)}>
        {data?.videos?.results?.length > 0 && (
          <iframe autoPlay className={classes.videos}
            frameBorder="0" title='Trailer'
            src={`https://www.youtube.com/embed/${data.videos.results[0].key}`}
            allow="autoplay"
          />
        )}
      </Modal>
    </Grid>
  )
}

export default MovieInformation