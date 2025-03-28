import { Box, Button, Dialog, DialogTitle, DialogContent, FormControl, FormControlLabel, Grid, Input, InputLabel, Skeleton, Switch, TextField, Typography, Select, MenuItem, InputAdornment, IconButton, Stack, Backdrop, CircularProgress, Divider, DialogActions } from "@mui/material";
import React, { useEffect, useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { strings } from "../strings";
import ServerProxy from "../tools/serverProxy";


export default function UserDetail(props) {




    const { detail, onOkAction, onCloseAction } = props;
    const [load, setLoad] = useState(false);
    const [user, setUser] = useState();
    const [showPassword, setShowPassword] = useState(false);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Functions

    const onClose = async function (params) {
        onCloseAction()
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };


    const handleSendData = async () => {


        if (user.id) {
            const isValid = (
                user.email &&
                user.role !== undefined
            );

            if (!isValid) {
                props.setAlert(prevState => ({
                    ...prevState,
                    message: strings.requiredFields,
                    hide: 1,
                    severity: "error"
                }));
                return -1;
            }

        } else {
            const isValid = (
                user.email &&
                user.password &&
                user.role !== undefined
            );

            if (!isValid) {
                props.setAlert(prevState => ({
                    ...prevState,
                    message: strings.requiredFields,
                    hide: 1,
                    severity: "error"
                }));
                return -1;
            }

        }
        props.setLoad(true);




        await onOkAction(user)
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////UseEffect



    useEffect(() => {
        async function loadData() {

            setLoad(true);

            try {

                const data = await ServerProxy.getUser(detail.id);
                setUser(data);

            } catch (error) {

                setUser(undefined);

                if (error?.message) {
                    alert(error.message)
                }
            }
            finally {
                setLoad(false);
            }

        }

        if (detail?.id !== null && detail?.id !== 0) {
            loadData();
        }
        else {
            setUser({
                id: 0,
                email: '',
                name: '',
                username: '',
                password: '',
                role: '',
                enabled: '1'
            })
        }





    }, [detail]);



    return (

        <Dialog
            open={detail.open}
            onClose={(event, reason) => { if (reason && reason === "backdropClick") return; onClose(null) }}
            sx={{ '& .MuiDialog-paper': { p: 2, backgroundColor: "#F8F8F8", position: "relative" }, }}

            fullWidth={true}
            maxWidth={'xs'}

        >
            {load && (
                <Backdrop
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,

                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={load}
                >
                    <CircularProgress color="primary" />
                </Backdrop>
            )}





            <DialogTitle sx={{ fontSize: "32px", fontWeight: "500" }} id="draggable-dialog-title">
                {user ? (user.id ? strings.editUser : strings.new + ' User') : <Skeleton sx={{ width: '250px' }} variant="text" />}
                <Divider sx={{ mt: 1, backgroundColor: "#656565" }} />

            </DialogTitle>

            <DialogContent>
                <Box sx={{ p: 1, height: '100%', overflowY: 'auto' }}>

                    {user ? (

                        <Box component={'form'} sx={{ display: 'flex', flexDirection: 'column' }}>

                            <Grid container >
                                <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'center', padding: 0 }}>
                                    <Typography sx={{ paddingRight: "5px", fontSize: "14px", color: "red", fontWeight: "400" }}>*</Typography>
                                    <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.name} : </InputLabel>
                                </Grid>

                                <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                        <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            required
                                            value={user.name}
                                            onChange={event => { setUser({ ...user, name: event.target.value }) }}
                                            inputProps={{
                                                sx: {
                                                    padding: 0,
                                                    height: "32px",
                                                    pl: 1,
                                                }
                                            }}

                                        />


                                    </FormControl>
                                </Grid>

                            </Grid>

                            <Grid container sx={{ mt: 2 }}>
                                <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'center', padding: 0 }}>
                                    <Typography sx={{ paddingRight: "5px", fontSize: "14px", color: "red", fontWeight: "400" }}>*</Typography>
                                    <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.username} : </InputLabel>
                                </Grid>

                                <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                        <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            required
                                            value={user.username}
                                            onChange={event => { setUser({ ...user, username: event.target.value }) }}
                                            inputProps={{
                                                sx: {
                                                    padding: 0,
                                                    height: "32px",
                                                    pl: 1,
                                                }
                                            }}

                                        />


                                    </FormControl>
                                </Grid>

                            </Grid>






                            <Grid container sx={{ mt: 2 }} >
                                <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'center', padding: 0 }}>
                                    <Typography sx={{ paddingRight: "5px", fontSize: "14px", color: "red", fontWeight: "400" }}>*</Typography>
                                    <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.email} : </InputLabel>
                                </Grid>

                                <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                        <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            required
                                            value={user.email}
                                            onChange={event => { setUser({ ...user, email: event.target.value }) }}
                                            inputProps={{
                                                sx: {
                                                    padding: 0,
                                                    height: "32px",
                                                    pl: 1,
                                                }
                                            }}

                                        />


                                    </FormControl>
                                </Grid>

                            </Grid>

                            {props.user.id !== detail.id && (
                                <>

                                    <Grid container sx={{ mt: 2 }}>
                                        <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'center', padding: 0 }}>
                                            <Typography sx={{ paddingRight: "5px", fontSize: "14px", color: "red", fontWeight: "400" }}>*</Typography>
                                            <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.password} : </InputLabel>
                                        </Grid>

                                        <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                                <Input
                                                    id="password-input"
                                                    type={showPassword ? 'text' : 'password'} // Mostra/nasconde la password
                                                    value={user.password}
                                                    disableUnderline
                                                    onChange={event => { setUser({ ...user, password: event.target.value }) }}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={handleClickShowPassword}
                                                                sx={{ mr: 1 }}
                                                            >
                                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    sx={{
                                                        padding: 0,
                                                        height: "32px",
                                                        pl: 1,
                                                        border: "1px solid rgba(0, 0, 0, 0.23)", // stile del bordo
                                                        borderRadius: "4px", // per un look più simile a <TextField />
                                                    }}
                                                />



                                            </FormControl>
                                        </Grid>

                                    </Grid>

                                    <Grid container sx={{ mt: 2 }}>
                                        <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'center', padding: 0 }}>
                                            <Typography sx={{ paddingRight: "5px", fontSize: "14px", color: "red", fontWeight: "400" }}>*</Typography>
                                            <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.role} : </InputLabel>

                                        </Grid>

                                        <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                                <Select
                                                    id="role-select"
                                                    value={user.role}
                                                    onChange={event => setUser({ ...user, role: event.target.value })}
                                                    variant="outlined" // Utilizza 'outlined' per ottenere lo stile senza linea sotto
                                                    sx={{
                                                        padding: 0,
                                                        height: "32px",
                                                        pl: 1,
                                                        borderRadius: "4px", // Arrotondamento per ottenere un look simile al TextField
                                                        backgroundColor: "#fff", // Per mantenere uno sfondo simile
                                                    }}
                                                >
                                                    <MenuItem value="supervisor">{strings.supervisor}</MenuItem>
                                                    <MenuItem value="admin">{strings.admin}</MenuItem>
                                                    <MenuItem value="operator">{strings.operator}</MenuItem>

                                                </Select>


                                            </FormControl>
                                        </Grid>

                                    </Grid>

                                    <Grid container sx={{ mt: 2 }}>
                                        <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'center', padding: 0 }}>
                                            <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.status} : </InputLabel>
                                        </Grid>

                                        <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                            <FormControl variant="standard">

                                                <FormControlLabel control={<Switch
                                                    checked={user.enabled === '1'}
                                                    onChange={() => { setUser({ ...user, enabled: user.enabled === '1' ? '0' : '1' }) }}
                                                />} label="Enabled" />
                                            </FormControl>



                                        </Grid>

                                    </Grid>

                                </>
                            )}



                        </Box>

                    ) : <Skeleton variant="text" />}

                </Box>
            </DialogContent>

            <DialogActions >

                <Button onClick={() => { onClose() }} sx={{ width: '100%', textTransform: "none", fontSize: "16px", fontFamily: "Inter", fontWeight: "400" }} variant="outlined">
                    {strings.discard}
                </Button>



                <Button onClick={ () => {handleSendData()}} sx={{ width: '100%', textTransform: "none", fontSize: "16px", fontFamily: "Inter", fontWeight: "400" }} variant="contained" color="primary">
                    {user ? (user.id ? strings.applyChange : strings.create) : ''}
                </Button>
            </DialogActions>
        </Dialog>
    )
}