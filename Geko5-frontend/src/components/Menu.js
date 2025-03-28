import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useState, useMemo} from "react";

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import MenuTablet from './MenuTablet';
import MenuDesktop from './MenuDesktop';

import {Box,Link, MenuItem, MenuList } from '@mui/material';
import { CalendarToday, Home as HomeIcon, QueryBuilder, StorageRounded, RemoveFromQueueRounded, ListRounded, DisplaySettings, NotificationsActive } from '@mui/icons-material';

import { Link as LinkRouter } from 'react-router-dom';


import Logo from '../icons/logoWisnam.svg'
import LogoSmallWisnam from '../icons/logoSmallWisnam.svg'

const DrawerHeader = styled('div')(({ theme }) => ({

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),


    ...theme.mixins.toolbar,


}));



export default function Menu(props) {

    const  {stateNavigation , open , setOpen , menuTablet , setMenuTablet} = props;

    const theme = useTheme();

    const isLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));
    const isLGcreen = useMediaQuery(theme.breakpoints.up('lg'));



    const leftMenu = useMemo(() => [
        {
            name: 'Dashboard',
            divider: 0,
            // icon : <DashboardIcon />,
            list: [
                {
                    name: 'Home page',
                    icon: <HomeIcon />,
                    url: 'home'
                }, {
                    name: 'Real Time data',
                    icon: <QueryBuilder />,
                    url: 'realtimeValue'
                }, {
                    name: 'Historical data',
                    icon: <CalendarToday />,
                    url: 'historicalValue'
                },
                {
                    name: 'Historical alarms',
                    icon: <NotificationsActive />,
                    url: 'alarms'
                },
            ]
        }, {
            name: 'Asset management',
            divider: 1,
            // icon : <Category />,
            list: [
                {
                    name: 'Data loggers',
                    icon: <RemoveFromQueueRounded />,
                    url: 'dataLogger'
                },
                {
                    name: 'Devices',
                    icon: <StorageRounded />,
                    url: 'devices'
                },

                {
                    name: 'Device models',
                    icon: <ListRounded />,
                    url: 'devicesType'
                },
                {
                    name: 'Device interfaces',
                    icon: <DisplaySettings />,
                    url: 'devicesInterface'
                }
            ]
        },
        {
            name: 'Alarms management',
            divider: 1,
            // icon : <Category />,
            list: [
                {
                    name: 'Alarms list',
                    icon: <StorageRounded />, // Elemento JSX con immagine
                    url: 'alarmList'
                },
            ]
        }
    ], []);

    return (
        <>
            <MenuTablet leftMenu={leftMenu} menuTablet={menuTablet} isLargeScreen={isLargeScreen} stateNavigation={stateNavigation}/>
            <MenuDesktop leftMenu={leftMenu} stateNavigation={stateNavigation} open={open} setOpen={setOpen} isLGcreen={isLGcreen} />
        </>
    );
}