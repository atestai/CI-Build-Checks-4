import { useEffect, useState } from "react";
import { Box, IconButton, Typography, FormControl, InputAdornment, Button, CircularProgress, Modal, TextField } from "@mui/material";
import { strings } from '../strings'
import { Delete, Fullscreen, Replay, SignalWifiStatusbarConnectedNoInternet4 } from "@mui/icons-material";
import ServerProxy from "../tools/serverProxy";
import ConfirmDialog from "../components/confirmDialog";
import useWindowSize from "../components/useWindowSize";
import config from "../config";
import SearchIcon from '@mui/icons-material/Search';
import DevicesTypeDetail from './deviceTypeDetail';
import ExportMenu from "../components/ExportMenu";
import ImportMenu from "../components/ImportMenu";
import HeaderPage from '../components/headerPage';
import { getColumnsDeviceType } from '../tools/column'
import DataGridComponent from "../components/DataGridComponent";
import ConnectedLost from "../components/ConnectedLost";





export default function DevicesType(props) {

    const { user } = props;

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Variables ;
    const [actionFuncion, setActionFuncion] = useState(null);
    const [elementSelected, setElementSelected] = useState([]);
    const [detail, setDetail] = useState({ id: 0, open: false });
    const [error, setError] = useState(false);
    const [load, setLoad] = useState(true);
    const [localFilter, setLocalFilter] = useState({ enabled: -1 });
    const [rows, setRows] = useState([]);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const windowSize = useWindowSize();



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Functions 



    const loadData = async () => {

        setLoad(true);

        try {

            const devicesType = await ServerProxy.getDevicesType({
                ...localFilter
            });
            setRows(devicesType);
        } catch (error) {
            props.setAlert(prevState => ({
                ...prevState,
                message: error?.response?.data?.message || 'An unknown error occurred',
                hide: 1,
                severity: "error"
            }));
            setError(true);
            setRows([]);
            setDetail({ id: 0, open: false })

        }
        finally {
            setLoad(false);
        }
    }


    const handleSelectionIds = (newSelection) => {
        setElementSelected(newSelection);
    };


    const onDetailOkAction = async function (obj) {

        try {
            if (obj?.id) {
                await ServerProxy.editDeviceType(obj);
            } else if (obj) {
                await ServerProxy.addDeviceType(obj);

            }

            loadData();
            setDetail({ id: 0,open: false});

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
            setLoad(false);

        } finally {
            setLoad(false);
        }
    };


    const onDelete = async function (id) {


        try {
            await ServerProxy.deleteDeviceType(id);
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
            await ServerProxy.deleteMultipleDeviceTypes(elementSelected);
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


    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
        if (!isFullScreen) {
            setIsModalLoading(true);
            setTimeout(() => setIsModalLoading(false), 500);
        }
    };



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Import Column 

    const columns = getColumnsDeviceType(isFullScreen, user, onDetailOkAction, setDetail, setActionFuncion, onDelete);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// UseEffect 



    useEffect(() => {
        document.title = `${strings.deviceModels} - Wisnam`;
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
                devicesType: 1 // Imposta il valore desiderato
            };
        });
        loadData();

    }, []);




    useEffect(() => {
        if (localFilter.text || localFilter.text === '') {
            loadData();
        }
    }, [localFilter])


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Component 


    return (

        <>
            <ConfirmDialog actionFuncion={actionFuncion} setActionFuncion={setActionFuncion} />
            {detail.open && (
                <DevicesTypeDetail load={load} setLoad={setLoad} setAlert={props.setAlert} detail={detail} onOkAction={onDetailOkAction} onCloseAction={() => setDetail({ id: 0, open: false })} />
            )}


            <Box sx={{ height: `calc(${windowSize.height}px - ${config.heightBanner}px);`, display: 'flex', flexDirection: 'column', overflowY: 'auto', p: .2 }}>



                <Box sx={{ flexShrink: 0, mb: 2, mt: { sm: 5, lg: 2 } }}>

                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>




                            <HeaderPage title={strings.deviceModels} titleTwo={strings.Asset_management} />


                            {!error && (

                                <Box sx={{ display: "flex" }}>

                                    {(user !== null && user?.role !== 'operator') && (

                                        <Button onClick={() => setDetail({ id: 0, open: true })}
                                            sx={{ height: "32px", color: (theme) => `${theme.palette.primary.textIntoButton}`, backgroundColor: "primary", textTransform: "none", fontSize: "14px", fontWeight: 400, mr: 1, '&:hover': { backgroundColor: "primary", color: (theme) => `${theme.palette.primary.textIntoButton}` } }} variant="contained" >
                                            {strings.addNewDevicesType}
                                        </Button>
                                    )}

                                    <ExportMenu alert={alert} setAlert={props.setAlert} table={"device_type"} />



                                    {(user !== null && user?.role !== 'operator') && (<ImportMenu alert={alert} setAlert={props.setAlert} user={user} loadData={loadData} />)}

                                </Box>
                            )}
                        </Box>


                    </Box>

                </Box>

                {!error ? (
                    <>
                        <Box sx={{ display: "flex", justifyContent: "space-between", backgroundColor: (theme) => `${theme.palette.component.colorSecondary}`, border: "1px solid #e0e0e0", borderTopLeftRadius: "5px", borderTopRightRadius: "5px" }}>

                            <Box sx={{ width: "100%", display: 'flex', justifyContent: "space-between" }}>

                                <Box sx={{ display: 'flex', alignItems: "center", pl: 2, py: 2 }}>



                                    <FormControl variant="standard" sx={{ minWidth: 200 }}>



                                        <TextField id="standard-basic" label="Search for model" variant="outlined"

                                            sx={{
                                                backgroundColor: "white",
                                                borderRadius: 1,
                                                '& .MuiInputLabel-root': { color: 'primary.main' },
                                                '& .MuiInput-underline:before': { borderBottom: '1px solid primary.main' },
                                                '& .MuiInput-underline:hover:before': { borderBottom: '1px solid primary.main' },
                                                '& .MuiInput-underline:after': { borderBottom: '2px solid primary.main' },
                                            }}

                                            placeholder="Search for model"
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