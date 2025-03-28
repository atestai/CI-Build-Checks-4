import { Box, Grid, Stack} from "@mui/material";
import config from "../config.js";
import useWindowSize from "../components/useWindowSize.js";
import CardStatus from "../components/homeWidgets/cardStatus.js";
import { useEffect } from "react";
import { useState } from "react";

import CardDiskSpace from "../components/homeWidgets/cardDiskSpace.js";
import CardAlarms from "../components/homeWidgets/cardAlarms.js";
import CardInfo from "../components/homeWidgets/cardInfo.js"
import CardDevices from "../components/homeWidgets/cardDevices.js";
import { strings } from "../strings.js";
import HeaderPage from "../components/headerPage.js";


export default function Homepage(props) {
    const { alarmMessage } = props

    const windowSize = useWindowSize();
    const [message, setMessage] = useState(null);
    const token = sessionStorage.getItem('token')
        ? JSON.parse(sessionStorage.getItem('token'))
        : '';

    useEffect(() => {

        const websocket = new WebSocket(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${config.server.host}${config.server.port ? ':' + config.server.port : ''}/info?token=${encodeURIComponent(token.token)}`);

        // Connection opened
        websocket.addEventListener("open", (event) => {
            websocket.send("Connection established")
        })

        // Listen for messages
        websocket.addEventListener("message", (event) => {
            //console.log("Message from server ", event.data)

            const data = JSON.parse(event.data);
            setMessage(data.message);

        })

        return () => websocket.close()

    }, [config.server.host, config.server.port, token.token]);





    useEffect(() => {
        props.setStateNavigation(() => {
            const resetValues = {
                home: 0,
                realtimeValue: 0,
                historicalValue: 0,
                dataLogger: 0,
                devicesType: 0,
                devices: 0,
                devicesModbus: 0,
                users: 0,
                ads: 0,
                mqtt: 0,
                saf: 0,
                system: 0
            };

            return {
                ...resetValues,
                home: 1 // Imposta il valore desiderato
            };
        });
    }, []);








    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: `calc(${windowSize.height}px - ${config.heightBanner}px);`, p: .2, overflowY: 'auto' }}>
            <Box sx={{ flexShrink: 0, mb: 3, mt: { sm: 5, lg: 2 } }}>

                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

                    <HeaderPage  title= {'Home page'} titleTwo={"Dashboard"} />

                </Box>
            </Box>


            <Box sx={{ width: '100%', mb: { lg: 3, xl: 3 } }}>

                <Grid container spacing={3}>

                    <Grid item sm={6} lg={4} >

                        <Stack spacing={2}>
                            <CardStatus data={message} code={'ads'} title={'Data Collector'} />
                            <CardStatus data={message} code={'mqtt'} title={'MQTT'} />
                            <CardDiskSpace data={message} code={'size'} title={'Disk size'} />
                        </Stack>
                    </Grid>

                    <Grid item sm={6} lg={8} >

                        <Grid container spacing={2}>
                            <Grid item sm={12} lg={6}>
                                <CardDevices data={message} code={'devices'} title={`${strings.devices}`} />
                            </Grid>

                            <Grid item sm={12} lg={6} sx={{ display: { sm: 'none', lg: 'block' } }}>
                                <CardInfo data={message} code={'systemInfo'} title={'System Info'} />
                            </Grid>


                        </Grid>


                    </Grid>

                    <Grid item sm={12} sx={{ order: { sm: 2, lg: 1 }, mb: 4, display: { sm: 'block', lg: 'none' } }}>
                        <CardInfo data={message} code={'systemInfo'} title={'System Info'} />

                    </Grid>

                    <Grid item sm={12} sx={{ order: { sm: 1, lg: 2 } }}>
                        <CardAlarms data={alarmMessage} code={'alarms'} title={'Alarms'} />
                    </Grid>



                </Grid>

            </Box>

        </Box>
    )
}