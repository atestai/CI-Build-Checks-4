import { Backdrop, Box, Button, CircularProgress, Divider, Paper, Stack, Typography, styled } from "@mui/material";

import { PieChart } from '@mui/x-charts/PieChart';
import { strings } from "../../strings";
import { Circle } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)',
    padding: '20px'
}));


const pieParams = {
    height: 200,
    //width : 500,
    margin: { right: 0 },
    slotProps: { legend: { hidden: true } },
};



export default function CardDevices(props) {

    const {
        title = 'title',
        data,
        load,
        code = 'devices',
        sx = undefined
    } = props;


    const [devices, setDevice] = useState({
        inactive: 0,
        active: 0
    })

    // if (data) {

    //     const {enabled } = data;

    //     if ( enabled ){

    //         device.inactive = 0;

    //         for (const key of Object.keys( enabled )) {

    //             if ( !enabled[key] )   {
    //                 device.inactive ++;
    //             } 
    //         }


    //         device.total = Object.keys( enabled ).length;
    //         device.active = device.total - device.inactive;
    //     }
    // }



    useEffect(() => {

        if (data) {
            const { enabled } = data;

            if (enabled) {

                const devices = {
                    inactive: 0,
                    active: 0,
                    total: 0,
                }


                for (const key of Object.keys(enabled)) {

                    if (!enabled[key]) {
                        devices.inactive++;
                    }
                }


                devices.total = Object.keys(enabled).length;
                devices.active = devices.total - devices.inactive;


                setDevice(devices)
            }
        }

    }, [data]);




    return (
        <Item sx={{ ...sx, minHeight: '140px' }}>

            <Stack spacing={2} >

                <Box sx={{ display: 'flex', justifyContent: "space-between", alignContent: 'center', }} >
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'black', alignContent: 'center', }} variant="hd">{title}</Typography>

                    <Button
                        component={Link}
                        to={'/devices'}
                        sx={{
                            mr: 1, textTransform: "none", fontSize: "12px", fontWeight: 400, height: "32px", '&:hover': {
                                backgroundColor: "primary",
                                color: "white",
                            },
                        }} variant="contained" >
                        {strings.viewMore}
                    </Button>
                </Box>

                <Divider sx={{ mb: 4 }} />
                {!data ? (
                    <Box sx={{ height: '310px', display: 'flex ', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : (

                    <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignContent: 'center' }} >

                        <Box sx={{ mb: 2 }}>
                            <PieChart
                                series={[
                                    {
                                        data: [
                                            { value: devices.active, color: '#54c51c', label: strings.activated },
                                            { value: devices.inactive, color: '#f4727d', label: strings.disabled },
                                        ],

                                        innerRadius: 50,
                                        outerRadius: 100,
                                        paddingAngle: 5,
                                        cornerRadius: 5,
                                    }
                                ]}
                                {...pieParams}
                            />
                        </Box>

                        <Box sx={{ p: 2 }}>

                            <Box sx={{ display: 'flex', justifyContent: "space-between", alignContent: 'center', }} >
                                <Typography variant="body1" gutterBottom>
                                    <Circle sx={{ color: "#54c51c", fontSize: 10, mr: 1 }} />
                                    {strings.activated}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {devices.active}

                                </Typography>
                            </Box>

                            <Divider sx={{ mb: 1 }} />

                            <Box sx={{ display: 'flex', justifyContent: "space-between", alignContent: 'center', }} >
                                <Typography variant="body1" gutterBottom>
                                    <Circle sx={{ color: "#f4727d", fontSize: 10, mr: 1 }} />
                                    {strings.disabled}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {devices.inactive}

                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 1 }} />

                            <Box sx={{ display: 'flex', justifyContent: "space-between", alignContent: 'center', }} >
                                <Typography variant="body1" gutterBottom>
                                    <Circle sx={{ color: "lightgray", fontSize: 10, mr: 1 }} />
                                    {strings.total}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {devices.total}
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 1 }} />

                        </Box>
                    </Box>
                )}
            </Stack>
        </Item>
    )
}