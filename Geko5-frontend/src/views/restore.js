import { useEffect, useState } from "react";
import { Box, IconButton, FormControl, InputAdornment, Button, CircularProgress, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography } from "@mui/material";
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { useGridApiRef } from '@mui/x-data-grid';
import UserDetail from "./userDetail";
import { strings } from '../strings'
import ServerProxy from "../tools/serverProxy";
import ConfirmDialog from "../components/confirmDialog";
import useWindowSize from "../components/useWindowSize";
import config from "../config";
import SearchIcon from '@mui/icons-material/Search';
import ExportMenu from "../components/ExportMenu";
import ImportMenu from "../components/ImportMenu";
import HeaderPage from "../components/headerPage";
import ConnectedLost from "../components/ConnectedLost";
import DataGridComponent from "../components/DataGridComponent";

import { getColumnsForRestore } from "../tools/column";
import { convertTimestamp } from "../tools/helpers";

export default function Restores(props) {
    const { user } = props;

    
    ///////////////////////////////////////////////////////////////////////////////////// Variables

    const apiRef = useGridApiRef();
    const [actionFuncion, setActionFuncion] = useState(null);
    const [detail, setDetail] = useState({ open: false });
    const [error, setError] = useState(false)
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [load, setLoad] = useState(true);
    const [localFilter, setLocalFilter] = useState({ enabled: -1 });
    const [rows, setRows] = useState([]);
    const windowSize = useWindowSize();

    ///////////////////////////////////////////////////////////////////////////////////// Functions


    const loadData = async () => {

        setLoad(true);

        try {

            const data = await ServerProxy.getRestore({
                ...localFilter
            });

            setRows(data);

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


    const onDelete = async function (id) {

        let flag_error = true;


        try {
            await ServerProxy.deleteUser(id);
            loadData();
        } catch (error) {
            console.log(error);
            props.setAlert(prevState => ({
                ...prevState,
                message: error.response.data.message,
                hide: 1,
                severity: "error"
            }));
            flag_error = false
        }
        finally {
            setActionFuncion(null);
            if (flag_error) {
                props.setAlert(prevState => ({
                    ...prevState,
                    message: strings.status200Operation,
                    hide: 1,
                    severity: "success"
                }));
            }
        }


    }


    const setApplayRestore = async function () {

        const {data} = detail;
        
        if (data){

            await ServerProxy.applayRestore(data.id)
            
            setDetail( old => ({...old, open: false }) )
        }

        //setDetail( old => ({...old, open: false }) )
       
    }

    const columns = getColumnsForRestore(user, (params) => {

        console.log( params );
        
        setDetail({open : true, data : {...params}} )
    }, setActionFuncion, onDelete);


    ///////////////////////////////////////////////////////////////////////////////////// UseEffect

    useEffect(() => {
        document.title = "Restores - Wisnam";

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
                users: 1 // Imposta il valore desiderato
            };
        });

        loadData();

    }, []);


    useEffect(() => {

        if (localFilter.text || localFilter.text === '') {
            loadData();
        }

    }, [localFilter])

    

    return (

        <>

            {detail.open && (
                <Dialog
                    open={detail.open}
                    onClose={() => setDetail( old => ({...old, open: false }) )}
                >
                    <DialogTitle id="alert-dialog-title">
                        {strings.restore}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText >
                            Do you want to restore data to the following backup?
                            <Typography>
                                #{detail.data.id} of {convertTimestamp(detail.data.createdAt)}                                                      
                            </Typography>

                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDetail( old => ({...old, open: false }) )}>Disagree</Button>
                        <Button onClick={() => {
                                setApplayRestore();
                            }} autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            <Box sx={{ height: `calc(${windowSize.height}px - ${config.heightBanner}px);`, display: 'flex', flexDirection: 'column' }}>

                <Box sx={{ flexShrink: 0, mb: 2, mt: { sm: 5, lg: 2 } }}>

                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <HeaderPage title={strings.restore} titleTwo={strings.settings} />
                        </Box>
                    </Box>
                </Box>


                {!error ? (
                    <>
                        <Box sx={{ display: "flex", justifyContent: "space-between", backgroundColor: (theme) => `${theme.palette.component.colorSecondary}`, borderTopLeftRadius: "5px", borderTopRightRadius: "5px", py: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: "center", pl: 2, py: 1 }}>

                                <FormControl variant="standard" sx={{ minWidth: 200 }}>

                                    <TextField id="standard-basic" label="Search" variant="outlined"
                                        sx={{
                                            backgroundColor: "white",
                                            borderRadius: 1,
                                            '& .MuiInputLabel-root': { color: 'primary.main' },
                                            '& .MuiInput-underline:before': { borderBottom: '1px solid primary.main' },
                                            '& .MuiInput-underline:hover:before': { borderBottom: '1px solid primary.main' },
                                            '& .MuiInput-underline:after': { borderBottom: '2px solid primary.main' },
                                        }}
                                        placeholder="Search"
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
                                <IconButton title={strings.reload} color="primary" onClick={loadData} sx={{ mr: 1 }}>
                                    <RotateLeftIcon />
                                </IconButton>
                            </Box>
                        </Box>

                        <DataGridComponent apiRef={apiRef} isModalLoading={isModalLoading} handleSelectionIds={() => { }} rows={rows} columns={columns} load={load} />
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