import { Box, Button, Dialog, DialogTitle, DialogContent, FormControl, FormControlLabel, Grid, InputLabel, Skeleton, Switch, TextField, Typography, Divider, Alert, Stack, Backdrop, CircularProgress, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import ServerProxy from "../tools/serverProxy";
import { strings } from "../strings";
import { DataGrid } from "@mui/x-data-grid";
import { Close, ExitToApp } from "@mui/icons-material";




export default function InfoAlarmAssociation(props) {

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Variables
    const { detail, onCloseAction } = props;
    const [load, setLoad] = useState(false);


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Functions 

    const onClose = async function (params) {
        onCloseAction()
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// UseEffect 




    return (

        <Dialog
            open={detail.open}
            onClose={(event, reason) => { if (reason && reason === "backdropClick") return; onClose(null) }}
            maxWidth={'xs'}
            fullWidth={true}
            sx={{
                '& .MuiDialog-paper': {
                    p: 2,
                    backgroundColor: "#F8F8F8"
                },
                '& .MuiBackdrop-root': {
                    zIndex: 13 // Riduci il z-index del backdrop
                },
                '& .MuiDialog-paper': {
                    zIndex: 13  // Riduci il z-index del dialog paper
                }
            }}

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





            <DialogTitle sx={{ fontSize: "32px", fontWeight: "500" }} id="draggable-dialog-title">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    {detail.name}


                    <IconButton onClick={() => { onClose(null); }}>
                        <Close />
                    </IconButton>
                </Box>


                <Divider sx={{ mt: 1, backgroundColor: "#656565" }} />
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Box >



                    <DataGrid
                        getRowId={(row) => row.assetId}
                        rows={detail.dati?.filter(item => item.alarmId === detail.id) || []}
                        columns={[{ field: 'name', headerName: 'Name', flex: 1 }]}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 50, page: 0 },
                            },
                        }}
                        disableRowSelectionOnClick
                        loading={load}
                        sx={{
                            '& .associated-row': {
                                backgroundColor: '#ffcdd2 !important',
                            },
                            mb: 4,
                            bgcolor: 'white',
                            height: '400px',  // Altezza fissa
                            flexGrow: 1,
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                            borderTop: "none",
                            borderBottomRightRadius: "20px",
                            borderBottomLeftRadius: "20px",
                            border: "1px solid #FAFAFA",
                            // Per gestire lo scroll
                            '& .MuiDataGrid-virtualScroller': {
                                overflow: 'auto'
                            },
                            '& .MuiDataGrid-footerContainer': {
                                bottom: 0,
                                bgcolor: 'background.paper',
                                zIndex: 2,
                                borderBottomRightRadius: "20px",
                                borderBottomLeftRadius: "20px"
                            },
                            '& .MuiDataGrid-row:nth-of-type(odd)': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            },
                        }}
                    />


                </Box>
            </DialogContent>


        </Dialog>
    )
}



