import { Box, Button, Dialog, DialogTitle, DialogContent, FormControl, Grid, InputLabel, Skeleton, TextField, Typography, Divider, Stack, Backdrop, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { strings } from "../strings";
import ServerProxy from "../tools/serverProxy";
import { Link as LinkRouter } from 'react-router-dom';


export default function DevicesTypeDetail(props) {

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Variables 
    const { detail, onOkAction, onCloseAction, load, setLoad } = props;
    const [deviceType, setDeviceType] = useState();
    const disabledTextFieldStyle = {
        '& .Mui-disabled': {
            WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)'
        },
        '& input.Mui-disabled': {
            color: 'rgba(0, 0, 0, 0.87)'
        },
        '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)'
        }
    };
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Functions 


    const onClose = async function (params) {
        props.setAlert(prevState => ({
            ...prevState,
            message: '',
            hide: 0,
            severity: ""
        }));
        onCloseAction()
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// UseEffect


    useEffect(() => {

        async function loadData() {
            setLoad(true)

            try {


                const data = await ServerProxy.getDeviceType(detail.id);
                setDeviceType(data);

            } catch (error) {

                setDeviceType(undefined);
                props.setAlert(prevState => ({
                    ...prevState,
                    message: error?.response?.data?.message || 'An unknown error occurred',
                    hide: 1,
                    severity: "error"
                }));


            } finally {
                setLoad(false);
            }


        }

        if (detail?.id !== null && detail?.id !== 0) {
            loadData();
        }
        else {
            setDeviceType({
                id: 0,
                model: '',
                manufacturer: '',
                firmwareRev: '',
                description: ''
            })
        }

    }, [detail]);


    return (

        <Dialog
            open={detail.open}
            onClose={(event, reason) => { if (reason && reason === "backdropClick") return; onClose(null) }}

            maxWidth={'xs'}
            fullWidth={true}
            sx={{ '& .MuiDialog-paper': { p: 2, backgroundColor: "#F8F8F8" }, }}

        >


            <Backdrop sx={{ position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: (theme) => theme.zIndex.drawer + 1, top: 0, left: 0 }} open={load}>
                <CircularProgress color="primary" />
            </Backdrop>



            <DialogTitle sx={{ fontSize: "32px", fontWeight: "500" }} id="draggable-dialog-title">
                {detail.show ? strings.infoDeviceModel : deviceType ? (deviceType.id ? strings.editDeviceType : strings.new + ' ' + strings.devicemodel) : <Skeleton sx={{ width: '250px' }} variant="text" />}
                <Divider sx={{ width: "100%", backgroundColor: "#656565", mt: 1 }} />
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Box sx={{ height: '100%', overflowY: 'auto' }}>

                    {deviceType ? (

                        <Box component={'form'} sx={{ display: 'flex', flexDirection: 'column' }}>



                            <Grid container>
                                <Grid item xs={4} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                    <Typography sx={{ fontSize: "14px", color: "red", fontWeight: "400", paddingRight: "5px" }}>*</Typography>
                                    <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="txtName">{strings.model}</InputLabel>

                                </Grid>
                                <Grid item xs={8} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                        <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            required
                                            disabled={detail.show && true}
                                            sx={disabledTextFieldStyle}
                                            value={deviceType.model || ''}
                                            onChange={event => { setDeviceType({ ...deviceType, model: event.target.value }) }}
                                            inputProps={{ sx: { height: "32px", padding: 0, pl: 1 } }}

                                        />


                                    </FormControl>
                                </Grid>

                            </Grid>

                            <Grid container sx={{ mt: 2 }}>
                                <Grid item xs={4} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                    <Typography sx={{ fontSize: "14px", color: "red", fontWeight: "400", paddingRight: "5px" }}>*</Typography>
                                    <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="txtName">{strings.manufacturer}</InputLabel>

                                </Grid>
                                <Grid item xs={8} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                        <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            value={deviceType.manufacturer || ''}
                                            required
                                            disabled={detail.show && true}
                                            sx={disabledTextFieldStyle}
                                            onChange={event => { setDeviceType({ ...deviceType, manufacturer: event.target.value }) }}

                                            inputProps={{ sx: { height: "32px", padding: 0, pl: 1 } }}

                                        />


                                    </FormControl>
                                </Grid>

                            </Grid>


                            <Grid container sx={{ mt: 2 }}>
                                <Grid item xs={4} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                    <Typography sx={{ paddingRight: "5px", fontSize: "14px", color: "red", fontWeight: "400" }}>*</Typography>
                                    <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.firmwareRev}</InputLabel>

                                </Grid>
                                <Grid item xs={8} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                        <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            value={deviceType.firmwareRev || ''}
                                            required
                                            disabled={detail.show && true}
                                            sx={disabledTextFieldStyle}
                                            onChange={event => { setDeviceType({ ...deviceType, firmwareRev: event.target.value }) }}

                                            inputProps={{
                                                sx: {
                                                    padding: 0,
                                                    height: "32px",
                                                    pl: 1
                                                }
                                            }}

                                        />


                                    </FormControl>
                                </Grid>

                            </Grid>


                            <Grid container sx={{ mt: 2 }}>
                                <Grid item xs={4} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                    <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="txtName">{strings.description}</InputLabel>

                                </Grid>
                                <Grid item xs={8} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                        <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            value={deviceType.description || ''}
                                            multiline
                                            rows={2}
                                            disabled={detail.show && true}
                                            sx={disabledTextFieldStyle}
                                            onChange={event => { setDeviceType({ ...deviceType, description: event.target.value }) }}

                                            inputProps={{ sx: { height: "32px", padding: 0, pl: 1 } }}

                                        />


                                    </FormControl>
                                </Grid>

                            </Grid>

                            {detail.show && (
                                <Grid container sx={{ mt: 2 }}>
                                    <Grid item xs={4} sx={{ display: "flex", justifyContent: "end", alignItems: 'center', padding: 0 }}>
                                        <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="txtName">{strings.Signal} : </InputLabel>

                                    </Grid>
                                    <Grid item xs={8} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1, height: 'auto' }}>
                                        <Typography color="primary" sx={{ cursor: 'pointer', textTransform: "none", textDecoration: 'none' }} component={LinkRouter} to={`/devicesType/${deviceType.id}/structures`}>
                                            Go to the signals

                                        </Typography>

                                    </Grid>


                                </Grid>

                            )}

                            <Stack spacing={3} direction={'row'} sx={{ marginTop: "100px" }} >
                                <Button sx={{ width: '100%', textTransform: "none", fontSize: "16px", fontFamily: "Inter", fontWeight: "400" }} variant="outlined" onClick={onClose}>{strings.discard}</Button>

                                {!detail?.show && (
                                    <Button onClick={async () => {

                                        const isValid = (deviceType.model && deviceType.manufacturer && deviceType.firmwareRev);

                                        if (!isValid) {
                                            props.setAlert(prevState => ({
                                                ...prevState,
                                                message: strings.requiredFields,
                                                hide: 1,
                                                severity: "error"
                                            }));
                                            return -1;
                                        }
                                        props.setLoad(true);

                                        await onOkAction(deviceType)
                                    }} sx={{ width: '100%', textTransform: "none", fontSize: "16px", fontFamily: "Inter", fontWeight: "400" }} variant="contained" color="primary">
                                        {deviceType ? (deviceType.id ? strings.applyChange : strings.create) : ''}

                                    </Button>
                                )}
                            </Stack>




                        </Box>

                    ) : <Skeleton variant="text" />}

                </Box>
            </DialogContent>


        </Dialog>
    )
}