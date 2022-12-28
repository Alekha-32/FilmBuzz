import React, { useState, useEffect,useContext } from 'react';
import { AppBar, Button, IconButton, Toolbar, Drawer, Avatar, useMediaQuery } from '@mui/material';
import { Menu, Brightness4, Brightness7, AccountCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useStyles from './styles'
import Sidebar from '../Sidebar/Sidebar';
import Search from '../Search/Search';
import { ColorModeContext } from '../../utils/ToggleColorMode';
import { useDispatch, useSelector } from 'react-redux';
import { fetchToken, createSessionId, moviesApi } from '../../utils';
import { setUser, userSelector } from '../../features/auth';
const NavBar = () => {
    const { isAuthenticated, user } = useSelector(userSelector);
    const [mobileOpen, setMobileOpen] = useState(false);
    const classes = useStyles();
    const isMobile = useMediaQuery('(max-width:600px)');
    const theme = useTheme();
    const dispatch = useDispatch();
    const token = localStorage.getItem('request_token');
    const sessionIdFromLocalStorage = localStorage.getItem('session_id');
    const colorMode =  useContext(ColorModeContext);
    useEffect(() => {
        const loginUser = async () => {
            if (token) {
                if (sessionIdFromLocalStorage) {
                    const { data: userData } = await moviesApi.get(`/account?session_id=${sessionIdFromLocalStorage}`);
                    dispatch(setUser(userData))
                }
                else {
                    const sessionId = await createSessionId();
                    const { data: userData } = await moviesApi.get(`/account?session_id=${sessionId}`);
                    dispatch(setUser(userData))
                }
            }
        };
        loginUser();
    }, [token]);
    return (
        <>
            <AppBar position='fixed'>
                <Toolbar className={classes.toolbar}>
                    {isMobile && (
                        <IconButton color="inherit"
                            edge='start'
                            style={{ outline: 'none' }}
                            onClick={() => setMobileOpen((prevMobileOpen) => !prevMobileOpen)}
                            className={classes.menuButton}
                        >
                            <Menu />
                        </IconButton>
                    )}
                    <IconButton color='inherit' sx={{ ml: 1 }} onClick={colorMode.toggleColorMode}>
                        {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                    {!isMobile && <Search />}
                    <div>
                        {!isAuthenticated ? (
                            <Button color='inherit' onClick={fetchToken}>
                                Login &nbsp; <AccountCircle />
                            </Button>
                        ) : (
                            <Button color='inherit' component={Link} to={`/profile/${user.id}`} className={classes.linkButton} onClick={() => { }}>
                                {!isMobile && <>My Movies &nbsp;</>}
                                <Avatar style={{ height: '30', width: '30' }}
                                    alt="profile"
                                    src="https://www.mtsolar.us/wp-content/uploads/2020/04/avatar-placeholder.png" />
                            </Button>
                        )}
                    </div>
                    {isMobile && <Search />}
                </Toolbar>
            </AppBar>
            <div>
                <nav className={classes.drawer}>
                    {isMobile ? (
                        <Drawer variant="temporary" anchor='right'
                            open={mobileOpen}
                            onClose={() => setMobileOpen((prevMobileOpen) => !prevMobileOpen)}
                            className={classes.drawerBackground}
                            classes={{ paper: classes.drawerPaper }}
                            ModalProps={{ keepMounted: true }}
                        >
                            <Sidebar setMobileOpen={setMobileOpen} />
                        </Drawer>
                    ) : (
                        <Drawer variant='permanent' open={mobileOpen} classes={{ paper: classes.drawerPaper }}>
                            <Sidebar setMobileOpen={setMobileOpen} />
                        </Drawer>
                    )}

                </nav>
            </div>
        </>



    )
}

export default NavBar