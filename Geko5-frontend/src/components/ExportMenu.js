import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import Tooltip from '@mui/material/Tooltip';
import { Alert, ListItem, ListItemText } from '@mui/material';
import { AccountCircle, FileUpload, GetApp, Lock, Logout, Person } from '@mui/icons-material';
import ServerProxy from '../tools/serverProxy';
import { strings } from '../strings';
import PasswordChangeDialog from './passwordChangeDialog';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import * as XLSX from "xlsx"; // Importa la libreria xlsx per generare file Excel


export default function ExportMenu(props) {



    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleExportTable = async (contentType) => {
        const table = props.table;

        try {
            const blobData = await ServerProxy.getExportTable({ contentType: contentType, table: table })


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
                a.download = `${props.table}_export_data.json`;  // Nome del file JSON
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
                a.download = `${props.table}_export_data.xlsx`;  // Nome del file Excel
                a.click();

                window.URL.revokeObjectURL(url);
            }

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




    const onSignOut = () => {
        sessionStorage.clear();
        window.location.assign('/');
    }





    return (
        <>



            <Box sx={{ display: 'flex', }}>
                <Tooltip title={strings.export}>


                    <IconButton

                        onClick={handleClick}
                        sx={{
                            mr: 1, color: "white", backgroundColor: "#007CB0", borderRadius: 2, width: "33px", height: "33px", '&:hover': {
                                backgroundColor: "#007CB0",
                                color: (theme) => `${theme.palette.primary.textIntoButton}`,

                            },
                        }}
                    >
                        <GetApp />
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="export-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >


                <MenuItem onClick={() => handleExportTable('json')} >

                    JSON

                </MenuItem>

                <Divider />

                <MenuItem onClick={() => handleExportTable('excel')}>

                    EXCEL
                </MenuItem>


            </Menu>
        </>
    );
}
