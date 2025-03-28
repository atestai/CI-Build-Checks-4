import { useEffect, useRef, useState } from "react";
import { Box, FormControl, IconButton, Typography, CircularProgress, TextField, Chip } from "@mui/material";
import { strings } from '../strings'
import { Replay, Fullscreen, SignalWifiStatusbarConnectedNoInternet4, Clear } from "@mui/icons-material";
import ServerProxy from "../tools/serverProxy";
import ConfirmDialog from "../components/confirmDialog";
import useWindowSize from "../components/useWindowSize";
import config from "../config";
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import ExportMenu from "../components/ExportMenu";
import { getColumnsAlarm } from "../tools/column";
import { it } from 'date-fns/locale';
import AlarmInfo from "./alarmInfo";
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { formatDate } from '../tools/helpers';
import HeaderPage from '../components/headerPage';
import DataGridComponent from "../components/DataGridComponent";
import ConnectedLost from "../components/ConnectedLost";



export default function Alarm(props) {




    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Variables 

    const [allRows, setAllRows] = useState([]);
    const [actionFuncion, setActionFuncion] = useState(null);
    const [detail, setDetail] = useState({ row: {}, open: false });
    const [error, setError] = useState(false)
    const [onlyOne, setOnlyOne] = useState(false); // Flag per limitare l'esecuzione una volta
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [load, setLoad] = useState(true);
    const [localFilter, setLocalFilter] = useState({ enabled: -1, realTime: true });
    const [selectedDateStart, setSelectedDateStart] = useState(null);
    const [selectedDateEnd, setSelectedDateEnd] = useState(null);
    const [rows, setRows] = useState([]);
    const windowSize = useWindowSize();
    const prevAlarm = useRef({ realTime: localFilter.realTime });



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Functions 
    const callSetCountRows = async () => {
        try {
            const alarm = await ServerProxy.getAlarms()
            setAllRows(alarm);
            setOnlyOne(true);
        } catch (error) {
            console.log("Check:", error);
        }

    }


    const handleDateChangeStart = (newDate) => {
        setSelectedDateStart(newDate);
        setRows([]);
    };


    const handleDateChangeEnd = (newDate) => {
        setSelectedDateEnd(newDate);
        setRows([]);
    };


    const loadData = async () => {

        setLoad(true);

        try {
            const data = await ServerProxy.getAlarms({
                ...localFilter
            });
         

            setRows(data.map(item => {

                return {
                    id: item._id,
                    ...item,
                    isActive: item.status,
                    timestampActive: formatDate(item.timestampActive),

                    timestampDeactive: item.timestampDeactive ? formatDate(item.timestampDeactive) : '-',
                }
            }));



        } catch (error) {
            props.setAlert(prevState => ({
                ...prevState,
                message: error?.response?.data?.message || 'An unknown error occurred',
                hide: 1,
                severity: "error"
            }));
            setError(true);
            setRows([]);
        } finally {
            setLoad(false);
        }
    };


    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
        if (!isFullScreen) {
            setIsModalLoading(true);
            setTimeout(() => setIsModalLoading(false), 500);
        }
    };

    const columns = getColumnsAlarm(setDetail, props);


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// UseEffect 




    useEffect(() => {

        document.title = `${strings.alarms} - Wisnam`;
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
                system: 0,
                alarmList: 0,
                alarms: 0
            };

            return {
                ...resetValues,
                alarms: 1
            };
        });

        loadData();

    }, []);






    useEffect(() => {

        if (localFilter.text || localFilter.text === '' || localFilter.selectedDateStart || localFilter.selectedDateStart === null || localFilter.selectedDateEnd || (localFilter.realTime !== prevAlarm.realTime) || localFilter.realTime == undefined) {
            loadData();
        }

    }, [localFilter])




    useEffect(() => {
        if (selectedDateEnd || selectedDateEnd == null) {
            setLocalFilter({
                ...localFilter,
                selectedDateEnd: selectedDateEnd ? selectedDateEnd.getTime() : ''
            })

        } 
        
        if (selectedDateStart || selectedDateStart == null) {


            setLocalFilter({
                ...localFilter,
                selectedDateStart: selectedDateStart ? selectedDateStart.getTime() : ''
            })

        }

    }, [selectedDateEnd, selectedDateStart])



    useEffect(() => {

        if (!onlyOne) {
            callSetCountRows();
        }

    }, [onlyOne]);




    return (

        <>

            <ConfirmDialog actionFuncion={actionFuncion} setActionFuncion={setActionFuncion} />

            {detail.open && (
                <AlarmInfo load={load} setDetail={setDetail} setLoad={setLoad} setAlert={props.setAlert} alert={alert} detail={detail} onCloseAction={() => setDetail({ row: null, open: false })} />
            )}


            <Box sx={{ height: `calc(${windowSize.height}px - ${config.heightBanner}px);`, display: 'flex', flexDirection: 'column', overflowY: 'auto', p: .1 }}>
                <Box sx={{ flexShrink: 0, mb: 2, mt: { sm: 5, lg: 2 } }}>

                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>

                            <HeaderPage title={strings.historicalAlarm} titleTwo={'Dashboard'} />


                            {!error && (
                                <Box sx={{ display: "flex" }}>

                                    <ExportMenu alert={alert} setAlert={props.setAlert} table={"alarms_historical"} />

                                </Box>
                            )}
                        </Box>


                    </Box>

                </Box>


                {!error ? (
                    <>
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", backgroundColor: (theme) => `${theme.palette.component.colorSecondary}`, border: "1px solid #e0e0e0", borderTopLeftRadius: "5px", borderTopRightRadius: "5px" }}>


                            <Box sx={{ width: "100%", display: 'flex', flexDirection: { sm: "column", lg: "row" }, justifyContent: "space-between" }}>

                                <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", flexWrap: { sm: "wrap", lg: "nowrap" }, py: 2 }}>

                                    <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                                        <FormControl variant="standard" sx={{ minWidth: 200 }}>



                                            <TextField id="standard-basic" label="Search for name" variant="outlined"
                                                sx={{
                                                    backgroundColor: "white",
                                                    borderRadius: 1,
                                                    '& .MuiInputLabel-root': { color: 'primary.main' },
                                                    '& .MuiInput-underline:before': { borderBottom: '1px solid primary.main' },
                                                    '& .MuiInput-underline:hover:before': { borderBottom: '1px solid primary.main' },
                                                    '& .MuiInput-underline:after': { borderBottom: '2px solid primary.main' },
                                                }}
                                                placeholder="Search for name"
                                                value={localFilter.text || ""}
                                                onChange={(event) => { setLocalFilter({ ...localFilter, text: event.target.value }) }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <SearchIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </FormControl>
                                    </Box>

                                    <Box sx={{ width: "auto", display: "flex", justifyContent: { sm: "center", md: "start" }, alignItems: { md: "center" }, ml: 1, pl: { sm: 0, md: 2 }, py: 2 }}>


                                        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => { setLocalFilter({ ...localFilter, realTime: undefined }) }}>
                                            <Typography sx={{ color: localFilter.realTime == undefined ? 'chip.text' : 'chip.text2', fontWeight: localFilter.realTime == undefined ? "500" : "", display: 'inline' }}>
                                                {strings.all}
                                            </Typography>

                                            <Chip
                                                label={onlyOne
                                                    ? allRows.length
                                                    : 0}
                                                sx={{ backgroundColor: 'chip.chipAllBg', color: 'chip.chipAllTxt', ml: 2, boxShadow: "none", borderRadius: "5px" }}
                                            />
                                        </Box>




                                        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer", mx: 4 }} onClick={() => { prevAlarm.current.realTime = localFilter.realTime; setLocalFilter({ ...localFilter, realTime: true }) }}>

                                            <Typography sx={{ color: localFilter.realTime === true ? 'chip.text' : 'chip.text2', fontWeight: localFilter.realTime === true ? "500" : "", display: 'inline' }}>
                                                {strings.active}
                                            </Typography>

                                            <Chip
                                                label={onlyOne
                                                    ? allRows.filter(item => item?.timestampActive && !item?.timestampDeactive).length
                                                    : 0}
                                                sx={{ backgroundColor: localFilter.realTime === true ? 'chip.chipEnableBgActive' : 'chip.chipEnabledBg', color: localFilter.realTime === true ? 'chip.chipEnabledTxtActive' : 'chip.chipEnabledTxtNotActive', ml: 2, boxShadow: "none", borderRadius: "5px" }}
                                            />
                                        </Box>



                                        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => { prevAlarm.current.realTime = localFilter.realTime; setLocalFilter({ ...localFilter, realTime: false }) }}>
                                            <Typography sx={{ color: localFilter.realTime === false ? 'chip.text' : 'chip.text2', fontWeight: localFilter.realTime === false ? "500" : "", display: 'inline' }}>
                                                {strings.deactive}
                                            </Typography>

                                            <Chip
                                                label={onlyOne ? allRows.filter(item => item?.timestampActive && item?.timestampDeactive).length
                                                    : 0}
                                                sx={{ backgroundColor: localFilter.realTime === false ? 'chip.chipDisableBg' : 'chip.chipDisableBgActive', color: localFilter.realTime === false ? 'chip.chipDisableTxtActive' : 'chip.chipDisableTxtNotActive', ml: 2, boxShadow: "none", borderRadius: "5px" }}
                                            />
                                        </Box>



                                    </Box>



                                    <Box sx={{ display: 'flex', alignItems: "center", justifyContent: "end", pr: 2, py: 1, order: { sm: 2, lg: 2 } }}>






                                        <IconButton
                                            title={strings.reload}
                                            color="primary"
                                            onClick={loadData}
                                        >
                                            <Replay />
                                        </IconButton>


                                        <Box display="flex" justifyContent="end" p={1}>
                                            <IconButton color="primary" onClick={toggleFullScreen}>
                                                <Fullscreen />
                                            </IconButton>
                                        </Box>





                                    </Box>


                                    <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center", order: { sm: 2, lg: 1 } }}>
                                        <Box sx={{ minWidth: 200, alignContent: "center", mx: { sm: 0, lg: 3 }, pl: { sm: 2, lg: 0 } }}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={it}>
                                                <DateTimePicker
                                                    label="Start"
                                                    value={selectedDateStart || null}
                                                    onChange={handleDateChangeStart}
                                                    ampm={false}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            sx={{
                                                                width: "235px",
                                                                backgroundColor: "white",
                                                                borderRadius: 1,
                                                                '& .MuiInputLabel-root': { color: 'primary.main', px: 1 },
                                                                '& .MuiInput-underline:before': { borderBottom: 'none' },
                                                                '& .MuiInput-underline:hover:before': { borderBottom: 'none' },
                                                                '& .MuiInput-underline:after': { borderBottom: 'none' },
                                                                '& .Mui-error': { color: 'primary.main', borderColor: 'transparent' },
                                                            }}

                                                            {...params}

                                                            InputProps={{
                                                                ...params.InputProps,
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        {selectedDateStart && (
                                                                            <IconButton sx={{ px: 0, '&:hover': { backgroundColor: 'transparent' } }} onClick={() => { setSelectedDateStart(null); }} size="small">
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




                                        <Box sx={{ alignContent: "center", ml: { sm: 2, lg: 1 }, minWidth: 200 }}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={it}>
                                                <DateTimePicker
                                                    label="End"
                                                    value={selectedDateEnd || null}  // Passa null se selectedDateEnd è undefined
                                                    onChange={handleDateChangeEnd}
                                                    ampm={false}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            sx={{
                                                                width: "235px",

                                                                backgroundColor: "white",
                                                                borderRadius: 1,
                                                                '& .MuiInputLabel-root': { color: 'primary.main', px: 1 },
                                                                '& .MuiInput-underline:before': { borderBottom: 'none' },
                                                                '& .MuiInput-underline:hover:before': { borderBottom: 'none' }, // Removes underline on hover
                                                                '& .MuiInput-underline:after': { borderBottom: 'none' }, // Removes underline after focus
                                                                '& .Mui-error': { color: 'primary.main', borderColor: 'transparent' },
                                                            }}
                                                            {...params}

                                                            InputProps={{
                                                                ...params.InputProps,
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        {selectedDateEnd && (
                                                                            <IconButton sx={{ px: 0, '&:hover': { backgroundColor: 'transparent' } }} onClick={() => { setSelectedDateEnd(null); }} size="small">
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


                                    </Box>


                                </Box>



                            </Box>


                        </Box>



                        <DataGridComponent isModalLoading={isModalLoading} isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} toggleFullScreen={toggleFullScreen} handleSelectionIds={() => { }} rows={rows} columns={columns} columnsFullScreen={columns} load={load} />



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
    )
}
