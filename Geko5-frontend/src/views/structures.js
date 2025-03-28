import { useEffect, useRef, useState } from "react";
import { Link as LinkRouter } from 'react-router-dom';
import StructuresDetail from '../views/structuresDetail';
import { Box, FormControl, IconButton, Button, CircularProgress, TextField } from "@mui/material";
import { useGridApiRef } from '@mui/x-data-grid';
import { strings } from '../strings'
import { Delete, Replay, Fullscreen, ExitToApp, ArrowBack } from "@mui/icons-material";
import ServerProxy from "../tools/serverProxy";
import ConfirmDialog from "../components/confirmDialog";
import useWindowSize from "../components/useWindowSize";
import config from "../config";
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import ExportMenu from "../components/ExportMenu";
import ImportMenu from "../components/ImportMenu";
import HeaderPage from "../components/headerPage";
import { getColumnsSignal } from "../tools/column"
import { useParams } from "react-router-dom";
import DataGridComponent from "../components/DataGridComponent";
import ConnectedLost from "../components/ConnectedLost";




export default function Structures(props) {


    const { user } = props;
    const { id } = useParams();

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Variables 

    const [actionFuncion, setActionFuncion] = useState(null);
    const [detail, setDetail] = useState({ idDeviceType: id, open: false, openEvent: false, idRow: undefined });
    const [elementSelected, setElementSelected] = useState([]);
    const [error, setError] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [load, setLoad] = useState(true);
    const [localFilter, setLocalFilter] = useState({ enabled: -1 });
    const [modelDeviceType, setModelDeviceType] = useState('');
    const [rows, setRows] = useState([]);
    const windowSize = useWindowSize();



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Functions 



    const copyRecord = async (obj, id) => {


        let eventResponse;
        let newObj = { ...obj };
        if (obj.signalType === 'bitmask') {
            eventResponse = await ServerProxy.getBitMasksForSignal(id);
            const cleanedEventResponse = eventResponse.map(({ device_type_data_structure_, device_type_data_structure_id, id, ...rest }) => rest);
            newObj = { ...newObj, event: cleanedEventResponse };


        }

        if (obj.signalType === 'enumeration') {
            eventResponse = await ServerProxy.getEnumerationsForSignal(id);
            const cleanedEventResponse = eventResponse.map(({ device_type_data_structure_, device_type_data_structure_id, id, ...rest }) => rest);
            newObj = { ...newObj, event: cleanedEventResponse };
        }


        onDetailOkAction(newObj)
    }




    const handleSelectionIds = (newSelection) => {
        setElementSelected(newSelection);
    };


    const loadData = async () => {
        setLoad(true);

        try {
            const deviceType = await ServerProxy.getDeviceType(id);



            const rows = await ServerProxy.getStructuresForIds(id, localFilter);
            console.log("rows", rows);

            setModelDeviceType(deviceType.model)
            setRows(rows)
        } catch (error) {
            setRows([]);
            setError(true);
            props.setAlert(prevState => ({
                ...prevState,
                message: error?.response?.data?.message || 'An unknown error occurred',
                hide: 1,
                severity: "error"
            }));

        } finally {
            setLoad(false);
        }
    };


    const onDelete = async function (id) {

        try {
            await ServerProxy.deleteStructures(id);
            await loadData();
            props.setAlert(prevState => ({
                ...prevState,
                message: strings.status200Operation,
                hide: 1,
                severity: "success"
            }));
        } catch (error) {

            props.setAlert(prevState => ({
                ...prevState,
                message: error?.response?.data?.message || 'An unknown error occurred',
                hide: 1,
                severity: "error"
            }));
        }
        finally {
            setActionFuncion(null);
        }


    }


    const onDeleteAll = async () => {


        try {

            await ServerProxy.deleteMultipleStructures(elementSelected);
            await loadData();
            props.setAlert(prevState => ({
                ...prevState,
                message: strings.status200Operation,
                hide: 1,
                severity: "success"
            }));
        } catch (error) {

            props.setAlert(prevState => ({
                ...prevState,
                message: error?.response?.data?.message || 'An unknown error occurred',
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
                const { event, ...objWithoutEvent } = obj;

                await ServerProxy.editStructures(objWithoutEvent);

                if (objWithoutEvent.signalType === 'bitmask') {
                    await ServerProxy.putBitmask(objWithoutEvent.id, event)
                }

                if (objWithoutEvent.signalType === 'enumeration') {
                    await ServerProxy.putEnumeration(objWithoutEvent.id, event)
                }


            } else if (obj) {

                const { event, ...objWithoutEvent } = obj;

                console.log("event,", event);

                console.log("objWithoutEvent,", objWithoutEvent);


                const response = await ServerProxy.addStructuresForId(objWithoutEvent);

                if (objWithoutEvent.signalType === 'bitmask') {
                    await ServerProxy.addBitmask(response.item.id, event);
                }

                if (objWithoutEvent.signalType === 'enumeration') {
                    await ServerProxy.addEnumeration(response.item.id, event);
                }








            }

            loadData();
            setDetail({ idRow: null, open: false, signal: [] });

            props.setAlert(prevState => ({
                ...prevState,
                message: strings.status200Operation,
                hide: 1,
                severity: "success"
            }));

            setLoad(false)

        } catch (error) {
            setLoad(false)
            props.setAlert(prevState => ({
                ...prevState,
                message: error?.response?.data?.message || 'An unknown error occurred',
                hide: 1,
                severity: "error"
            }));
        }
    };


    const onTogleEnable = async function (option) {

        try {
            const { id, value } = option;
            const obj = {
                id: id,
                showOnGraphic: value == 0 ? "1" : "0"
            }
            await ServerProxy.editStructures(obj);
            await loadData();
            props.setAlert(prevState => ({
                ...prevState,
                message: strings.status200Operation,
                hide: 1,
                severity: "success"
            }));

        } catch (error) {
            props.setAlert(prevState => ({
                ...prevState,
                message: error?.response?.data?.message || 'An unknown error occurred',
                hide: 1,
                severity: "error"
            }));
            console.log(error);
        }
    };


    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
        if (!isFullScreen) {
            setIsModalLoading(true);
            setTimeout(() => setIsModalLoading(false), 500);
        }
    };



    const columns = getColumnsSignal(isFullScreen, user, onTogleEnable, onDetailOkAction, setDetail, setActionFuncion, onDelete, id, copyRecord);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Use Effect 


    useEffect(() => {
        loadData();
        document.title = "Device type - Signals - Wisnam";
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
                devicesType: 1
            };
        });

    }, []);


    useEffect(() => {


        if (localFilter.text || localFilter.text === '') {
            loadData();
        }

    }, [localFilter])







    return (

        <>

            <ConfirmDialog actionFuncion={actionFuncion} setActionFuncion={setActionFuncion} />

            {(detail.open || detail.openEvent) &&
                <StructuresDetail load={load} setLoad={setLoad} setAlert={props.setAlert} alert={alert} setDetail={setDetail} detail={detail} onOkAction={onDetailOkAction} onCloseAction={() => setDetail({ idDeviceType: id, open: false, idRow: null })} />
            }

            <Box sx={{ height: `calc(${windowSize.height}px - ${config.heightBanner}px);`, display: 'flex', flexDirection: 'column', }}>

                <Box sx={{ flexShrink: 0, mb: 2, mt: { sm: 5, lg: 2 } }}>


                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>

                        <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: { sm: "column", md: "row" } }}>



                            <HeaderPage route={true} path={'/devicesType'} anidate={true} anidateTitle={modelDeviceType} title={strings.signals} titleTwo={strings.deviceModels} />


                            {!error && (
                                <Box sx={{ width: { sm: "100%", md: "inherit" }, display: "flex", justifyContent: { sm: "end", md: "inherit" }, mt: { sm: 2, md: 0 } }}>


                                  

                                    <Button component={LinkRouter} to={`/devicesType`} sx={{ height: "32px", backgroundColor: "primary", textTransform: "none", fontSize: "14px", fontWeight: 400, mr: 1, '&:hover': { backgroundColor: "primary", color: (theme) => `${theme.palette.primary.textIntoButton}` } }} variant="contained" >
                                        <ArrowBack />
                                    </Button>




                                    {(user !== null && user?.role !== "operator") && (
                                        <>
                                            <Button onClick={() => setDetail((prev) => ({ ...prev, open: true, idRow: 0, idDeviceType: id }))} sx={{ height: "32px", backgroundColor: "primary", textTransform: "none", fontSize: "14px", fontWeight: 400, mr: 1, '&:hover': { backgroundColor: "primary", color: "white" } }} variant="contained" >
                                                {strings.newStructures}
                                            </Button>
                                            <ImportMenu alert={alert} setAlert={props.setAlert} loadData={loadData} />
                                        </>
                                    )}

                                    <ExportMenu alert={alert} setAlert={props.setAlert} table={"devicetype_data_structure"} />





                                </Box>
                            )}
                        </Box>


                    </Box>

                </Box>

                {!error ? (



                    <>
                        <Box sx={{ display: "flex", justifyContent: "space-between", backgroundColor: (theme) => `${theme.palette.component.colorSecondary}`, border: "1px solid #e0e0e0", borderTopLeftRadius: "5px", borderTopRightRadius: "5px" }}>


                            <Box sx={{ display: 'flex', alignItems: "center", pl: 2, py: 2 }}>


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



                            <Box sx={{ display: 'flex', alignItems: "center", justifyContent: "end", pr: 2, py: 1 }}>

                                {elementSelected.length > 0 && (

                                    <IconButton title={strings.deleteAll} color="primary" onClick={() => { setActionFuncion({ f: onDeleteAll }) }} >
                                        <Delete />
                                    </IconButton>


                                )}




                                <IconButton title={strings.reload} color="primary" onClick={loadData} >
                                    <Replay />
                                </IconButton>


                                <Box display="flex" justifyContent="end" p={1}>
                                    <IconButton color="primary" onClick={toggleFullScreen}>
                                        <Fullscreen />
                                    </IconButton>
                                </Box>




                            </Box>


                        </Box>


                        <DataGridComponent isModalLoading={isModalLoading} isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} toggleFullScreen={toggleFullScreen} handleSelectionIds={handleSelectionIds} rows={rows} columns={columns} columnsFullScreen={columns} load={load} />


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
