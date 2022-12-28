import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment } from '@mui/material';
//import { Search as SearchIcon } from '@mui/icons-material';
import { ManageSearch } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import useStyles from './styles';
import { searchMovie } from '../../features/CurrentGenreOrCategory';
const Search = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [query, SetQuery] = useState('')
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            dispatch(searchMovie(query));
        }
    }
    return (
        <div className={classes.SearchContainer}>
            <TextField onKeyPress={handleKeyPress} value={query} onChange={(e) => SetQuery(e.target.value)} variant='standard'
                inputProps={{
                    className: classes.input,
                    startadronment: (
                        <InputAdornment position='start'>
                          <ManageSearch />
                        </InputAdornment>
                    ),
                }} />
        </div>
    )
}

export default Search