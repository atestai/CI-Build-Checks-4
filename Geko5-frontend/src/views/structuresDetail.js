import { Backdrop, Box, Button, Dialog, DialogTitle, DialogContent, FormControl, Grid, InputLabel, Skeleton, TextField, Typography, Divider, Stack, MenuItem, Select, CircularProgress, FormControlLabel, Switch, IconButton, DialogActions, Tooltip } from "@mui/material";
import React, { useEffect, useState , useRef} from "react";

import { strings } from "../strings";
import ServerProxy from "../tools/serverProxy";
import { } from "@mui/material";
import { Info, Settings } from "@mui/icons-material";
import EventDetail from "../components/EventDetail";
import CodeEditor from "../components/CodeEditor";



export default function StructuresDetail(props) {

    const { detail, setDetail, onOkAction, onCloseAction, load, setLoad } = props;

    const prevModbusType = useRef(null);

    const [signal, setSignal] = useState({
        id: 0,
        deviceTypeId: detail.idDeviceType,
        name: '',
        signalType: '',
        description: '',
        modbusFunction: '',
        modbusAddress: '',
        modbusType: '',
        modbusAccess: 'R',
        measureUnit: '',
        gain: '1',
        event: [],
        diff: 0,
        postFunction: '',
        showOnGraphic: 0,
    });

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Functions 


    const onClose = async function (params) {
        onCloseAction()
    }

    const onDetailOkAction = async function (obj) {

        setSignal((prev) => ({ ...prev, event: obj }))
        setDetail((prev) => ({ ...prev, open: true, openEvent: false }));

    };


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Use Effect 


    useEffect(() => {


        console.log("useEffect 1");


        async function loadData() {
            setLoad(true)

            try {

                const data = await ServerProxy.getStructuresForId(detail.idRow || undefined);

                if (data.signalType === 'bitmask') {
                    data.event = await ServerProxy.getBitMasksForSignal(data.id);
                }

                if (data.signalType === 'enumeration') {
                    data.event = await ServerProxy.getEnumerationsForSignal(data.id);
                }

                setSignal(data);

            } catch (error) {
                if (error?.message) {
                    // alert()
                    console.log(error.message);

                }
            } finally {
                setLoad(false)
            }

        }

        if (detail?.idRow !== null && detail?.idRow !== 0) {

            loadData();
        }
        else {

            console.log("useEffect 2");

            // if (signal?.event.length === 0) {

            console.log("useEffect 3");


            setSignal({
                id: 0,
                deviceTypeId: detail.idDeviceType,
                name: '',
                signalType: '',
                description: '',
                modbusFunction: '',
                modbusAddress: '',
                modbusType: '',
                modbusAccess: 'R',
                measureUnit: '',
                gain: '1',
                event: [],
                diff: 0,
                postFunction: '',
                showOnGraphic: 0,
            })
        }
    }, [detail.idRow]);

    
    useEffect(() => {

        if (typeof prevModbusType.current === "string" && 
            typeof signal.modbusType === "string" && 
            signal.modbusType.toLowerCase() === 'bitmask') {

            const prevMatch = prevModbusType.current.match(/\d+/);
            const currentMatch = signal.modbusType.match(/\d+/);
    
            if (prevMatch && currentMatch) {
                if (parseInt(prevMatch[0]) !== parseInt(currentMatch[0])) {
                    setSignal((prev) => ({
                        ...prev,
                        event: []
                    }));
                }
            }
        }
    
        prevModbusType.current = signal.modbusType;
    
    }, [signal.modbusType]);


    return (
        <>
            {detail.openEvent && (
                <EventDetail load={load} setLoad={setLoad} alert={alert} setAlert={props.setAlert} detail={detail} onOkAction={onDetailOkAction} onCloseAction={() => setDetail((prev) => ({ ...prev, id: null, openEvent: false, open: true }))} />
            )}



            <Dialog
                open={detail.open}
                onClose={(event, reason) => { if (reason && reason === "backdropClick") return; onClose(null) }}

                maxWidth={'md'} fullWidth={true} sx={{ '& .MuiDialog-paper': { position: "relative", backgroundColor: "#F8F8F8", p: 2 } }}
            >


                <Backdrop
                    sx={{ position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: (theme) => theme.zIndex.drawer + 1, top: 0, left: 0 }}
                    open={load}
                >
                    <CircularProgress color="primary" />
                </Backdrop>



                <DialogTitle sx={{ fontSize: "32px", fontWeight: "500" }} id="draggable-dialog-title">
                    {signal ? (signal.id ? strings.editSignal : strings.new + ' ' + strings.signal) : <Skeleton sx={{ width: '250px' }} variant="text" />}

                    <Divider sx={{ backgroundColor: "#656565", mt: 1 }} />
                </DialogTitle>

                <DialogContent sx={{ mt: 2 }}>
                    <Box sx={{ height: '100%', overflowY: 'auto' }}>

                        {signal ? (

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
                                                value={signal.name}
                                                onChange={event => { setSignal({ ...signal, name: event.target.value }) }}
                                                inputProps={{ sx: { height: "32px", padding: 0, pl: 1 } }}

                                            />


                                        </FormControl>
                                    </Grid>

                                </Grid>


                                <Grid container sx={{ mt: 2 }}>
                                    <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                        <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="txtName">{strings.description} </InputLabel>

                                    </Grid>
                                    <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                        <FormControl variant="standard" sx={{ width: "100%" }}>
                                            <TextField
                                                id="outlined-basic"
                                                variant="outlined"
                                                value={signal.description || ''}
                                                multiline
                                                rows={2}
                                                onChange={event => { setSignal({ ...signal, description: event.target.value }) }}
                                                inputProps={{ sx: { height: "32px", padding: 0, pl: 1 } }}

                                            />


                                        </FormControl>
                                    </Grid>

                                </Grid>

                                <Grid container sx={{ mt: 2 }}>
                                    <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                        <Typography sx={{ fontSize: "14px", color: "red", fontWeight: "400", paddingRight: "5px" }}>*</Typography>
                                        <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="modbusType">{strings.signalType}</InputLabel>
                                    </Grid>
                                    <Grid item xs={(signal?.signalType && signal?.signalType !== 'measure' && ((signal?.signalType === 'bitmask' && signal.modbusType !== '') || signal?.signalType === 'enumeration')) ? 8 : 9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                        <FormControl variant="standard" sx={{ width: "100%" }}>
                                            <Select
                                                disabled={(signal.modbusFunction == 1 || signal.modbusFunction == 2)  && true }
                                                variant="outlined"
                                                labelId="word-order-select-label"
                                                id="word-order-select"
                                                value={signal.signalType}
                                                required
                                                onChange={event => { setSignal({ ...signal, signalType: event.target.value, event: [] }) }}
                                                sx={{ height: "32px", padding: 0 }}
                                            >
                                                <MenuItem value={"digital"}>{strings.digital}</MenuItem>
                                                <MenuItem value={"measure"}>{strings.measure}</MenuItem>
                                                <MenuItem value={"bitmask"}>{strings.bitMask}</MenuItem>
                                                <MenuItem value={"enumeration"}>{strings.enumeration}</MenuItem>

                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {signal?.signalType &&
                                        signal?.signalType !== 'measure' &&
                                        ((signal?.signalType === 'bitmask' && signal.modbusType !== '') || signal?.signalType === 'enumeration') && (
                                            <Grid item xs={1}>
                                                <IconButton onClick={() => setDetail((prev) => ({ ...prev, open: false, openEvent: true, signal: signal }))}>
                                                    <Settings />
                                                </IconButton>
                                            </Grid>
                                        )}

                                </Grid>

                                <Grid container sx={{ mt: 2 }}>
                                    <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                        <Typography sx={{ fontSize: "14px", color: "red", fontWeight: "400", paddingRight: "5px" }}>*</Typography>

                                        <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} >{strings.modbusFunction} </InputLabel>

                                    </Grid>
                                    <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                      

                                        <FormControl variant="standard" sx={{ width: "100%" }}>
                                            <Select
                                                variant="outlined"
                                                labelId="word-order-select-label"
                                                id="word-order-select"
                                                value={signal.modbusFunction}
                                                required
                                                onChange={event => { setSignal({ ...signal, modbusFunction: event.target.value ,  modbusType: (event.target.value == 1 || event.target.value == 2) ? 'BIT' : '' ,  gain : 1, diff: 0 , signalType: (event.target.value == 1 || event.target.value == 2) ? 'digital' : ''
                                                }) }}
                                                sx={{ height: "32px", padding: 0 }}
                                            >
                                                <MenuItem value={"1"}>1</MenuItem>
                                                <MenuItem value={"2"}>2</MenuItem>
                                                <MenuItem value={"3"}>3</MenuItem>
                                                <MenuItem value={"4"}>4</MenuItem>
                                                <MenuItem value={"5"}>5</MenuItem>
                                                <MenuItem value={"6"}>6</MenuItem>
                                                <MenuItem value={"7"}>7</MenuItem>
                                                <MenuItem value={"8"}>8</MenuItem>
                                                <MenuItem value={"11"}>11</MenuItem>
                                                <MenuItem value={"12"}>12</MenuItem>
                                                <MenuItem value={"15"}>15</MenuItem>
                                                <MenuItem value={"16"}>16</MenuItem>
                                                <MenuItem value={"17"}>17</MenuItem>
                                                <MenuItem value={"20"}>20</MenuItem>
                                                <MenuItem value={"21"}>21</MenuItem>
                                                <MenuItem value={"22"}>22</MenuItem>
                                                <MenuItem value={"23"}>23</MenuItem>
                                                <MenuItem value={"24"}>24</MenuItem>
                                                <MenuItem value={"43"}>43</MenuItem>

                                            </Select>
                                        </FormControl>
                                    </Grid>

                                </Grid>


                                <Grid container sx={{ mt: 2 }}>
                                    <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                        <Typography sx={{ fontSize: "14px", color: "red", fontWeight: "400", paddingRight: "5px" }}>*</Typography>
                                        <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="modbusType">{strings.modbusType}</InputLabel>
                                    </Grid>
                                    <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                        <FormControl variant="standard" sx={{ width: "100%" }}>
                                            <Select
                                               disabled={(signal.modbusFunction == 1 || signal.modbusFunction == 2)  ? true : signal.signalType ? false : true }
                                                variant="outlined"
                                                labelId="word-order-select-label"
                                                id="word-order-select"
                                                value={signal.modbusType}
                                                required
                                                onChange={event => { setSignal({ ...signal, modbusType: event.target.value }) }}
                                                sx={{ height: "32px", padding: 0, pl: 0 }}
                                            >
                                                <MenuItem value={"BIT"}>BIT</MenuItem>
                                                <MenuItem value={"INT16"}>INT16</MenuItem>
                                                <MenuItem value={"INT32"}>INT32</MenuItem>
                                                <MenuItem value={"UINT16"}>UINT16</MenuItem>
                                                <MenuItem value={"UINT32"}>UINT32</MenuItem>

                                                {signal.signalType === 'measure' && (<MenuItem value={"FLOAT32"}>FLOAT32</MenuItem>)}

                                                {signal.signalType === 'measure' && (<MenuItem value={"DOUBLE64"}>DOUBLE64</MenuItem>)}

                                            </Select>
                                        </FormControl>
                                    </Grid>

                                </Grid>


                           


                                <Grid container sx={{ mt: 2 }}>
                                    <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                        <Typography sx={{ fontSize: "14px", color: "red", fontWeight: "400", paddingRight: "5px" }}>*</Typography>
                                        <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} >{strings.modbusAddress} </InputLabel>

                                    </Grid>
                                    <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                        <FormControl variant="standard" sx={{ width: "100%" }}>
                                            <TextField
                                                id="outlined-basic"
                                                variant="outlined"
                                                required
                                                type="number"
                                                value={signal.modbusAddress}
                                                onChange={event => { setSignal({ ...signal, modbusAddress: event.target.value }) }}
                                                inputProps={{ min: 0, sx: { height: "32px", padding: 0, px: 1 } }}

                                            />


                                        </FormControl>
                                    </Grid>

                                </Grid>


                                <Grid container sx={{ mt: 2 }}>
                                    <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                        <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="modbusType">{strings.modbusAccess}</InputLabel>
                                    </Grid>
                                    <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                        <FormControl variant="standard" sx={{ width: "100%" }}>
                                            <Select
                                                variant="outlined"
                                                labelId="word-order-select-label"
                                                id="word-order-select"
                                                value={signal.modbusAccess}
                                                required
                                                onChange={event => { setSignal({ ...signal, modbusAccess: event.target.value }) }}
                                                sx={{ height: "32px", padding: 0 }}
                                            >
                                                <MenuItem value={"R"}>R</MenuItem>
                                                <MenuItem value={"W"}>W</MenuItem>
                                                <MenuItem value={"RW"}>RW</MenuItem>

                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>


                                <Grid container sx={{ mt: 2 }}>
                                    <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                        <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} >{strings.measureUnit} </InputLabel>

                                    </Grid>
                                    <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1  }}>
                                        <FormControl variant="standard" sx={{ width: "100%" }}>
                                            <TextField
                                                id="outlined-basic"
                                                variant="outlined"
                                                disabled={(signal.signalType === 'digital')  && true }

                                                value={signal.measureUnit || ''}
                                                required
                                                onChange={event => { setSignal({ ...signal, measureUnit: event.target.value }) }}
                                                inputProps={{ sx: { height: "32px", padding: 0, px: 1 } }}

                                            />


                                        </FormControl>
                                    </Grid>

                                </Grid>




                                <Grid container sx={{ mt: 2 }}>
                                    <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                        <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} >{strings.gain} </InputLabel>

                                    </Grid>
                                    <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                        <FormControl variant="standard" sx={{ width: "100%" }}>
                                            <TextField
                                                id="outlined-basic"
                                                variant="outlined"
                                                disabled={signal.signalType === 'digital' && true }

                                                value={signal.gain}
                                                required
                                                type="number"
                                                onChange={event => { setSignal({ ...signal, gain: event.target.value }) }}
                                                inputProps={{ min: 0, sx: { height: "32px", padding: 0, px: 1 } }}

                                            />


                                        </FormControl>
                                    </Grid>

                                </Grid>

                                <Grid container sx={{ mt: 2 }}>
                                    <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                        <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} >{strings.diff}  </InputLabel>

                                    </Grid>
                                    <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                        <FormControl variant="standard" sx={{ width: "100%" }}>
                                            <TextField
                                                id="outlined-basic"
                                                variant="outlined"
                                                disabled={signal.signalType === 'digital' && true }
                                                value={signal.diff}
                                                required
                                                type="number"
                                                onChange={event => { setSignal({ ...signal, diff: event.target.value }) }}
                                                inputProps={{ min: 0, sx: { height: "32px", padding: 0, px: 1 } }}

                                            />


                                        </FormControl>
                                    </Grid>

                                </Grid>

                                <Grid container sx={{ mt: 2 }}>
                                    <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'center', padding: 0 }}>
                                        <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="txtName">{strings.displayOnGraph} </InputLabel>

                                    </Grid>
                                    <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                        <FormControl variant="standard" sx={{ width: "100%" }}>
                                            <FormControlLabel control={<Switch
                                                checked={signal.showOnGraphic === 1}
                                                onChange={() => { setSignal({ ...signal, showOnGraphic: signal.showOnGraphic === 1 ? 0 : 1 }) }}
                                            />} label="Show" />

                                        </FormControl>
                                    </Grid>

                                </Grid>


                                <Grid container sx={{ mt: 2 }}>
                                    <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                        <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="txtName">{strings.postFunction} </InputLabel>

                                    </Grid>
                                    <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                        <FormControl variant="standard" sx={{ width: "100%" }}>
                                            <Typography sx={{ display: 'flex', color: 'tertiary.text', fontSize: "14px", fontWeight: "400", lineHeight: "22px" }}>
                                                {'function postFunction(value, gain, diff, metrics){'}
                                                <Tooltip title={strings.infoPostFunction} arrow>

                                                    <Info  fontSize='small' />
                                                </Tooltip>
                                            </Typography>



                                            <CodeEditor value={signal.postFunction} onChange={(newValue) => setSignal({ ...signal, postFunction: newValue })} />

                                            <Typography sx={{ color: (theme) => `${theme.palette.tertiary.text}`, fontSize: "14px", fontWeight: "400", lineHeight: "22px" }}>
                                                {"}"}
                                            </Typography>



                                        </FormControl>



                                    </Grid>

                                </Grid>








                            </Box>

                        ) : <Skeleton variant="text" />}

                    </Box>
                </DialogContent>


                <DialogActions>
                    <Button sx={{ width: '100%', textTransform: "none", fontSize: "16px", fontFamily: "Inter", fontWeight: "400" }} variant="outlined" onClick={() => {
                        props.setAlert(prevState => ({
                            ...prevState,
                            message: '',
                            hide: 0,
                            severity: ''
                        }));
                        onClose()
                    }}>{strings.discard}</Button>
                    <Button onClick={async () => {

                        const isValid = (
                            signal.name &&
                            (signal.modbusFunction !== null && signal.modbusFunction !== undefined) &&
                            (signal.modbusAddress !== null && signal.modbusAddress !== undefined) &&
                            signal.modbusType

                        );



                        if (!isValid || (signal.signalType !== 'measure' && signal.signalType !== 'digital'  && signal.event.length === 0)) {
                            props.setAlert(prevState => ({
                                ...prevState,
                                message: !isValid ? strings.requiredFields : (strings.requireEvent + ' ' + signal.signalType),
                                hide: 1,
                                severity: "error"
                            }));
                            return -1;
                        }
                        props.setLoad(true)

                        await onOkAction(signal)


                    }} sx={{ width: '100%', textTransform: "none", fontSize: "16px", fontFamily: "Inter", fontWeight: "400" }} variant="contained" color="primary">
                        {signal ? (signal.id ? strings.applyChange : strings.create) : ''}

                    </Button>
                </DialogActions>


            </Dialog>

        </>
    )
}



