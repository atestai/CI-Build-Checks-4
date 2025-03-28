import { Box, Button, Dialog, DialogTitle, DialogContent, Typography, Divider, Alert, Backdrop, CircularProgress, IconButton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import { strings } from "../strings";
import ServerProxy from "../tools/serverProxy";
import { alpha } from '@mui/material/styles';
import { DataGrid } from "@mui/x-data-grid";
import ConfirmDialog from "../components/confirmDialog";
import { Link as LinkRouter } from 'react-router-dom';
import { Close, Edit, RestartAlt, Save } from "@mui/icons-material";



export default function AssociationAlarm(props) {

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Variables 
    const { associationAlarm, onCloseAction, onOkAction, setAssociationAlarm } = props;



    // const columnsForAssociation = [
    //     {
    //         field: 'id',
    //         headerName: strings.id,
    //         width: 90
    //     },
    //     {
    //         field: 'name',
    //         headerName: 'Name',
    //         width: 250,
    //     },
    //     {
    //         field: 'active_time',
    //         headerName: 'Active time',
    //         maxWidth: 100,
    //     },
    //     {
    //         field: 'deactive_time',
    //         headerName: 'Deactive time',
    //         maxWidth: 100,
    //     },
    //     {
    //         field: 'severity',
    //         headerName: 'Severity',
    //         maxWidth: 100,
    //     },
    //     {
    //         field: 'message',
    //         headerName: 'Message',
    //         flex: 1,
    //         width: 150,
    //     }
    // ];

    const [actionFuncion, setActionFuncion] = useState(null);
    const [alert, setAlert] = useState({ hide: 0, message: '', severity: '' });
    const [dynamicSelectedIds, setDynamicSelectedIds] = useState([]);
    const [elementSelectedRemoved, setElementSelectedRemoved] = useState([]);
    const gridRef = useRef(null);
    const [infoAssociation, setInfoAssociation] = useState(false);
    const [load, setLoad] = useState(false);
    const [mergedSelectedIds, setMergedSelectedIds] = useState([]);
    const [rows, setRows] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState([]);
    //const [selectedIds, setSelectedIds] = useState([]);


    const columns = [
        {
            field: 'id',
            headerName: strings.id,
            width: 90
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 250,
        },
        {
            field: 'active_time',
            headerName: 'Active time',
            maxWidth: 100,
        },
        {
            field: 'deactive_time',
            headerName: 'Deactive time',
            maxWidth: 100,
        },
        {
            field: 'severity',
            headerName: 'Severity',
            maxWidth: 100,
        },
        {
            field: 'message',
            headerName: 'Message',
            flex: 1,
            width: 150,
        },

        {...( infoAssociation && {
        
            headerName: 'Actions',
            field: 'Actions',
            width: 90,
            renderCell: (params) => {
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center', pr: 2 }}>
                        <IconButton
                            component={LinkRouter}
                            to={`/alarmDetail/${params.row.id}`}
                            sx={{ color: 'grey' }}
                            title="Edit"
                            variant="contained"
                            aria-label="Edit"
                        >
                            <Edit />
                        </IconButton>
                    </Box>
                );
            } 
        })}

    ];

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Functions 


    const onClose = async function () {
        onCloseAction()
    }


    async function loadData() {


        setLoad(true);
        
        try {
            const data = await ServerProxy.getConfigurationAlarms();
            setRows(data);
        } catch (error) {
            setAssociationAlarm({ id: null, open: false })
            setRows([]);
        } finally {
            setLoad(false);
        }

    }




    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// UseEffect 

    useEffect(() => {
        loadData();
    }, [associationAlarm.open]);


    useEffect(() => {

        const loadAlarmAssociation = async (idAsset) => {

            const alarmAssociation = await ServerProxy.getAlarmsByDeviceId(idAsset);

            const rowIDS = rows.map(item => item.id);

            const selectedIds = alarmAssociation.filter(item => {
                return rowIDS.includes(item.alarmId);
            }).map(item => item.alarmId);


            console.log({selectedIds, rows} );
            
            setMergedSelectedIds([...selectedIds]);
            setSelectedAsset([associationAlarm.id]);

        }

        if (associationAlarm.id && rows.length > 0) {
            setInfoAssociation(true)
            loadAlarmAssociation(associationAlarm.id);
        }
        
    }, [rows]);


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Component  

    return (
        <>
            <ConfirmDialog actionFuncion={actionFuncion} setActionFuncion={setActionFuncion} />

            <Dialog
                open={associationAlarm.open}
                onClose={(event, reason) => {
                    if (reason && reason === "backdropClick") return; onClose(null); setRows([]); setSelectedAsset([]); /*setSelectedIds([]);*/ setInfoAssociation(false)
                }}
                maxWidth={'xl'}
                fullWidth={true}
                sx={{ '& .MuiDialog-paper': { p: 2, backgroundColor: "#F8F8F8" }, }}

            >

       
                <Backdrop
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,

                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={load}
                >
                    <CircularProgress color="primary" />
                </Backdrop>
                


               {props.alert.hide || alert.hide ? (
                    <Alert
                        sx={{
                            position: "fixed",
                            top: "1%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 1301,
                            width: "auto",
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                            borderRadius: '16px',
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "flex",
                            alignItems: "center",
                        }}
                        severity={props.alert.severity || alert.severity}
                        title={props.alert.message || alert.message}
                    >
                        <span style={{ flexShrink: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {props.alert.message || alert.message}
                        </span>
                    </Alert>
                ) : null} 



                <DialogTitle id="draggable-dialog-title">
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>

                        <Typography sx={{ fontSize: "32px", fontWeight: "500" }} >{associationAlarm.id ? strings.associatedAlarm : "Associate one or more alarms"}</Typography>
                        <Box>

                            <Button onClick={() => { setSelectedAsset([]); /*setSelectedIds([]);*/ setMergedSelectedIds([]); setAssociationAlarm(prevState => ({ ...prevState })) }}
                                sx={{ height: "32px", backgroundColor: "primary", textTransform: "none", fontSize: "14px", fontWeight: 400, mr: 1, '&:hover': { backgroundColor: "primary", color: (theme) => `${theme.palette.primary.textIntoButton}` } }} variant="contained" >

                                <RestartAlt sx={{ mr: 1 }}/>
                                Reset

                            </Button>


                            <Button onClick={() => { onOkAction({  selectedAlarms: mergedSelectedIds, selectedAsset: selectedAsset }) }}

                                sx={{ height: "32px", backgroundColor: "primary", textTransform: "none", fontSize: "14px", fontWeight: 400, mr: 1, '&:hover': { backgroundColor: "primary", color: (theme) => `${theme.palette.primary.textIntoButton}` } }} variant="contained" >
                                <Save sx={{ mr: 1 }} />
                                {strings.apply}
                            </Button>



                            <IconButton onClick={() => { onClose(null); setRows([]); setSelectedAsset([]); /*setSelectedIds([]);*/ setInfoAssociation(false) }}>
                                <Close />

                            </IconButton>

                        </Box>

                    </Box>



                    <Divider sx={{ mt: 1, backgroundColor: "#656565" }} />
                </DialogTitle>

                <DialogContent sx={{ mt: 2, }}>
                    <Box sx={{ height: '100%', overflowY: 'auto' }}>



                        <DataGrid
                            ref={gridRef}
                            rows={rows || []}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 50, page: 0 },
                                },
                            }}
                            disableRowSelectionOnClick
                            loading={load}
                            checkboxSelection
                            rowSelectionModel={mergedSelectedIds} // Imposta gli ID selezionati
                            onRowSelectionModelChange={(ids) => setMergedSelectedIds([...ids])}

                            sx={{
                                '& .associated-row': {
                                    backgroundColor: '#ffcdd2 !important',
                                },
                                mb: 4,
                                bgcolor: 'white',
                                height: "400px",
                                flexGrow: 1,
                                borderTopLeftRadius: 0,
                                borderTopRightRadius: 0,
                                borderTop: "none",
                                borderBottomRightRadius: "20px",
                                borderBottomLeftRadius: "20px",
                                border: "1px solid #FAFAFA",
                                '& .MuiDataGrid-main': {
                                    overflow: 'hidden',
                                },
                                '& .MuiDataGrid-virtualScroller': { overflow: 'auto' },
                                '& .MuiDataGrid-footerContainer': {
                                    bottom: 0,
                                    bgcolor: 'background.paper',
                                    zIndex: 2,
                                    borderBottomRightRadius: "20px",
                                    borderBottomLeftRadius: "20px"
                                },
                                '& .MuiDataGrid-row:hover': {
                                    backgroundColor: (theme) => `${alpha(theme.palette.primary.light, 0.1)} !important`,
                                },
                                '& .MuiDataGrid-row:nth-of-type(odd)': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                },

                            }}


                        />


                    </Box>
                </DialogContent>


            </Dialog>
        </>
    )
}



