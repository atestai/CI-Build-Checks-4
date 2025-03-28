import { Alert, Backdrop, Box, Button, Checkbox, CircularProgress, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import BackgroundLogin from '../icons/background_Geko_Datalogger.png';
import Logo from "../icons/logoWisnam.svg";
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import { useNavigate } from "react-router-dom";
import { strings } from "../strings";
import { useState, useEffect } from "react";
import ServerProxy from "../tools/serverProxy";
import useMediaQuery from '@mui/material/useMediaQuery';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTheme } from "@emotion/react";

export default function SignIn() {

    const [alert, setAlert] = useState({ hide: 0, message: '', severity: '' })
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [load, setLoad] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.up('sm'));


    const navigate = useNavigate();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////Functions 

    const handleSubmit = async (event) => {

        const isValid = (
            credentials.username &&
            credentials.password
        );

        if (!isValid) {
            setAlert(prevState => ({
                ...prevState,
                message: strings.requiredFields,
                hide: 1,
                severity: "error"
            }));
            return -1;
        }

        try {
            setLoad(true);
            const token = await ServerProxy.oauth(credentials);
            if (token) {

                navigate(0);
            }
        } catch (error) {






            if (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") {
                setAlert(prevState => ({
                    ...prevState,
                    message: strings.status400,
                    hide: 1,
                    severity: "error"
                }));

            } else {
                setAlert(prevState => ({
                    ...prevState,
                    message: strings.status401,
                    hide: 1,
                    severity: "error"
                }));


            }





        } finally {
            setLoad(false);
        }



    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };



    ////////////////////////////////////////////////////////////////////////////////////////////////////////UseEffect


    useEffect(() => {
        const timer = setTimeout(() => {
            setAlert(prev => ({ ...prev, hide: 0, message: '', severity: '' }));
        }, 20000); // 5000 millisecondi = 5 secondi
        return () => clearTimeout(timer);
    }, [alert.hide]);


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


            <Backdrop
                sx={{ position: 'absolute', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'white', top: 0, left: 0, }}
                open={!isSmallScreen}
            >
                <Box sx={{ p: 2 }}>
                    <Typography>
                        We're sorry, but this website is not optimized for smartphones. Please use a tablet, laptop, or desktop for the best experience.
                    </Typography>
                </Box>

            </Backdrop>

            <Box
                sx={{
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    backgroundImage: `url(${BackgroundLogin})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    backgroundPosition: 'center'
                }}
            >
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ maxWidth: 1440, width: { sm: '100%', lg: '70%' }, height: '498px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>


                        <Card sx={{ width: '50%', position: 'relative', backgroundColor: 'white', borderRadius: '16px' }}>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', px: { sm: '40px', lg: '80px' } }} onKeyDown={handleKeyDown}>

                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                    <img src={Logo} alt='logo' height={"60px"} width={"190px"} />
                                </Box>


                                <Typography sx={{ fontSize: { sm: '25px', lg: '30px' }, lineHeight: '69px', fontWeight: 400, mb: 4 }}>
                                    {strings.login}
                                </Typography>

                                <TextField required id="user" sx={{ mb: 3 }} value={credentials.username} onChange={event => { setCredentials({ ...credentials, username: event.target.value }) }} label="Username" variant="outlined" />

                                <TextField
                                    required
                                    id="password"
                                    value={credentials.password}
                                    onChange={(event) =>
                                        setCredentials({ ...credentials, password: event.target.value })
                                    }
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'} // Mostra/nasconde la password
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleClickShowPassword} edge="end">
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />



                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }} >
                                    <Typography sx={{ fontSize: '11px', fontWeight: '400', color: '#49454F' }}>
                                        <Checkbox sx={{ padding: 0, margin: 0 }} />
                                        Remember Me
                                    </Typography>
                                </Box>

                                <Button sx={{ width: '100%', textTransform: 'none', mt: 4, mb: 4 }} onClick={handleSubmit} variant="contained">{strings.login}</Button>


                            </CardContent>

                            {load && (
                                <Backdrop
                                    sx={{
                                        position: 'absolute',
                                        zIndex: (theme) => theme.zIndex.drawer + 1,
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        top: 0,
                                        left: 0

                                    }}
                                    open={load}
                                >
                                    <CircularProgress color="primary" />
                                </Backdrop>
                            )}
                        </Card>
                    </Box>
                </Box>
            </Box>

        </>
    );
}
