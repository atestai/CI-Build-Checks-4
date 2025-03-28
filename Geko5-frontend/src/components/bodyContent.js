
import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Typography } from '@mui/material';


import Devices from '../views/devices';
import DevicesType from '../views/devicesType';
import RealTimeValue from '../views/realTimeValue';
import Cpus from '../views/cpus';
import Users from '../views/users';
import Homepage from '../views/homepage';
import Setting from "../views/settings"
import HistoricalData from '../views/historicalData';
import Structures from "../views/structures";
import DevicesInterface from "../views/devicesInterface";
import User from "../views/user";
import AlarmList from '../views/alarmList';
import AlarmDetail from '../views/alarmDetail';
import Alarm from "../views/alarm";
import Restores from '../views/restore';


export default function BodyContent(props) {

    return (
        
        <Routes >
            
            <Route path="/home" element={<Homepage {...props} />} />
            <Route path="/realtimeValue" element={<RealTimeValue {...props} />} />
            <Route path="/historicalValue" element={<HistoricalData {...props} />} />

            <Route path="/dataLogger" element={<Cpus {...props} />} />
            <Route path="/users" element={<Users {...props} />} />

            <Route path="/user/:id" element={<User {...props} />} />
            
            <Route path="/alarmList" element={<AlarmList {...props}  />} />


            <Route path="/alarmDetail/:id" element={<AlarmDetail {...props} />} />
            
            <Route path="/alarmDetail" element={<AlarmDetail {...props} />} />

            <Route path="/alarms" element={<Alarm {...props} />} />



            <Route path="/devicesType" element={<DevicesType {...props}  />} />

            <Route path="/devicesInterface" element={<DevicesInterface {...props} />} />

            <Route path="/devicesType/:id/structures" element={<Structures {...props}  />} />

            <Route path="/devices" element={<Devices {...props} />} />
            
            <Route path="/settings" element={<Setting {...props} />} />

            <Route path="/restores" element={<Restores {...props} />} />


            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/*" element={<Typography paragraph>{"Page not found"}</Typography>} />
        </Routes>
    )
}