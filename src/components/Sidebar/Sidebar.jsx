import React from 'react';
import { Divider, List, ListItem, ListItemText, ListSubheader, Box, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/styles';
import useStyles from './styles'
import FilmBuzz from "../Assests/filmbuzz.png"
import { useGetGenresQuery } from '../../services/TMDB';
import { useDispatch, useSelector } from 'react-redux';
import { selectGenreOrCategory } from '../../features/CurrentGenreOrCategory';

const categories = [
    { label: 'popular', value: 'popular' },
    { label: 'Top Rated', value: 'top_rated' },
    { label: 'Upcoming', value: 'upcoming' }
]

const Sidebar = (setMobileOpen) => {
    const { genreIdOrCategoryName } = useSelector((state) => state.CurrentGenreOrCategory);
    const theme = useTheme();
    const classes = useStyles();
    const { data, isFetching } = useGetGenresQuery();
    const dispatch = useDispatch();

    return (
        <>
            <Link to="/" className={classes.imageLink}>
                <img className={classes.image}
                    src={theme.palette.mode === 'light' ? FilmBuzz : FilmBuzz}
                    alt="logo"
                />
            </Link>
            <Divider />
            <List>
                <ListSubheader >Categories</ListSubheader>
                {categories.map(({ label, value }) => (
                    <Link key={value} className={classes.links} to="/">
                        <ListItem onClick={() => dispatch(selectGenreOrCategory(value))} button>
                            {/* <ListItemIcon>
                                <img src={NetflixLogo} alt="logo" className={classes.genreImages} height={30} />
                            </ListItemIcon> */}
                            <ListItemText primary={label} />
                        </ListItem>
                    </Link>
                ))}
            </List>
            <Divider />
            <List>
                <ListSubheader >geners</ListSubheader>
                {isFetching ? (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                ) : data.genres.map(({ name, id }) => (
                    <Link key={id} className={classes.links} to="/">
                        <ListItem onClick={() => dispatch(selectGenreOrCategory(id))} button>
                            {/* <ListItemIcon>
                                <img src={NetflixLogo} alt="logo" className={classes.genreImages} height={30} />
                            </ListItemIcon> */}
                            <ListItemText primary={name} />
                        </ListItem>
                    </Link>
                ))}
            </List>
        </>
    )
}

export default Sidebar