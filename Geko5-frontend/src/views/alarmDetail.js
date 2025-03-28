import { Box, FormControl, InputLabel, TextField, Backdrop, CircularProgress, MenuItem, Select, Autocomplete, IconButton, Typography, Button, InputAdornment, Icon } from "@mui/material";
import React, { useEffect, useState } from "react";

import { strings } from "../strings";
import ServerProxy from "../tools/serverProxy";
import useWindowSize from "../components/useWindowSize";
import { AddCircleOutline, ArrowBack, Delete, Edit, ExitToApp, RemoveCircleOutline, Save } from "@mui/icons-material";
import config from "../config";
import { Link as LinkRouter, useParams } from 'react-router-dom';
import HeaderPage from "../components/headerPage";

const AND_OPERATOR = '$and'
const OR_OPERATOR = '$or'

export default function AlarmDetail(props) {

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Variables 
    const { id } = useParams(); // Ottieni l'ID dall'URL

    const [alarm, setAlarm] = useState({});
    const [booleanOperator, setBooleanOperator] = useState([AND_OPERATOR]);
    const [devices, setDevices] = useState({});
    const [devicesType, setDevicesType] = useState({});
    const [loadAxios, setLoadAxios] = useState(false);
    const [loading, setLoading] = useState(false); // Stato per il caricamento
    const [redirect, setRedirect] = useState(false);
    const windowSize = useWindowSize();
    const [arrayObjectSignal, setArrayObjectSignal] = useState([]);
    const [condition_dev, setCondition_dev] = useState([]);





    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Functions 


    const handleSendAlarm = async () => {

        try {



            const hasPlaceholder = condition_dev.some((item) => {
                const checkNestdRow = Object.keys(item).find(key => key == 'assetCategory');
                if (checkNestdRow != undefined) {
                    const assetCategory = item.assetCategory;
                    const device_and_signal = Object.keys(item).find(key => key !== 'assetCategory');
                    const [device, signal] = device_and_signal.split('.');

                    const operator_condition = Object.keys(item[device_and_signal])[0];
                    const value_condition = item[device_and_signal][operator_condition];


                    if (
                        device === 'placeholder' ||
                        assetCategory === 'placeholder' ||
                        signal === 'placeholder' ||
                        operator_condition === 'placeholder' ||
                        value_condition === 'placeholder'
                    ) {
                        return true;
                    }
                    return false;
                } else {

                    const arrayCondition = Object.values(item)[0];

                    const hasPlaceholder = arrayCondition.some((item) => {
                        const assetCategory = item.assetCategory;
                        const device_and_signal = Object.keys(item).find(key => key !== 'assetCategory');
                        const [device, signal] = device_and_signal.split('.');

                        const operator_condition = Object.keys(item[device_and_signal])[0];
                        const value_condition = item[device_and_signal][operator_condition];


                        if (
                            device === 'placeholder' ||
                            assetCategory === 'placeholder' ||
                            signal === 'placeholder' ||
                            operator_condition === 'placeholder' ||
                            value_condition === 'placeholder'
                        ) {
                            return true;
                        }
                        return false
                    });

                    return hasPlaceholder;

                }



            });

            if (hasPlaceholder) {


                props.setAlert(prevState => ({
                    ...prevState,
                    message: strings.requiredFields,
                    hide: 1,
                    severity: "error"
                }));

                return
            }




            const objectCondition = { [booleanOperator[0]]: condition_dev }



            const checkCondition = Object.values(objectCondition)[0];

            const isValid = (alarm.name && alarm.severity && alarm.message && checkCondition.length > 0);

            if (!isValid) {
                props.setAlert(prevState => ({
                    ...prevState,
                    message: strings.requiredFields,
                    hide: 1,
                    severity: "error"
                }));
                return -1;
            }


            await ServerProxy.addConfigurationAlarms({
                name: alarm.name,
                active_time: (alarm.activeTimeStamp && alarm.activeTimeStamp),
                deactive_time: (alarm.deactiveTimeStamp && alarm.deactiveTimeStamp),
                message: alarm.message,
                severity: alarm.severity,
                condition: JSON.stringify(objectCondition),
            })

            props.setAlert(prevState => ({
                ...prevState,
                message: strings.status200Operation,
                hide: 1,
                severity: "success"
            }));


            setRedirect(true)

        } catch (error) {

            props.setAlert(prevState => ({
                ...prevState,
                message: error?.response?.data?.message || 'An unknown error occurred',
                hide: 1,
                severity: "error"
            }));

        } finally {
            setLoadAxios(false);
        }
    }

    const handleEditAlarm = async () => {

        try {
            setLoadAxios(true);

            const hasPlaceholder = condition_dev.some((item) => {
                const checkNestdRow = Object.keys(item).find(key => key == 'assetCategory');
                if (checkNestdRow != undefined) {
                    const assetCategory = item.assetCategory;
                    const device_and_signal = Object.keys(item).find(key => key !== 'assetCategory');
                    const [device, signal] = device_and_signal.split('.');

                    const operator_condition = Object.keys(item[device_and_signal])[0];
                    const value_condition = item[device_and_signal][operator_condition];


                    if (
                        device === 'placeholder' ||
                        assetCategory === 'placeholder' ||
                        signal === 'placeholder' ||
                        operator_condition === 'placeholder' ||
                        value_condition === 'placeholder'
                    ) {
                        return true;
                    }
                    return false;
                } else {

                    const arrayCondition = Object.values(item)[0];

                    const hasPlaceholder = arrayCondition.some((item) => {
                        const assetCategory = item.assetCategory;
                        const device_and_signal = Object.keys(item).find(key => key !== 'assetCategory');
                        const [device, signal] = device_and_signal.split('.');

                        const operator_condition = Object.keys(item[device_and_signal])[0];
                        const value_condition = item[device_and_signal][operator_condition];


                        if (
                            device === 'placeholder' ||
                            assetCategory === 'placeholder' ||
                            signal === 'placeholder' ||
                            operator_condition === 'placeholder' ||
                            value_condition === 'placeholder'
                        ) {
                            return true;
                        }
                        return false
                    });

                    return hasPlaceholder;

                }



            });

            if (hasPlaceholder) {


                props.setAlert(prevState => ({
                    ...prevState,
                    message: strings.requiredFields,
                    hide: 1,
                    severity: "error"
                }));

                return
            }



            const objectCondition = { [booleanOperator[0]]: condition_dev }



            const checkCondition = Object.values(objectCondition)[0];



            const isValid = (alarm.name && alarm.severity && alarm.message && checkCondition.length > 0);

            if (!isValid) {
                props.setAlert(prevState => ({
                    ...prevState,
                    message: strings.requiredFields,
                    hide: 1,
                    severity: "error"
                }));
                return -1;
            }



            await ServerProxy.editConfigurationAlarm({
                id: alarm.id,
                name: alarm.name,
                active_time: (alarm.activeTimeStamp && alarm.activeTimeStamp),
                deactive_time: (alarm.deactiveTimeStamp && alarm.deactiveTimeStamp),
                message: alarm.message,
                severity: alarm.severity,
                condition: JSON.stringify(objectCondition),
            })

            props.setAlert(prevState => ({
                ...prevState,
                message: strings.status200Operation,
                hide: 1,
                severity: "success"
            }));


            setRedirect(true)

        } catch (error) {

            props.setAlert(prevState => ({
                ...prevState,
                message: error?.response?.data?.message || 'An unknown error occurred',
                hide: 1,
                severity: "error"
            }));

        } finally {
            setLoadAxios(false);
        }
    }




    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// UseEffect

    useEffect(() => {

        async function loadDevices() {


            try {

                const data = await ServerProxy.getDevices();
                setDevices(data);

            } catch (error) {

                setDevices(undefined);

                if (error?.message) {
                    if (error?.code === 'ERR_NETWORK') {
                        console.log(error.code);

                    }
                }


            }


        }


        async function loadDevicesType() {


            try {

                const data = await ServerProxy.getDevicesType();
                setDevicesType(data);

            } catch (error) {

                setDevicesType(undefined);

                if (error?.message) {
                    if (error?.code === 'ERR_NETWORK') {
                        console.log(error.code);

                    }
                }


            }


        }

        props.setLoadRenderingPage(false)
        loadDevices();
        loadDevicesType();


        if (!id) {
            setCondition_dev(prev => [...prev, { ['placeholder.placeholder']: { placeholder: 'placeholder' }, assetCategory: 'placeholder' }]);

        }



    }, []);


    useEffect(() => {
        const loadAlarm = async () => {
            setLoadAxios(true);
            const arrayOfObject = [];


            const alarm = await ServerProxy.getConfigurationAlarm(id);

            setAlarm((prev) => ({
                ...prev,
                id: alarm.id,
                name: alarm.name,
                severity: alarm.severity,
                message: alarm.message,
                activeTimeStamp: alarm.active_time,
                deactiveTimeStamp: alarm.deactive_time
            }))


            const parsedCondition = JSON.parse(alarm.condition);

            const key = Object.keys(parsedCondition)[0]
            setBooleanOperator([key])
            setCondition_dev(parsedCondition[key])


            setLoadAxios(false);

        }

        if (id) {
            loadAlarm();
        }

        if (redirect) {
            const timer = setTimeout(() => { window.location.replace('/alarmList') }, 1000);
            return () => clearTimeout(timer);
        }



    }, [id, redirect])




    useEffect(() => {
        const getSignal = async () => {

            if (condition_dev) {
                for (const element of condition_dev) {
                    if (element.assetCategory && element.assetCategory !== '#') {

                        const searchSignalPresent = Object.keys(arrayObjectSignal).find(item => item === element.assetCategory);


                        if (!searchSignalPresent && element.assetCategory !== 'placeholder') {

                            try {
                                const signalList = await ServerProxy.getStructuresForIds(element.assetCategory);

                                setArrayObjectSignal(prevState => ({
                                    ...prevState,
                                    [element.assetCategory]: signalList
                                }));

                            } catch (error) {
                                console.log(`Errore nel recupero del segnale per ${element.assetCategory}:`, error);
                            }
                        }
                    }



                    if (element.$and || element.$or) {

                        const array = element.$and
                            ? [...element.$and]
                            : element.$or
                                ? [...element.$or]
                                : [];


                        for (const elementNested of array) {




                            const searchSignalPresent = Object.keys(arrayObjectSignal).find(item => item === elementNested.assetCategory);

                            if (!searchSignalPresent && elementNested.assetCategory !== 'placeholder') {

                                try {
                                    const signalList = await ServerProxy.getStructuresForIds(elementNested.assetCategory);

                                    setArrayObjectSignal(prevState => ({
                                        ...prevState,
                                        [elementNested.assetCategory]: signalList
                                    }));

                                } catch (error) {
                                    console.log(`Errore nel recupero del segnale per ${elementNested.assetCategory}:`, error);
                                }
                            }

                        }



                    }
                }
            }

        }
        getSignal()



    }, [condition_dev])




    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Component 


    return (

        <Box sx={{ height: `calc(${windowSize.height}px - ${config.heightBanner}px);`, display: 'flex', flexDirection: 'column', p: .2 }}>



            <Backdrop sx={{ position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: (theme) => theme.zIndex.drawer + 1, top: 0, left: 0 }} open={loadAxios} >
                <CircularProgress color="primary" />
            </Backdrop>



            <Box sx={{ flexShrink: 0, mb: 2, mt: { sm: 5, lg: 2 } }}>

                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>



                        <HeaderPage title={id ? strings.editAlarm : strings.createalarm} titleTwo={strings.alarmsManagement} />






                        <Box sx={{ display: "flex" }}>





                            {id ? (

                                <Button startIcon={<Edit />} onClick={() => { handleEditAlarm() }} sx={{ height: "32px", backgroundColor: "primary", textTransform: "none", fontSize: "14px", fontWeight: 400, mr: 1, '&:hover': { backgroundColor: "primary", color: (theme) => `${theme.palette.primary.textIntoButton}` } }} variant="contained" >

                                    {strings.edit}

                                </Button>
                            ) : (

                                <Button startIcon={<Save />} onClick={() => { handleSendAlarm() }} sx={{ height: "32px", backgroundColor: "primary", textTransform: "none", fontSize: "14px", fontWeight: 400, mr: 1, '&:hover': { backgroundColor: "primary", color: (theme) => `${theme.palette.primary.textIntoButton}` } }} variant="contained" >

                                    {strings.save}

                                </Button>
                            )}


                            <Button component={LinkRouter} to={`/alarmList`} sx={{ height: "32px", backgroundColor: "primary", textTransform: "none", fontSize: "14px", fontWeight: 400, mr: 1, '&:hover': { backgroundColor: "primary", color: (theme) => `${theme.palette.primary.textIntoButton}` } }} variant="contained" >
                                <ArrowBack />
                            </Button>








                        </Box>

                    </Box>


                </Box>

            </Box>

            <Box sx={{ display: 'flex', flexDirection: "column", background: "white", boxShadow: 3, borderRadius: 1, mr: 1, p: 2, px: 1 }}>

                <Box sx={{ display: "flex" }}>


                    <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pr: 1 }}>
                        <FormControl variant="standard" sx={{ width: "100%" }}>
                            <TextField
                                id="outlined-basic"
                                variant="outlined"
                                label={`${strings.name}*`}
                                value={alarm.name || ''}
                                sx={{
                                    '& .MuiInputLabel-root': {
                                        color: (theme) => theme.palette.primary.main,
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: (theme) => theme.palette.primary.main,
                                    }
                                }}
                                onChange={event => {
                                    setAlarm(prevCondition => ({
                                        ...prevCondition,
                                        name: event.target.value
                                    }));
                                }}
                            />
                        </FormControl>
                    </Box>


                    <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0 }}>
                        <FormControl variant="standard" sx={{ width: "100%" }}>
                            <TextField
                                type="number"
                                id="outlined-basic"
                                variant="outlined"
                                label={strings.activeTimeStamp}
                                value={alarm.activeTimeStamp || ''}
                                sx={{
                                    '& .MuiInputLabel-root': {
                                        color: (theme) => theme.palette.primary.main,
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: (theme) => theme.palette.primary.main,
                                    }
                                }}
                                onChange={event => {
                                    setAlarm(prevCondition => ({
                                        ...prevCondition,
                                        activeTimeStamp: event.target.value
                                    }));
                                }}

                                InputProps={{
                                    min: 0,
                                    step: 1,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <span style={{ fontWeight: 'bold' }}>s</span> {/* Sostituisci con il testo che desideri */}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </FormControl>
                    </Box>


                    <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, px: 1 }}>
                        <FormControl variant="standard" sx={{ width: "100%" }}>
                            <TextField
                                type="number"
                                id="outlined-basic"
                                variant="outlined"
                                label={strings.deactiveTimestamp}
                                value={alarm.deactiveTimeStamp || ''}
                                sx={{
                                    '& .MuiInputLabel-root': {
                                        color: (theme) => theme.palette.primary.main,
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: (theme) => theme.palette.primary.main,
                                    }
                                }}
                                onChange={event => {
                                    setAlarm(prevCondition => ({
                                        ...prevCondition,
                                        deactiveTimeStamp: event.target.value
                                    }));
                                }}
                                InputProps={{
                                    min: 0,
                                    step: 1,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <span style={{ fontWeight: 'bold' }}>s</span> {/* Sostituisci con il testo che desideri */}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </FormControl>
                    </Box>


                    <Box sx={{ width: "40%", display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: 1 }}>
                        <FormControl variant="standard" sx={{ width: "100%" }}>
                            <TextField
                                required
                                type="number"
                                id="outlined-basic"
                                variant="outlined"
                                label={strings.severity}
                                value={alarm.severity || ''}
                                sx={{
                                    '& .MuiInputLabel-root': {
                                        color: (theme) => theme.palette.primary.main,
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: (theme) => theme.palette.primary.main,
                                    }
                                }}
                                onChange={event => {
                                    setAlarm(prevCondition => ({
                                        ...prevCondition,
                                        severity: event.target.value
                                    }));
                                }}

                                inputProps={{
                                    min: 0,
                                    step: 1
                                }}

                            />
                        </FormControl>
                    </Box>


                </Box>


                <Box sx={{ display: "flex" }}>


                    <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0 }}>
                        <FormControl variant="standard" sx={{ width: "100%" }}>
                            <TextField
                                label="Message*"
                                value={alarm.message || ''}
                                onChange={(event) => {
                                    setAlarm((prevCondition) => ({
                                        ...prevCondition,
                                        message: event.target.value,
                                    }));
                                }}
                                multiline
                                rows={3}
                                variant="outlined"
                                placeholder="Enter your message"
                                fullWidth

                                sx={{
                                    marginTop: 2, // Aggiungi spazio sopra il campo
                                    '& .MuiInputLabel-root': {
                                        color: (theme) => `${theme.palette.primary.main}`,
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: (theme) => `${theme.palette.primary.main}`,
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: (theme) => `${theme.palette.primary.main}`,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: (theme) => `${theme.palette.primary.dark}`,
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: (theme) => `${theme.palette.primary.main}`,
                                        },
                                    },
                                }}
                            />
                        </FormControl>
                    </Box>


                </Box>

            </Box>



            <Box component={'form'} sx={{ height: { sm: '52%', md: '50%', lg: '40%', xxl: '45vh' }, display: "flex", my: 4, padding: 0 }}>

                <Box sx={{ width: "100%", height: '100%', maxHeight: '100%', display: "flex", flexDirection: "column", overflowY: "auto", boxShadow: 3, borderRadius: 1, background: "white", mr: 1, my: 1, px: 1 }}>

                    <Box sx={{ width: "fit-content", display: "flex", borderRadius: "16px", backgroundColor: "#e0e0e0", my: 1, p: 0 }}>

                        <IconButton title="Remove all operations" sx={{ display: "block", '&:hover': { backgroundColor: 'transparent' } }} onClick={() => { setCondition_dev([{}]) }}>
                            <RemoveCircleOutline fontSize="small" sx={{ color: "red" }} />
                        </IconButton>



                        <Box sx={{ backgroundColor: "white", alignContent: "center", px: 1 }}>
                            <Select id="byte-order-select" value={booleanOperator[0] || ''} required onChange={event => { setBooleanOperator([event.target.value]) }}>

                                <MenuItem value={AND_OPERATOR}>AND</MenuItem>
                                <MenuItem value={OR_OPERATOR}>OR</MenuItem>

                            </Select>
                        </Box>



                        <IconButton title="New operation" sx={{ display: "block", '&:hover': { backgroundColor: 'transparent' } }} onClick={() => { setCondition_dev(prev => [...prev, { ['placeholder.placeholder']: { placeholder: 'placeholder' }, assetCategory: 'placeholder' }]); }}>
                            <AddCircleOutline fontSize="small" sx={{ color: "green" }} />
                        </IconButton>

                    </Box>


                    <>

                        {condition_dev && condition_dev.map((_, index) => (
                            <Box key={`main-${index}`} >

                                {/*  BLOCK 1  */}
                                {Object.keys(condition_dev[index]).some(item => item === 'assetCategory') && (

                                    <Box sx={{ width: "100%", position: "relative", display: "flex", justifyContent: "space-evenly", mt: 2, p: 1, }}>


                                        <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
                                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                                <Autocomplete
                                                    disablePortal
                                                    options={
                                                        devices && devices.length > 0
                                                            ? [{ id: null, deviceTypeId: '#' }, ...devices]
                                                            : [{ id: null, deviceTypeId: '#' }]
                                                    }

                                                    getOptionLabel={(option) => {
                                                        if (!option) return '';
                                                        if (option.deviceTypeId === '#') return '#';
                                                        return option.name || '';
                                                    }}

                                                    onChange={(event, value) => {

                                                        setCondition_dev(prevCondition_dev => {
                                                            const updatedCondition = [...prevCondition_dev];
                                                            const currentRole = updatedCondition[index];

                                                            if (currentRole) {
                                                                const obj_Key = Object.keys(currentRole).find(item => item !== 'assetCategory');

                                                                const [, rightKey] = obj_Key.split('.');



                                                                const newKey = `${(value) ? (value.deviceTypeId === "#") ? value.deviceTypeId : value.id : 'placeholder'}.${rightKey}`
                                                                const obj_Value = currentRole[obj_Key];

                                                                delete currentRole[obj_Key]

                                                                currentRole[newKey] = obj_Value !== 'placeholder' ? obj_Value : 'placeholder';
                                                                currentRole['assetCategory'] = (value) ? (value.deviceTypeId === '#') ? value.id : value.deviceTypeId : 'placeholder';
                                                            }

                                                            return updatedCondition;
                                                        });


                                                    }}

                                                    isOptionEqualToValue={(option, value) => option.id === value?.id && option.deviceTypeId === value?.deviceTypeId}

                                                    value={
                                                        Array.isArray(devices) && Array.isArray(condition_dev) && condition_dev[index]
                                                            ? (() => {
                                                                const obj_Key = Object.keys(condition_dev[index]).find(item => item !== 'assetCategory');
                                                                if (!obj_Key) return null;
                                                                const [leftKey] = obj_Key.split('.');

                                                                if (leftKey === '#') return { id: null, deviceTypeId: '#' };

                                                                return devices.find(device => device.id === Number(leftKey)) || null;
                                                            })()
                                                            : null
                                                    }


                                                    filterOptions={(options, state) => {
                                                        if (state.inputValue === '#') return ['#'];
                                                        return options;
                                                    }}

                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label={`${strings.Device}*`}
                                                            id="outlined-basic"
                                                            variant="outlined"
                                                            placeholder="Search device"
                                                            sx={{
                                                                borderRadius: 1,
                                                                '& .MuiInputLabel-root': {
                                                                    color: (theme) => `${theme.palette.primary.main}`,
                                                                },
                                                                '& .MuiInputLabel-root.Mui-focused': {
                                                                    color: (theme) => `${theme.palette.primary.main}`,
                                                                },
                                                                '& .MuiInput-underline:before': {
                                                                    borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,
                                                                },
                                                                '& .MuiInput-underline:hover:before': {
                                                                    borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,
                                                                },
                                                                '& .MuiInput-underline:after': {
                                                                    borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`,
                                                                },
                                                            }}
                                                            InputProps={{
                                                                ...params.InputProps,
                                                            }}
                                                        />
                                                    )}

                                                    ListboxProps={{ style: { maxHeight: 150 } }}
                                                />



                                            </FormControl>
                                        </Box>

                                        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", mx: 1 }}>



                                            <Box>

                                                <FormControl variant="standard" sx={{ width: "100%", mr: 2 }}>


                                                    {(() => {
                                                        const obj_Key = Object.keys(condition_dev[index]).find(item => item !== 'assetCategory');
                                                        const [leftKey] = obj_Key.split('.');



                                                        return leftKey !== '#' ? (
                                                            <TextField
                                                                id="outlined-basic"
                                                                variant="outlined"
                                                                label={`${strings.deviceModel}*`}
                                                                value={
                                                                    (condition_dev) ? Array.isArray(devicesType) && Array.isArray(condition_dev) ? devicesType.find((device) => device.id === Number(condition_dev[index]['assetCategory']))?.model || '' : '' : ''
                                                                }
                                                                InputLabelProps={{
                                                                    shrink: (condition_dev[index]['assetCategory'] !== 'placeholder') ? true : false,
                                                                }}
                                                                InputProps={{
                                                                    readOnly: true,
                                                                }}
                                                                sx={{
                                                                    '& .MuiInputLabel-root': {
                                                                        color: (theme) => theme.palette.primary.main,
                                                                    },
                                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                                        color: (theme) => theme.palette.primary.main,
                                                                    }
                                                                }}

                                                            />
                                                        ) : (
                                                            <Autocomplete
                                                                disablePortal
                                                                options={devicesType || []}
                                                                getOptionLabel={(option) => option.model || ''}
                                                                onChange={(event, value) => {


                                                                    setCondition_dev(prevCondition_dev => {
                                                                        const updatedCondition = [...prevCondition_dev];
                                                                        const currentRole = updatedCondition[index];

                                                                        if (currentRole) {
                                                                            currentRole['assetCategory'] = value ? value.id : 'placeholder';
                                                                        }

                                                                        return updatedCondition;
                                                                    });




                                                                    setLoading(true);

                                                                }}
                                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                                value={Array.isArray(devicesType) && Array.isArray(condition_dev) ? devicesType.find((devicesType) => devicesType.id === condition_dev[index]['assetCategory']) || null : null}

                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label={`${strings.deviceModel}*`}
                                                                        id="outlined-basic"
                                                                        variant="outlined"
                                                                        placeholder="Search device model"
                                                                        sx={{
                                                                            borderRadius: 1,
                                                                            '& .MuiInputLabel-root': {
                                                                                color: (theme) => `${theme.palette.primary.main}`,
                                                                            },
                                                                            '& .MuiInputLabel-root.Mui-focused': {
                                                                                color: (theme) => `${theme.palette.primary.main}`,
                                                                            },
                                                                            '& .MuiInput-underline:before': {
                                                                                borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,
                                                                            },
                                                                            '& .MuiInput-underline:hover:before': {
                                                                                borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,
                                                                            },
                                                                            '& .MuiInput-underline:after': {
                                                                                borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`,
                                                                            },
                                                                        }}
                                                                        InputProps={{
                                                                            ...params.InputProps,
                                                                        }}
                                                                    />
                                                                )}
                                                                ListboxProps={{ style: { maxHeight: 150 } }}
                                                            />
                                                        )
                                                    })()}


                                                </FormControl>
                                            </Box>



                                        </Box>

                                        <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, }}>

                                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                                <Autocomplete
                                                    disablePortal
                                                    loading={loading}
                                                    options={(() => {
                                                        if (condition_dev[index]) {
                                                            const obj_Key = Object.keys(condition_dev[index]).find(item => item === 'assetCategory');

                                                            if (!obj_Key) return [];
                                                            const signalArray = arrayObjectSignal[condition_dev[index][obj_Key]]
                                                            return signalArray || []
                                                        } else {
                                                            return [];
                                                        }

                                                    })()}

                                                    isOptionEqualToValue={(option, value) => option.id === value.id}


                                                    getOptionLabel={(option) => option.name || ''}

                                                    onChange={(event, value) => {


                                                        setCondition_dev(prevCondition_dev => {
                                                            const updatedCondition = [...prevCondition_dev];
                                                            const currentRole = updatedCondition[index];

                                                            if (currentRole) {
                                                                const obj_Key = Object.keys(currentRole).find(item => item !== 'assetCategory');
                                                                const [leftKey,] = obj_Key.split('.');
                                                                const newKey = `${leftKey}.${value?.name}`
                                                                const obj_Value = currentRole[obj_Key];

                                                                delete currentRole[obj_Key]

                                                                currentRole[newKey] = obj_Value !== 'placeholder' ? obj_Value : 'placeholder';
                                                            }
                                                            return updatedCondition;
                                                        });



                                                    }}

                                                    value={(() => {

                                                        if (condition_dev[index]) {

                                                            const obj_Key = Object.keys(condition_dev[index]).find((item) => item !== 'assetCategory');

                                                            const [, leftKey] = obj_Key.split('.');
                                                            const obj_Key_obj_Value = condition_dev[index]['assetCategory'];


                                                            if (obj_Key_obj_Value && arrayObjectSignal[obj_Key_obj_Value]) {
                                                                const result = arrayObjectSignal[obj_Key_obj_Value].find(sig => sig.name === leftKey) || null;
                                                                return result;
                                                            }
                                                        }
                                                        return null;

                                                    })()}

                                                    ListboxProps={{ style: { maxHeight: 150 } }}

                                                    renderOption={(props, option) => (
                                                        <li {...props} key={option.id}>
                                                            {option.name}
                                                        </li>
                                                    )}

                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label={`${strings.Signal}*`}
                                                            id="outlined-basic"
                                                            variant="outlined"
                                                            placeholder="Search signal "
                                                            sx={{
                                                                borderRadius: 1,
                                                                '& .MuiInputLabel-root': {
                                                                    color: (theme) => `${theme.palette.primary.main}`,
                                                                },
                                                                '& .MuiInputLabel-root.Mui-focused': {
                                                                    color: (theme) => `${theme.palette.primary.main}`,
                                                                },
                                                                '& .MuiInput-underline:before': {
                                                                    borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,
                                                                },
                                                                '& .MuiInput-underline:hover:before': {
                                                                    borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,
                                                                },
                                                                '& .MuiInput-underline:after': {
                                                                    borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`,
                                                                },
                                                            }}

                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Box>

                                        <Box sx={{ width: "80%", display: "flex", alignItems: "center", mx: 1 }}>

                                            <FormControl variant="outlined" sx={{ width: "100%" }}>

                                                <InputLabel id="byte-order-select-label" sx={{ '&.Mui-focused': { color: (theme) => `${theme.palette.primary.main}` }, color: (theme) => `${theme.palette.primary.main}` }}>
                                                    {strings.operator}*
                                                </InputLabel>
                                                <Select
                                                    labelId="byte-order-select-label"
                                                    id="byte-order-select"
                                                    value={(() => {

                                                        if (condition_dev[index]) {

                                                            const obj_Key = Object.keys(condition_dev[index]).find((item) => item !== 'assetCategory');
                                                            const obj_value = condition_dev[index][obj_Key]

                                                            const obj_value_obj_value = Object.keys(obj_value)[0]



                                                            return obj_value_obj_value === 'placeholder' ? '' : obj_value_obj_value;


                                                        } else {

                                                            return '';
                                                        }

                                                    })()}


                                                    required
                                                    onChange={event => {


                                                        setCondition_dev(prevCondition_dev => {
                                                            const updatedCondition = [...prevCondition_dev];
                                                            const currentRole = updatedCondition[index];

                                                            if (currentRole) {
                                                                const obj_Key = Object.keys(currentRole).find(item => item !== 'assetCategory');
                                                                const obj_Value = currentRole[obj_Key];
                                                                const obj_Value_obj_Value = Object.values(obj_Value)[0];

                                                                const newValue = { [event.target.value]: obj_Value_obj_Value !== 'placeholder' ? obj_Value_obj_Value : 'placeholder' }



                                                                delete currentRole[obj_Key]

                                                                currentRole[obj_Key] = newValue;
                                                            }

                                                            return updatedCondition;
                                                        });




                                                    }}
                                                    label="Operatore"

                                                >

                                                    <MenuItem value={'$lt'}>{'<'}</MenuItem>
                                                    <MenuItem value={'$eq'}>{'='}</MenuItem>
                                                    <MenuItem value={'$ne'}>{'!='}</MenuItem>
                                                    <MenuItem value={'$gt'}>{'>'}</MenuItem>
                                                    <MenuItem value={'$lte'}>{'=<'}</MenuItem>
                                                    <MenuItem value={'$gte'}>{'>='}</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>

                                        <Box sx={{ width: "80%", display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0 }}>
                                            <FormControl variant="standard" sx={{ width: "100%" }}>
                                                <TextField
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    label={`${strings.value}*`}

                                                    value={(() => {

                                                        if (condition_dev[index]) {

                                                            const obj_Key = Object.keys(condition_dev[index]).find((item) => item !== 'assetCategory');
                                                            const obj_value = condition_dev[index][obj_Key]
                                                            const obj_Value_obj_Value = obj_value[Object.keys(obj_value)[0]]

                                                            return obj_Value_obj_Value === 'placeholder' ? '' : obj_Value_obj_Value;


                                                        } else {
                                                            return '';
                                                        }

                                                    })()}
                                                    sx={{
                                                        '& .MuiInputLabel-root': {
                                                            color: (theme) => theme.palette.primary.main,
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': {
                                                            color: (theme) => theme.palette.primary.main,
                                                        }
                                                    }}
                                                    onChange={event => {


                                                        setCondition_dev(prevCondition_dev => {
                                                            const updatedCondition = [...prevCondition_dev];
                                                            const currentRole = updatedCondition[index];

                                                            if (currentRole) {
                                                                const obj_Key = Object.keys(currentRole).find(item => item !== 'assetCategory');
                                                                const obj_Value = currentRole[obj_Key];
                                                                const obj_Key_obj_Key = Object.keys(obj_Value)[0];


                                                                delete currentRole[obj_Key]
                                                                currentRole[obj_Key] = { [obj_Key_obj_Key]: event.target.value };
                                                            }

                                                            return updatedCondition;
                                                        });


                                                    }}
                                                />
                                            </FormControl>
                                        </Box>

                                        <Box sx={{ display: "flex" }}>


                                            <IconButton title="Delete" onClick={() => {
                                                setCondition_dev(prevCondition_dev => {
                                                    const updatedCondition = [...prevCondition_dev];
                                                    updatedCondition.splice(index, 1);

                                                    return updatedCondition;
                                                });
                                            }} sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                                                <Delete />

                                            </IconButton>

                                            <IconButton title="New nested operation"
                                                onClick={() => {

                                                    const currentRecord = condition_dev[index];

                                                    const objKey = Object.keys(currentRecord).find(item => item !== 'assetCategory');
                                                    const [leftKey, rightKey] = objKey.split('.');
                                                    const objValue = currentRecord[objKey];
                                                    const obj_obj_key = Object.keys(objValue)[0]



                                                    const isValid = (
                                                        leftKey !== 'placeholder' &&
                                                        rightKey !== 'placeholder' &&
                                                        obj_obj_key !== 'placeholder' &&
                                                        objValue[obj_obj_key] !== 'placeholder' &&
                                                        currentRecord['assetCategory'] !== 'placeholder'
                                                    );

                                                    if (!isValid) {
                                                        props.setAlert(prevState => ({
                                                            ...prevState,
                                                            message: strings.requiredNested,
                                                            hide: 1,
                                                            severity: "error"
                                                        }));
                                                        return -1;
                                                    }

                                                    setCondition_dev((prev) => {
                                                        const updateArray = [...prev];
                                                        updateArray.splice(index + 1, 0, {
                                                            [AND_OPERATOR]: [
                                                                {
                                                                    'placeholder.placeholder': { placeholder: 'placeholder' },
                                                                    'assetCategory': 'placeholder'
                                                                }
                                                            ]
                                                        })
                                                        return updateArray;
                                                    })




                                                }} sx={{ display: (condition_dev[index + 1] && Object.keys(condition_dev[index + 1]).some(item => item === '$and' || item === '$or')) ? 'none' : 'block', '&:hover': { backgroundColor: 'transparent' } }}>

                                                <AddCircleOutline />

                                            </IconButton>
                                        </Box>




                                    </Box>
                                )}


                                {/*  BLOCK 2  */}
                                {Object.keys(condition_dev[index]).some(item => item === '$and' || item === '$or') && (
                                    <>
                                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>

                                            <Box sx={{ width: "90%", display: "flex", }}>
                                                <Box sx={{ width: "fit-content", display: "flex", borderRadius: "16px", backgroundColor: "#e0e0e0", my: 1, p: 0 }}>

                                                    <IconButton title="Remove all nested operations" sx={{ display: "block", '&:hover': { backgroundColor: 'transparent' } }}

                                                        onClick={() => {
                                                            setCondition_dev(prevCondition_dev => {
                                                                const updatedCondition = [...prevCondition_dev];
                                                                updatedCondition.splice(index, 1);

                                                                return updatedCondition;
                                                            });
                                                        }}>
                                                        <RemoveCircleOutline fontSize="small" sx={{ color: "red" }} />

                                                    </IconButton>


                                                    <Box sx={{ backgroundColor: "white", alignContent: "center", px: 1 }}>

                                                        <Select
                                                            id="byte-order-select"
                                                            value={Object.keys(condition_dev[index])[0] || ''}
                                                            required
                                                            onChange={event => {





                                                                setCondition_dev(prevCondition_dev => {
                                                                    const updatedCondition = [...prevCondition_dev]; // Copia dell'array precedente
                                                                    const obj = updatedCondition[index]; // Ottieni l'oggetto corrente
                                                                    const obj_key = Object.keys(obj)[0];
                                                                    const newObj = { [event.target.value]: updatedCondition[index][obj_key] }



                                                                    delete updatedCondition[index][obj_key];

                                                                    Object.assign(updatedCondition[index], newObj);
                                                                    return updatedCondition;

                                                                });
                                                            }}
                                                        >
                                                            <MenuItem value={AND_OPERATOR}>AND</MenuItem>
                                                            <MenuItem value={OR_OPERATOR}>OR</MenuItem>
                                                        </Select>
                                                    </Box>



                                                    <IconButton title="New nested operation" sx={{ display: "block", '&:hover': { backgroundColor: 'transparent' } }}
                                                        onClick={() => {




                                                            setCondition_dev(prevCondition_dev => {
                                                                const updatedCondition = [...prevCondition_dev];
                                                                const currentRole = updatedCondition[index];

                                                                const obj_key = Object.keys(currentRole);

                                                                updatedCondition[index][obj_key].push({
                                                                    'placeholder.placeholder': { placeholder: 'placeholder' },
                                                                    'assetCategory': 'placeholder'
                                                                });



                                                                return updatedCondition;
                                                            });



                                                        }}>
                                                        <AddCircleOutline fontSize="small" sx={{ color: "green" }} />
                                                    </IconButton>

                                                </Box>
                                            </Box>

                                        </Box>

                                        {(condition_dev[index].$and || condition_dev[index].$or)?.map((_, index_nested) => (






                                            <Box key={`nested-${index_nested}`} sx={{ display: "flex", alignItems: "flex-end", flexDirection: "column" }}>

                                                <Box sx={{ position: "relative", display: "flex", justifyContent: "space-evenly", p: 1, width: "90%" }}>

                                                    <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
                                                        <FormControl variant="standard" sx={{ width: "100%" }}>
                                                            <Autocomplete
                                                                disablePortal
                                                                options={
                                                                    devices && devices.length > 0
                                                                        ? [{ id: null, deviceTypeId: '#' }, ...devices]
                                                                        : [{ id: null, deviceTypeId: '#' }]
                                                                }

                                                                getOptionLabel={(option) => {
                                                                    if (!option) return '';
                                                                    if (option.deviceTypeId === '#') return '#';
                                                                    return option.name || '';
                                                                }}


                                                                onChange={async (event, value) => {



                                                                    setCondition_dev(prevCondition_dev => {
                                                                        const updatedCondition = [...prevCondition_dev];
                                                                        const currentRole = updatedCondition[index];

                                                                        if (currentRole) {
                                                                            const obj_Value = Object.values(currentRole)[0];
                                                                            const obj_Key = Object.keys(obj_Value[index_nested]).find(item => item !== 'assetCategory');


                                                                            const [, rightKey] = obj_Key.split('.');



                                                                            const newKey = `${value ? value.deviceTypeId === "#" ? value.deviceTypeId : value.id : 'placeholder'}.${rightKey}`

                                                                            const newObject = { [newKey]: obj_Value[index_nested][obj_Key], assetCategory: value ? value.deviceTypeId === '#' ? value.id : value.deviceTypeId : 'placeholder' }

                                                                            Object.assign(obj_Value[index_nested], newObject);
                                                                            delete obj_Value[index_nested][obj_Key]




                                                                        }

                                                                        return updatedCondition;
                                                                    });



                                                                }}
                                                                isOptionEqualToValue={(option, value) => {
                                                                    return option.id === value?.id && option.deviceTypeId === value?.deviceTypeId;
                                                                }}



                                                                value={
                                                                    Array.isArray(devices) &&
                                                                        Array.isArray(condition_dev) &&
                                                                        condition_dev[index]
                                                                        ? (() => {
                                                                            const obj = Object.values(condition_dev[index])[0];
                                                                            const obj_Key = Object.keys(obj[index_nested]).find((item) => item !== 'assetCategory');


                                                                            const [leftKey] = obj_Key.split('.');

                                                                            if (leftKey === '#') return { id: null, deviceTypeId: '#' };

                                                                            return devices.find((device) => device.id === Number(leftKey)) || null;
                                                                        })()
                                                                        : ''
                                                                }


                                                                filterOptions={(options, state) => {
                                                                    if (state.inputValue === '#') return [{ id: null, deviceTypeId: '#' }];
                                                                    return options;
                                                                }}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label={`${strings.Device}*`}
                                                                        id="outlined-basic"
                                                                        variant="outlined"
                                                                        placeholder="Search device"
                                                                        sx={{
                                                                            borderRadius: 1,
                                                                            '& .MuiInputLabel-root': {
                                                                                color: (theme) => `${theme.palette.primary.main}`,
                                                                            },
                                                                            '& .MuiInputLabel-root.Mui-focused': {
                                                                                color: (theme) => `${theme.palette.primary.main}`,
                                                                            },
                                                                            '& .MuiInput-underline:before': {
                                                                                borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,
                                                                            },
                                                                            '& .MuiInput-underline:hover:before': {
                                                                                borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,
                                                                            },
                                                                            '& .MuiInput-underline:after': {
                                                                                borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`,
                                                                            },
                                                                        }}
                                                                        InputProps={{
                                                                            ...params.InputProps,
                                                                        }}
                                                                    />
                                                                )}
                                                                ListboxProps={{ style: { maxHeight: 150 } }}
                                                            />
                                                        </FormControl>
                                                    </Box>

                                                    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", mx: 1 }}>

                                                        <FormControl variant="standard" sx={{ width: "100%" }}>


                                                            {(() => {
                                                                const obj = Object.values(condition_dev[index])[0];
                                                                const obj_Key = Object.keys(obj[index_nested]).find(item => item !== 'assetCategory');

                                                                const [leftKey] = obj_Key.split('.');


                                                                return leftKey !== '#' ? (

                                                                    <TextField
                                                                        id="outlined-basic"
                                                                        variant="outlined"
                                                                        label={`${strings.deviceModel}*`}
                                                                        value={(() => {
                                                                            const obj = Object.values(condition_dev[index])[0];
                                                                            const assetCategory = obj[index_nested]?.['assetCategory'];

                                                                            if (assetCategory == null) return '';

                                                                            if (Array.isArray(devicesType)) {
                                                                                const device = devicesType.find(device => device.id === Number(assetCategory));
                                                                                return device?.model || '';
                                                                            }

                                                                            return '';
                                                                        })()}
                                                                        InputProps={{
                                                                            readOnly: true,
                                                                        }}
                                                                        sx={{
                                                                            '& .MuiInputLabel-root': {
                                                                                color: (theme) => theme.palette.primary.main,
                                                                            },
                                                                            '& .MuiInputLabel-root.Mui-focused': {
                                                                                color: (theme) => theme.palette.primary.main,
                                                                            },
                                                                        }}
                                                                    />


                                                                ) : (
                                                                    <Autocomplete
                                                                        disablePortal
                                                                        options={devicesType || []}
                                                                        getOptionLabel={(option) => option.model || ''}
                                                                        onChange={(event, value) => {


                                                                            setCondition_dev(prevCondition_dev => {
                                                                                const updatedCondition = [...prevCondition_dev];
                                                                                const currentRole = updatedCondition[index];

                                                                                if (currentRole) {
                                                                                    const obj_Value = Object.values(currentRole)[0];


                                                                                    obj_Value[index_nested]['assetCategory'] = value ? value.id : 'placeholder';


                                                                                }

                                                                                return updatedCondition;
                                                                            });

                                                                            setLoading(true);




                                                                        }}


                                                                        isOptionEqualToValue={(option, value) => option.id === value.id}


                                                                        value={(
                                                                            () => {
                                                                                const obj = Object.values(condition_dev[index])[0];
                                                                                if (obj[index_nested]['assetCategory'] != null) {

                                                                                    if (Array.isArray(devicesType) && Array.isArray(condition_dev)) {
                                                                                        return devicesType.find((devicesType) => devicesType.id === Number(obj[index_nested]['assetCategory']));
                                                                                    } else {
                                                                                        return null;
                                                                                    }

                                                                                } else {
                                                                                    return '';
                                                                                }



                                                                            })()
                                                                        }

                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label={`${strings.deviceModel}*`}
                                                                                id="outlined-basic"
                                                                                variant="outlined"
                                                                                placeholder="Search device model"
                                                                                sx={{
                                                                                    borderRadius: 1,
                                                                                    '& .MuiInputLabel-root': {
                                                                                        color: (theme) => `${theme.palette.primary.main}`,
                                                                                    },
                                                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                                                        color: (theme) => `${theme.palette.primary.main}`,
                                                                                    },
                                                                                    '& .MuiInput-underline:before': {
                                                                                        borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,
                                                                                    },
                                                                                    '& .MuiInput-underline:hover:before': {
                                                                                        borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,
                                                                                    },
                                                                                    '& .MuiInput-underline:after': {
                                                                                        borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`,
                                                                                    },
                                                                                }}
                                                                                InputProps={{
                                                                                    ...params.InputProps,
                                                                                }}
                                                                            />
                                                                        )}
                                                                        ListboxProps={{ style: { maxHeight: 150 } }}
                                                                    />
                                                                )

                                                            })()}
                                                        </FormControl>

                                                    </Box>


                                                    <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0 }}>
                                                        <FormControl variant="standard" sx={{ width: "100%" }}>
                                                            <Autocomplete
                                                                disablePortal
                                                                loading={loading}


                                                                options={(() => {
                                                                    if (condition_dev[index]) {
                                                                        const obj = Object.values(condition_dev[index])[0];

                                                                        if (!obj) return [];
                                                                        const signalArray = arrayObjectSignal[obj[index_nested]['assetCategory']]

                                                                        return signalArray || []
                                                                    } else {
                                                                        return [];
                                                                    }

                                                                })()}




                                                                getOptionLabel={option => option.name}



                                                                onChange={(event, value) => {



                                                                    setCondition_dev(prevCondition_dev => {
                                                                        const updatedCondition = [...prevCondition_dev];
                                                                        const currentRole = updatedCondition[index];

                                                                        if (currentRole) {
                                                                            const obj_Value = Object.values(currentRole)[0];
                                                                            const obj_Key = Object.keys(obj_Value[index_nested]).find(item => item !== 'assetCategory');


                                                                            const [leftKey,] = obj_Key.split('.');
                                                                            const newKey = `${leftKey}.${value?.name}`





                                                                            obj_Value[index_nested][newKey] = obj_Value[index_nested][obj_Key];
                                                                            delete obj_Value[index_nested][obj_Key];



                                                                        }

                                                                        return updatedCondition;
                                                                    });



                                                                }}





                                                                value={(() => {





                                                                    if (condition_dev[index]) {

                                                                        const obj = Object.values(condition_dev[index])[0];



                                                                        if (arrayObjectSignal[obj[index_nested]['assetCategory']]) {
                                                                            const foundElement = arrayObjectSignal[obj[index_nested]['assetCategory']].find((element) => {

                                                                                const obj_Key = Object.keys(obj[index_nested]).find(item => item !== 'assetCategory');
                                                                                const [, rightKey] = obj_Key.split('.');

                                                                                return element.name === rightKey;
                                                                            });
                                                                            return foundElement;
                                                                        }
                                                                    }
                                                                    return null;

                                                                })()}


                                                                ListboxProps={{ style: { maxHeight: 150 } }}

                                                                renderOption={(props, option) => (
                                                                    <li {...props} key={option.id}>
                                                                        {option.name}
                                                                    </li>
                                                                )}

                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label={`${strings.Signal}*`}
                                                                        id="outlined-basicas"
                                                                        variant="outlined"
                                                                        placeholder="Search siganl "
                                                                        sx={{
                                                                            borderRadius: 1,
                                                                            '& .MuiInputLabel-root': {
                                                                                color: (theme) => `${theme.palette.primary.main}`,
                                                                            },
                                                                            '& .MuiInputLabel-root.Mui-focused': {
                                                                                color: (theme) => `${theme.palette.primary.main}`,
                                                                            },
                                                                            '& .MuiInput-underline:before': {
                                                                                borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,
                                                                            },
                                                                            '& .MuiInput-underline:hover:before': {
                                                                                borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,
                                                                            },
                                                                            '& .MuiInput-underline:after': {
                                                                                borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`,
                                                                            },
                                                                        }}
                                                                        InputProps={{
                                                                            ...params.InputProps,
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        </FormControl>
                                                    </Box>




                                                    <Box sx={{ width: "80%", display: "flex", alignItems: "center", mx: 1 }}>
                                                        <FormControl variant="outlined" sx={{ width: "100%" }}>

                                                            <InputLabel id="byte-order-select-label" sx={{ '&.Mui-focused': { color: (theme) => `${theme.palette.primary.main}` }, color: (theme) => `${theme.palette.primary.main}` }}>
                                                                {strings.operator}*
                                                            </InputLabel>

                                                            <Select labelId="byte-order-select-label" id="byte-order-select"

                                                                value={(() => {
                                                                    const obj_Value = Object.values(condition_dev[index])[0];
                                                                    const obj_Key = Object.keys(obj_Value[index_nested]).find(item => item !== 'assetCategory');

                                                                    const obj_operator = obj_Value[index_nested][obj_Key];
                                                                    const obj_key = Object.keys(obj_operator)[0];

                                                                    return obj_key === 'placeholder' ? '' : obj_key;




                                                                })()}
                                                                required
                                                                onChange={event => {


                                                                    setCondition_dev(prevCondition_dev => {
                                                                        const updatedCondition = [...prevCondition_dev];
                                                                        const currentRole = updatedCondition[index];

                                                                        if (currentRole) {
                                                                            const obj_Value = Object.values(currentRole)[0];
                                                                            const obj_Key = Object.keys(obj_Value[index_nested]).find(item => item !== 'assetCategory');

                                                                            const obj_operator = obj_Value[index_nested][obj_Key];
                                                                            const obj_key = Object.keys(obj_operator)

                                                                            const newObject = { [event.target.value]: obj_operator[obj_key] }


                                                                            obj_Value[index_nested][obj_Key] = newObject;


                                                                        }

                                                                        return updatedCondition;
                                                                    });


                                                                }}
                                                                label={`${strings.operator}*`}
                                                            >

                                                                <MenuItem value={'$lt'}>{'<'}</MenuItem>
                                                                <MenuItem value={'$eq'}>{'='}</MenuItem>
                                                                <MenuItem value={'$ne'}>{'!='}</MenuItem>
                                                                <MenuItem value={'$gt'}>{'>'}</MenuItem>
                                                                <MenuItem value={'$lte'}>{'=<'}</MenuItem>
                                                                <MenuItem value={'$gte'}>{'>='}</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Box>


                                                    <Box sx={{ width: "80%", display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0 }}>
                                                        <FormControl variant="standard" sx={{ width: "100%" }}>
                                                            <TextField
                                                                id="outlined-basic"
                                                                variant="outlined"
                                                                label={`${strings.value}*`}
                                                                value={(() => {
                                                                    const obj_Value = Object.values(condition_dev[index])[0];
                                                                    const obj_Key = Object.keys(obj_Value[index_nested]).find(item => item !== 'assetCategory');
                                                                    const obj_operator = obj_Value[index_nested][obj_Key];
                                                                    const obj_key = Object.keys(obj_operator);
                                                                    return obj_operator[obj_key] === 'placeholder' ? '' : obj_operator[obj_key];



                                                                })()}
                                                                sx={{
                                                                    '& .MuiInputLabel-root': {
                                                                        color: (theme) => theme.palette.primary.main,
                                                                    },
                                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                                        color: (theme) => theme.palette.primary.main,
                                                                    }
                                                                }}
                                                                onChange={event => {


                                                                    setCondition_dev(prevCondition_dev => {
                                                                        const updatedCondition = [...prevCondition_dev];
                                                                        const currentRole = updatedCondition[index];

                                                                        if (currentRole) {
                                                                            const obj_Value = Object.values(currentRole)[0];
                                                                            const obj_Key = Object.keys(obj_Value[index_nested]).find(item => item !== 'assetCategory');

                                                                            const obj_operator = obj_Value[index_nested][obj_Key];
                                                                            const obj_key = Object.keys(obj_operator)
                                                                            obj_operator[obj_key] = event.target.value;




                                                                        }

                                                                        return updatedCondition;
                                                                    });


                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Box>

                                                    <Box sx={{ display: "flex" }}>


                                                        <IconButton
                                                            title="Delete"
                                                            onClick={() => {



                                                                setCondition_dev(prevCondition_dev => {
                                                                    const updatedCondition = [...prevCondition_dev];
                                                                    const currentRole = updatedCondition[index];

                                                                    const obj_key = Object.keys(currentRole);




                                                                    updatedCondition[index][obj_key].splice(index_nested, 1);



                                                                    return updatedCondition;
                                                                });
                                                            }}
                                                            sx={{
                                                                '&:hover': {
                                                                    backgroundColor: 'transparent'
                                                                }
                                                            }}
                                                        >
                                                            <Delete />
                                                        </IconButton>



                                                    </Box>







                                                </Box>

                                            </Box>



                                        ))}
                                    </>
                                )}

                            </Box>



                        ))}
                    </>
                </Box>

            </Box>




        </Box >

    )
}



