import { Box, Button, Dialog, DialogTitle, DialogContent, FormControl, FormControlLabel, Grid, InputLabel, Skeleton, Switch, TextField, Typography, Divider, Stack, Backdrop, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import ServerProxy from "../tools/serverProxy";
import { strings } from "../strings";




export default function CpuDetail(props) {

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Variables
    const { detail, onOkAction, onCloseAction, load, setLoad } = props;
    const [cpu, setCpu] = useState();
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

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// UseEffect 


    useEffect(() => {
        async function loadData() {
            setLoad(true)

            try {
                const data = await ServerProxy.getCpu(detail.id);
                setCpu(data);
            } catch (error) {
                setCpu(undefined);
                if (error?.response) {
                    const { data } = error.response;

                    if (data) {

                        props.setAlert(prevState => ({
                            ...prevState,
                            message: data.message,
                            hide: 1,
                            severity: "error"
                        }));
                        onClose();

                    }
                }
            } finally {
                setLoad(false)

            }


        }

        if (detail?.id !== null && detail?.id !== 0) {
            loadData();
        } else {
            setCpu({
                id: 0,
                name: '',
                description: '',
                host: '',
                location: '',
                enabled: '1'
            })
        }

    }, [detail]);


    return (

        <Dialog
            open={detail.open}
            onClose={(event, reason) => { if (reason && reason === "backdropClick") return; onClose(null) }}
            maxWidth={'xs'}
            fullWidth={true}
            sx={{
                '& .MuiDialog-paper': {
                    p: 2,
                    backgroundColor: "#F8F8F8"
                },
                '& .MuiBackdrop-root': {
                    zIndex: 13
                },
                '& .MuiDialog-paper': {
                    zIndex: 13
                }
            }}

        >


            <Backdrop open={load} sx={{ position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: (theme) => theme.zIndex.drawer + 1, top: 0, left: 0 }}>
                <CircularProgress color="primary" />
            </Backdrop>





            <DialogTitle sx={{ fontSize: "32px", fontWeight: "500" }} id="draggable-dialog-title">

                {detail.show ? strings.infoDataLogger : cpu ? (cpu.id ? strings.editCpu : strings.newdataLogger) : <Skeleton sx={{ width: '250px' }} variant="text" />}
                <Divider sx={{ mt: 1, backgroundColor: "#656565" }} />

            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Box sx={{ height: '100%', overflowY: 'auto' }}>

                    {cpu ? (

                        <Box component={'form'} sx={{ display: 'flex', flexDirection: 'column' }}>



                            <Grid container>
                                <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                    <Typography sx={{ paddingRight: "5px", fontSize: "14px", color: "red", fontWeight: "400" }}>*</Typography>
                                    <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.name}</InputLabel>

                                </Grid>
                                <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                        <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            required
                                            disabled={detail.show && true}
                                            sx={disabledTextFieldStyle}
                                            value={cpu.name}
                                            onChange={event => { setCpu({ ...cpu, name: event.target.value }) }}
                                            inputProps={{ sx: { height: "32px", padding: 0, pl: 1 } }}

                                        />


                                    </FormControl>
                                </Grid>

                            </Grid>

                            <Grid container sx={{ mt: 2 }}>
                                <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                    <Typography sx={{ paddingRight: "5px", fontSize: "14px", color: "red", fontWeight: "400" }}>*</Typography>
                                    <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.host}</InputLabel>

                                </Grid>
                                <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                        <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            value={cpu.host}
                                            disabled={detail.show && true}
                                            sx={disabledTextFieldStyle}
                                            required
                                            onChange={event => { setCpu({ ...cpu, host: event.target.value }) }}
                                            inputProps={{ sx: { height: "32px", padding: 0, pl: 1 } }}
                                        />


                                    </FormControl>
                                </Grid>

                            </Grid>

                            <Grid container sx={{ mt: 2 }}>
                                <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                    <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.location}</InputLabel>

                                </Grid>
                                <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                        <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            required
                                            disabled={detail.show && true}
                                            sx={disabledTextFieldStyle}
                                            value={cpu.location}
                                            onChange={event => { setCpu({ ...cpu, location: event.target.value }) }}
                                            inputProps={{ sx: { height: "32px", padding: 0, pl: 1 } }}


                                        />


                                    </FormControl>
                                </Grid>

                            </Grid>


                            <Grid container sx={{ mt: 2 }}>
                                <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                    <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.description}</InputLabel>

                                </Grid>
                                <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                        <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            value={cpu.description}
                                            multiline
                                            disabled={detail.show && true}
                                            sx={disabledTextFieldStyle}
                                            rows={2}
                                            onChange={event => { setCpu({ ...cpu, description: event.target.value }) }}
                                            inputProps={{ sx: { height: "32px", padding: 0, pl: 1 } }}



                                        />


                                    </FormControl>
                                </Grid>

                            </Grid>

                            <Grid container sx={{ mt: 2 }}>
                                <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'center', padding: 0 }}>
                                    <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.status}</InputLabel>

                                </Grid>
                                <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                        <FormControlLabel control={<Switch
                                            checked={cpu.enabled === '1'}
                                            disabled={detail.show && true}
                                            sx={disabledTextFieldStyle}

                                            onChange={() => { setCpu({ ...cpu, enabled: cpu.enabled === '1' ? '0' : '1' }) }}
                                        />} label="Enabled" />

                                    </FormControl>
                                </Grid>

                            </Grid>

                            <Stack spacing={3} direction={'row'} sx={{ marginTop: "100px" }} >

                                <Button sx={{ width: '100%', textTransform: "none", fontSize: "16px", fontFamily: "Inter", fontWeight: "400" }} variant="outlined" onClick={() => { props.setAlert(prevState => ({ ...prevState, message: '', hide: 0, severity: '' })); onClose() }}>
                                    {strings.discard}
                                </Button>

                                {!detail?.show && (
                                    <Button onClick={async () => {
                                        const isValid = (
                                            cpu.name &&
                                            cpu.host &&
                                            cpu.enabled !== undefined
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
                                        setLoad(true);


                                        await onOkAction(cpu)
                                    }} sx={{ width: '100%', textTransform: "none", fontSize: "16px", fontFamily: "Inter", fontWeight: "400" }} variant="contained" color="primary">
                                        {cpu ? (cpu.id ? strings.applyChange : strings.create) : ''}

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



