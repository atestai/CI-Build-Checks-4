import { useEffect,  useState } from "react";
import { Box, FormControl, IconButton,  Button, CircularProgress, TextField } from "@mui/material";
import {  useGridApiRef } from '@mui/x-data-grid';
import { strings } from '../strings'
import { Delete,  Replay,  Fullscreen } from "@mui/icons-material";
import ServerProxy from "../tools/serverProxy";
import ConfirmDialog from "../components/confirmDialog";
import useWindowSize from "../components/useWindowSize";
import config from "../config";
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import ExportMenu from "../components/ExportMenu";
import ImportMenu from "../components/ImportMenu";
import InfoAlarmAssociation from "../views/infoAlarmAssociation";
import { Link as LinkRouter } from 'react-router-dom';
import ConnectedLost from "../components/ConnectedLost";
import HeaderPage from "../components/headerPage";
import DataGridComponent from "../components/DataGridComponent";
import {getColumnsAlarmList} from "../tools/column"




export default function AlarmList(props) {

    const { user } = props;

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Variables 

    const [actionFuncion, setActionFuncion] = useState(null);
    const [detail, setDetail] = useState({ open: false, id: 0 });
    const [error, setError] = useState(false)
    const [elementSelected, setElementSelected] = useState([]);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [load, setLoad] = useState(true);
    const [localFilter, setLocalFilter] = useState({ enabled: -1 });
    const [rows, setRows] = useState([]);
    const windowSize = useWindowSize();

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Functions 


    const handleSelectionIds = (newSelection) => {
        setElementSelected(newSelection);
    };


    const loadData = async () => {
        setLoad(true);
        try {
            const data = await ServerProxy.getConfigurationAlarms({
                ...localFilter
            });

            data.forEach((item) => { item.association_asset_alarm = JSON.parse(item.association_asset_alarm) })
            setRows(data);

        } catch (error) {
            props.setAlert(prevState => ({
                ...prevState,
                message: error?.response?.data?.message || 'An unknown error occurred',
                hide: 1,
                severity: "error"
            }));

            setRows([]);
            setError(true);
        } finally {
            setLoad(false);
        }
    };


    const onDelete = async function (id) {

        try {
            await ServerProxy.deleteConfigurationAlarm(id);
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


    const onDeleteAll = async () => {
        try {
            await ServerProxy.deleteMultipleConfigurationAlarms(elementSelected);
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


    const copyAlarm = async (obj) => {

        try {

            await ServerProxy.addConfigurationAlarms(obj)
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
    }



    const columns = getColumnsAlarmList(user,  setDetail, copyAlarm, setActionFuncion, onDelete)
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// UseEffect 




    useEffect(() => {

        loadData();
        document.title = `${strings.alarmlist} - Wisnam`;
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
                alarm: 0,
                alarmList: 0,
            };

            return {
                ...resetValues,
                alarmList: 1
            };
        });

    }, []);


    useEffect(() => {

        if (
            localFilter.text === '' || localFilter.text
        ) {

            loadData();
        }

    }, [localFilter])




    return (

        <>

            <ConfirmDialog actionFuncion={actionFuncion} setActionFuncion={setActionFuncion} />

            {detail.open && (
                <InfoAlarmAssociation setAlert={props.setAlert} detail={detail} onCloseAction={() => setDetail({ id: 0, open: false })} />
            )}




            <Box sx={{ height: `calc(${windowSize.height}px - ${config.heightBanner}px);`, display: 'flex', flexDirection: 'column', overflowY: 'auto', p: .2 }}>
                <Box sx={{ flexShrink: 0, mb: 2, mt: { sm: 5, lg: 2 } }}>

                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>



                            <HeaderPage title={strings.alarmlist} titleTwo={strings.alarmsManagement} />

                            {!error && (
                                <Box sx={{ display: "flex" }}>

                                    {(user !== null && user?.role !== 'operator') &&

                                        <Button component={LinkRouter} to={`/alarmDetail`}
                                            sx={{ height: "32px", backgroundColor: "primary", textTransform: "none", fontSize: "14px", fontWeight: 400, mr: 1, '&:hover': { backgroundColor: "primary", color: (theme) => `${theme.palette.primary.textIntoButton}` } }} variant="contained" >
                                            {strings.createAlarm}
                                        </Button>



                                    }

                                    <ExportMenu alert={alert} setAlert={props.setAlert} table={"alarms_list"} />


                                    {(user !== null && user?.role !== 'operator') && <ImportMenu alert={alert} setAlert={props.setAlert} loadData={loadData} />}

                                </Box>
                            )}
                        </Box>


                    </Box>

                </Box>


                {!error ? (
                    <>
                        <Box sx={{ display: "flex", justifyContent: "space-between", backgroundColor: (theme) => `${theme.palette.component.colorSecondary}`, border: "1px solid #e0e0e0", borderTopLeftRadius: "5px", borderTopRightRadius: "5px" }}>


                            <Box sx={{ width: "100%", display: 'flex', justifyContent: "space-between" }}>


                                <Box sx={{ display: 'flex', justifyContent: "space-around", alignItems: { md: "center" }, pl: 2, py: 2 }}>




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
                                        <>

                                            <IconButton title={strings.deleteAll} color="primary" onClick={() => { setActionFuncion({ f: onDeleteAll }) }}>
                                                <Delete />
                                            </IconButton>
                                        </>

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
