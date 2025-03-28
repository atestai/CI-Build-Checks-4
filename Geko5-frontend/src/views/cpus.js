import { useEffect, useState } from "react";
import { Box, FormControl, IconButton, Typography, Button, Chip, CircularProgress, TextField, } from "@mui/material";
import { useGridApiRef } from '@mui/x-data-grid';
import { strings } from '../strings'
import { Delete, Replay, Fullscreen } from "@mui/icons-material";
import ServerProxy from "../tools/serverProxy";
import ConfirmDialog from "../components/confirmDialog";
import useWindowSize from "../components/useWindowSize";
import config from "../config";
import CpuDetail from "./cpuDetail";
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import ExportMenu from "../components/ExportMenu";
import ImportMenu from "../components/ImportMenu";
import MenuUploadAll from "../components/MenuUploadAll";
import HeaderPage from "../components/headerPage";
import ConnectedLost from "../components/ConnectedLost";
import DataGridComponent from "../components/DataGridComponent";
import { getColumnsCpu } from "../tools/column"



export default function Cpus(props) {


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Variables 

    const { user } = props;



    const apiRef = useGridApiRef();
    const [actionFuncion, setActionFuncion] = useState(null);
    const [allRows, setAllRows] = useState([]);
    const [elementSelected, setElementSelected] = useState({ operation: null, ids: [] });
    const [detail, setDetail] = useState({ open: false, id: 0 });
    const [onlyOne, setOnlyOne] = useState(false); // Flag per limitare l'esecuzione una volta
    const [error, setError] = useState(false)
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [load, setLoad] = useState(true);
    const [localFilter, setLocalFilter] = useState({ enabled: undefined });
    const [rows, setRows] = useState([]);
    const windowSize = useWindowSize();

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Functions 



    const handleSelectionIds = (newSelection) => {
        setElementSelected(prevState => ({
            ...prevState,
            ids: newSelection
        }));
    };

    const loadData = async () => {
        setLoad(true);
        try {
            const data = await ServerProxy.getCpus({ ...localFilter });
            setRows(data);
            if (!onlyOne) {
                setOnlyOne(true);
                setAllRows(data);
            }

        } catch (error) {
            setDetail({ open: false, id: 0 })
            setRows([]);
            setError(true);
        } finally {
            setLoad(false);
        }
    };

    const onDelete = async function (id) {
        try {
            await ServerProxy.deleteCpus(id);
            setOnlyOne(false);
            props.setAlert(prevState => ({
                ...prevState,
                message: strings.status200Operation,
                hide: 1,
                severity: "success"
            }));
        } catch (error) {
            props.setAlert(prevState => ({
                ...prevState,
                message: error.response.data.message,
                hide: 1,
                severity: "error"
            }));

        } finally {
            setActionFuncion(null);

        }


    };

    const onDeleteAll = async () => {

        try {

            await ServerProxy.deleteMultipleDataLogger(elementSelected.ids);
            setOnlyOne(false);
            props.setAlert(prevState => ({
                ...prevState,
                message: strings.status200Operation,
                hide: 1,
                severity: "success"
            }));

        } catch (error) {
            props.setAlert(prevState => ({
                ...prevState,
                message: error.response.data.message,
                hide: 1,
                severity: "error"
            }));
        } finally {
            setActionFuncion(null);

        }


    };

    const onDetailOkAction = async function (obj) {
        try {
            if (obj?.id) {
                await ServerProxy.editCpu(obj);
            } else if (obj) {
                await ServerProxy.addCpu(obj);
            }
            
            setOnlyOne(false);        
            setDetail({ open: false, id: 0 });


            props.setAlert(prevState => ({
                ...prevState,
                message: strings.status200Operation,
                hide: 1,
                severity: "success"
            }));

            setLoad(false);


        } catch (error) {

            if (error?.response) {
                const { data } = error.response;

                if (data) {

                    props.setAlert(prevState => ({
                        ...prevState,
                        message: data.message,
                        hide: 1,
                        severity: "error"
                    }));
                    setLoad(false);

                }
            }
        }
    };

    const onTogleEnable = async function (option) {

        try {
            const { id, value } = option;

            await ServerProxy.togleStatusCup(id, value);
            setOnlyOne(false);

            props.setAlert(prevState => ({
                ...prevState,
                message: strings.status200Operation,
                hide: 1,
                severity: "success"
            }));

        } catch (error) {
            props.setAlert(prevState => ({
                ...prevState,
                message: error.response.data.message,
                hide: 1,
                severity: "error"
            }));
        }

    };

    const onUpdateAll = async () => {
        try {
            await ServerProxy.updateMultipleDataLogger(elementSelected);
            apiRef.current.setRowSelectionModel([]);
            setOnlyOne(false);

            props.setAlert(prevState => ({
                ...prevState,
                message: strings.status200Operation,
                hide: 1,
                severity: "success"
            }));

        } catch (error) {

            props.setAlert(prevState => ({
                ...prevState,
                message: error.response.data.message,
                hide: 1,
                severity: "error"
            }));
        }


    };

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
        if (!isFullScreen) {
            setIsModalLoading(true);
            setTimeout(() => setIsModalLoading(false), 500);
        }
    };

    const columns = getColumnsCpu(isFullScreen, user, onTogleEnable, onDetailOkAction, setDetail, setActionFuncion, onDelete);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// UseEffect 


    useEffect(() => {
        document.title = `${strings.dataLoggers} - Wisnam`;
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
                dataLogger: 1
            };
        });
    }, []);


    useEffect(() => {

        if (elementSelected.operation !== null && elementSelected.ids.length > 0) {
            onUpdateAll();
            setElementSelected({ operation: null, ids: [] });
        }


        if (localFilter.text || localFilter.text === '' || localFilter.enabled !== undefined) {
            loadData();
        }

    }, [elementSelected.operation, elementSelected.ids.length, onlyOne, localFilter]);

    useEffect(() => {
        if (!onlyOne) {
            loadData();
        }
    }, [onlyOne]);


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Component 





    return (

        <>

            <ConfirmDialog actionFuncion={actionFuncion} setActionFuncion={setActionFuncion} />




            {detail.open && (

                <CpuDetail load={load} setLoad={setLoad} setAlert={props.setAlert} detail={detail} onOkAction={onDetailOkAction} onCloseAction={() => setDetail({ id: 0, open: false })} />

            )}


            <Box sx={{ height: `calc(${windowSize.height}px - ${config.heightBanner}px);`, display: 'flex', flexDirection: 'column', overflowY: 'auto', p: .2, }}>

                <Box sx={{ flexShrink: 0, mb: 2, mt: { sm: 5, lg: 2 } }}>

                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>



                            <HeaderPage title={strings.dataLoggers} titleTwo={strings.Asset_management} />


                            {!error && (
                                <Box sx={{ display: "flex" }}>

                                    {user?.role !== 'operator' && user !== null && (
                                        <Button onClick={() => setDetail({ id: 0, open: true })}
                                            sx={{ height: "32px", backgroundColor: "primary", fontSize: "14px", fontWeight: 400, textTransform: "none", mr: 1, '&:hover': { backgroundColor: "primary", color: 'white' } }} variant="contained" >
                                            {strings.addNewDataLogger}
                                        </Button>
                                    )}



                                    <ExportMenu user={user} alert={alert} setAlert={props.setAlert} table={"data_logger"} />

                                    {user?.role !== 'operator' && user !== null && <ImportMenu alert={alert} setAlert={props.setAlert} loadData={loadData} />}

                                </Box>
                            )}
                        </Box>


                    </Box>

                </Box>


                {!error ? (
                    <>
                        <Box sx={{ display: "flex", justifyContent: "space-between", backgroundColor: (theme) => `${theme.palette.component.colorSecondary}`, border: "solid 1px #e0e0e0", borderTopLeftRadius: "5px", borderTopRightRadius: "5px" }}>


                            <Box sx={{ width: "100%", display: 'flex', flexDirection: { sm: "column", md: "row" }, justifyContent: "space-between" }}>

                                <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", flexWrap: { sm: "wrap", md: "nowrap" }, py: 2 }}>

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

                                    <Box sx={{ width: "100%", display: "flex", justifyContent: { sm: "center", md: "start" }, alignItems: { md: "center" }, order: { sm: 2, md: 1 }, ml: 2, pl: { sm: 0, md: 2 }, py: 2 }}>


                                        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => setLocalFilter({ ...localFilter, enabled: -1 })}>
                                            <Typography sx={{ color: localFilter.enabled === -1 ? (theme) => `${theme.palette.chip.text}` : (theme) => `${theme.palette.chip.text2}`, fontWeight: localFilter.enabled === -1 ? "500" : "", display: 'inline' }}>
                                                {strings.all}
                                            </Typography>

                                            <Chip
                                                label={onlyOne
                                                    ? allRows.length
                                                    : 0}
                                                sx={{ backgroundColor: (theme) => `${theme.palette.chip.chipAllBg}`, color: (theme) => `${theme.palette.chip.chipAllTxt}`, ml: 2, boxShadow: "none", borderRadius: "5px" }}
                                            />
                                        </Box>

                                        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer", mx: 4 }} onClick={() => setLocalFilter({ ...localFilter, enabled: 1 })}>

                                            <Typography sx={{ color: localFilter.enabled === 1 ? (theme) => `${theme.palette.chip.text}` : (theme) => `${theme.palette.chip.text2}`, fontWeight: localFilter.enabled === 1 ? "500" : "", display: 'inline' }}>
                                                {strings.enable}
                                            </Typography>

                                            <Chip
                                                label={onlyOne
                                                    ? allRows.filter(item => item.enabled === '1').length
                                                    : 0}
                                                sx={{ backgroundColor: localFilter.enabled === 1 ? (theme) => `${theme.palette.chip.chipEnableBgActive}` : (theme) => `${theme.palette.chip.chipEnabledBg}`, color: localFilter.enabled === 1 ? (theme) => `${theme.palette.chip.chipEnabledTxtActive}` : (theme) => `${theme.palette.chip.chipEnabledTxtNotActive}`, ml: 2, boxShadow: "none", borderRadius: "5px" }}
                                            />
                                        </Box>



                                        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => setLocalFilter({ ...localFilter, enabled: 0 })}>
                                            <Typography sx={{ color: localFilter.enabled === 0 ? (theme) => `${theme.palette.chip.text}` : (theme) => `${theme.palette.chip.text2}`, fontWeight: localFilter.enabled === 0 ? "500" : "", display: 'inline' }}>
                                                {strings.disable}
                                            </Typography>

                                            <Chip
                                                label={onlyOne ? allRows.filter(item => item.enabled === '0').length
                                                    : 0}
                                                sx={{ backgroundColor: localFilter.enabled === 0 ? (theme) => `${theme.palette.chip.chipDisableBg}` : (theme) => `${theme.palette.chip.chipDisableBgActive}`, color: localFilter.enabled === 0 ? (theme) => `${theme.palette.chip.chipDisableTxtActive}` : (theme) => `${theme.palette.chip.chipDisableTxtNotActive}`, ml: 2, boxShadow: "none", borderRadius: "5px" }}
                                            />
                                        </Box>



                                    </Box>



                                    <Box sx={{ display: 'flex', alignItems: "center", justifyContent: "end", order: { sm: 1, md: 2 }, mr: 2, py: 1 }}>

                                        {elementSelected.ids.length > 0 && (
                                            <>
                                                <MenuUploadAll changeAllIds={elementSelected} setChangeAllIds={setElementSelected} />

                                                <IconButton title={strings.deleteAll} color="primary" onClick={() => { setActionFuncion({ f: onDeleteAll }) }}>
                                                    <Delete />
                                                </IconButton>
                                            </>

                                        )}




                                        <IconButton title={strings.reload} color="primary" onClick={loadData}>
                                            <Replay />
                                        </IconButton>


                                        <Box display="flex" justifyContent="end" >
                                            <IconButton color="primary" onClick={toggleFullScreen}>
                                                <Fullscreen />
                                            </IconButton>
                                        </Box>





                                    </Box>
                                </Box>





                            </Box>


                        </Box>


                        <DataGridComponent apiRef={apiRef} isModalLoading={isModalLoading} isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} toggleFullScreen={toggleFullScreen} handleSelectionIds={handleSelectionIds} rows={rows} columns={columns} columnsFullScreen={columns} load={load} />


                    </>
                ) : (
                    load ? (

                        <Box sx={{ display: "flex", justifyContent: "center", height: "40vh", alignItems: "center" }}>
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
