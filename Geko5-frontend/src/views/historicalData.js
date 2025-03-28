import { Autocomplete, Box, Button, FormControl, TextField,  IconButton, CircularProgress, InputAdornment } from "@mui/material";
import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import config from "../config";
import useWindowSize from "../components/useWindowSize";
import ServerProxy from '../tools/serverProxy';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { it } from 'date-fns/locale';
import { Clear, Fullscreen} from "@mui/icons-material";
import { strings } from "../strings";
import ExportHistorical from "../components/ExportHistorical"
import HeaderPage from "../components/headerPage";
import DataGridComponent from "../components/DataGridComponent";
import { convertTimestamp } from "../tools/helpers";
import ConnectedLost from "../components/ConnectedLost";


export default function HistoricalData(props) {



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Variables 


    const [columns, setColumns] = useState([]);
    const [devices, setDevices] = useState([]);
    const [error, setError] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [load, setLoad] = useState(false);
    const [rows, setRows] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ pageSize: config.pagination.pageSize, page: 1 });
    const [stateParams, setStateParams] = useState({
        startTime: "",
        endTime: "",
        idDevices: "",
        pageSize: 200,
        pageNumber: 1,
    });


    const windowSize = useWindowSize();



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Functions



    const handleClearInput = (flag = true) => {
        setRows([]);
        setColumns([]);
        if (!flag) {
            setStateParams({});
        }
        setStateParams((prevParams) => ({
            ...prevParams,
            idDevices: '',
            pageNumber: 1
        }));
    }


    const handleDateChangeStart = (newDate) => {
        if (newDate === null) {
            setStateParams((prevParams) => ({
                ...prevParams,
                startTime: '',
            }));
            setRows([]);
            setColumns([]);
            return;
        }

        setStateParams((prevParams) => ({
            ...prevParams,
            startTime: newDate.getTime(),
        }));
        setRows([]);
        setColumns([]);
    };


    const handleDateChangeEnd = (newDate) => {
        if (newDate === null) {
            setStateParams((prevParams) => ({
                ...prevParams,
                endTime: null,
            }));
            setRows([]);
            setColumns([]);
            return;
        }

        setStateParams((prevParams) => ({
            ...prevParams,
            endTime: newDate.getTime(),
        }));
        setRows([]);
        setColumns([]);
    };


    const loadDevices = async () => {

        try {
            const devices = await ServerProxy.getDevices();
            setDevices(devices.filter(item => item.enabled === "1").map(item => ({ label: item.name, id: item.id })));

        } catch (error) {
            props.setAlert(prevState => ({
                ...prevState,
                message: error?.response?.data?.message || 'An unknown error occurred',
                hide: 1,
                severity: "error"
            }));
            setError(true);
        }
    }


    const loadDeviceValue = async () => {
        if (!error) {

            setLoad(true);


            try {


                if (stateParams.idDevices) {

                    const { idDevices } = stateParams;

                    const response = await ServerProxy.getDeviceStruttures(idDevices);

                    if (response) {

                        const obj = {};

                        response.map(item => {
                            obj[item.name] = item.measureUnit
                        })

                        sessionStorage.setItem(`historical_headers_map_${idDevices}`, JSON.stringify(obj));

                    }


                    if (stateParams.startTime) {
                        const response = await ServerProxy.getDeviceForHistoricalData(stateParams);
                        setRows(oldRows => {

                            const newRows = [
                                ...oldRows,
                                ...transformData(idDevices, response)
                            ]

                            return newRows;
                        })
                    } else {
                        props.setAlert(prevState => ({
                            ...prevState,
                            message: 'No start date provided. Please specify a start date to retrieve historical data.',
                            hide: 1,
                            severity: 'warning'
                        }));

                    }

                } else {
                    props.setAlert(prevState => ({
                        ...prevState,
                        message: 'No device selected. Please specify a device to retrieve historical data.',
                        hide: 1,
                        severity: 'warning'
                    }));


                }


            } catch (error) {
                props.setAlert(prevState => ({
                    ...prevState,
                    message: error?.response?.data?.message || 'An unknown error occurred',
                    hide: 1,
                    severity: "error"
                }));
                setError(true);
            }
            finally {
                setLoad(false);
            }
        }
    }


    const onPaginationModelChange = function (model) {

        if (rows.length > 0) {
            const currentPageRapport = ((model.page + 1) * model.pageSize) / rows.length
            if (currentPageRapport >= .99) {

                setStateParams((prevParams) => ({
                    ...prevParams,
                    pageNumber: prevParams.pageNumber + 1,
                }));
            }
        }
        setPaginationModel(model);
    }


    const transformData = (deviceId, inputData, addId = true) => {
        const result = [];


        const keys = Object.keys(inputData);

        if (keys.length === 0) {
            return result;  // Ritorna un array vuoto se `inputData` è vuoto
        }

        const keysOfSpecificObject = Object.keys(inputData[keys[0]]?.data);


        keys.forEach(key => {

            const item = inputData[key]; // Estrai l'oggetto corrente
            const data = item.data; // Estrai i dati dall'oggetto corrente
            const timestamp = item.timestamp;
            const dataPoint = {};

            if (addId) {
                dataPoint.id = key;
            }

            if (!dataPoint['timestamp']) {
                dataPoint['timestamp'] = convertTimestamp(timestamp);
            }

            keysOfSpecificObject.forEach(colKey => {


                if (data[colKey] !== undefined) {

                    dataPoint[colKey] = data[colKey];
                } else {
                    dataPoint[colKey] = null; // Mostra esplicitamente null per i valori non definiti
                }
            });

            result.push(dataPoint);
        });

        const historicalHeadersMap = sessionStorage.getItem(`historical_headers_map_${deviceId}`) ? JSON.parse(sessionStorage.getItem(`historical_headers_map_${deviceId}`)) : null;

        //console.log( historicalHeadersMap );


        const dataColumns = keysOfSpecificObject.map((colKeyObj, index) => ({
            field: colKeyObj,
            headerName: colKeyObj + (historicalHeadersMap[colKeyObj] ? ` (${historicalHeadersMap[colKeyObj]})` : ''),
            flex: 1,
            minWidth: 150,
            key: `col-${index}`, // Assicura che ogni colonna abbia una key
            renderCell: (params) => {
                if (params.value === null) {
                    return <i style={{ color: 'gray' }}>null</i>; // Visualizza "null" in grigio corsivo
                }
                return params.value; // Mostra il valore normalmente
            },
        }));

        const newColumn = {
            field: 'timestamp', // Nuova chiave
            headerName: 'Timestamp', // Nuovo header
            minWidth: '160'

        };

        dataColumns.unshift(newColumn);


        setColumns(dataColumns)

        return result;

    }


    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
        if (!isFullScreen) {
            setIsModalLoading(true);
            setTimeout(() => setIsModalLoading(false), 500);
        }
    };





    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// UseEffect


    useEffect(() => {
        document.title = "Historical Data - Wisnam";

        loadDevices();

        props.setStateNavigation(() => {
            const resetValues = {
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
                system: 0
            };

            return {
                ...resetValues,
                historicalValue: 1
            };
        });


    }, []);


    useEffect(() => {
        if (stateParams.pageNumber !== 1) {
            loadDeviceValue()
        }
    }, [stateParams])













    return (
        <>
            <Box sx={{ height: `calc(${windowSize.height}px - ${config.heightBanner}px);`, display: "flex", flexDirection: "column", overflowY: "auto", p: 0 }}>




                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, mt: { sm: 5, lg: 2 } }}>



                    <HeaderPage title={strings.HistoricalData} titleTwo={"Dashboard"} />


                    <Box sx={{ display: "flex" }}>

                        <ExportHistorical stateParams={stateParams} devices={devices} load={load} setLoad={setLoad} alert={alert} setAlert={props.setAlert} idDevices={stateParams.idDevices} />

                    </Box>
                </Box>






                {!error ? (
                    <>


                        <Box sx={{ display: "flex", flexWrap: { sm: "wrap", md: "nowrap" }, mb: 4 }}>



                            <Box sx={{ width: { sm: "100%", md: "inherit" }, alignContent: "center", mb: { sm: 2, md: 0 } }}>

                                <FormControl variant="standard" sx={{ minWidth: { sm: '100%', md: 300 } }}>
                                    <Autocomplete
                                        disablePortal
                                        options={devices || []}
                                        value={devices.find((device) => device.label === inputValue) || null}
                                        onInputChange={(event, newInputValue) => {
                                            setInputValue(newInputValue);
                                        }}
                                        isOptionEqualToValue={(option, value) => option.label === value?.label}
                                        onChange={(event, newValue) => {
                                            handleClearInput();
                                            if (newValue) {
                                                
                                                setStateParams((prevParams) => ({
                                                    ...prevParams,
                                                    idDevices: newValue.id,
                                                }));
                                                setInputValue(newValue.label);
                                            } else {
                                                handleClearInput();
                                                setInputValue("");
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params}
                                                variant="outlined"
                                                label="Search devices"
                                                placeholder="Search devices"
                                                sx={{
                                                    borderRadius: 1,
                                                    backgroundColor: "white",
                                                    '& .MuiInputLabel-root': { color: 'primary.main' },
                                                    '& .MuiInput-underline:before': { borderBottom: '1px solid primary.main' },
                                                    '& .MuiInput-underline:hover:before': { borderBottom: '1px solid primary.main' },
                                                    '& .MuiInput-underline:after': { borderBottom: '2px solid primary.main' },
                                                }}
                                            />
                                        )}
                                    />
                                </FormControl>





                            </Box>



                            <Box sx={{ mx: { sm: 0, md: 3 }, alignContent: "center", }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={it}>
                                    {/* Start Date Picker */}
                                    <DateTimePicker
                                        label="Start"
                                        value={stateParams.startTime || null}
                                        onChange={handleDateChangeStart}
                                        ampm={false}
                                        renderInput={(params) => (
                                            <TextField
                                                sx={{
                                                    backgroundColor: "white",
                                                    borderRadius: 1,
                                                    '& .MuiInputLabel-root': { color: 'primary.main' },
                                                    '& .MuiInput-underline:before': { borderBottom: '1px solid primary.main' },
                                                    '& .MuiInput-underline:hover:before': { borderBottom: '1px solid primary.main' },
                                                    '& .MuiInput-underline:after': { borderBottom: '2px solid primary.main' },
                                                    '& .Mui-error': { color: 'primary.main', borderColor: 'trasparent' },
                                                }}
                                                {...params}

                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            {stateParams.startTime && (
                                                                <IconButton sx={{ px: 0, '&:hover': { backgroundColor: 'transparent' } }} onClick={() => {
                                                                    setStateParams((prevParams) => ({
                                                                        ...prevParams,
                                                                        startTime: null,
                                                                    }));
                                                                }} size="small">
                                                                    <Clear />
                                                                </IconButton>
                                                            )}
                                                            {params.InputProps?.endAdornment}
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Box>


                            <Box sx={{ alignContent: "center", mx: { sm: 2, md: 0 } }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={it}>
                                    {/* End Date Picker */}
                                    <DateTimePicker
                                        label="End"
                                        value={stateParams.endTime || null}
                                        onChange={handleDateChangeEnd}
                                        ampm={false}
                                        renderInput={(params) => (
                                            <TextField
                                                sx={{
                                                    backgroundColor: "white",
                                                    borderRadius: 1,
                                                    '& .MuiInputLabel-root': { color: 'primary.main' },
                                                    '& .MuiInput-underline:before': { borderBottom: '1px solid primary.main' },
                                                    '& .MuiInput-underline:hover:before': { borderBottom: '1px solid primary.main' },
                                                    '& .MuiInput-underline:after': { borderBottom: '2px solid primary.main' },
                                                }}

                                                {...params}


                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            {stateParams.endTime && (
                                                                <IconButton sx={{ px: 0, '&:hover': { backgroundColor: 'transparent' } }} onClick={() => {
                                                                    setStateParams((prevParams) => ({
                                                                        ...prevParams,
                                                                        endTime: null,
                                                                    }));
                                                                }} size="small">
                                                                    <Clear />
                                                                </IconButton>
                                                            )}
                                                            {params.InputProps?.endAdornment}
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Box>


                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Button
                                    sx={{ width: "133px", ml: { sm: 0, md: 2 }, '&:hover': { backgroundColor: "primary", color: "white" } }}
                                    onClick={() => {
                                        setRows([]);
                                        setColumns([]);
                                        setStateParams((prevParams) => ({ ...prevParams, pageNumber: 1 }));


                                        loadDeviceValue()
                                    }}
                                    variant="contained"
                                >
                                    Apply
                                </Button>
                            </Box>

                        </Box>

                        <>

                            {rows.length > 0 && (
                                <Box sx={{ display: "flex", justifyContent: "end", backgroundColor: (theme) => `${theme.palette.component.colorSecondary}`, border: "1px solid #e0e0e0", borderTopLeftRadius: "5px", borderTopRightRadius: "5px" }}>


                                    <Box display="flex" justifyContent="end" p={1}>
                                        <IconButton color="primary" onClick={toggleFullScreen}>
                                            <Fullscreen />
                                        </IconButton>
                                    </Box>

                                </Box>
                            )}

                            <DataGridComponent paginationFlag={true} paginationModel={paginationModel} onPaginationModelChange={onPaginationModelChange} isModalLoading={isModalLoading} isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} toggleFullScreen={toggleFullScreen} handleSelectionIds={() => { }} rows={rows} columns={columns} columnsFullScreen={columns} load={load} />

                        </>


                    </>
                ) : (
                    load ? (

                        <Box sx={{ height: "40vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <CircularProgress />
                        </Box>

                    ) : (

                        < ConnectedLost />
                    )
                )}


            </Box>







        </>
    );
}
