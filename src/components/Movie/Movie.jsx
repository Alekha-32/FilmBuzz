import React from 'react';
import { Typography, Grid, Grow, Rating } from '@mui/material';
import { Link } from 'react-router-dom';

import useStyles from './Styles'


const Movie = ({ movie, index }) => {
    const classes = useStyles();
    return (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} className={classes.movie}>
            <Grow in key={index} timeout={{ enter: (index + 1) * 250, }}>
                <Link className={classes.links} to={`/movieInfo/${movie.id}`}>
                    <img
                        alt={movie.title}
                        className={classes.image}
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/original/${movie.poster_path}` : "https://www.fillmurray.com/200/300"} />
                </Link>
            </Grow>
            <Typography className={classes.title} varient="h5"> {movie.title}</Typography>
            <Rating readOnly value={movie.vote_average/2} precision={0.1} className={classes.rating}></Rating>
        </Grid>
    )
}

export default Movie