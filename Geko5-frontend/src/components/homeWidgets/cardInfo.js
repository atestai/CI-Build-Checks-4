import { Box, Button, Divider, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography, styled } from "@mui/material";

import { strings } from "../../strings";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

import ServerProxy from "../../tools/serverProxy";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)',
    padding: '20px'
}));



function convertSecondsToUptime(seconds) {
    // Arrotondiamo i secondi al numero intero più vicino
    seconds = Math.round(seconds);

    const secondsInDay = 86400; // 24 * 60 * 60
    const secondsInHour = 3600; // 60 * 60
    const secondsInMinute = 60;

    const days = Math.floor(seconds / secondsInDay);
    seconds %= secondsInDay;

    const hours = Math.floor(seconds / secondsInHour);
    seconds %= secondsInHour;

    const minutes = Math.floor(seconds / secondsInMinute);

    return `${days} days, ${hours} h, ${minutes} m`;
}

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}


const rows = {

    uptime: {
        name: 'Up time',
        value: undefined,
        fontSize: '1.1rem',
        color: 'info',
        funValue: convertSecondsToUptime
    },

    currentDate: {
        name: 'Date & Time',
        value: undefined,
        color: 'info',
        fontSize: '1.1rem',
        funValue: (value) => formatDate(new Date(value))
    },

    timeZone: {
        name: 'Time Zone',
        value: undefined,
        color: 'info',
        funValue: (value) => value
    },

    internetStatus: {
        name: 'Internet Status',
        value: undefined,
        color: 'info',
        funValue: (value) => value
    },

    defaultGateway: {
        name: 'Default Gateway',
        value: undefined,
        color: 'info',
        funValue: (value) => value
    },

    intefaceFirst: {
        name: 'Network interface #1',
        value: undefined,
        color: 'warning',
        funValue: (value) => value
    },


    intefaceSecond: {
        name: 'Network interface #2',
        value: undefined,
        color: 'warning',
        funValue: (value) => value
    },
}



function BasicTable(props) {

    const { rows = {} } = props;
    const ready = rows.uptime.value;

    return (
        <TableContainer component={Paper}>
            <Table sx={{ maxWidth: '100%' }} aria-label="simple table">
                <TableBody>
                    {Object.keys(rows).map((key, index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {rows[key].name}
                            </TableCell>
                            <TableCell align="right">{ready ?
                                rows[key].funValue(rows[key].value) :
                                <Skeleton variant="text" />
                            }</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}




export default function CardInfo(props) {


    const {
        title = 'title',
        data,
        code = 'settings',
        sx = undefined, 
        user,
    } = props;


    if (data) {

        const systemInfo = {...data};

        if (systemInfo) {

            Object.keys(systemInfo).forEach(key => {

                switch (key) {

                    case 'internetStatus':
                        rows.internetStatus.value = systemInfo.internetStatus + "";
                        rows.internetStatus.color = rows.internetStatus.value === 'Online' ? 'success' : 'error'

                        break;

                    case 'activeInterfaces':

                        if (systemInfo.activeInterfaces.length > 0) {
                            const { name, address } = systemInfo.activeInterfaces[0]

                            rows.intefaceFirst.value = address
                            rows.intefaceFirst.color = systemInfo.linkStatuses[name] === 'Attivo' ? 'success' : 'error'
                        }
                        else {
                            rows.intefaceFirst.value = '-'
                            rows.intefaceFirst.color = 'warning'
                        }


                        if (systemInfo.activeInterfaces.length > 1) {
                            const { name, address } = systemInfo.activeInterfaces[1]

                            rows.intefaceSecond.value = address
                            rows.intefaceSecond.color = systemInfo.linkStatuses[name] === 'Attivo' ? 'success' : 'error'

                        }
                        else {
                            rows.intefaceSecond.value = '-'
                            rows.intefaceSecond.color = 'warning'
                        }


                        //rows.intefaceSecond.value = systemInfo['activeInterfaces'].length > 1 ? systemInfo['activeInterfaces'][1].address + '' : '-'

                        break;

                    default:
                        if (rows[key]) {
                            rows[key].value = systemInfo[key] + "";
                        }

                        break;
                }
            });


        }
    }




    return (
        <Item sx={{ ...sx, minHeight: '140px', maxHeight: '470px' }}>

            <Stack spacing={2} sx={{ height: "100%" }}>

                <Box sx={{ display: 'flex', justifyContent: "space-between", alignContent: 'center', }} >
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'black' }} variant="hd">{title}</Typography>
                    {user === null || user?.role === 'operator' ? "" : (

                        <Button component={Link} to={'/settings'} sx={{
                            mr: 1, textTransform: "none", fontSize: "14px", fontWeight: 400, height: "32px", '&:hover': {
                                backgroundColor: "primary",
                                color: "white",
                            }, textWrap: "nowrap"
                        }} variant="contained" >
                            {strings.changeSettings}
                        </Button>
                    )}
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignContent: 'center', overflow: "auto", maxHeight: '370px' }} >

                    <BasicTable rows={rows} />
                </Box>

            </Stack>
        </Item>
    )
}
