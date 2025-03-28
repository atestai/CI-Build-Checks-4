import React, { useEffect, useState, useRef } from "react";

import { Box, FormControl, IconButton, Typography, Button, TextField, Grid, InputLabel, Input, Chip, MenuItem, Select, CircularProgress, Backdrop, Paper, Dialog, DialogTitle, TableHead, TableContainer, Table, TableRow, TableCell, DialogContentText, DialogContent, TableBody, DialogActions, Alert, Stack, AlertTitle, Accordion, AccordionSummary, AccordionDetails, Card, CardContent } from "@mui/material";
import useWindowSize from "../components/useWindowSize";
import config from "../config";
import { strings } from '../strings'
import ServerProxy from "../tools/serverProxy";
import { Close, ExpandMore, FileDownload, FileUpload, InsertDriveFile, PlaylistAdd, RestartAlt, Save, Send } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { camelCaseToReadable, getFileNameOrExtension } from "../tools/helpers";
import HeaderPage from "../components/headerPage";

import { styled } from '@mui/material/styles';




export default function Cpus(props) {


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Variables 


    const [contentType, setContentType] = React.useState('');
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);
    const [file, setFile] = useState({
        selectedFile: null, 
        type: 'upsert'
    });
    const [loading, setLoading] = useState(false);
    const [loadingImport, setLoadingImport] = useState(false);

    const [settings, setSettings] = useState([]);
    const [showTabId, setShowTabId] = useState([
        { name: 'ads', display: 'block' },
        { name: 'mqtt', display: 'none' },
        { name: 'store_forward', display: 'none' },
        { name: 'system', display: 'none' },
        { name: 'modbus', display: 'none' },
        { name: 'import_export', display: 'none' },

    ])
    const [value, setValue] = useState('ads');
    const windowSize = useWindowSize();

    const [resultData, setResultData] = useState({
        show: false,
        result: [],
        errors: []
    });


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Functions 

    const checkFileType = (e, eventType) => {
        let extension;

        if (eventType === "drop") {
            extension = e.dataTransfer.files[0].name.match(/\.([^.]+)$/)[1];
        } else {
            extension = e.target.value.match(/\.([^.]+)$/)[1];
        }

        switch (extension) {
            case "json":
            case "xlsx":
                eventType !== "drop"
                    ? setFile((prev) => ({ ...prev, selectedFile: e.target.files[0] }))
                    : setFile((prev) => ({ ...prev, selectedFile: e.dataTransfer.files[0] }));
                break;
            default:
                setFile((prev) => ({ ...prev, selectedFile: null }));
                props.setAlert(prevState => ({
                    ...prevState,
                    message: `${extension} format is not supported.`,  // Usa i backticks qui
                    hide: 1,
                    severity: "error"
                }));

        }
    };


    const chooseFile = (e) => {
        if (e.target.files && e.target.files[0]) {
            // checkSize(e);
            checkFileType(e);

        }
    };


    const handleChangeType = (event) => {
        setContentType(event.target.value);
    };


    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };


    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            checkFileType(e, "drop");
        }
    };


    const handleDownload = async () => {
        try {
            // Ottieni i dati dal server
            const blobData = await ServerProxy.getExport({ contentType });

            if (contentType === "json") {
                // Converti il blob JSON in un oggetto JavaScript
                const jsonText = await blobData.text();
                const data = JSON.parse(jsonText);


                // Esporta come JSON
                const jsonString = JSON.stringify(data, null, 2); // Converte i dati in formato JSON
                const jsonBlob = new Blob([jsonString], { type: 'application/json' });
                const url = window.URL.createObjectURL(jsonBlob);

                // Crea un link per scaricare il file
                const a = document.createElement('a');
                a.href = url;
                a.download = `data_export.json`;  // Nome del file JSON
                a.click();

                window.URL.revokeObjectURL(url);

            } else if (contentType === "excel") {
                // Converte il blob Excel in un oggetto arrayBuffer
                const arrayBuffer = await blobData.arrayBuffer();

                // Carica i dati binari nel foglio Excel
                const workbook = XLSX.read(arrayBuffer, { type: "array" });

                // Esporta i dati in un nuovo file Excel
                const excelData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
                const excelBlob = new Blob([excelData], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

                // Crea un URL per il Blob e scarica il file
                const url = window.URL.createObjectURL(excelBlob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `data_export.xlsx`;  // Nome del file Excel
                a.click();

                window.URL.revokeObjectURL(url);
            }
            props.setAlert(prevState => ({
                ...prevState,
                message: strings.status200Operation,
                hide: 1,
                severity: "success"
            }));
            setContentType('');
        } catch (error) {
            props.setAlert(prevState => ({
                ...prevState,
                message: error?.response?.data?.message || 'An unknown error occurred',
                hide: 1,
                severity: "error"
            }));
        }
    };


    const handleSendImport = async () => {

        if (file.type === undefined) {
            props.setAlert(prevState => ({
                ...prevState,
                message: strings.typeImportMissing,
                hide: 1,
                severity: "warning"
            }));
        }
        try {

            setLoadingImport(true);

            const response = await ServerProxy.postExport(file);
            
            if ( response) {
                const { errors, result } = response;
                setResultData({show: true,  errors, result });
               
            }

        
            
            props.setAlert(prevState => ({
                ...prevState,
                message: strings.status200Operation,
                hide: 1,
                severity: "success"
            }));

            setFile({ selectedFile: null });
        } catch (error) {


            props.setAlert(prevState => ({
                ...prevState,
                message: error?.response?.data?.message || 'An unknown error occurred',
                hide: 1,
                severity: "error"
            }));
        }
        setLoadingImport(false);

    };


    const handleRemoveFile = () => {
        setFile((prev) => ({ ...prev, selectedFile: null }));
    };



    const sendValue = async (group) => {


        const data = settings.map(item => {
            let entry = { key: item.key };

            if (item.value !== undefined) {
                entry.value = item.value;
            }

            return entry;
        });

        const json = { group, data };
        try {
            await ServerProxy.editSetting(json);
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



    };


    const showTab = (value) => {
        setShowTabId((prevState) =>
            prevState.map((item) =>
                item.name === value
                    ? { ...item, display: 'block' }
                    : { ...item, display: 'none' }
            )
        );
        setValue(value)
    };




    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Use Effect 

    useEffect(() => {

        async function fetchData() {
            try {
                setLoading(true)
                let data;
                switch (value) {
                    case 'ads':
                        data = await ServerProxy.getSetting("ads");
                        break;
                    case 'mqtt':
                        data = await ServerProxy.getSetting("mqtt");
                        break;
                    case 'store_forward':
                        data = await ServerProxy.getSetting("saf");
                        break;
                    case 'system':
                        data = await ServerProxy.getSetting("system");
                        break;
                    case 'modbus':
                        data = await ServerProxy.getSetting("modbus");
                        break;
                    default:
                        console.log("Error");
                        return;
                }

                setSettings(data);
            } catch (error) {
                props.setAlert(prevState => ({
                    ...prevState,
                    message: error?.response?.data?.message || 'An unknown error occurred',
                    hide: 1,
                    severity: "error"
                }));

            } finally {
                setLoading(false)

            }
        }

        fetchData();


    }, [value]);




    useEffect(() => {
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
                ...resetValues
            };
        });
        document.title = `${strings.settings} - Wisnam`;

    }, []);


    const resultDataDialogClose = () => {
        setResultData({ show: false, errors: [], result: [] });
    }


    // Styled components for enhanced formatting
    const JsonKey = styled(Typography)(({ theme }) => ({
        color: theme.palette.primary.main,
        fontWeight: 600,
        marginRight: theme.spacing(1)
    }));

    const JsonValue = styled(Typography)(({ theme }) => ({
        color: theme.palette.text.secondary
    }));


        const renderJsonValue = (value) => {
            if (value === null) return <JsonValue>null</JsonValue>;
            if (typeof value === 'object') {
                return (
                    <Box pl={2} borderLeft={1} borderBottom={1} borderColor="divider">
                        {Object.entries(value).map(([key, val]) => (
                            <Box key={key} display="flex" alignItems="center" mb={1}>
                                <JsonKey>{key}:</JsonKey>
                                {renderJsonValue(val)}
                            </Box>
                        ))}
                    </Box>
                );
            }
            if (Array.isArray(value)) {
                return (
                    <Box>
                        {value.map((item, index) => (
                            <Box key={index} display="flex" alignItems="center">
                                <JsonValue>[{index}] {renderJsonValue(item)}</JsonValue>
                            </Box>
                        ))}
                    </Box>
                );
            }
            return <JsonValue>{JSON.stringify(value)}</JsonValue>;
        };


    return (

        <>

       
            <Dialog
                fullWidth={true}
                maxWidth={'lg'}
                open={resultData.show}
                onClose={resultDataDialogClose}
                
            >
                <DialogTitle>
                    {strings.result}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText >

                        <TableContainer sx={{mb: 2}} component={Box}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Results</TableCell>
                                        <TableCell align="right">Inserted</TableCell>
                                        <TableCell align="right">Updated</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                               
                                    {Object.keys(resultData.result).map((row, index) => {

                                        if (row === 'mode' )
                                            return null;

                                        return (<TableRow
                                            key={index}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row} 
                                            </TableCell>
                                            <TableCell align="right">{resultData.result[row].inserted}</TableCell>
                                            <TableCell align="right">{resultData.result[row].updated}</TableCell>
                                        </TableRow>

                                        )}
                                    )}
                               
                        
                                </TableBody>
                            </Table>
                        </TableContainer>
                                
                        {Object.keys(resultData.errors).length && (
                            <>
                                <AlertTitle>Errors</AlertTitle>
                                    <Stack sx={{ width: '100%' }} spacing={2}>       
                                    {Object.keys(resultData.errors).map((row, index) => {

                                        if ( resultData.errors[row]?.length === 0  ){
                                            return;
                                        }
                                            
                                        return (
                                            <Box key={index} sx={{ border: '1px solid #eee', p: 2 }} >
                                                <AlertTitle>{row}</AlertTitle>
                                                
                                                <Stack sx={{ width: '100%' }} spacing={2}>

                                                    {resultData.errors[row].map(( item, i) => {
                                                        return (
                                                            
                                                        
                                                            <Box variant="outlined" sx={{ p: 2, bgcolor: 'tranparent' }}>
                                                                {renderJsonValue(item)}
                                                            </Box>
                                                        


                                                            // <Accordion sx={{width: '100%'}} key={i} >
                                                            //     <AccordionSummary
                                                            //          sx={{width: '100%'}}
                                                            //         expandIcon={<ExpandMore />}
                                                                    
                                                            //     >
                                                            //         <Typography component="span">{item.error}</Typography>
                                                            //     </AccordionSummary>
                                                            //     <AccordionDetails>
                                                                    
                                                            //        { JSON.stringify(item) }
                                                            //     </AccordionDetails>
                                                            // </Accordion>
                                                        )

                                                    })}
                                            
                                                </Stack>
                                            </Box>
                                        )
                                    })}
                                </Stack>
                            </>
                        )}

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={resultDataDialogClose} autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
      


            <Backdrop sx={{ position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: (theme) => theme.zIndex.drawer + 1, top: 0, left: 0 }} open={loadingImport} >
                <CircularProgress color="primary" />
            </Backdrop>


            <Box sx={{ height: `calc(${windowSize.height}px - ${config.heightBanner}px);`, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flexShrink: 0, mb: 2, mt: { sm: 5, lg: 2 } }}>

                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>



                        <HeaderPage title={strings.settings} titleTwo={strings.settings} />



                    </Box>

                </Box>

                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3, borderRadius: '16px', backgroundColor: 'white' }}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', textAlign: 'center', textTransform: 'uppercase', borderRadius: '16px' }}>

                        <Typography onClick={() => showTab('ads')} sx={{ width: '100%', fontSize: { sm: '17px' }, borderTopLeftRadius: '16px', cursor: 'pointer', borderBottom: '1px solid', borderColor: 'primary.main', color: showTabId.find(tab => tab.name === 'ads' && tab.display === 'block') ? 'white' : 'black', backgroundColor: showTabId.find(tab => tab.name === 'ads' && tab.display === 'block') ? 'primary.main' : 'white', py: 1 }}>{strings.ads} </Typography>
                        <Typography onClick={() => showTab('mqtt')} sx={{ width: '100%', fontSize: { sm: '17px' }, cursor: 'pointer', borderBottom: '1px solid', borderColor: 'primary.main', color: showTabId.find(tab => tab.name === 'mqtt' && tab.display === 'block') ? 'white' : 'black', backgroundColor: showTabId.find(tab => tab.name === 'mqtt' && tab.display === 'block') ? 'primary.main' : 'white', py: 1 }}>{strings.mqtt}</Typography>
                        <Typography onClick={() => showTab('store_forward')} sx={{ width: '100%', fontSize: { sm: '17px' }, cursor: 'pointer', borderBottom: '1px solid', borderColor: 'primary.main', color: showTabId.find(tab => tab.name === 'store_forward' && tab.display === 'block') ? 'white' : 'black', backgroundColor: showTabId.find(tab => tab.name === 'store_forward' && tab.display === 'block') ? 'primary.main' : 'white', py: 1 }}>{strings.store_forward}</Typography>
                        <Typography onClick={() => showTab('system')} sx={{ width: '100%', fontSize: { sm: '17px' }, cursor: 'pointer', borderBottom: '1px solid', borderColor: 'primary.main', color: showTabId.find(tab => tab.name === 'system' && tab.display === 'block') ? 'white' : 'black', backgroundColor: showTabId.find(tab => tab.name === 'system' && tab.display === 'block') ? 'primary.main' : 'white', py: 1 }}>{strings.system}</Typography>
                        <Typography onClick={() => showTab('modbus')} sx={{ width: '100%', fontSize: { sm: '17px' }, cursor: 'pointer', borderBottom: '1px solid', borderColor: 'primary.main', color: showTabId.find(tab => tab.name === 'modbus' && tab.display === 'block') ? 'white' : 'black', backgroundColor: showTabId.find(tab => tab.name === 'modbus' && tab.display === 'block') ? 'primary.main' : 'white', py: 1 }}>{strings.modbus}</Typography>
                        <Typography onClick={() => showTab('import_export')} sx={{ width: '100%', fontSize: { sm: '17px' }, borderTopRightRadius: '16px', cursor: 'pointer', borderBottom: '1px solid', borderColor: 'primary.main', color: showTabId.find(tab => tab.name === 'import_export' && tab.display === 'block') ? 'white' : 'black', backgroundColor: showTabId.find(tab => tab.name === 'import_export' && tab.display === 'block') ? 'primary.main' : 'white', py: 1 }}>IMPORT & EXPORT</Typography>

                    </Box>


                    {loading ?

                        <Box sx={{ height: "40vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <CircularProgress />
                        </Box>

                        : (
                            <Box >
                                <Box sx={{ display: showTabId.find(tab => tab.name === 'ads')?.display || 'none' }}>

                                    <Box sx={{ display: "flex", flexDirection: "column", pb: 2 }}>



                                        <Box sx={{ height: "auto", display: "flex", p: 3 }}>

                                            <Grid container sx={{ maxHeight: "100vh", overflow: "auto", px: 2 }}>

                                                {settings.map((item, index) => (


                                                    <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }} key={`ads-${index}`}>
                                                        <Grid container sx={{ mt: 2 }} >

                                                            <Grid item xs={12} xl={3} sx={{ display: "flex", justifyContent: { sm: "star", xl: "end" }, alignItems: 'center', padding: 0 }}>
                                                                <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">
                                                                    {camelCaseToReadable(item.key)} :
                                                                </InputLabel>

                                                            </Grid>
                                                            <Grid item xs={11} xl={9} sx={{ display: "flex", justifyContent: "end", alignItems: "center", padding: 0, pl: { sm: 0, xl: 1 } }}>
                                                                <FormControl variant="standard" sx={{ width: "100%" }}>

                                                                    {item.domain === 'Bool' ? (
                                                                        <>

                                                                            <Select
                                                                                labelId="role-select-label"
                                                                                id="role-select"
                                                                                value={item.value || ''}




                                                                                onChange={(event) => {

                                                                                    setSettings(prevSettings =>
                                                                                        prevSettings.map(setting =>
                                                                                            setting.id === item.id ? { ...setting, value: event.target.value } : setting
                                                                                        )
                                                                                    );
                                                                                }}
                                                                                size="small"

                                                                                sx={{
                                                                                    padding: 0,
                                                                                    height: "32px",
                                                                                    borderRadius: "4px",
                                                                                    backgroundColor: "#fff",
                                                                                }}
                                                                            >
                                                                                <MenuItem value="true">True</MenuItem>
                                                                                <MenuItem value="false">False</MenuItem>
                                                                            </Select>
                                                                        </>
                                                                    ) : (

                                                                        <TextField
                                                                            id="outlined-basic"
                                                                            variant="outlined"
                                                                            value={item.value || ''}
                                                                            type={item.domain}
                                                                            onChange={(event) => {
                                                                                const newValue = event.target.value;

                                                                                setSettings(prevSettings =>
                                                                                    prevSettings.map(setting =>
                                                                                        setting.id === item.id ? { ...setting, value: newValue } : setting
                                                                                    )
                                                                                );
                                                                            }}
                                                                            inputProps={{
                                                                                sx: {
                                                                                    padding: 0,
                                                                                    height: "32px",
                                                                                    px: 1
                                                                                }
                                                                            }}

                                                                        />





                                                                    )}
                                                                </FormControl>

                                                                {item.value !== item.defaultValue && (
                                                                    <IconButton title={'Restore default'} sx={{ width: "33px", height: "33px", color: "white", backgroundColor: "#007CB0", borderRadius: 2, ml: 1, '&:hover': { backgroundColor: "#007CB0", color: "white" } }}

                                                                        onClick={() => {
                                                                            setSettings(prevSettings =>
                                                                                prevSettings.map(setting =>
                                                                                    setting.id === item.id ? { ...setting, value: setting.defaultValue } : setting
                                                                                )
                                                                            );
                                                                        }}

                                                                    >
                                                                        <RestartAlt />

                                                                    </IconButton>
                                                                )}
                                                            </Grid>

                                                        </Grid>
                                                    </Grid>



                                                ))}


                                            </Grid>
                                        </Box>



                                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                                            <Button
                                                onClick={() => sendValue('ads')}
                                                startIcon={<Save />}
                                                sx={{ height: "32px", backgroundColor: "primary", textTransform: "none", fontSize: "14px", fontWeight: 400, '&:hover': { backgroundColor: "primary", color: "white" } }}
                                                variant="contained"
                                            >
                                                {strings.save}
                                            </Button>
                                        </Box>

                                    </Box>


                                </Box>

                                <Box sx={{ display: showTabId.find(tab => tab.name === 'mqtt')?.display || 'none' }} >

                                    <Box sx={{ display: "flex", flexDirection: "column", pb: 2 }}>

                                        <Box sx={{ p: 3, display: "flex", height: "auto" }}>

                                            <Grid container sx={{ maxHeight: { sm: '300px', xl: 'inherit' }, overflowY: 'auto', px: 2 }}>

                                                {settings.map((item, index) => (

                                                    <Grid item xs={6} key={`mqtt-${index}`}>
                                                        <Grid container sx={{ mt: 2 }}>

                                                            <Grid item xs={12} xl={3} sx={{ display: "flex", justifyContent: { sm: "star", xl: "end" }, alignItems: 'center', padding: 0 }}>
                                                                <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">  {camelCaseToReadable(item.key)} : </InputLabel>

                                                            </Grid>
                                                            <Grid item xs={11} xl={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: { sm: 0, xl: 1 } }}>
                                                                <FormControl variant="standard" sx={{ width: "100%" }}>


                                                                    {item.domain === 'Bool' ? (
                                                                        <>

                                                                            <Select
                                                                                labelId="role-select-label"
                                                                                id="role-select"
                                                                                value={item.value || ''}

                                                                                variant="outlined"



                                                                                onChange={(event) => {

                                                                                    setSettings(prevSettings =>
                                                                                        prevSettings.map(setting =>
                                                                                            setting.id === item.id ? { ...setting, value: event.target.value } : setting
                                                                                        )
                                                                                    );
                                                                                }}

                                                                                size="small"

                                                                                sx={{ height: "32px", borderRadius: "4px", backgroundColor: "#fff", padding: 0 }}
                                                                            >
                                                                                <MenuItem value="true">True</MenuItem>
                                                                                <MenuItem value="false">False</MenuItem>
                                                                            </Select>
                                                                        </>
                                                                    ) : (

                                                                        <TextField
                                                                            id="outlined-basic"
                                                                            variant="outlined"
                                                                            value={item.value || ''}
                                                                            type={item.domain}
                                                                            onChange={(event) => {
                                                                                const newValue = event.target.value;

                                                                                setSettings(prevSettings =>
                                                                                    prevSettings.map(setting =>
                                                                                        setting.id === item.id ? { ...setting, value: newValue } : setting
                                                                                    )
                                                                                );
                                                                            }}
                                                                            inputProps={{ sx: { height: "32px", padding: 0, px: 1 } }}

                                                                        />




                                                                    )}
                                                                </FormControl>




                                                                {item.value !== item.defaultValue && (
                                                                    <IconButton title={'Restore default'} sx={{ width: "33px", height: "33px", color: "white", backgroundColor: "#007CB0", borderRadius: 2, ml: 1, '&:hover': { backgroundColor: "#007CB0", color: "white" } }}

                                                                        onClick={() => {
                                                                            setSettings(prevSettings =>
                                                                                prevSettings.map(setting =>
                                                                                    setting.id === item.id ? { ...setting, value: setting.defaultValue } : setting
                                                                                )
                                                                            );
                                                                        }}

                                                                    >
                                                                        <RestartAlt />

                                                                    </IconButton>
                                                                )}
                                                            </Grid>

                                                        </Grid>
                                                    </Grid>





                                                ))}
                                            </Grid>
                                        </Box>


                                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                                            <Button onClick={() => sendValue('mqtt')} startIcon={<Save />} sx={{ height: "32px", backgroundColor: "primary", textTransform: "none", fontSize: "14px", fontWeight: 400, '&:hover': { backgroundColor: "primary", color: "white" } }} variant="contained">
                                                {strings.save}
                                            </Button>
                                        </Box>

                                    </Box>

                                </Box>


                                <Box sx={{ display: showTabId.find(tab => tab.name === 'store_forward')?.display || 'none' }} >

                                    <Box sx={{ display: "flex", flexDirection: "column", pb: 2 }}>
                                        <Box sx={{ height: "auto", display: "flex", p: 3 }}>

                                            <Grid container sx={{ maxHeight: { sm: '300px', xl: 'inherit' }, overflowY: 'auto', px: 2 }}>

                                                {settings.map((item, index) => (
                                                    <React.Fragment key={`store_forward-${index}`}>


                                                        <Grid item xs={6}>
                                                            <Grid container sx={{ mt: 2 }}>

                                                                <Grid item xs={12} xl={3} sx={{ display: "flex", justifyContent: { sm: "star", xl: "end" }, alignItems: 'center', padding: 0 }}>
                                                                    <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName"> {camelCaseToReadable(item.key)} : </InputLabel>

                                                                </Grid>
                                                                <Grid item xs={11} xl={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: { sm: 0, xl: 1 } }}>                                                                    <FormControl variant="standard" sx={{ width: "100%" }}>
                                                                    <FormControl variant="standard" sx={{ width: "100%" }}>


                                                                        {item.domain === 'Bool' ? (
                                                                            <>

                                                                                <Select labelId="role-select-label" id="role-select" value={item.value || ''} variant="outlined" size="small" sx={{ height: "32px", borderRadius: "4px", backgroundColor: "#fff", padding: 0 }}

                                                                                    onChange={(event) => {

                                                                                        setSettings(prevSettings =>
                                                                                            prevSettings.map(setting =>
                                                                                                setting.id === item.id ? { ...setting, value: event.target.value } : setting
                                                                                            )
                                                                                        );
                                                                                    }}


                                                                                >
                                                                                    <MenuItem value="true">True</MenuItem>
                                                                                    <MenuItem value="false">False</MenuItem>
                                                                                </Select>
                                                                            </>
                                                                        ) : (

                                                                            <TextField
                                                                                id="outlined-basic"
                                                                                variant="outlined"
                                                                                value={item.value || ''}
                                                                                type={item.domain}
                                                                                onChange={(event) => {
                                                                                    const newValue = event.target.value;

                                                                                    setSettings(prevSettings =>
                                                                                        prevSettings.map(setting =>
                                                                                            setting.id === item.id ? { ...setting, value: newValue } : setting
                                                                                        )
                                                                                    );
                                                                                }}
                                                                                inputProps={{ sx: { height: "32px", padding: 0, px: 1 } }}

                                                                            />




                                                                        )}
                                                                    </FormControl>



                                                                </FormControl>



                                                                    {item.value !== item.defaultValue && (
                                                                        <IconButton title={'Restore default'} sx={{ width: "33px", height: "33px", color: "white", backgroundColor: "#007CB0", borderRadius: 2, ml: 1, '&:hover': { backgroundColor: "#007CB0", color: "white" } }}

                                                                            onClick={() => {
                                                                                setSettings(prevSettings =>
                                                                                    prevSettings.map(setting =>
                                                                                        setting.id === item.id ? { ...setting, value: setting.defaultValue } : setting
                                                                                    )
                                                                                );
                                                                            }}

                                                                        >
                                                                            <RestartAlt />

                                                                        </IconButton>
                                                                    )}
                                                                </Grid>

                                                            </Grid>
                                                        </Grid>



                                                    </React.Fragment>
                                                ))}
                                            </Grid>
                                        </Box>

                                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                                            <Button
                                                onClick={() => sendValue('saf')}
                                                startIcon={<Save />}
                                                sx={{
                                                    mr: 1, backgroundColor: "primary", textTransform: "none", fontSize: "14px", fontWeight: 400, height: "32px",
                                                    '&:hover': { backgroundColor: "primary", color: "white" }
                                                }}
                                                variant="contained"
                                            >
                                                {strings.save}
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>


                                <Box sx={{ display: showTabId.find(tab => tab.name === 'system')?.display || 'none' }} >

                                    <Box sx={{ display: "flex", flexDirection: "column", pb: 2 }}>

                                        <Box sx={{ height: "auto", display: "flex", p: 3 }}>
                                            <Grid container sx={{ maxHeight: "100vh", overflow: "auto", px: 2 }}>

                                                {settings.map((item, index) => (


                                                    <Grid item xs={6} key={`system-${index}`}>
                                                        <Grid container sx={{ mt: 2 }}>

                                                            <Grid item xs={12} xl={3} sx={{ display: "flex", justifyContent: { sm: "star", xl: "end" }, alignItems: 'center', padding: 0 }}>
                                                                <InputLabel sx={{ display: "flex", color: "#000000E0", justifyContent: "end", alignItems: "center", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{camelCaseToReadable(item.key)} : </InputLabel>

                                                            </Grid>
                                                            <Grid item xs={11} xl={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: { sm: 0, xl: 1 } }}>
                                                                <FormControl variant="standard" sx={{ width: "100%" }}>


                                                                    {item.domain === 'Bool' ? (
                                                                        <>

                                                                            <Select size="small" sx={{ height: "32px", borderRadius: "4px", backgroundColor: "#fff" }} labelId="role-select-label" id="role-select" value={item.value || ''} variant="outlined"

                                                                                onChange={(event) => {

                                                                                    setSettings(prevSettings =>
                                                                                        prevSettings.map(setting =>
                                                                                            setting.id === item.id ? { ...setting, value: event.target.value } : setting
                                                                                        )
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <MenuItem value="true">True</MenuItem>
                                                                                <MenuItem value="false">False</MenuItem>
                                                                            </Select>
                                                                        </>
                                                                    ) : (

                                                                        <TextField inputProps={{ sx: { height: "32px", padding: 0, px: 1 } }} id="outlined-basic" variant="outlined" value={item.value || ''} type={item.domain}
                                                                            onChange={(event) => {
                                                                                const newValue = event.target.value;

                                                                                setSettings(prevSettings =>
                                                                                    prevSettings.map(setting =>
                                                                                        setting.id === item.id ? { ...setting, value: newValue } : setting
                                                                                    )
                                                                                );
                                                                            }}

                                                                        />




                                                                    )}
                                                                </FormControl>



                                                                {item.value !== item.defaultValue && (
                                                                    <IconButton title={'Restore default'} sx={{ width: "33px", height: "33px", color: "white", backgroundColor: "#007CB0", borderRadius: 2, ml: 1, '&:hover': { backgroundColor: "#007CB0", color: "white" } }}

                                                                        onClick={() => {
                                                                            setSettings(prevSettings =>
                                                                                prevSettings.map(setting =>
                                                                                    setting.id === item.id ? { ...setting, value: setting.defaultValue } : setting
                                                                                )
                                                                            );
                                                                        }}

                                                                    >
                                                                        <RestartAlt />

                                                                    </IconButton>
                                                                )}
                                                            </Grid>

                                                        </Grid>
                                                    </Grid>



                                                ))}
                                            </Grid>
                                        </Box>

                                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                                            <Button onClick={() => sendValue('system')} startIcon={<Save />} sx={{ height: "32px", backgroundColor: "primary", textTransform: "none", fontSize: "14px", fontWeight: 400, '&:hover': { backgroundColor: "primary", color: "white" } }} variant="contained" >
                                                {strings.save}
                                            </Button>
                                        </Box>

                                    </Box>
                                </Box>


                                <Box sx={{ display: showTabId.find(tab => tab.name === 'modbus')?.display || 'none' }} >

                                    <Box sx={{ display: "flex", flexDirection: "column", pb: 2 }}>

                                        <Box sx={{ height: "auto", display: "flex", p: 3 }}>

                                            <Grid container sx={{ maxHeight: "100vh", overflow: "auto", px: 2 }}>

                                                {settings.map((item, index) => (

                                                    <Grid item xs={6} key={`modbus-${index}`}>
                                                        <Grid container sx={{ mt: 2 }}>

                                                            <Grid item xs={12} xl={3} sx={{ display: "flex", justifyContent: { sm: "star", xl: "end" }, alignItems: 'center', padding: 0 }}>
                                                                <InputLabel sx={{ display: "flex", justifyContent: "end", alignItems: "center", color: "#000000E0", fontSize: "14px", fontWeight: "400" }} htmlFor="txtName">{camelCaseToReadable(item.key)} : </InputLabel>

                                                            </Grid>
                                                            <Grid item xs={11} xl={9} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: 0, pl: { sm: 0, xl: 1 } }}>
                                                                <FormControl variant="standard" sx={{ width: "100%" }}>


                                                                    {item.domain === 'Bool' ? (
                                                                        <>

                                                                            <Select labelId="role-select-label" id="role-select" value={item.value || ''} variant="outlined" size="small" sx={{ height: "32px", backgroundColor: "#fff", borderRadius: "4px", padding: 0 }}
                                                                                onChange={(event) => {

                                                                                    setSettings(prevSettings =>
                                                                                        prevSettings.map(setting =>
                                                                                            setting.id === item.id ? { ...setting, value: event.target.value } : setting
                                                                                        )
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <MenuItem value="true">True</MenuItem>
                                                                                <MenuItem value="false">False</MenuItem>
                                                                            </Select>
                                                                        </>
                                                                    ) : (

                                                                        <TextField
                                                                            id="outlined-basic"
                                                                            variant="outlined"
                                                                            value={item.value || ''}
                                                                            type={item.domain}
                                                                            onChange={(event) => {
                                                                                const newValue = event.target.value;

                                                                                setSettings(prevSettings =>
                                                                                    prevSettings.map(setting =>
                                                                                        setting.id === item.id ? { ...setting, value: newValue } : setting
                                                                                    )
                                                                                );
                                                                            }}
                                                                            inputProps={{ sx: { height: "32px", padding: 0, px: 1 } }}

                                                                        />




                                                                    )}
                                                                </FormControl>




                                                                {item.value !== item.defaultValue && (
                                                                    <IconButton title={'Restore default'} sx={{ width: "33px", height: "33px", color: "white", backgroundColor: "#007CB0", borderRadius: 2, ml: 1, '&:hover': { backgroundColor: "#007CB0", color: "white" } }}

                                                                        onClick={() => {
                                                                            setSettings(prevSettings =>
                                                                                prevSettings.map(setting =>
                                                                                    setting.id === item.id ? { ...setting, value: setting.defaultValue } : setting
                                                                                )
                                                                            );
                                                                        }}

                                                                    >
                                                                        <RestartAlt />

                                                                    </IconButton>
                                                                )}
                                                            </Grid>

                                                        </Grid>
                                                    </Grid>




                                                ))}
                                            </Grid>
                                        </Box>

                                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                                            <Button onClick={() => sendValue('modbus')}
                                                startIcon={<Save />}
                                                sx={{ height: "32px", backgroundColor: "primary", textTransform: "none", fontSize: "14px", fontWeight: 400, '&:hover': { backgroundColor: "primary", color: "white" } }}
                                                variant="contained"
                                            >
                                                {strings.save}
                                            </Button>
                                        </Box>
                                    </Box>

                                </Box>


                                <Box sx={{ display: showTabId.find(tab => tab.name === 'import_export')?.display || 'none' }} >

                                    <Box sx={{ display: "flex", flexDirection: "column", pb: 2 }}>

                                        <Grid container sx={{ mt: 2, maxHeight: "100vh", overflow: "auto", p: 3 }}>
                                            <Grid item xs={12} md={6} sx={{overflow: "auto",  display: "flex", alignItems: "center", flexDirection: "column", pb: { sm: 2, md: 0 } }}>

                                                <Box sx={{ width: "70%", cursor: "pointer" }} onClick={() => fileInputRef.current.click()}>


                                                    <Box component={"div"} sx={{  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "2rem", border: "2px dashed #E0E0E0", borderRadius: "10px", }}
                                                        onDragEnter={handleDrag}
                                                        onDragLeave={handleDrag}
                                                        onDragOver={handleDrag}
                                                        onDrop={handleDrop}
                                                        onSubmit={(e) => e.preventDefault()}
                                                    >


                                                        <FileUpload color="primary" fontSize="large" className="upload-icon" />
                                                        <Box sx={{ mt: 3 }}>
                                                            <Box sx={{ color: "#0000008F", fontWeight: 400, fontSize: "20px", lineHeight: "20px" }}>
                                                                Drop your file here or {" "}

                                                                <Box sx={{ display: "inline-block", color: "primary.main" }}>
                                                                    Browse
                                                                    <Input
                                                                        inputRef={fileInputRef}
                                                                        type="file"
                                                                        style={{ display: "none" }}
                                                                        onChange={chooseFile}
                                                                    />
                                                                </Box>
                                                            </Box>
                                                        </Box>

                                                        <p className="info">Supported files: JSON, EXCEL</p>

                                                    </Box>
                                                </Box>

                                                {file.selectedFile !== null ? (
                                                    <Box sx={{ width: "100%", mt: 3, px: 2 }}>

                                                        <Grid container sx={{ backgroundColor: "#F0F3F5", borderRadius: '16px', py: 1 }}>
                                                            <Grid item xs={1} sx={{ textAlign: "center" }}>

                                                                <IconButton color="primary">
                                                                    <InsertDriveFile />
                                                                </IconButton>
                                                            </Grid>
                                                            <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", pl: 1, alignItems: "center" }}>
                                                                <Typography sx={{ color: "black", fontWeight: 400, fontSize: "20px", lineHeight: "20px" }}>
                                                                    {getFileNameOrExtension(file.selectedFile.name, true)}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={2}>
                                                                <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center" }}>

                                                                    <Chip sx={{ textTransform: "uppercase" }} label={getFileNameOrExtension(file.selectedFile.name, false)} color="primary" />
                                                                    <IconButton sx={{ color: "black" }}
                                                                    >
                                                                        <Close onClick={handleRemoveFile} />
                                                                    </IconButton>
                                                                </Box>
                                                            </Grid>

                                                        </Grid>

                                                   
                                                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                                                            
                                                            <Box
                                                                component="form"
                                                                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
                                                                >
                                                                
                                                                <Typography sx={{ color: "#0000008F", fontWeight: 400, fontSize: "20px", lineHeight: "20px", mr: 2 }}>
                                                                    {strings.typeImport}
                                                                </Typography>

                                                                <Select
                                                                        labelId="demo-simple-select-label"
                                                                        id="demo-simple-select"
                                                                        value={file.type}
                                                                        label={strings.typeImport}
                                                                        onChange={event => { setFile((prev) => ({ ...prev, type: event.target.value })) }}

                                                                    >
                                                                        <MenuItem value={'upsert'}>UPDATE OR INSERT</MenuItem>
                                                                        <MenuItem value={'truncate'}>DELETE & INSERT</MenuItem>
                                                                        <MenuItem value={'insert'}>INSERT</MenuItem>

                                                                </Select>
                                                                <IconButton  
                                                                    size="large"
                                                                    color="primary"
                                                                    onClick={() => { handleSendImport() }}
                                                                    title={strings.import}
                                                                    
                                                                    >   
                                                                    <Send fontSize="inherit" />    
                                                                </IconButton >
                                                            
                                                            </Box>

                                                        
                                                            
                                                        </Box>

                                                       


                                                    </Box>
                                                ) : ''}

                                            </Grid>



                                            <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center", flexDirection: "column", borderTop: { sm: "3px dashed #E0E0E0", md: "inherit" }, borderLeft: { md: "3px dashed #E0E0E0" }, pt: { sm: 2, md: 0 } }}>

                                                <Box sx={{ width: "70%", cursor: "pointer" }} >

                                                    <Box component={"div"} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", border: "2px dashed #E0E0E0", borderRadius: "10px", padding: "2rem" }}>


                                                        <FileDownload color="primary" fontSize="large" className="upload-icon" />

                                                        <Box sx={{ mt: 3 }}>
                                                            <Box sx={{ color: "#0000008F", fontWeight: 400, fontSize: "20px", lineHeight: "20px" }}>
                                                                Export data in your preferred format:


                                                            </Box>

                                                        </Box>
                                                        <Box sx={{ mt: 2 }}>
                                                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                                                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                                                <Select
                                                                    labelId="demo-simple-select-label"
                                                                    id="demo-simple-select"
                                                                    value={contentType}
                                                                    label="Type"
                                                                    onChange={handleChangeType}
                                                                >
                                                                    <MenuItem value={'json'}>JSON</MenuItem>
                                                                    <MenuItem value={'excel'}>Excel</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </Box>

                                                    </Box>
                                                </Box>


                                            </Grid>

                                        </Grid>

                                        <Box sx={{ width: "100%", display: "flex", mt: 3 }}>
                                            

                                            <Box sx={{ width: "100%", textAlign: "center" }}>

                                                {contentType ? (
                                                    <Button
                                                        startIcon={<Save />}
                                                        sx={{ backgroundColor: "primary", textTransform: "none", fontSize: "14px", fontWeight: 400, height: "32px", '&:hover': { backgroundColor: "primary", color: "white" } }}
                                                        variant="contained"

                                                        onClick={handleDownload}
                                                    >
                                                        {strings.export}
                                                    </Button>
                                                ) : ''}
                                            </Box>
                                        </Box>


                                    </Box>


                                </Box>

                            </Box>
                        )}



                </Box>



            </Box>

        </>
    )
}
