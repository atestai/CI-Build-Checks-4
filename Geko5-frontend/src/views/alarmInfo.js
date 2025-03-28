import { Box, Dialog, DialogTitle, DialogContent, FormControl, Grid, InputLabel, Skeleton, TextField, Divider, Alert, Backdrop, CircularProgress, Typography, Button, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { strings } from "../strings";
import { Close } from "@mui/icons-material";



export default function AlarmInfo(props) {

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Variables 
    const { detail, onCloseAction } = props;
    const [alarm, setAlarm] = useState();

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Functions 

    const onClose = async function (params) {
        onCloseAction()
    }


    const formatDateTime = (date) => {
        date = new Date(Number(date));


        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mesi da 0 a 11
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} - ${hours}:${minutes}`;
    };



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// UseEffect 


    useEffect(() => {

        if (detail.row) {
            setAlarm(detail.row);

        } else {
            setAlarm(undefined);

        }



    }, [detail]);


    return (

        <Dialog
            open={detail.open}
            onClose={(event, reason) => { if (reason && reason === "backdropClick") return; onClose(null) }}

            maxWidth={'lg'}
            fullWidth={true}
            sx={{ '& .MuiDialog-paper': { p: 2, backgroundColor: "#F8F8F8" }, }}

        >

            {/* {props.load && (
                <Backdrop
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,

                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={props.load}
                >
                    <CircularProgress color="primary" />
                </Backdrop>
            )} */}


            {props.alert.hide ? (
                <Alert
                    sx={{
                        position: "fixed",
                        top: "1%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 1301,
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
                    severity={props.alert.severity}
                    title={props.alert.message}
                >
                    <span style={{ flexShrink: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {props.alert.message}
                    </span>
                </Alert>
            ) : null}



            <DialogTitle id="draggable-dialog-title">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems : 'center' }}>
                    <Typography sx={{ fontSize: "32px", fontWeight: "500" }} >
                    Alarm detail

                    </Typography>

                  


                    <IconButton onClick = {() => { props.setDetail({ row: null, open: false })}}>
                        <Close sx={{color : 'black'}} />
                    </IconButton>
                </Box>


                <Divider sx={{ mt: 1, backgroundColor: "#656565" }} />
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Box sx={{ height: '100%', overflowY: 'auto' }}>

                    {alarm !== undefined ? (
                        <Box sx={{ display: "flex", flexDirection: "column" }}>

                            <Box sx={{ display: "flex" }}>
                                <Box component={'form'} sx={{ display: 'flex', flexDirection: 'column', width: "100%" }}>


                                    <Grid container>
                                        <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'center', padding: 0 }}>
                                            <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.activationTime} : </InputLabel>

                                        </Grid>
                                        <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                                <TextField
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    value={alarm.timestampActive}

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
                                        <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'center', padding: 0 }}>
                                            <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.asset} : </InputLabel>

                                        </Grid>
                                        <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                                <TextField
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    required
                                                    value={alarm.device || ''}
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
                                            <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.status} : </InputLabel>
                                        </Grid>
                                        <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                                <TextField
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    required
                                                    value={alarm.isActive || ''}
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













                                </Box>

                                <Box component={'form'} sx={{ display: 'flex', flexDirection: 'column', width: "100%" }}>


                                    <Grid container>
                                        <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'center', padding: 0 }}>
                                            <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.deactivationTime} : </InputLabel>

                                        </Grid>
                                        <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                                <TextField
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    value={alarm.timestampDeactive}
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
                                        <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'center', padding: 0 }}>
                                            <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.name} : </InputLabel>

                                        </Grid>
                                        <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                                <TextField
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    required
                                                    value={alarm.name || ''}
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
                                            <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.severity} : </InputLabel>

                                        </Grid>
                                        <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                                <TextField
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    required
                                                    value={alarm.severity || ''}
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

                                </Box>
                            </Box>

                            <Box sx={{ mt: 2, mb: 2, display: "flex" }}>
                                <Box sx={{ width: "12.4%", display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                    <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.message} : </InputLabel>
                                </Box>

                                <Box sx={{ width: "88%", display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                        <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            value={alarm.message || ''}
                                            multiline
                                            rows={2}

                                            inputProps={{
                                                sx: {
                                                    padding: 0,
                                                    height: "32px",
                                                    pl: 1
                                                }
                                            }}

                                        />


                                    </FormControl>
                                </Box>





                            </Box>
                        </Box>

                    ) : <Skeleton variant="text" />}

                </Box>
            </DialogContent>


        </Dialog>
    )
}



