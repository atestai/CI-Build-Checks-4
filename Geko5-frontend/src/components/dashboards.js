import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useState,  useEffect } from "react";

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import AccountMenu from "./AccountMenu"
import SettingMenu from "./SettingMenu"
import DownloadMenu from "./DownloadMenu"
import AlarmsMenu from "./AlarmsMenu";
import Menu from './Menu'
import Footer from './Footer';
import { strings } from '../strings'
import config from '../config';


import { Alert, Backdrop,  Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';


import BodyContent from './bodyContent';
import ServerProxy from '../tools/serverProxy';



const drawerWidth = 240;




const DrawerHeader = styled('div')(({ theme }) => ({

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),


    ...theme.mixins.toolbar,


}));


const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        alignContent: 'stretch',
        padding: theme.spacing(2),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),

        marginLeft: 0,

        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            //marginLeft: '0',
            //marginRight: `${drawerWidth}px`,
            marginRight: `0`,
        }),
    }),
);


const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({


    // backgroundImage: "url('./striscia-orizontal.png')",
    // backgroundSize: 'cover',
    // backgroundPosition: 'center',
    // //animation: 'rotate 10s linear infinite',
    backgroundColor: "white",


    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));





export default function MiniDrawer() {

    const [alert, setAlert] = useState({
        hide: 0,
        message: '',
        severity: ''
    })
    const [alarmMessage, setAlarmMessage] = useState("");
    // const [download, setDownload] = useState([]);
    const [filter, setFilter] = useState('');
    const [load, setLoad] = useState(false);
    const [nameDataLogger, setNameDataLogger] = useState('');
    const [menuTablet, setMenuTablet] = useState(false);
    const [open, setOpen] = useState(true);
    const [stateNavigation, setStateNavigation] = useState({
        home: 0,
        realtimeValue: 0,
        historicalValue: 0,
        dataLogger: 0,
        devicesType: 0,
        devices: 0,
        devicesModbus: 0,
        users: 0,
        ads: 0,
        mqtt: 0,
        saf: 0,
        system: 0,
        alarms: 0,
        devicesInterface: 0

    })
    const token = sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')) : '';

    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
    const [wsStatus, setWsStatus] = useState({});
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));
    const [isTokenExpired, setIsTokenExpired] = useState(false);
    const isSmallScreen = useMediaQuery(theme.breakpoints.up('sm'));




    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Functions 


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// UseEffect 

    useEffect(() => {
        const timer = setTimeout(() => {
            setAlert(prev => ({ ...prev, hide: 0, message: '', severity: '' }));
        }, 5000); // 5000 millisecondi = 5 secondi
        return () => clearTimeout(timer);
    }, [alert.hide]);


    useEffect(() => {
        try {
            const wsAdsStatus = new WebSocket(
                `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${config.server.host}${config.server.port ? ':' + config.server.port : ''}/adsStatus?token=${encodeURIComponent(token.token)}`
            );

            const wsAlarms = new WebSocket(
                `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${config.server.host}${config.server.port ? ':' + config.server.port : ''}/alarms?token=${encodeURIComponent(token.token)}`
            );

            // Gestione WebSocket adsStatus
            wsAdsStatus.addEventListener("open", () => {
                wsAdsStatus.send("Connection established to /adsStatus");
            });

            wsAdsStatus.addEventListener("message", (event) => {
                const data = JSON.parse(event.data);
                if (data?.message) {
                    setWsStatus(data.message);
                }
            });

            // Gestione WebSocket alarms
            wsAlarms.addEventListener("open", () => {
                wsAlarms.send("Connection established to /alarms");
            });

            wsAlarms.addEventListener("message", (event) => {
                const data = JSON.parse(event.data);
                setAlarmMessage(data.message);
            });

            // Cleanup: chiudere entrambi i WebSocket alla disconnessione
            return () => {
                wsAdsStatus.close();
                wsAlarms.close();
            };
        } catch (error) {
            console.log("WebSocket error:", error);
        }
    }, [token.token]);


    useEffect(() => {

        const loadDataLogger = async () => {
            try {
                const dataLoggerId = await ServerProxy.getSettingWithGroupAndKey("system", "dataLoggerId");
                setNameDataLogger(dataLoggerId.value.name)


            } catch (connectionError) {
                console.log("Error :", connectionError);

            }
        }
        loadDataLogger();

    }, [])


    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setOpen(false);
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [windowWidth]);




    useEffect(() => {
        if (!token) return;

        const checkTokenExpiration = () => {
            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (token.exp < currentTimestamp) {
                setIsTokenExpired(true);
            }
        };

        checkTokenExpiration();
        const interval = setInterval(checkTokenExpiration, 1000);
        return () => clearInterval(interval);
    }, [token]);






    return (
        <>
            {alert.hide ? (
                <Alert
                    sx={{
                        position: "fixed",
                        top: "1%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 9999,
                        width: "auto",
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                        borderRadius: '16px',
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "flex",
                        alignItems: "center",
                    }}
                    severity={alert.severity}
                    title={alert.message}
                >
                    <span style={{ flexShrink: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {alert.message}
                    </span>
                </Alert>
            ) : null}



            <Box sx={{ height: '100vh', display: 'flex', position: "relative", overflow: 'hidden', zIndex: "2" }}>

                {/* Block for mobile */}
                <Backdrop sx={{ position: 'absolute', top: 0, left: 0, backgroundColor: 'white', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={!isSmallScreen} >
                    <Box sx={{ p: 2 }}>
                        <Typography>
                            We're sorry, but this website is not optimized for smartphones. Please use a tablet, laptop, or desktop for the best experience.
                        </Typography>
                    </Box>

                </Backdrop>


                {/* Load Backdrop */}

                <Backdrop sx={{ position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={load}>
                    <CircularProgress color="primary" />
                </Backdrop>





                <CssBaseline />


                <AppBar sx={{ width: { sm: "100%", lg: (open) ? `calc(100% - 270px)` : `calc(100% - 90px)` }, position: "fixed", zIndex: 3, boxShadow: 0, backgroundColor: (wsStatus.status) ? (theme) => `${theme.palette.editMode.bg}` : '#fff', marginLeft: (open) ? '270px' : '90px' }} open={open} >

                    <Toolbar sx={{  width: "100%" }} >


                        <Stack direction="row" sx={{ width: '100%', display: 'flex', flexDirection: { sm: "column", lg: "row" }, justifyContent: { sm: "flex-start", lg: "space-between" }, alignItems: "center" }} >

                            <Box sx={{ width: { sm: "100%", lg: "auto" }, order: { sm: 2, lg: 1 }}}>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <Typography sx={{ fontSize: '1.8rem', fontWeight: 'bold', }} variant='h6' color={(wsStatus.status) ? (theme) => `${theme.palette.editMode.colorIcon}` : 'black'}>
                                        {nameDataLogger}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{  display: "flex", width: { sm: "100%", lg: "unset" }, justifyContent: { sm: "space-between", lg: "center" }, order: { sm: 1, lg: 2 }, mt: { sm: 1, lg: 0 } }}>

                                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ display: { sm: "block", lg: "none" } }} onClick={() => setMenuTablet((prevValue) => !prevValue)} >
                                    <MenuIcon sx={{ fontSize: "30px", color: (theme) => (wsStatus.status ? theme.palette.editMode.colorIcon : 'black') }} />
                                </IconButton>

                                <Box sx={{ display: "flex" }}>

                                    {wsStatus.status ? (
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <Button
                                                sx={{ height: "32px", backgroundColor: "#97BF0D", textTransform: "none", fontSize: "14px", fontWeight: 400, mr: 1, color: '#0e5b1d'  ,'&:hover': { backgroundColor: "#97BF0D", color: '#333' } }} variant="contained"
                                                onClick={async () => {
                                                    try {
                                                        setLoad(true);
                                                        await ServerProxy.postReconfigure()

                                                    } catch (error) {
                                                        console.log(error);
                                                    } finally {
                                                        setLoad(false);
                                                    }
                                                }} >
                                                {strings.applyTheConfiguration}
                                            </Button>

                                        </Box>
                                    ) : ''}


                                    <AlarmsMenu alarmMessage={alarmMessage} setLoad={setLoad} colorIcon={(wsStatus.status) ? (theme) => `${theme.palette.editMode.colorIcon}` : '#6F6F6F'} wsStatus={wsStatus} alert={alert} setAlert={setAlert} />


                                    {user === null || user?.role === "operator" ? "" : (<SettingMenu colorIcon={(wsStatus.status) ? (theme) => `${theme.palette.editMode.colorIcon}` : '#6F6F6F'} />)}


                                    <AccountMenu alert={alert} setAlert={setAlert} user={user} colorIcon={(wsStatus.status) ? (theme) => `${theme.palette.editMode.colorIcon}` : '#6F6F6F'} />




                                    <DownloadMenu alert={alert} setAlert={setAlert} setLoad={setLoad} colorIcon={(wsStatus.status) ? (theme) => `${theme.palette.editMode.colorIcon}` : '#6F6F6F'} wsStatus={wsStatus} />


                                </Box>
                                
                            </Box>
                        </Stack>


                    </Toolbar>
                </AppBar>


                <Menu stateNavigation={stateNavigation} open={open} setOpen={setOpen} menuTablet={menuTablet} setMenuTablet={setMenuTablet}/>


                <Backdrop
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 3,
                    }}
                    onClick={() => setMenuTablet(false)}

                    open={menuTablet && !isLargeScreen}
                >
                </Backdrop>

                <Main sx={{
                    flex: 1, // Usa tutto lo spazio rimanente
                    height: '100vh',
                    backgroundColor: "#EEEEEE",
                    overflow: 'hidden', // Contiene il contenuto
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 2,
                    position: "relative"


                }}>


                    <DrawerHeader sx={{ background: 'transparent', boxShadow: 'none' }} />
                    <BodyContent user={user} alarmMessage={alarmMessage} setLoadRenderingPage={setLoad} setAlert={setAlert} stateNavigation={stateNavigation} setStateNavigation={setStateNavigation} open={open} filter={filter} setFilter={setFilter} />

                </Main>

                <Footer isTokenExpired={isTokenExpired} open={open} />

            </Box>

        </>



    );
}