import { Box, Button, Dialog, DialogTitle, DialogContent, FormControl, Grid, InputLabel, Skeleton, TextField, Typography, Divider, Stack, Backdrop, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { strings } from "../strings";
import ServerProxy from "../tools/serverProxy";



export default function CpuDetail(props) {

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Variables

    const { detail, onOkAction, onCloseAction, load, setLoad } = props;
    const [deviceInterface, setDeviceInterface] = useState();
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
        onCloseAction()
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Use Effect

    useEffect(() => {

        async function loadData() {
            setLoad(true);

            try {

                const data = await ServerProxy.getDeviceInterface(detail.id);
                setDeviceInterface(data);

            } catch (error) {

                setDeviceInterface(undefined);
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
            setDeviceInterface({
                id: 0,
                name: '',
                host: '',
                port: '',
                enabled: '1'
            })
        }

    }, [detail]);


    return (

        <Dialog
            open={detail.open}
            onClose={(event, reason) => { if (reason && reason === "backdropClick") return; onClose(null) }}
            maxWidth={'xs'} fullWidth={true} sx={{ '& .MuiDialog-paper': { p: 2, backgroundColor: "#F8F8F8" } }}
        >


            <Backdrop
                sx={{ position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: (theme) => theme.zIndex.drawer + 1, top: 0, left: 0 }} open={load}
            >
                <CircularProgress color="primary" />
            </Backdrop>





            <DialogTitle sx={{ fontSize: "32px", fontWeight: "500" }} id="draggable-dialog-title">
                {detail.show ? 'Info device interface' : deviceInterface ? (deviceInterface.id ? strings.editDeviceInterface : strings.addNewDeviceInterface) : <Skeleton sx={{ width: '250px' }} variant="text" />}



                <Divider sx={{backgroundColor: "#656565" ,mt: 1}} />
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Box sx={{ height: '100%', overflowY: 'auto' }}>

                    {deviceInterface ? (

                        <Box component={'form'} sx={{ display: 'flex', flexDirection: 'column' }}>



                            <Grid container>
                                <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                    <Typography sx={{ fontSize: "14px", color: "red", fontWeight: "400", paddingRight: "5px" }}>*</Typography>
                                    <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="txtName">{strings.name}</InputLabel>

                                </Grid>
                                <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                        <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            required
                                            disabled={detail.show && true}
                                            sx={disabledTextFieldStyle}
                                            value={deviceInterface.name}
                                            onChange={event => { setDeviceInterface({ ...deviceInterface, name: event.target.value }) }}
                                            inputProps={{ sx: { height: "32px", padding: 0, pl: 1 } }}

                                        />


                                    </FormControl>
                                </Grid>

                            </Grid>

                            <Grid container sx={{ mt: 2 }}>
                                <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                    <Typography sx={{ fontSize: "14px", color: "red", fontWeight: "400", paddingRight: "5px" }}>*</Typography>
                                    <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="txtName">{strings.host}</InputLabel>

                                </Grid>
                                <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                        <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            value={deviceInterface.host}
                                            disabled={detail.show && true}
                                            sx={disabledTextFieldStyle}
                                            required
                                            onChange={event => { setDeviceInterface({ ...deviceInterface, host: event.target.value }) }}

                                            inputProps={{ sx: { height: "32px", padding: 0, pl: 1 } }}

                                        />


                                    </FormControl>
                                </Grid>

                            </Grid>


                            <Grid container sx={{ mt: 2 }}>
                                <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                    <Typography sx={{ fontSize: "14px", color: "red", fontWeight: "400", paddingRight: "5px" }}>*</Typography>
                                    <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="txtName">{strings.port}</InputLabel>

                                </Grid>
                                <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                        <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            value={deviceInterface.port}
                                            disabled={detail.show && true}
                                            sx={disabledTextFieldStyle}
                                            onChange={event => { setDeviceInterface({ ...deviceInterface, port: event.target.value }) }}

                                            inputProps={{ sx: { height: "32px", padding: 0, pl: 1 } }}

                                        />


                                    </FormControl>
                                </Grid>

                            </Grid>



                            <Stack spacing={3} direction={'row'} sx={{ marginTop: "100px" }} >
                                <Button sx={{ width: '100%', textTransform: "none", fontSize: "16px", fontFamily: "Inter", fontWeight: "400" }} variant="outlined" onClick={() => {
                                    props.setAlert(prevState => ({
                                        ...prevState,
                                        message: '',
                                        hide: 0,
                                        severity: ''
                                    }));
                                    onClose()
                                }}
                                >{strings.discard}</Button>

                                {!detail?.show && (

                                    <Button onClick={async () => {
                                        const isValid = (
                                            deviceInterface.name &&
                                            deviceInterface.host &&
                                            deviceInterface.port
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

                                        props.setLoad(true);
                                        await onOkAction(deviceInterface)
                                    }} sx={{ width: '100%', textTransform: "none", fontSize: "16px", fontFamily: "Inter", fontWeight: "400" }} variant="contained" color="primary">
                                        {deviceInterface ? (deviceInterface.id ? strings.applyChange : strings.create) : ''}

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



