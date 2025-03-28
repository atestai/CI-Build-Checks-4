import { Box, Button, Chip, Divider, IconButton, Paper, Skeleton, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableRow, Typography, styled } from "@mui/material";

import { strings } from "../../strings";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link as LinkRouter } from 'react-router-dom';
import { Notifications, StorageRounded } from "@mui/icons-material";
import {formatDate} from '../../tools/helpers';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)',
    padding: '20px'
}));

const columns = [
    {
        field: 'deviceName',
        headerName: 'Device',
        width: 150,
    },
    {
        field: 'name',
        headerName: 'Alarm',
        width: 100,
        filterable: false,
    },
    {
        field: 'timestampActive',
        headerName: strings.ActivationTime,
        width: 150
    },
    {
        field: 'severity',
        headerName: 'Severity',
        width: 90,
    },
    {
        field: 'message',
        headerName: 'Message',
        flex: 1,
        width: 140,
    },
    {
        headerName: 'Details',
        field: 'Details',
        width: 140,

        renderCell: (params) => {

            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center', pr: 2 }}>
                    <IconButton  sx={{ color: 'grey' }}  component={LinkRouter} to={`/devices`} title="More info" variant="contained" aria-label="More info"><StorageRounded /></IconButton>
                    <IconButton component={LinkRouter} to={`/alarmDetail/${params.row.alarmId}`} sx={{ color: 'grey' }} title="Show alarm" variant="contained" aria-label="Show alarm"><Notifications /></IconButton>


                </Box>
            )
        }
    }
];



function DataGridDemo(props) {


    const [data, setData] = useState([]);



    useEffect(() => {



        if (Array.isArray(props.rows)) {

            setData(props.rows.map ( item => {
                return {
                    id : item._id,
                    ...item,  
                    timestampActive : formatDate(item.timestampActive),
          
                }

            } ));

        }
      
       

    }, [props.rows])


    return (
        <Box sx={{ height: 380, maxHeight: '450px', pb: 2 }}>
            <DataGrid

                rows={data || []}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                loading={ (Array.isArray(data) ? false : true)}

                pageSizeOptions={[5]}
                disableRowSelectionOnClick
            />
        </Box>
    );
}





export default function CardDataLogger(props) {

    const {
        title = 'title',
        data,
        code = 'alarms',
        sx = undefined,
    } = props;



    return (
        <Item sx={{ ...sx, minHeight: '140px', maxHeight: '470px' }}>

            <Stack spacing={2} >

                <Box sx={{ display: 'flex', justifyContent: "space-between", alignContent: 'center', }} >
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'black' }} variant="hd">{title}</Typography>

                    <Button component={Link}
                        to={'/alarms'}
                        sx={{
                            mr: 1, textTransform: "none", fontSize: "14px", fontWeight: 400, height: "32px", '&:hover': {
                                backgroundColor: "primary",
                                color: "white",
                            },
                        }} variant="contained" >
                        {strings.viewMore}
                    </Button>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignContent: 'center' }} >
                    <DataGridDemo rows={data}/>
                </Box>

            </Stack>
        </Item>
    )
}
