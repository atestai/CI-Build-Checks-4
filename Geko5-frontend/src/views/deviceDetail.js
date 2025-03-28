import { Add } from "@mui/icons-material";
import { Box, Button, Dialog, DialogTitle, DialogContent, FormControl, FormControlLabel, Grid, InputLabel, Skeleton, Switch, TextField, Typography, Select, MenuItem, InputAdornment, IconButton, Autocomplete, Divider, Stack, CircularProgress, Backdrop, DialogActions } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import ReactCardFlip from 'react-card-flip';
import { strings } from "../strings";
import ServerProxy from "../tools/serverProxy";



export default function DeviceDetail(props) {

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Variables

    const { detail, onOkAction, onCloseAction } = props;


    const cardRef = useRef({ front: null, back: null })

    const boxRefs = useRef({ dataLogger: null, deviceType: null, deviceInterface: null });
    const [boxHeight, setBoxHeight] = useState(0);
    const [createElement, setCreateElement] = useState({ cpu: {}, deviceType: {}, deviceInterface: {} })
    const [device, setDevice] = useState({
        id: 0,
        name: '',
        dataLoggerId: '',
        deviceTypeId: '',
        deviceModbusId: '',
        description: '',
        deviceInterfaceId: '',
        pollingPeriod: '15',
        protocol: '',
        byteOrder: '',
        wordOrder: '',
        unitId: '',
        enabled: '1'
    });
    const [isFlipped, setIsFlipped] = useState(true);
    const [moreInfoData, setMoreInfoData] = useState({ dataLogger: [], devicesType: [], devicesModbus: [], devicesInterface: [], });
    const [newElement, setNewElement] = useState({ dataLogger: false, deviceType: false, deviceInterface: false })
    const [overflow, setOverflow] = useState('auto');
    let [prevInterface, setPrevInterface] = useState();
    let sendDevice = {
        id: 0,
        name: '',
        dataLoggerId: '',
        deviceTypeId: '',
        deviceModbusId: '',
        description: '',
        enabled: '1'
    };


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Functions



    const onClose = async (params) => {
        onCloseAction()
    }


    const readHeightBack = () => {
        if (cardRef.current.back) {
            const height = cardRef.current.back.offsetHeight;
            setBoxHeight(height);
        }

    }


    const readHeightFront = () => {
        if (cardRef.current.front) {
            const height = cardRef.current.front.offsetHeight;
            setBoxHeight(height);
        }

    }

    const sendNewDataLogger = async () => {
        try {

            const isValid = (
                createElement.cpu.name &&
                createElement.cpu.host
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


            const response = await ServerProxy.addCpu(createElement.cpu);
            const newDataLogger = response.dataLogger;
            //Add the new datalogger just inserted
            setMoreInfoData(prevData => ({ ...prevData, dataLogger: [...prevData.dataLogger, newDataLogger] }));
            // Set datalogger for new device
            setDevice(prevDevice => ({ ...prevDevice, dataLoggerId: newDataLogger.id }));

            setCreateElement((prev) => ({ ...prev, cpu: {} }))
            setIsFlipped(prevIsFlipped => !prevIsFlipped);
            readHeightFront();
            setNewElement((prev) => ({ ...prev, dataLogger: !prev.dataLogger }))
            setOverflow('auto');
            props.setLoad(false);

        } catch (error) {
            props.setAlert(prevState => ({
                ...prevState,
                message: error.response.data.message,
                hide: 1,
                severity: "error"
            }));
            props.setLoad(false);

        }
    }

    const sendNewDeviceType = async () => {
        try {

            const isValid = (
                createElement.deviceType.model &&
                createElement.deviceType.manufacturer &&
                createElement.deviceType.firmwareRev

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


            const response = await ServerProxy.addDeviceType(createElement.deviceType);
            const newDeviceType = response.deviceType;

            //Add the new devicetype just inserted
            setMoreInfoData(prevData => ({ ...prevData, devicesType: [...prevData.devicesType, newDeviceType] }));
            // Set devicetype for new device
            setDevice(prevDevice => ({ ...prevDevice, deviceType: { ...prevDevice.deviceType, id: newDeviceType.id } }));
            setCreateElement((prev) => ({ ...prev, deviceType: {} }))
            setIsFlipped(prevIsFlipped => !prevIsFlipped);
            readHeightFront();
            setNewElement((prev) => ({ ...prev, deviceType: !prev.deviceType }))
            setOverflow('auto');
            props.setLoad(false);

        } catch (error) {
            props.setAlert(prevState => ({
                ...prevState,
                message: error.response.data.message,
                hide: 1,
                severity: "error"
            }));
            props.setLoad(false);

        }
    }

    const sendNewDeviceInterface = async () => {
        try {

            const isValid = (
                createElement.deviceInterface.name &&
                createElement.deviceInterface.host &&
                createElement.deviceInterface.port

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


            const response = await ServerProxy.addDeviceInterface(createElement.deviceInterface);
            const newDeviceInterface = response.deviceInterface;
            //Add the new deviceInterface just inserted
            setMoreInfoData(prevData => ({
                ...prevData,
                devicesInterface: [...prevData.devicesInterface, newDeviceInterface]
            }));
            // Set deviceInterface for new device
            setDevice(prevDevice => ({
                ...prevDevice,
                deviceInterfaceId: newDeviceInterface.id
            }));
            setCreateElement((prev) => ({ ...prev, deviceInterface: {} }))
            setIsFlipped(prevIsFlipped => !prevIsFlipped);
            readHeightFront();
            setNewElement((prev) => ({ ...prev, deviceInterface: !prev.deviceInterface }))
            setOverflow('auto');
            props.setLoad(false);

        } catch (error) {
            props.setAlert(prevState => ({
                ...prevState,
                message: error.response.data.message,
                hide: 1,
                severity: "error"
            }));
            props.setLoad(false);

        }
    }

    const getMoreInfo = async () => {
        try {

            const dataLogger = await ServerProxy.getCpus();
            const devicesType = await ServerProxy.getDevicesType();
            const devicesInterface = await ServerProxy.getDevicesInterface();
            setMoreInfoData(prevState => ({
                ...prevState,
                dataLogger: dataLogger,
                devicesType: devicesType,
                devicesInterface: devicesInterface
            }));

            if (cardRef.current.front) {
                const height = cardRef.current.front.offsetHeight;
                setBoxHeight(height);
            }

        } catch (error) {
            props.setAlert(prevState => ({
                ...prevState,
                message: error.response.data.message,
                hide: 1,
                severity: "error"
            }));
        }


    }

    const handleSendData = async () => {
        let notChange = false;
        sendDevice = {
            id: device.id,
            name: device.name,
            dataLoggerId: device.dataLoggerId,
            deviceTypeId: device.deviceType?.id,
            deviceInterfaceId: device.deviceInterfaceId,
            description: device.description,
            pollingPeriod: device.pollingPeriod,
            byteOrder: device.byteOrder,
            protocol: device.protocol,
            wordOrder: device.wordOrder,
            unitId: device.unitId,
            enabled: device.enabled,
        };

        if (detail?.id) {
            if (sendDevice.deviceInterfaceId === prevInterface.deviceInterfaceId &&
                sendDevice.pollingPeriod === prevInterface.pollingPeriod &&
                sendDevice.byteOrder === prevInterface.byteOrder &&
                sendDevice.protocol === prevInterface.protocol &&
                sendDevice.wordOrder === prevInterface.wordOrder &&
                sendDevice.unitId === prevInterface.unitId
            ) {
                notChange = true;
            }

        }



        const isValid = (
            sendDevice.name &&
            sendDevice.dataLoggerId &&
            sendDevice.deviceTypeId &&
            (sendDevice.protocol !== 'TCP' || sendDevice.deviceInterfaceId) &&
            sendDevice.unitId &&
            sendDevice.protocol &&
            sendDevice.byteOrder &&
            sendDevice.wordOrder &&
            sendDevice.enabled !== undefined
        );

        if (!isValid) {
            props.setAlert(prevState => ({
                ...prevState,
                message: strings.requiredFields,
                hide: 1,
                severity: "error"
            }));
        } else {

            props.setLoad(true);
            await onOkAction(sendDevice, notChange)


        }



    }


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// UseEffect




    useEffect(() => {

        async function loadData() {



            try {


                // if (cardRef.current.front) {
                //     const height = cardRef.current.front.offsetHeight;
                //     setBoxHeight(height);
                // }


                const deviceData = await ServerProxy.getDevice(detail.id);
                console.log("deviceData",detail.id);

                const interfaceData = await ServerProxy.getInterfaceForDevice(detail.id);

                

                setDevice({
                    ...deviceData,
                    deviceInterfaceId: interfaceData.data.interfaceId,
                    pollingPeriod: interfaceData.data.pollingPeriod / 1000,
                    byteOrder: interfaceData.data.config.byteOrder,
                    protocol: interfaceData.data.protocol,
                    wordOrder: interfaceData.data.config.wordOrder,
                    unitId: interfaceData.data.config.unitId,
                });


                // setRows(devices.map(item => ({
                //     ...item,
                //     interfaceObj: item?.interface || '-',
                //     deviceTypeObj: item.deviceType,
                //     dataLoggerObj: item.dataLogger,
                //     deviceType: item.deviceType.model,
                //     interfaceHost: item.interface?.host || '-',
                //     interfacePort: item.interface?.port || '-',
                //     interface: item.interface?.name || '-',
                //     dataLogger: item.dataLogger.name
                // })));
    


                setPrevInterface(prevDevice => ({
                    ...prevDevice,
                    deviceInterfaceId: interfaceData.data.interfaceId,
                    pollingPeriod: interfaceData.data.pollingPeriod / 1000,
                    protocol: interfaceData.data.protocol,
                    byteOrder: interfaceData.data.config.byteOrder,
                    wordOrder: interfaceData.data.config.wordOrder,
                    unitId: interfaceData.data.config.unitId,
                }));





                if (cardRef.current.front) {
                    const height = cardRef.current.front.offsetHeight;
                    setBoxHeight(height);
                }




            } catch (error) {

                setDevice(undefined);

                if (error?.code === 'ERR_NETWORK') {
                    onClose();
                }
            }


        }



        getMoreInfo();

        if (detail?.id !== null && detail?.id !== 0) {

            loadData();
        }
        else {




            setDevice({
                id: 0,
                name: '',
                dataLoggerId: '',
                deviceTypeId: '',
                deviceModbusId: '',
                description: '',
                deviceInterfaceId: '',
                pollingPeriod: '15',
                protocol: '',
                byteOrder: '',
                wordOrder: '',
                unitId: '',
                enabled: '1'
            })



            setCreateElement((prev) => ({
                ...prev,
                deviceType: {
                    id: 0,
                    model: '',
                    manufacturer: '',
                    firmwareRev: '',
                    description: ''
                },
                cpu: {
                    id: 0,
                    name: '',
                    description: '',
                    host: '',
                    location: '',
                    enabled: '1'
                },
                deviceInterface: {
                    id: 0,
                    name: '',
                    host: '',
                    port: ''
                }
            }))





        }




    }, [detail]);




    useEffect(() => {
        if (newElement.deviceInterface) {
            if (boxRefs.current.deviceInterface) {
                const height = boxRefs.current.deviceInterface.offsetHeight;
                setBoxHeight(height);
            }
        }

        if (newElement.dataLogger) {
            if (boxRefs.current.dataLogger) {
                const height = boxRefs.current.dataLogger.offsetHeight;
                setBoxHeight(height);
            }
        }

        if (newElement.deviceType) {
            if (boxRefs.current.deviceType) {
                const height = boxRefs.current.deviceType.offsetHeight;
                setBoxHeight(height);
            }
        }

    }, [newElement])





    return (



        <Dialog
            open={detail.open}
            onClose={(event, reason) => { if (reason && reason === "backdropClick") return; onClose(null) }}

            maxWidth={'md'}
            fullWidth={true}
            sx={{ '& .MuiDialog-paper': { position: "relative", backgroundColor: "#F8F8F8", p: 2, } }}

        >

            <Backdrop sx={{ position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: (theme) => theme.zIndex.drawer + 1, top: 0, left: 0 }} open={props.load}>
                <CircularProgress color="primary" />
            </Backdrop>






            <ReactCardFlip isFlipped={isFlipped} infinite={true} flipSpeedFrontToBack={0.9} flipSpeedBackToFront={0.9} flipDirection="horizontal" containerStyle={{ height: `${boxHeight}px`, overflowY: `${overflow}`, overflowX: 'hidden' }}>



                <Box key="front" ref={(el) => (cardRef.current.front = el)} sx={{ position: "relative" }}>




                    <DialogTitle sx={{ fontSize: "32px", fontWeight: "500" }} id="draggable-dialog-title">

                        {device ? (device.id ? strings.editDevice : strings.new + ' ' + strings.device) : <Skeleton sx={{ width: '250px' }} variant="text" />}

                        <Divider sx={{ backgroundColor: "#656565", mt: 1 }} />
                    </DialogTitle>





                    <DialogContent sx={{ mt: 2, overflowY: "unset" }}>
                        <Box >

                            {device ? (

                                <Box component={'form'} sx={{ display: 'flex', flexDirection: 'column' }}>



                                    <Grid container>
                                        <Grid item xs={4} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                            <Typography sx={{ fontSize: "14px", color: "red", fontWeight: "400", paddingRight: "5px" }}>*</Typography>
                                            <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.name}</InputLabel>

                                        </Grid>
                                        <Grid item xs={8} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                                <TextField
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    required
                                                    value={device.name || ''}
                                                    onChange={event => {

                                                        setDevice(prevState => ({
                                                            ...prevState,
                                                            name: event.target.value
                                                        }));
                                                    }}
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
                                        <Grid item xs={4} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                            <Typography sx={{ fontSize: "14px", color: "red", fontWeight: "400" }}>*</Typography>
                                            <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="autocomplete-data-logger">{strings.dataLogger}</InputLabel>
                                        </Grid>
                                        <Grid item xs={8} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                                <Autocomplete
                                                    options={[
                                                        { id: 'none', name: strings.newOptionDataLogger },
                                                        ...moreInfoData['dataLogger']
                                                    ]}

                                                    getOptionLabel={(option) => option.name}
                                                    renderOption={(props, option) => {
                                                        const { key, ...rest } = props;
                                                        return (
                                                            <li key={key} {...rest}>
                                                                <Box sx={{ width: "100%", display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                                                    {option.name}

                                                                    <IconButton color="primary" sx={{ '&:hover': { backgroundColor: "inherit" } }}>
                                                                        {option.id === 'none' ? (
                                                                            <Add sx={{ padding: 0, '&:hover': { backgroundColor: "inherit" } }} />
                                                                        ) : ""}
                                                                    </IconButton>
                                                                </Box>
                                                            </li>
                                                        );
                                                    }}
                                                    onChange={(event, newValue) => {
                                                        if (newValue && newValue.id === 'none') {
                                                            props.setAlert(prevState => ({ ...prevState, message: '', hide: 0, severity: '' }));
                                                            setNewElement((prev) => ({ ...prev, dataLogger: !prev.dataLogger }))
                                                            setIsFlipped(prevIsFlipped => !prevIsFlipped);
                                                            readHeightBack();
                                                            setOverflow('hidden');
                                                        } else {

                                                            setDevice(prevDevice => ({
                                                                ...prevDevice,
                                                                dataLoggerId: newValue ? newValue.id : '',
                                                            }));
                                                        }
                                                    }}
                                                    sx={{
                                                        '& .MuiInputBase-root': {
                                                            padding: 0,
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField {...params} id="autocomplete-data-logger" variant="outlined" required InputLabelProps={{ shrink: true }} inputProps={{ ...params.inputProps, sx: { height: "32px", boxSizing: 'border-box', padding: 0, pl: 1 } }} />
                                                    )}
                                                    value={moreInfoData['dataLogger'].find(item => item.id === (device?.dataLoggerId || null)) || null}
                                                />
                                            </FormControl>
                                        </Grid>

                                    </Grid>


                                    <Grid container sx={{ mt: 2 }}>
                                        <Grid item xs={4} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                            <Typography sx={{ fontSize: "14px", color: "red", fontWeight: "400", paddingRight: "5px" }}>*</Typography>
                                            <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="autocomplete-device-type">{strings.deviceModel}</InputLabel>
                                        </Grid>
                                        <Grid item xs={8} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                                <Autocomplete
                                                    options={[
                                                        { id: 'none', model: strings.newOptionDeviceType },
                                                        ...moreInfoData['devicesType']
                                                    ]}
                                                    getOptionLabel={(option) => option.model}
                                                    renderOption={(props, option) => {
                                                        const { key, ...rest } = props;
                                                        return (
                                                            <li key={key} {...rest}>
                                                                <Box sx={{ width: "100%", display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                                                    {option.model}
                                                                    <IconButton color="primary" sx={{ '&:hover': { backgroundColor: "inherit" } }} >
                                                                        {option.id === 'none' && (
                                                                            <Add sx={{ padding: 0, '&:hover': { backgroundColor: "inherit" } }} />
                                                                        )}
                                                                    </IconButton>
                                                                </Box>
                                                            </li>
                                                        );
                                                    }}

                                                    onChange={(event, newValue) => {
                                                        if (newValue && newValue.id === 'none') {
                                                            setNewElement((prev) => ({ ...prev, deviceType: !prev.deviceType }))
                                                            setIsFlipped(prevIsFlipped => !prevIsFlipped);
                                                            readHeightBack();
                                                            props.setAlert(prevState => ({ ...prevState, message: '', hide: 0, severity: '' }));
                                                            setOverflow('hidden');
                                                        } else {

                                                            setDevice(prevDevice => ({
                                                                ...prevDevice,
                                                                deviceType: {
                                                                    ...prevDevice.deviceType,
                                                                    id: newValue ? newValue.id : '',
                                                                }
                                                            }));

                                                        }
                                                    }}
                                                    sx={{
                                                        '& .MuiInputBase-root': {
                                                            padding: 0,
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField {...params} id="autocomplete-device-type" variant="outlined" required InputLabelProps={{ shrink: true }} inputProps={{ ...params.inputProps, sx: { height: "32px", boxSizing: 'border-box', padding: 0, pl: 1 } }} />
                                                    )}
                                                    value={moreInfoData['devicesType'].find(item => item.id === (device?.deviceType?.id || null)) || null}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                    <Grid container sx={{ mt: 2 }}>
                                        <Grid item xs={4} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                            <Typography sx={{ fontSize: "14px", color: "red", fontWeight: "400", paddingRight: "5px" }}>*</Typography>
                                            <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="byteOrder">{strings.protocol}</InputLabel>
                                        </Grid>
                                        <Grid item xs={8} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                                <Select
                                                    variant="outlined"
                                                    labelId="byte-order-select-label"
                                                    id="byte-order-select"
                                                    value={device.protocol || ''}
                                                    required
                                                    onChange={event => { setDevice(prevDevice => ({ ...prevDevice, protocol: event.target.value })) }}

                                                    sx={{ height: "32px", padding: 0, pl: 1 }}
                                                >

                                                    <MenuItem value={"TCP"}>TCP</MenuItem>
                                                    <MenuItem value={"RTU"}>RTU</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>



                                    <Grid container sx={{ mt: 2 }}>
                                        <Grid item xs={4} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                            <Typography sx={{ fontSize: "14px", color: "red", fontWeight: "400", paddingRight: "5px" }}>*</Typography>
                                            <InputLabel disabled={device.protocol !== 'TCP' && true} sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="autocomplete-device-interface">{strings.deviceInterface}</InputLabel>
                                        </Grid>
                                        <Grid item xs={8} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                                <Autocomplete
                                                    options={[
                                                        { id: 'none', name: strings.newOptionDeviceInterface },
                                                        ...moreInfoData['devicesInterface']
                                                    ]}
                                                    getOptionLabel={(option) => option.name}
                                                    renderOption={(props, option) => {
                                                        const { key, ...rest } = props;
                                                        return (
                                                            <li key={key} {...rest}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", width: "100%" }}>
                                                                    {option.name}
                                                                    <IconButton color="primary" sx={{ '&:hover': { backgroundColor: "inherit" } }}
                                                                    >
                                                                        {option.id === 'none' && (
                                                                            <Add sx={{ padding: 0, '&:hover': { backgroundColor: "inherit" } }} />
                                                                        )}
                                                                    </IconButton>
                                                                </Box>
                                                            </li>
                                                        );
                                                    }}
                                                    disabled={device.protocol !== 'TCP' && true}

                                                    onChange={(event, newValue) => {
                                                        if (newValue && newValue.id === 'none') {
                                                            setNewElement((prev) => ({ ...prev, deviceInterface: !prev.deviceInterface }))
                                                            setIsFlipped(prevIsFlipped => !prevIsFlipped);
                                                            readHeightBack();
                                                            props.setAlert(prevState => ({ ...prevState, message: '', hide: 0, severity: '' }));
                                                            setOverflow('hidden');
                                                        } else {


                                                            setDevice(prevDevice => ({
                                                                ...prevDevice,
                                                                deviceInterfaceId: newValue ? newValue.id : '',
                                                            }));


                                                        }
                                                    }}
                                                    sx={{ '& .MuiInputBase-root': { padding: 0 } }}

                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            id="autocomplete-device-interface"
                                                            variant="outlined"
                                                            required
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            inputProps={{
                                                                ...params.inputProps,
                                                                sx: {
                                                                    padding: 0,
                                                                    height: "32px",
                                                                    pl: 1,
                                                                    boxSizing: 'border-box',
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                    value={moreInfoData['devicesInterface'].find(item => item.id === (device?.deviceInterfaceId || null)) || null}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>



                                    <Grid container sx={{ mt: 2 }}>
                                        <Grid item xs={4} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                            <Typography sx={{ fontSize: "14px", color: "red", fontWeight: "400", paddingRight: "5px" }}>*</Typography>
                                            <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="txtName">{strings.unitId}</InputLabel>

                                        </Grid>
                                        <Grid item xs={8} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                                <TextField
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    value={device.unitId || ''}
                                                    required
                                                    onChange={event => { setDevice(prevDevice => ({ ...prevDevice, unitId: event.target.value })) }}



                                                    inputProps={{ sx: { height: "32px", padding: 0, pl: 1 } }}

                                                />


                                            </FormControl>
                                        </Grid>

                                    </Grid>


                                    <Grid container sx={{ mt: 2 }}>
                                        <Grid item xs={4} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                            <Typography sx={{ fontSize: "14px", color: "red", fontWeight: "400", paddingRight: "5px" }}>*</Typography>
                                            <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="byteOrder">{strings.byteOrder}</InputLabel>
                                        </Grid>
                                        <Grid item xs={8} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                                <Select
                                                    variant="outlined"
                                                    labelId="byte-order-select-label"
                                                    id="byte-order-select"
                                                    value={device.byteOrder || ''}
                                                    required
                                                    onChange={event => { setDevice(prevDevice => ({ ...prevDevice, byteOrder: event.target.value })) }}

                                                    sx={{ height: "32px", padding: 0, pl: 1 }}
                                                >

                                                    <MenuItem value={"BE"}>BIG ENDIAN</MenuItem>
                                                    <MenuItem value={"LE"}>LITTLE ENDIAN</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>


                                    <Grid container sx={{ mt: 2 }}>
                                        <Grid item xs={4} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                            <Typography sx={{ fontSize: "14px", color: "red", fontWeight: "400", paddingRight: "5px" }}>*</Typography>
                                            <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="wordOrder">{strings.wordOrder}</InputLabel>
                                        </Grid>
                                        <Grid item xs={8} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                                <Select
                                                    variant="outlined"
                                                    labelId="word-order-select-label"
                                                    id="word-order-select"
                                                    value={device.wordOrder || ''}
                                                    required
                                                    onChange={event => { setDevice(prevDevice => ({ ...prevDevice, wordOrder: event.target.value })) }}

                                                    sx={{ height: "32px", padding: 0, pl: 1 }}
                                                >

                                                    <MenuItem value={"BE"}>BIG ENDIAN</MenuItem>
                                                    <MenuItem value={"LE"}>LITTLE ENDIAN</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>


                                    <Grid container sx={{ mt: 2 }}>
                                        <Grid item xs={4} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                            <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="txtName">{strings.pollingPeriod}</InputLabel>
                                        </Grid>
                                        <Grid item xs={8} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                                <TextField
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    value={device.pollingPeriod || ''}
                                                    required
                                                    type="number"
                                                    onChange={event => { setDevice(prevDevice => ({ ...prevDevice, pollingPeriod: event.target.value })) }}

                                                    inputProps={{ min: 1, sx: { height: "32px", padding: 0, pl: 1 } }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <span style={{ fontWeight: 'bold' }}>s</span>
                                                            </InputAdornment>
                                                        ),
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
                                                    value={device.description || ''}
                                                    required
                                                    multiline
                                                    rows={2}
                                                    onChange={event => {
                                                        setDevice({ ...device, description: event.target.value })
                                                    }}

                                                    inputProps={{ sx: { height: "32px", padding: 0 } }}

                                                />


                                            </FormControl>
                                        </Grid>

                                    </Grid>


                                    <Grid container sx={{ mt: 2 }}>
                                        <Grid item xs={4} sx={{ display: "flex", justifyContent: "end", alignItems: 'center', padding: 0 }}>
                                            <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="txtName">{strings.status}</InputLabel>

                                        </Grid>
                                        <Grid item xs={8} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                                <FormControlLabel control={<Switch
                                                    checked={device.enabled === '1'}
                                                    onChange={() => {

                                                        setDevice(prevDevice => ({
                                                            ...prevDevice,
                                                            enabled: prevDevice.enabled === '1' ? '0' : '1'
                                                        }));
                                                    }}
                                                />} label="Enabled" />


                                            </FormControl>
                                        </Grid>

                                    </Grid>



                                </Box>
                            ) : <Skeleton variant="text" />}
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button sx={{ width: '100%', textTransform: "none", fontSize: "16px", fontFamily: "Inter", fontWeight: "400" }} variant="outlined" onClick={() => { props.setAlert(prevState => ({ ...prevState, message: '', hide: 0, severity: '' })); onClose() }}>{strings.discard}</Button>


                        <Button onClick={() => { handleSendData() }} sx={{ width: '100%', textTransform: "none", fontSize: "16px", fontFamily: "Inter", fontWeight: "400" }} variant="contained" color="primary">

                            {device ? (device.id ? strings.applyChange : strings.create) : ''}

                        </Button>
                    </DialogActions>


                </Box>


                <Box key="back" ref={(el) => (cardRef.current.back = el)}>
                    {newElement.deviceType ? (

                        <Box ref={(el) => (boxRefs.current.deviceType = el)}>



                            <DialogTitle sx={{ fontSize: "32px", fontWeight: "500" }} id="draggable-dialog-title">
                                {createElement.deviceType ? (createElement.deviceType.id ? "Edit info" : strings.new + " " + strings.devicemodel) : <Skeleton sx={{ width: '250px' }} variant="text" />}

                                <Divider sx={{ backgroundColor: "#656565", mt: 1 }} />
                            </DialogTitle>

                            <DialogContent sx={{ mt: 2 }}>
                                <Box sx={{ height: '100%', overflowY: 'hidden' }}>

                                    {createElement.deviceType ? (

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
                                                            value={createElement.deviceType.model}
                                                            onChange={(event) => {
                                                                setCreateElement((prev) => ({
                                                                    ...prev,
                                                                    deviceType: {
                                                                        ...prev.deviceType,
                                                                        model: event.target.value,
                                                                    },
                                                                }));
                                                            }}
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
                                                            value={createElement.deviceType.manufacturer}
                                                            required
                                                            onChange={(event) => {
                                                                setCreateElement((prev) => ({
                                                                    ...prev,
                                                                    deviceType: {
                                                                        ...prev.deviceType,
                                                                        manufacturer: event.target.value,
                                                                    },
                                                                }));
                                                            }}
                                                            inputProps={{ sx: { height: "32px", padding: 0, pl: 1 } }}

                                                        />


                                                    </FormControl>
                                                </Grid>

                                            </Grid>


                                            <Grid container sx={{ mt: 2 }}>
                                                <Grid item xs={4} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                                    <Typography sx={{ fontSize: "14px", color: "red", fontWeight: "400", paddingRight: "5px" }}>*</Typography>
                                                    <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="txtName">{strings.firmwareRev}</InputLabel>

                                                </Grid>
                                                <Grid item xs={8} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                                        <TextField
                                                            id="outlined-basic"
                                                            variant="outlined"
                                                            value={createElement.deviceType.firmwareRev}
                                                            required
                                                            onChange={(event) => {
                                                                setCreateElement((prev) => ({
                                                                    ...prev,
                                                                    deviceType: {
                                                                        ...prev.deviceType,
                                                                        firmwareRev: event.target.value,
                                                                    },
                                                                }));
                                                            }}
                                                            inputProps={{ sx: { height: "32px", padding: 0, pl: 1 } }}

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
                                                            value={createElement.deviceType.description}
                                                            onChange={(event) => {
                                                                setCreateElement((prev) => ({
                                                                    ...prev,
                                                                    deviceType: {
                                                                        ...prev.deviceType,
                                                                        description: event.target.value,
                                                                    },
                                                                }));
                                                            }}

                                                            inputProps={{ sx: { height: "32px", padding: 0, pl: 1 } }}

                                                        />


                                                    </FormControl>
                                                </Grid>

                                            </Grid>


                                            <Stack spacing={3} direction={'row'} sx={{ marginTop: "120px" }} >
                                                <Button sx={{ width: '100%', textTransform: "none", fontSize: "16px", fontFamily: "Inter", fontWeight: "400" }} variant="outlined" onClick={() => {
                                                    setIsFlipped(prevIsFlipped => !prevIsFlipped);
                                                    readHeightFront();
                                                    setNewElement((prev) => ({ ...prev, deviceType: !prev.deviceType }))
                                                    props.setAlert(prevState => ({
                                                        ...prevState,
                                                        message: '',
                                                        hide: 0,
                                                        severity: ''
                                                    }));
                                                    setCreateElement((prev) => ({ ...prev, deviceType: {} }))
                                                    setOverflow('auto');


                                                }}>{strings.discard}</Button>
                                                <Button onClick={async () => { await sendNewDeviceType() }} sx={{ width: '100%', textTransform: "none", fontSize: "16px", fontFamily: "Inter", fontWeight: "400" }} variant="contained" color="primary">
                                                    {createElement.deviceType ? (createElement.deviceType.id ? strings.applyChange : strings.create) : ''}

                                                </Button>
                                            </Stack>


                                        </Box>

                                    ) : <Skeleton variant="text" />}

                                </Box>
                            </DialogContent>

                        </Box>

                    ) : newElement.dataLogger ? (

                        <Box ref={(el) => (boxRefs.current.dataLogger = el)}>



                            <DialogTitle sx={{ fontSize: "32px", fontWeight: "500" }} id="draggable-dialog-title">
                                {createElement.cpu ? strings.new + ' ' + strings.datalogger : <Skeleton sx={{ width: '250px' }} variant="text" />}

                                <Divider sx={{ backgroundColor: "#656565", mt: 1 }} />
                            </DialogTitle>

                            <DialogContent sx={{ mt: 2 }}>
                                <Box sx={{ height: '100%', overflowY: 'hidden' }}>

                                    {createElement.cpu ? (

                                        <Box component={'form'} sx={{ display: 'flex', flexDirection: 'column' }}>


                                            <Grid container>
                                                <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                                    <Typography sx={{ fontSize: "14px", color: "red", fontWeight: "400", paddingRight: "5px" }}>*</Typography>
                                                    <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.name}</InputLabel>

                                                </Grid>
                                                <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                                        <TextField
                                                            id="outlined-basic"
                                                            variant="outlined"
                                                            required
                                                            value={createElement.cpu.name}

                                                            onChange={(event) => {
                                                                setCreateElement((prev) => ({
                                                                    ...prev,
                                                                    cpu: {
                                                                        ...prev.cpu,
                                                                        name: event.target.value,
                                                                    },
                                                                }));
                                                            }}


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
                                                <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                                    <Typography sx={{ fontSize: "14px", color: "red", fontWeight: "400", paddingRight: "5px" }}>*</Typography>
                                                    <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{strings.host}</InputLabel>

                                                </Grid>
                                                <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                                        <TextField
                                                            id="outlined-basic"
                                                            variant="outlined"
                                                            value={createElement.cpu.host}
                                                            required

                                                            onChange={(event) => {
                                                                setCreateElement((prev) => ({
                                                                    ...prev,
                                                                    cpu: {
                                                                        ...prev.cpu,
                                                                        host: event.target.value,
                                                                    },
                                                                }));
                                                            }}
                                                            inputProps={{ sx: { height: "32px", padding: 0, pl: 1 } }}

                                                        />


                                                    </FormControl>
                                                </Grid>

                                            </Grid>

                                            <Grid container sx={{ mt: 2 }}>
                                                <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                                    <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="txtName">{strings.location}</InputLabel>

                                                </Grid>
                                                <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                                        <TextField
                                                            id="outlined-basic"
                                                            variant="outlined"
                                                            required
                                                            value={createElement.cpu.location}
                                                            onChange={(event) => {
                                                                setCreateElement((prev) => ({
                                                                    ...prev,
                                                                    cpu: {
                                                                        ...prev.cpu,
                                                                        location: event.target.value,
                                                                    },
                                                                }));
                                                            }}
                                                            inputProps={{ sx: { height: "32px", padding: 0, pl: 1 } }}

                                                        />


                                                    </FormControl>
                                                </Grid>

                                            </Grid>



                                            <Grid container sx={{ mt: 2 }}>
                                                <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'flex-start', padding: 0 }}>
                                                    <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="txtName">{strings.description}</InputLabel>

                                                </Grid>
                                                <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                                        <TextField
                                                            id="outlined-basic"
                                                            variant="outlined"
                                                            value={createElement.cpu.description}
                                                            multiline
                                                            rows={2}
                                                            onChange={(event) => {
                                                                setCreateElement((prev) => ({
                                                                    ...prev,
                                                                    cpu: {
                                                                        ...prev.cpu,
                                                                        description: event.target.value,
                                                                    },
                                                                }));
                                                            }}
                                                            inputProps={{ sx: { height: "32px", padding: 0 } }}

                                                        />


                                                    </FormControl>
                                                </Grid>

                                            </Grid>

                                            <Grid container sx={{ mt: 2 }}>
                                                <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", alignItems: 'center', padding: 0 }}>
                                                    <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400", color: "#000000E0" }} htmlFor="txtName">{strings.status}</InputLabel>

                                                </Grid>
                                                <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                                        <FormControlLabel control={

                                                            <Switch checked={createElement.cpu.enabled === '1'}
                                                                onChange={(event) => {
                                                                    setCreateElement((prev) => ({
                                                                        ...prev,
                                                                        cpu: {
                                                                            ...prev.cpu,
                                                                            enabled: createElement.cpu.enabled === '1' ? '0' : '1'
                                                                        },
                                                                    }));
                                                                }}

                                                            />} label="Enabled" />

                                                    </FormControl>
                                                </Grid>

                                            </Grid>

                                            <Stack spacing={3} direction={'row'} sx={{ marginTop: "100px" }} >
                                                <Button sx={{ width: '100%', textTransform: "none", fontSize: "16px", fontFamily: "Inter", fontWeight: "400" }} variant="outlined" onClick={() => {
                                                    setIsFlipped(prevIsFlipped => !prevIsFlipped);
                                                    readHeightFront();
                                                    setNewElement((prev) => ({ ...prev, dataLogger: !prev.dataLogger }))
                                                    setCreateElement((prev) => ({ ...prev, cpu: {} }))


                                                    props.setAlert(prevState => ({
                                                        ...prevState,
                                                        message: '',
                                                        hide: 0,
                                                        severity: ''
                                                    }));
                                                    setOverflow('auto');
                                                }}>{strings.discard}</Button>
                                                <Button onClick={async () => { await sendNewDataLogger() }} sx={{ width: '100%', textTransform: "none", fontSize: "16px", fontFamily: "Inter", fontWeight: "400" }} variant="contained" color="primary">
                                                    {createElement.cpu ? (createElement.cpu.id ? strings.applyChange : strings.create) : ''}

                                                </Button>
                                            </Stack>


                                        </Box>

                                    ) : <Skeleton variant="text" />}

                                </Box>
                            </DialogContent>

                        </Box>

                    ) : newElement.deviceInterface ? (

                        <Box ref={(el) => (boxRefs.current.deviceInterface = el)}>

                            <DialogTitle sx={{ fontSize: "32px", fontWeight: "500" }} id="draggable-dialog-title">
                                {createElement.deviceInterface ? (createElement.deviceInterface.id ? strings.editDeviceInterface : strings.new + " " + strings.deviceinterface) : <Skeleton sx={{ width: '250px' }} variant="text" />}

                                <Divider sx={{ mt: 1, backgroundColor: "#656565" }} />
                            </DialogTitle>
                            <DialogContent sx={{ mt: 2 }}>
                                <Box sx={{ height: '100%', overflowY: 'hidden' }}>
                                    {createElement.deviceInterface ? (
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
                                                            value={createElement.deviceInterface.name}
                                                            onChange={(event) => {
                                                                setCreateElement((prev) => ({
                                                                    ...prev,
                                                                    deviceInterface: {
                                                                        ...prev.deviceInterface,
                                                                        name: event.target.value,
                                                                    },
                                                                }));
                                                            }}
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
                                                            value={createElement.deviceInterface.host}
                                                            required
                                                            onChange={(event) => {
                                                                setCreateElement((prev) => ({
                                                                    ...prev,
                                                                    deviceInterface: {
                                                                        ...prev.deviceInterface,
                                                                        host: event.target.value,
                                                                    },
                                                                }));
                                                            }}
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
                                                            value={createElement.deviceInterface.port}
                                                            onChange={(event) => {
                                                                setCreateElement((prev) => ({
                                                                    ...prev,
                                                                    deviceInterface: {
                                                                        ...prev.deviceInterface,
                                                                        port: event.target.value,
                                                                    },
                                                                }));
                                                            }}
                                                            inputProps={{ sx: { height: "32px", padding: 0, pl: 1 } }}

                                                        />


                                                    </FormControl>
                                                </Grid>

                                            </Grid>


                                            <Stack spacing={3} direction={'row'} sx={{ marginTop: "100px" }} >
                                                <Button sx={{ width: '100%', textTransform: "none", fontSize: "16px", fontFamily: "Inter", fontWeight: "400" }} variant="outlined" onClick={() => {
                                                    setIsFlipped(prevIsFlipped => !prevIsFlipped);
                                                    readHeightFront();
                                                    setNewElement((prev) => ({ ...prev, deviceInterface: !prev.deviceInterface }))
                                                    setCreateElement((prev) => ({ ...prev, deviceInterface: {} }))
                                                    props.setAlert(prevState => ({
                                                        ...prevState,
                                                        message: '',
                                                        hide: 0,
                                                        severity: ''
                                                    }));
                                                    setOverflow('auto');
                                                }}>{strings.discard}</Button>
                                                <Button onClick={async () => { await sendNewDeviceInterface() }} sx={{ width: '100%', textTransform: "none", fontSize: "16px", fontFamily: "Inter", fontWeight: "400" }} variant="contained" color="primary">
                                                    {createElement.deviceInterface ? (createElement.deviceInterface.id ? strings.applyChange : strings.create) : ''}

                                                </Button>
                                            </Stack>



                                        </Box>
                                    ) : <Skeleton variant="text" />}
                                </Box>
                            </DialogContent>







                        </Box>

                    ) : (
                        <Box></Box>
                    )}

                </Box>

            </ReactCardFlip>

        </Dialog>



    )
}