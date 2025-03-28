import { useEffect, useState } from "react";

import { Autocomplete, Box, Button, Chip, CircularProgress, FormControl, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import AssociationAlarm from '../views/associationAlarm';
import DeviceDetail from '../views/deviceDetail';
import CpuDetail from "./cpuDetail";
import DeviceInterfaceDetail from "./deviceInterfaceDetail";
import DevicesTypeDetail from './deviceTypeDetail';
import { useGridApiRef } from '@mui/x-data-grid';
import { strings } from '../strings'
import { Delete, FilterAlt, Fullscreen, Replay, EditNotifications } from "@mui/icons-material";
import ServerProxy from "../tools/serverProxy";
import ConfirmDialog from "../components/confirmDialog";
import useWindowSize from "../components/useWindowSize";
import config from "../config";
import SearchIcon from '@mui/icons-material/Search';
import MenuUploadAll from "../components/MenuUploadAll";
import ExportMenu from "../components/ExportMenu";
import ImportMenu from "../components/ImportMenu";
import ConnectedLost from "../components/ConnectedLost";
import DataGridComponent from "../components/DataGridComponent";
import HeaderPage from "../components/headerPage";
import { getColumnsDevice } from "../tools/column"




export default function Devices(props) {

    const { user } = props;


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Variables 



    const [actionFuncion, setActionFuncion] = useState(null);
    const [associationAlarm, setAssociationAlarm] = useState({ id: 0, open: false });
    const [allRows, setAllRows] = useState([]);
    const apiRef = useGridApiRef();
    const [detail, setDetail] = useState({ id: 0, open: false });
    const [detailInfo, setDetailInfo] = useState({ cpu: { id: 0, open: false, show: false }, deviceInterface: { id: 0, open: false, show: false }, deviceType: { id: 0, open: false, show: false } })
    const [elementSelected, setElementSelected] = useState({ operation: null, ids: [] });
    const [error, setError] = useState(false);
    const [filter, setFilter] = useState({ deviceModels: [], dataLoggers: [], deviceInterfaces: [], show: false });
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [load, setLoad] = useState(true);
    const [localFilter, setLocalFilter] = useState({ enabled: undefined });
    const [onlyOne, setOnlyOne] = useState(false);
    const [rows, setRows] = useState([]);
    const windowSize = useWindowSize();



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Functions

    const loadData = async () => {

        setLoad(true);

        try {

            const devices = await ServerProxy.getDevices({
                ...localFilter
            });


            console.log("devices",devices);
            

            setRows(devices.map(item => ({
                ...item,
                interfaceObj: item?.interface || '-',
                deviceTypeObj: item.deviceType,
                dataLoggerObj: item.dataLogger,
                deviceType: item.deviceType.model,
                interfaceHost: item.interface?.host || '-',
                interfacePort: item.interface?.port || '-',
                interface: item.interface?.name || '-',
                dataLogger: item.dataLogger.name
            })));


            if (!onlyOne) {

                setAllRows(devices);
                setOnlyOne(true);

                const deviceTypeIds = Array.from(
                    devices.reduce((acc, device) => {
                        const id = device.deviceType.id;
                        const model = device.deviceType.model;

                        if (!acc.has(id)) {
                            acc.set(id, { label: model, id: id });
                        }

                        return acc;
                    }, new Map()).values()
                );

                const dataLoggerIds = Array.from(
                    devices.reduce((acc, device) => {
                        const id = device.dataLogger.id;
                        const name = device.dataLogger.name;

                        if (!acc.has(id)) {
                            acc.set(id, { label: name, id: id });
                        }

                        return acc;
                    }, new Map()).values()
                );

                const deviceInterfaceIds = Array.from(
                    devices.reduce((acc, device) => {
                        const id = device?.interface?.id || '-';
                        const name = device?.interface?.name || '-';

                        if (!acc.has(id)) {
                            acc.set(id, { label: name, id: id });
                        }

                        return acc;
                    }, new Map()).values()
                );

                setFilter((prev) => ({
                    ...prev,
                    deviceModels: deviceTypeIds,
                    dataLoggers: dataLoggerIds,
                    deviceInterfaces: deviceInterfaceIds
                }))


            }


        } catch (error) {

            console.log("Errore ricevuto",error);
            
            setRows(null);
            setError(true);

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
        finally {
            setLoad(false);
        }
    }


    const onDelete = async function (id) {

        try {
            await ServerProxy.deleteDevice(id);
            setLocalFilter({ text: '' });
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

    }


    const onDeleteAll = async () => {


        try {
            await ServerProxy.deleteMultipleDevice(elementSelected.ids);
            setLocalFilter({ text: '' });
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


    const onTogleEnable = async function (option) {

        try {
            const { id, value } = option;

            await ServerProxy.togleStatusDevice(id, value);
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


    }


    const onUpdateAll = async () => {




        try {
            await ServerProxy.updateMultipleDevice(elementSelected);
            apiRef.current.setRowSelectionModel([]);
            setLocalFilter({ text: '' });
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


    const onDetailOkAction = async function (obj, notChange) {

        try {
            if (obj?.id) {



                await ServerProxy.editDevice({
                    id: obj.id,
                    name: obj.name,
                    enabled: obj.enabled,
                    description: obj.description,
                    dataLoggerId: obj.dataLoggerId,
                    deviceTypeId: obj.deviceTypeId
                });

                if (!notChange) {
                    await ServerProxy.addAssociationInterfaceDevice(obj.id, {
                        interfaceId: obj.protocol === 'TCP' ? obj.deviceInterfaceId : null,
                        protocol: obj.protocol,
                        pollingPeriod: obj.pollingPeriod * 1000,
                        config: {
                            unitId: obj.unitId,
                            wordOrder: obj.wordOrder,
                            byteOrder: obj.byteOrder
                        }

                    });
                }


            } else if (obj) {


                const response = await ServerProxy.addDevice({
                    name: obj.name,
                    enabled: obj.enabled,
                    description: obj.description,
                    dataLoggerId: obj.dataLoggerId,
                    deviceTypeId: obj.deviceTypeId
                });

                const deviceId = response.device.id;
                await ServerProxy.addAssociationInterfaceDevice(deviceId, {
                    interfaceId: obj.protocol === 'TCP' ? obj.deviceInterfaceId : null,
                    pollingPeriod: obj.pollingPeriod * 1000,
                    protocol: obj.protocol,
                    config: {
                        unitId: obj.unitId,
                        wordOrder: obj.wordOrder,
                        byteOrder: obj.byteOrder
                    }

                });

            }

            setOnlyOne(false);
            setLoad(false)
            setDetail({
                id: null,
                open: false
            });

            props.setAlert(prevState => ({
                ...prevState,
                message: strings.status200Operation,
                hide: 1,
                severity: "success"
            }));

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
        } finally {
            //setLock(false);
        }
    };


    const onDetailOkActionAssociationAlarm = async function (obj) {

        try {
            setLoad(true)


            const { ids } = elementSelected;

            if (obj.selectedAsset.length > 0) {
                await ServerProxy.updateAlarmAssociation(obj)
            } else if (ids.length > 0) {
                obj.selectedAsset = [...ids];
                await ServerProxy.addAssociationAlarm(obj);
            }




            props.setAlert(prevState => ({
                ...prevState,
                message: strings.status200Operation,
                hide: 1,
                severity: "success"
            }));


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

                }
            }

        } finally {
            setLoad(false)
            apiRef.current.setRowSelectionModel([]);

        }
    }


    const handleSelectionIds = (newSelection) => {
        setElementSelected(prevState => ({
            ...prevState,
            ids: newSelection
        }));
    };


    const handleCopyRecord = async (record) => {

        try {
            const interfaceData = await ServerProxy.getInterfaceForDevice(record.id);


            onDetailOkAction({
                name: record.name + "_copy-1",
                enabled: record.enabled,
                description: record.description,
                dataLoggerId: record.dataLoggerId,
                deviceTypeId: record.deviceTypeId,
                deviceInterfaceId: interfaceData.data.protocol === 'RTU' ? null : interfaceData.data.interfaceId,
                pollingPeriod: interfaceData.data.pollingPeriod / 1000,
                byteOrder: interfaceData.data.config.byteOrder,
                wordOrder: interfaceData.data.config.wordOrder,
                protocol: interfaceData.data.protocol,
                unitId: interfaceData.data.config.unitId,


            }, true);


        } catch (error) {
            props.setAlert(prevState => ({
                ...prevState,
                message: error.response.data.message,
                hide: 1,
                severity: "error"
            }));
        }






    }


    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
        if (!isFullScreen) {
            setIsModalLoading(true);
            setTimeout(() => setIsModalLoading(false), 500);
        }
    };




    const columns = getColumnsDevice(isFullScreen, user, onTogleEnable, handleCopyRecord, setDetailInfo, setAssociationAlarm, setDetail, setActionFuncion, onDelete)

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// UseEffect


    useEffect(() => {
        document.title = `${strings.devices} - Wisnam`;
        setLocalFilter({ deviceTypeId: undefined, dataLoggerId: undefined, interfaceId: undefined });
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
                devices: 1
            };
        });

    }, []);


    // useEffect(() => {

    //     if (
    //         localFilter.text === '' || localFilter.text ||
    //         localFilter.deviceTypeId !== undefined ||
    //         localFilter.dataLoggerId !== undefined ||
    //         localFilter.interfaceId !== undefined ||
    //         localFilter.enabled !== undefined
    //     ) {

    //         loadData();
    //     }

    // }, [localFilter])


    useEffect(() => {
        if (elementSelected.operation !== null && elementSelected.ids.length > 0) {
            onUpdateAll();
            setElementSelected({ operation: null, ids: [] });
        }

        if (!onlyOne) {
            loadData();
        }


    }, [onlyOne, elementSelected.operation, elementSelected.ids.length]);

   

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Component



    return (

        <>
            <ConfirmDialog actionFuncion={actionFuncion} setActionFuncion={setActionFuncion} />

            {detail.open && (
                <DeviceDetail load={load} setAlert={props.setAlert} setLoad={setLoad} alert={alert} detail={detail} onOkAction={onDetailOkAction} onCloseAction={() => setDetail({ id: null, open: false })} />
            )}


            {detailInfo.cpu.open && (
                <CpuDetail load={load} setLoad={setLoad} setAlert={props.setAlert} detail={detailInfo.cpu} onCloseAction={() => setDetailInfo((prev) => ({ ...prev, cpu: { id: 0, open: false, show: false } }))} />
            )}


            {detailInfo.deviceInterface.open && (
                <DeviceInterfaceDetail load={load} setLoad={setLoad} setAlert={props.setAlert} detail={detailInfo.deviceInterface} onCloseAction={() => setDetailInfo((prev) => ({ ...prev, deviceInterface: { id: 0, open: false, show: false } }))} />
            )}


            {detailInfo.deviceType.open && (
                <DevicesTypeDetail load={load} setLoad={setLoad} setAlert={props.setAlert} detail={detailInfo.deviceType} onCloseAction={() => setDetailInfo((prev) => ({ ...prev, deviceType: { id: 0, open: false, show: false } }))} />
            )}


            {associationAlarm.open === true && (
                <AssociationAlarm load={load} setLoad={setLoad} setAlert={props.setAlert} alert={alert} setAssociationAlarm={setAssociationAlarm} associationAlarm={associationAlarm} onOkAction={onDetailOkActionAssociationAlarm} onCloseAction={() => setAssociationAlarm({ open: false })} />
            )}



            <Box sx={{ height: `calc(${windowSize.height}px - ${config.heightBanner}px);`, display: 'flex', flexDirection: 'column', }}>

                <Box sx={{ flexShrink: 0, mb: 2, mt: { sm: 5, lg: 2 } }}>

                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>



                            <HeaderPage title={strings.devices} titleTwo={strings.Asset_management} />


                            {!error && (

                                <Box sx={{ display: "flex" }}>

                                    {user !== null && user?.role !== "operator" &&

                                        <Button onClick={() => setDetail({ id: 0, open: true })}
                                            sx={{ height: "32px", backgroundColor: "primary", textTransform: "none", fontSize: "14px", fontWeight: 400, mr: 1, '&:hover': { backgroundColor: "primary", color: (theme) => `${theme.palette.primary.textIntoButton}` } }} variant="contained" >
                                            {strings.addNewDevices}
                                        </Button>


                                    }



                                    <ExportMenu alert={alert} setAlert={props.setAlert} table={"device"} />



                                    {user !== null && user?.role !== 'operator' && <ImportMenu alert={alert} setAlert={props.setAlert} user={user} loadData={loadData} />}



                                </Box>

                            )}

                        </Box>


                    </Box>

                </Box>

                {!error ? (
                    <>
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: 'component.colorSecondary', border: "1px solid #e0e0e0", borderTopLeftRadius: "5px", borderTopRightRadius: "5px", }}>


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

                                    <Box sx={{ display: "flex", width: "100%", justifyContent: { sm: "center", md: "start" }, alignItems: { md: "center" }, ml: 2, pl: { sm: 0, md: 2 }, py: 2, order: { sm: 2, md: 1 } }}>

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
                                                sx={{ backgroundColor: localFilter.enabled === 1 ? (theme) => `${theme.palette.primary.dark}` : (theme) => `${theme.palette.primary.light}`, color: 'white', ml: 2, boxShadow: "none", borderRadius: "5px" }}
                                            />
                                        </Box>


                                        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => setLocalFilter({ ...localFilter, enabled: 0 })}>
                                            <Typography sx={{ color: localFilter.enabled === 0 ? (theme) => `${theme.palette.chip.text}` : (theme) => `${theme.palette.chip.text2}`, fontWeight: localFilter.enabled === 0 ? "500" : "", display: 'inline' }}>
                                                {strings.disable}
                                            </Typography>

                                            <Chip
                                                label={onlyOne ? allRows.filter(item => item.enabled === '0').length
                                                    : 0}
                                                sx={{ backgroundColor: localFilter.enabled === 0 ? (theme) => `${theme.palette.error.dark}` : (theme) => `${theme.palette.error.light}`, color: 'white', ml: 2, boxShadow: "none", borderRadius: "5px" }}
                                            />
                                        </Box>

                                    </Box>




                                    <Box sx={{ display: 'flex', alignItems: "center", justifyContent: "end", order: { sm: 1, md: 2 }, mr: 2, py: 1 }}>




                                        {elementSelected.ids.length > 0 && (
                                            <>
                                                <MenuUploadAll changeAllIds={elementSelected} setChangeAllIds={setElementSelected} />

                                                <IconButton
                                                    title={strings.deleteAll}
                                                    color="primary"
                                                    onClick={() => { setActionFuncion({ f: onDeleteAll }) }}
                                                >
                                                    <Delete />
                                                </IconButton>

                                                <IconButton title={strings.associationAlarm} color="primary" onClick={() => setAssociationAlarm({ id: 0, open: true })}>
                                                    <EditNotifications />
                                                </IconButton>
                                            </>
                                        )}

                                        <IconButton title={strings.filters} color="primary" onClick={() => { setFilter((prev) => ({ ...prev, show: !prev.show })) }} >
                                            <FilterAlt />
                                        </IconButton>


                                        <IconButton title={strings.reload} color="primary" onClick={loadData} >
                                            <Replay />
                                        </IconButton>

                                        <Box display="flex" justifyContent="end">
                                            <IconButton title="FullScreen" color="primary" onClick={toggleFullScreen}>
                                                <Fullscreen />
                                            </IconButton>
                                        </Box>










                                    </Box>
                                </Box>


                            </Box>

                            {filter.show && (

                                <Box sx={{ display: "flex", justifyContent: "flex-start", borderTopLeftRadius: "5px", borderTopRightRadius: "5px", mb: 1, mt: { sm: 2, md: 0 }, px: { sm: 3, md: 2 } }}>

                                    <FormControl variant="standard" sx={{ width: "100%", maxWidth: "250px", background: "white" }}>
                                        <Autocomplete
                                            disablePortal
                                            options={filter.deviceModels || []}
                                            value={filter.deviceModels.find(option => option.id === localFilter?.deviceTypeId) || null}
                                            onChange={(event, newValue) => {
                                                setLocalFilter({ ...localFilter, deviceTypeId: newValue ? newValue.id : null });
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={strings.deviceModel}
                                                    variant="outlined"
                                                    placeholder="Search device model"
                                                    sx={{
                                                        borderRadius: 1,
                                                        '& .MuiInputLabel-root': {
                                                            color: 'primary.main',
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': {
                                                            color: 'primary.main',
                                                        },
                                                        '& .MuiInput-underline:before': {
                                                            borderBottom: '1px solid  primary.main',
                                                        },
                                                        '& .MuiInput-underline:hover:before': {
                                                            borderBottom: '1px solid  primary.main',
                                                        },
                                                        '& .MuiInput-underline:after': {
                                                            borderBottom: '1px solid  primary.main',
                                                        },
                                                    }}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                    }}
                                                />
                                            )}
                                        />
                                    </FormControl>


                                    <FormControl variant="standard" sx={{ width: "100%", maxWidth: "250px", background: "white", mx: 2 }}>
                                        <Autocomplete
                                            disablePortal
                                            options={filter.dataLoggers || []}
                                            value={filter.dataLoggers.find(option => option.id === localFilter?.dataLoggerId) || null}
                                            onChange={(event, newValue) => {
                                                setLocalFilter({ ...localFilter, dataLoggerId: newValue ? newValue.id : null });
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Data logger"
                                                    variant="outlined"
                                                    placeholder="Search data logger"
                                                    sx={{
                                                        borderRadius: 1,
                                                        '& .MuiInputLabel-root': {
                                                            color: 'primary.main',
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': {
                                                            color: 'primary.main',
                                                        },
                                                        '& .MuiInput-underline:before': {
                                                            borderBottom: '1px solid  primary.main',
                                                        },
                                                        '& .MuiInput-underline:hover:before': {
                                                            borderBottom: '1px solid  primary.main',
                                                        },
                                                        '& .MuiInput-underline:after': {
                                                            borderBottom: '1px solid  primary.main',
                                                        },
                                                    }}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                    }}
                                                />
                                            )}
                                        />
                                    </FormControl>


                                    <FormControl variant="standard" sx={{ width: "100%", maxWidth: "250px", background: "white" }}>
                                        <Autocomplete
                                            disablePortal
                                            options={filter.deviceInterfaces || []}
                                            value={filter.deviceInterfaces.find(option => option.id === localFilter?.interfaceId) || null}
                                            onChange={(event, newValue) => {
                                                setLocalFilter({ ...localFilter, interfaceId: newValue ? newValue.id : null });
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={strings.deviceInterface}
                                                    variant="outlined"
                                                    placeholder="Search device interface"
                                                    sx={{
                                                        borderRadius: 1,
                                                        '& .MuiInputLabel-root': {
                                                            color: 'primary.main',
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': {
                                                            color: 'primary.main',
                                                        },
                                                        '& .MuiInput-underline:before': {
                                                            borderBottom: '1px solid  primary.main',
                                                        },
                                                        '& .MuiInput-underline:hover:before': {
                                                            borderBottom: '1px solid  primary.main',
                                                        },
                                                        '& .MuiInput-underline:after': {
                                                            borderBottom: '1px solid  primary.main',
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



                            )}
                        </Box>


                        <DataGridComponent apiRef={apiRef} isModalLoading={isModalLoading} isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} toggleFullScreen={toggleFullScreen} handleSelectionIds={handleSelectionIds} rows={rows} columns={columns} columnsFullScreen={columns} load={load} />

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
