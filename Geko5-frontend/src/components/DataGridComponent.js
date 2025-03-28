import { Box, CircularProgress, IconButton, Modal, Typography } from "@mui/material";
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { Link as LinkRouter } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { useState } from "react";
import { FullscreenExit } from "@mui/icons-material";

const modalBoxStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100vw",
    height: "100vh",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 2,
    display: "flex",
};



export default function DataGridComponent(props) {

    const { 
        apiRef ,
        rows, 
        columns, 
        columnsFullScreen, load, handleSelectionIds, toggleFullScreen, isFullScreen, isModalLoading, onPaginationModelChange, paginationModel, paginationFlag } = props;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////// Functions



    return (
        <>

            <DataGrid
                apiRef={apiRef}
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 50, page: 0 },
                    },
                }}

                disableRowSelectionOnClick
                loading={load}
                checkboxSelection
                {...(paginationFlag
                    ? {
                        pageSizeOptions: [paginationModel.pageSize],
                        paginationModel: paginationModel,
                        onPaginationModelChange: onPaginationModelChange
                    } : {})}


                onRowSelectionModelChange={(ids) => handleSelectionIds(ids)}
                sx={{

                    mb: 4,
                    bgcolor: 'white',
                    flexGrow: 1,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderTop: "none",
                    borderBottomRightRadius: "20px",
                    borderBottomLeftRadius: "20px",
                    border: "1px solid #e0e0e0",


                    '& .MuiDataGrid-main': {
                        overflow: 'hidden',
                    },
                    '& .MuiDataGrid-virtualScroller': { overflow: 'auto' },
                    '& .MuiDataGrid-footerContainer': {
                        bottom: 0,
                        bgcolor: 'background.paper',
                        zIndex: 2,
                        borderBottomRightRadius: "20px",
                        borderBottomLeftRadius: "20px",
                    },
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: (theme) => `${alpha(theme.palette.primary.light, 0.1)} !important`,
                    },
                    '& .MuiDataGrid-row:nth-of-type(odd)': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    },
                    '& .MuiDataGrid-columnHeader': {
                        borderRadius: 0,
                        '&:first-of-type': {
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                        },
                        '&:last-of-type': {
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                        },
                    },
                }}



            />



            <Modal open={isFullScreen} onClose={toggleFullScreen}>
                <Box sx={{ ...modalBoxStyle, position: "relative" }}>
                    {isModalLoading ? (
                        <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }} >
                            <CircularProgress />
                        </Box>
                    ) : (
                        <DataGrid
                            apiRef={apiRef}
                            rows={rows}
                            columns={columnsFullScreen}
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 50, page: 0 },
                                },
                            }}
                            disableRowSelectionOnClick
                            loading={load}
                            checkboxSelection
                            onRowSelectionModelChange={(ids) => handleSelectionIds(ids)}
                            sx={{
                                width: "100%",
                                height: "100%",
                                "& .MuiDataGrid-footerContainer": {
                                    bottom: 0,
                                    bgcolor: "background.paper",
                                    zIndex: 2,
                                    borderBottomRightRadius: "20px",
                                    borderBottomLeftRadius: "20px",
                                },
                                "& .MuiDataGrid-row:hover": {
                                    backgroundColor: (theme) =>
                                        `${alpha(theme.palette.primary.light, 0.1)} !important`,
                                },
                                "& .MuiDataGrid-row:nth-of-type(odd)": {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                },
                            }}
                            slots={{
                                toolbar: () => (
                                    <Box display="flex" justifyContent="end" p={1}>
                                        <IconButton color="primary" onClick={toggleFullScreen}>
                                            <FullscreenExit />
                                        </IconButton>
                                    </Box>
                                ),
                            }}
                        />
                    )}
                </Box>
            </Modal>

        </>
    )
}