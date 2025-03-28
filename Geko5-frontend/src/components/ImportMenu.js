import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import Tooltip from '@mui/material/Tooltip';
import { Alert, Backdrop, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, Input, InputLabel, ListItem, ListItemText, Modal, Select, Typography } from '@mui/material';
import { AccountCircle, Close, FileDownload, FileUpload, InsertDriveFile, Lock, Logout, Person, Send } from '@mui/icons-material';
import ServerProxy from '../tools/serverProxy';
import { strings } from '../strings';
import PasswordChangeDialog from './passwordChangeDialog';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import * as XLSX from "xlsx"; // Importa la libreria xlsx per generare file Excel


export default function ImportMenu(props) {




    const [anchorEl, setAnchorEl] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [contentType, setContentType] = useState('');

    const fileInputRef = useRef(null);
    const [file, setFile] = useState({
        selectedFile: null
    });
    const [user, setUser] = useState();

    const [open, setOpen] = useState(false);
    const [openDialogPassword, setOpenDialogPassword] = useState(false);
    const style = {
        position: 'absolute',
        width: "80vw",
        height: '80vh',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: '16px',
        boxShadow: 24,
        p: 4,
    };

    const [loadingImport, setLoadingImport] = useState(false); // Stato di caricamento


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
                    ? setFile({ selectedFile: e.target.files[0] })
                    : setFile({ selectedFile: e.dataTransfer.files[0] });
                break;
            default:
                setFile({ selectedFile: null });
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


    const handleOpen = () => setOpen(true);


    const handleClose = () => setOpen(false);



    const handleSendImport = async () => {
        
        try {
            setLoadingImport(true);
            await ServerProxy.postExport(file);
            props.setAlert(prevState => ({
                ...prevState,
                message: strings.status200Operation,
                hide: 1,
                severity: "success"
            }));
            setFile({ selectedFile: null });
            handleClose();
            props.loadData();
        } catch (error) {
            props.setAlert(prevState => ({
                ...prevState,
                message: error.response.data,
                hide: 1,
                severity: "error"
            }));
        }
        //setLoadingImport(false);

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


    const handleRemoveFile = () => {
        setFile({ selectedFile: null });
    };


    const handleChangeType = (event) => {
        setContentType(event.target.value);
    };


    const getFileNameOrExtension = (fileName, funzionalita) => {
        const [name, extension] = fileName.split('.');
        return funzionalita ? name : extension;
    };


 

    return (
        <>


            <Box sx={{ display: 'flex', }}>
                <Tooltip title={strings.import}>




                    <IconButton
                        onClick={handleOpen}

                        sx={{
                            mr: 1, color: (theme) => `${theme.palette.primary.textIntoButton}`, backgroundColor: "#009688", borderRadius: 2, width: "33px", height: "33px", '&:hover': {
                                backgroundColor: "#009688",
                                color: (theme) => `${theme.palette.primary.textIntoButton}`,
                            },
                        }}
                    >
                        <FileUpload />
                    </IconButton>
                </Tooltip>
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
                maxWidth="sm"
                fullWidth
            >
                {loadingImport && (
                    <Backdrop
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,

                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: (theme) => theme.zIndex.drawer + 1,
                        }}
                        open={loadingImport}
                    >
                        <CircularProgress color="primary" />
                    </Backdrop>
                )}


                <DialogTitle sx={{ fontSize: "32px", fontWeight: "500" }} id="draggable-dialog-title">
                    {strings.importFile}

                    <Divider sx={{ mt: 1, backgroundColor: "#656565" }} />
                </DialogTitle>

                <DialogContent sx={{ mt: 2, maxHeight: '60vh', overflow: 'auto' }}>
                    <Grid container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ width: "70%", cursor: "pointer" }} onClick={() => fileInputRef.current.click()}>
                            <Box component="div" sx={{ padding: "2rem", border: "2px dashed #E0E0E0", borderRadius: "10px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <InsertDriveFile color="primary" fontSize="large" className="upload-icon" />
                                <Box sx={{ mt: 3 }}>
                                    <Box sx={{
                                        color: "#0000008F",
                                        fontWeight: 400,
                                        fontSize: "20px",
                                        lineHeight: "20px",
                                    }}>
                                        Drop your file here or{" "}
                                        <Box sx={{ display: "inline-block", color: "#009688" }}>
                                            Browse
                                            <Input
                                                inputRef={fileInputRef} // Material-UI ref prop
                                                type="file"
                                                style={{ display: "none" }} // Hide the input
                                                onChange={chooseFile} // Call the function when a file is selected
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                                <p className="info">Supported files:  JSON, EXCEL</p>
                            </Box>
                        </Box>

                        {file.selectedFile !== null && (
                            <Box sx={{ width: "100%", mt: 3, px: 2 }}>
                                <Grid container sx={{ backgroundColor: "#F0F3F5", borderRadius: '16px', py: 1 }}>
                                    <Grid item xs={1} sx={{ textAlign: "center" }}>
                                        <IconButton color="primary">
                                            <InsertDriveFile />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={9} sx={{ display: "flex", justifyContent: "flex-start", pl: 1, alignItems: "center" }}>
                                        <Typography sx={{
                                            color: "black",
                                            fontWeight: 400,
                                            fontSize: "20px",
                                            lineHeight: "20px",
                                        }}>
                                            {getFileNameOrExtension(file.selectedFile.name, true)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
                                            <Chip sx={{ textTransform: "uppercase" }} label={getFileNameOrExtension(file.selectedFile.name, false)} color="primary" />
                                            <IconButton sx={{ color: "black" }} onClick={handleRemoveFile}>
                                                <Close />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ justifyContent: 'center', mb: 4 }}>
                    {file.selectedFile && (
                        <Button
                            onClick={() => { handleSendImport() }}
                            startIcon={<Send />}
                            sx={{
                                backgroundColor: "primary", textTransform: "none", fontSize: "14px", fontWeight: 400, height: "32px",
                                '&:hover': { backgroundColor: "primary", color: "white" }
                            }}
                            variant="contained"
                        >
                            {strings.import}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

        </>
    );
}
